import { prisma } from '../lib/prisma';
import { generateVerificationPDF } from './pdf.service';
import { uploadPDF } from '../config/cloudinary';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { CandidateStatus, VerificationStatus } from '@prisma/client';

export class VerificationService {
  /**
   * Fetch all verification logs for candidate files owned by the user
   */
  static async getVerificationLogs(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      prisma.verificationLog.findMany({
        where: { candidate: { createdById: userId } },
        include: { candidate: { select: { fullName: true, email: true } } },
        orderBy: { verifiedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.verificationLog.count({
        where: { candidate: { createdById: userId } },
      }),
    ]);
    return { 
      logs, 
      pagination: { 
        total, 
        page, 
        limit, 
        totalPages: Math.ceil(total / limit) 
      } 
    };
  }

  /**
   * Run full verification flow for a candidate
   */
  static async startVerification(userId: string, candidateId: string) {
    // 1. Fetch candidate and owner details
    const candidate = await prisma.candidate.findFirst({
      where: { id: candidateId, createdById: userId },
      include: { createdBy: true }
    });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    if (candidate.status === CandidateStatus.VERIFIED) {
      throw new BadRequestError('Candidate is already fully verified');
    }

    console.log(`[Verification] Starting workflow for candidate: ${candidate.fullName} (${candidate.id})`);

    // 2. Perform Aadhaar Verification
    const aadhaarResult = await this.verifyAadhaar(candidate.aadhaarNumber, candidate.fullName, candidate.dob);
    const aadhaarLog = await prisma.verificationLog.create({
      data: {
        candidateId: candidate.id,
        verificationType: 'AADHAAR',
        requestPayload: { aadhaarNumber: this.maskAadhaar(candidate.aadhaarNumber), name: candidate.fullName, dob: candidate.dob },
        responsePayload: aadhaarResult,
        verificationStatus: aadhaarResult.status === 'verified' ? VerificationStatus.SUCCESS : VerificationStatus.FAILED,
      }
    });

    // 3. Perform PAN Verification
    const panResult = await this.verifyPan(candidate.panNumber, candidate.fullName);
    const panLog = await prisma.verificationLog.create({
      data: {
        candidateId: candidate.id,
        verificationType: 'PAN',
        requestPayload: { panNumber: this.maskPAN(candidate.panNumber), name: candidate.fullName },
        responsePayload: panResult,
        verificationStatus: panResult.status === 'verified' ? VerificationStatus.SUCCESS : VerificationStatus.FAILED,
      }
    });

    // 4. Determine overall status
    let finalStatus: CandidateStatus = CandidateStatus.PENDING;
    const isAadhaarOk = aadhaarLog.verificationStatus === VerificationStatus.SUCCESS;
    const isPanOk = panLog.verificationStatus === VerificationStatus.SUCCESS;

    if (isAadhaarOk && isPanOk) {
      finalStatus = CandidateStatus.VERIFIED;
    } else if (!isAadhaarOk && !isPanOk) {
      finalStatus = CandidateStatus.FAILED;
    } else {
      finalStatus = CandidateStatus.PARTIAL;
    }

    // Update candidate status in db
    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidate.id },
      data: { status: finalStatus },
    });

    console.log(`[Verification] Candidate status updated to: ${finalStatus}`);

    // 5. Generate PDF Report using Puppeteer
    const pdfData = {
      candidate: {
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        dob: candidate.dob,
        address: candidate.address,
        aadhaarNumber: candidate.aadhaarNumber,
        panNumber: candidate.panNumber,
        status: finalStatus,
      },
      verifiedBy: candidate.createdBy.name,
      logs: {
        aadhaar: {
          status: aadhaarLog.verificationStatus,
          message: aadhaarResult.message,
          verifiedAt: aadhaarLog.verifiedAt,
          payload: aadhaarResult,
        },
        pan: {
          status: panLog.verificationStatus,
          message: panResult.message,
          verifiedAt: panLog.verifiedAt,
          payload: panResult,
        }
      }
    };

    let reportUrl = '';
    try {
      console.log(`[Verification] Rendering PDF report...`);
      const pdfBuffer = await generateVerificationPDF(pdfData);

      console.log(`[Verification] Uploading PDF report to Cloudinary...`);
      const filename = `report_${candidate.id}_${Date.now()}`;
      reportUrl = await uploadPDF(pdfBuffer, filename);

      // Save report in Database
      await prisma.report.create({
        data: {
          candidateId: candidate.id,
          reportUrl,
        }
      });
      console.log(`[Verification] Report saved with URL: ${reportUrl}`);
    } catch (pdfError) {
      console.error('[Verification] Error generating or uploading PDF report:', pdfError);
      // We don't fail the verification workflow if PDF fails, but we log it
    }

    return {
      candidate: updatedCandidate,
      reportUrl,
      logs: [aadhaarLog, panLog]
    };
  }

  /**
   * Mock Aadhaar API check
   */
  private static async verifyAadhaar(aadhaarNumber: string, name: string, dob: string): Promise<any> {
    const apiUrl = process.env.AADHAAR_API_URL;
    
    // Simulate slight network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    if (apiUrl) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aadhaarNumber, name, dob })
        });
        return await response.json();
      } catch (error) {
        console.warn('[Verification] Aadhaar API request failed, falling back to mock response');
      }
    }

    // Default mock response: Check if Aadhaar matches length (regex validation is handled before)
    // For realistic simulation: fail if name contains "fail" or starts with "99" (to test failed flows)
    if (name.toLowerCase().includes('fail') || aadhaarNumber.startsWith('999')) {
      return {
        status: "failed",
        nameMatch: false,
        dobMatch: false,
        message: "Aadhaar verification failed. Name or DOB match mismatch."
      };
    }

    return {
      status: "verified",
      nameMatch: true,
      dobMatch: true,
      message: "Aadhaar verified successfully"
    };
  }

  /**
   * Mock PAN API check
   */
  private static async verifyPan(panNumber: string, name: string): Promise<any> {
    const apiUrl = process.env.PAN_API_URL;

    // Simulate slight network latency
    await new Promise(resolve => setTimeout(resolve, 600));

    if (apiUrl) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ panNumber, name })
        });
        return await response.json();
      } catch (error) {
        console.warn('[Verification] PAN API request failed, falling back to mock response');
      }
    }

    // Default mock response
    // For realistic simulation: fail if name contains "fail" or PAN starts with "XX" or "9"
    if (name.toLowerCase().includes('fail') || panNumber.startsWith('XX') || panNumber.startsWith('9')) {
      return {
        status: "failed",
        panStatus: "inactive",
        message: "PAN verification failed. Account is invalid or inactive."
      };
    }

    return {
      status: "verified",
      panStatus: "active",
      message: "PAN verified successfully"
    };
  }

  private static maskAadhaar(val: string) {
    if (val.length < 12) return 'XXXX-XXXX-XXXX';
    return `XXXX-XXXX-${val.substring(8)}`;
  }

  private static maskPAN(val: string) {
    if (val.length < 10) return 'XXXXX-XXXX-X';
    return `${val.substring(0, 5)}XXXX${val.substring(9)}`;
  }
}

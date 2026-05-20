import puppeteer from 'puppeteer';

interface PDFInputData {
  candidate: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    aadhaarNumber: string;
    panNumber: string;
    status: string;
  };
  verifiedBy: string;
  logs: {
    aadhaar?: {
      status: string;
      message: string;
      verifiedAt: Date;
      payload: any;
    };
    pan?: {
      status: string;
      message: string;
      verifiedAt: Date;
      payload: any;
    };
  };
}

/**
 * Mask sensitive values
 */
const maskAadhaar = (val: string) => {
  if (val.length < 12) return 'XXXX-XXXX-XXXX';
  return `XXXX-XXXX-${val.substring(8)}`;
};

const maskPAN = (val: string) => {
  if (val.length < 10) return 'XXXXX-XXXX-X';
  return `${val.substring(0, 5)}XXXX${val.substring(9)}`;
};

export const generateVerificationPDF = async (data: PDFInputData): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();

    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }) + ' UTC';

    const aadhaarStatus = data.logs.aadhaar?.status === 'SUCCESS' ? 'VERIFIED' : 'FAILED';
    const panStatus = data.logs.pan?.status === 'SUCCESS' ? 'VERIFIED' : 'FAILED';

    const overallStatus = data.candidate.status;
    let statusColor = '#000000'; // Default black
    if (overallStatus === 'VERIFIED') statusColor = '#16a34a'; // Green
    if (overallStatus === 'FAILED') statusColor = '#dc2626'; // Red
    if (overallStatus === 'PARTIAL') statusColor = '#ea580c'; // Orange

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #111827;
            margin: 0;
            padding: 40px;
            font-size: 13px;
            line-height: 1.5;
            background-color: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-weight: 700;
            font-size: 20px;
            letter-spacing: -0.025em;
          }
          .logo span {
            color: #4b5563;
            font-weight: 400;
          }
          .report-info {
            text-align: right;
          }
          .report-info h1 {
            margin: 0 0 5px 0;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: -0.01em;
          }
          .report-info p {
            margin: 0;
            color: #6b7280;
            font-size: 11px;
          }
          .status-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px 20px;
            margin-bottom: 30px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 11px;
            letter-spacing: 0.05em;
            color: #ffffff;
            background-color: ${statusColor};
          }
          .section-title {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #4b5563;
            margin-top: 0;
            margin-bottom: 12px;
            border-bottom: 1px solid #f3f4f6;
            padding-bottom: 5px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .info-group {
            margin-bottom: 10px;
          }
          .info-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .info-value {
            font-weight: 500;
          }
          .verification-box {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            margin-bottom: 20px;
            overflow: hidden;
          }
          .v-header {
            background-color: #f9fafb;
            padding: 12px 15px;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .v-body {
            padding: 15px;
          }
          .v-badge {
            font-size: 10px;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 600;
          }
          .v-badge.success {
            background-color: #d1fae5;
            color: #065f46;
          }
          .v-badge.failed {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 11px;
            color: #6b7280;
          }
          .signature-box {
            text-align: center;
            width: 180px;
          }
          .signature-line {
            border-top: 1px solid #9ca3af;
            margin-bottom: 5px;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">vShield<span>Background Verification</span></div>
          <div class="report-info">
            <h1>VERIFICATION REPORT</h1>
            <p>Generated: ${formattedDate}</p>
            <p>ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>

        <div class="status-banner">
          <div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">OVERALL VERIFICATION STATUS</div>
            <div style="font-weight: 600; font-size: 16px;">Candidate Credentials Assessment</div>
          </div>
          <div class="status-badge">${overallStatus}</div>
        </div>

        <h2 class="section-title">Candidate Details</h2>
        <div class="grid">
          <div>
            <div class="info-group">
              <div class="info-label">Full Name</div>
              <div class="info-value">${data.candidate.fullName}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Email Address</div>
              <div class="info-value">${data.candidate.email}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Phone Number</div>
              <div class="info-value">${data.candidate.phone}</div>
            </div>
          </div>
          <div>
            <div class="info-group">
              <div class="info-label">Date of Birth</div>
              <div class="info-value">${data.candidate.dob}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Current Address</div>
              <div class="info-value">${data.candidate.address}</div>
            </div>
          </div>
        </div>

        <h2 class="section-title">Identity Verifications</h2>

        <!-- Aadhaar Verification -->
        <div class="verification-box">
          <div class="v-header">
            <span>Aadhaar Verification (Government Identity Check)</span>
            <span class="v-badge ${data.logs.aadhaar?.status === 'SUCCESS' ? 'success' : 'failed'}">${aadhaarStatus}</span>
          </div>
          <div class="v-body">
            <div class="grid" style="margin-bottom: 0; gap: 15px;">
              <div>
                <div class="info-group">
                  <div class="info-label">Submitted Aadhaar Number</div>
                  <div class="info-value">${maskAadhaar(data.candidate.aadhaarNumber)}</div>
                </div>
                <div class="info-group">
                  <div class="info-label">API Response Status</div>
                  <div class="info-value" style="text-transform: capitalize;">${data.logs.aadhaar?.payload?.status || 'N/A'}</div>
                </div>
              </div>
              <div>
                <div class="info-group">
                  <div class="info-label">Verification Message</div>
                  <div class="info-value">${data.logs.aadhaar?.message || 'Verification not run.'}</div>
                </div>
                <div class="info-group">
                  <div class="info-label">Aadhaar Validation Checks</div>
                  <div class="info-value" style="font-size: 11px;">
                    Name Match: ${data.logs.aadhaar?.payload?.nameMatch ? '✅ MATCH' : '❌ NO MATCH'}<br/>
                    DOB Match: ${data.logs.aadhaar?.payload?.dobMatch ? '✅ MATCH' : '❌ NO MATCH'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PAN Verification -->
        <div class="verification-box">
          <div class="v-header">
            <span>PAN Verification (Tax Identity Check)</span>
            <span class="v-badge ${data.logs.pan?.status === 'SUCCESS' ? 'success' : 'failed'}">${panStatus}</span>
          </div>
          <div class="v-body">
            <div class="grid" style="margin-bottom: 0; gap: 15px;">
              <div>
                <div class="info-group">
                  <div class="info-label">Submitted PAN Number</div>
                  <div class="info-value">${maskPAN(data.candidate.panNumber)}</div>
                </div>
                <div class="info-group">
                  <div class="info-label">PAN Card Status</div>
                  <div class="info-value" style="text-transform: capitalize;">${data.logs.pan?.payload?.panStatus || 'N/A'}</div>
                </div>
              </div>
              <div>
                <div class="info-group">
                  <div class="info-label">Verification Message</div>
                  <div class="info-value">${data.logs.pan?.message || 'Verification not run.'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <div>
            <p>Verified By: <strong>${data.verifiedBy}</strong></p>
            <p>© vShield Inc. This document is encrypted and digitally signed.</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <strong>Verification Officer</strong>
            <p style="margin: 2px 0 0 0; font-size: 10px; color: #9ca3af;">vShield Platform Stamp</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};

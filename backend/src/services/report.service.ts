import { prisma } from '../lib/prisma';
import { NotFoundError } from '../utils/errors';

export class ReportService {
  /**
   * Fetch report by candidate ID
   */
  static async getReportByCandidateId(userId: string, candidateId: string) {
    const candidate = await prisma.candidate.findFirst({
      where: { id: candidateId, createdById: userId }
    });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    const report = await prisma.report.findFirst({
      where: { candidateId: candidateId },
      include: { candidate: true },
      orderBy: { generatedAt: 'desc' }
    });

    if (!report) {
      throw new NotFoundError('No verification report found for this candidate');
    }

    return report;
  }

  /**
   * Fetch report details by report ID
   */
  static async getReportById(userId: string, reportId: string) {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        candidate: true
      }
    });

    if (!report || report.candidate.createdById !== userId) {
      throw new NotFoundError('Report not found');
    }

    return report;
  }
}

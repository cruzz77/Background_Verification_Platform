import { Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class ReportController {
  /**
   * Get report by Candidate ID or Report ID
   */
  static async getReportByCandidateId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params; // Candidate ID
      const report = await ReportService.getReportByCandidateId(userId, id);

      res.status(200).json({
        status: 'success',
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get specific report metadata by ID
   */
  static async getReportById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params; // Report ID
      const report = await ReportService.getReportById(userId, id);

      res.status(200).json({
        status: 'success',
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  }
}

import { Response, NextFunction } from 'express';
import { VerificationService } from '../services/verification.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class VerificationController {
  /**
   * Get all verification logs with pagination
   */
  static async getVerificationLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page, limit } = req.query;
      const result = await VerificationService.getVerificationLogs(
        userId,
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined
      );

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Run background identity verification checks
   */
  static async startVerification(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params; // Candidate ID
      
      const result = await VerificationService.startVerification(userId, id);

      res.status(200).json({
        status: 'success',
        message: 'Verification workflow executed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

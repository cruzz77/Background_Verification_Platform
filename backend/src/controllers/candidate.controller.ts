import { Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidate.service';
import { createCandidateSchema, updateCandidateSchema } from '../validations/candidate.validation';
import { AuthRequest } from '../middleware/auth.middleware';

export class CandidateController {
  /**
   * List candidate items
   */
  static async getCandidates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page, limit, search, status } = req.query;
      
      const result = await CandidateService.getCandidates(userId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        status: status as any,
      });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new candidate
   */
  static async createCandidate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const validatedData = createCandidateSchema.parse(req.body);
      const candidate = await CandidateService.createCandidate(userId, validatedData);

      res.status(201).json({
        status: 'success',
        message: 'Candidate created successfully',
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single candidate details
   */
  static async getCandidateById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const candidate = await CandidateService.getCandidateById(userId, id);

      res.status(200).json({
        status: 'success',
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update candidate details
   */
  static async updateCandidate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const validatedData = updateCandidateSchema.parse(req.body);
      const candidate = await CandidateService.updateCandidate(userId, id, validatedData);

      res.status(200).json({
        status: 'success',
        message: 'Candidate updated successfully',
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete candidate
   */
  static async deleteCandidate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const result = await CandidateService.deleteCandidate(userId, id);

      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

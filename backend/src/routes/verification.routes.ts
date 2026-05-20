import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/logs', authMiddleware as any, VerificationController.getVerificationLogs as any);
router.post('/:id/start', authMiddleware as any, VerificationController.startVerification as any);

export default router;

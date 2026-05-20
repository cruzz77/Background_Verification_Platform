import { Router } from 'express';
import authRoutes from './auth.routes';
import candidateRoutes from './candidate.routes';
import verificationRoutes from './verification.routes';
import reportRoutes from './report.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/candidates', candidateRoutes);
router.use('/verifications', verificationRoutes);
router.use('/reports', reportRoutes);

export default router;

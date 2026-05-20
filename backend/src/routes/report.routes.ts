import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

router.get('/:id', ReportController.getReportByCandidateId as any);
router.get('/details/:id', ReportController.getReportById as any);

export default router;

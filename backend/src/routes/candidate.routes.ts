import { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all candidate routes
router.use(authMiddleware as any);

router.get('/', CandidateController.getCandidates as any);
router.post('/', CandidateController.createCandidate as any);
router.get('/:id', CandidateController.getCandidateById as any);
router.put('/:id', CandidateController.updateCandidate as any);
router.delete('/:id', CandidateController.deleteCandidate as any);

export default router;

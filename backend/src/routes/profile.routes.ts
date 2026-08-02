import { Router } from 'express';
import { getAppraisals, getAppraisalById, getMyProfile, updateMyProfile } from '../controllers/profile.controller';
import { verifyToken } from '../middlewares/firebaseAuth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Note: verifyToken is commented out for Phase 1 local testing without frontend JWT passed.
// In production: router.get('/appraisals', verifyToken, requireRole(['user', 'admin']), getAppraisals);

router.get('/me', verifyToken, getMyProfile);
router.put('/me', verifyToken, updateMyProfile);

router.get('/appraisals', getAppraisals);
router.get('/appraisals/:id', getAppraisalById);

export default router;

import { Router } from 'express';
import { analyzeDevice } from '../controllers/device.controller';
import { upload } from '../middlewares/upload.middleware';
import { verifyToken } from '../middlewares/firebaseAuth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { analyzeDeviceSchema } from '../validators/device.validator';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Endpoint for appraising/analyzing a device image
// Note: verifyToken is commented out for Phase 1 local testing without frontend JWT passed.
// In production: router.post('/analyze', verifyToken, requireRole(['user', 'admin']), upload.single('image'), validate(analyzeDeviceSchema), analyzeDevice);

router.post('/analyze', upload.single('image'), validate(analyzeDeviceSchema), analyzeDevice);

export default router;

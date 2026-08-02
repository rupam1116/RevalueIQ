import { Router } from 'express';
import { syncUser, logout } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/firebaseAuth.middleware';

const router = Router();

router.post('/sync-user', verifyToken, syncUser);
router.post('/logout', logout);

export default router;

import { Router } from 'express';
import { subscribeNewsletter, getRealtimeBlogs } from '../controllers/news.controller';

const router = Router();

router.post('/newsletter', subscribeNewsletter);
router.get('/blogs/realtime', getRealtimeBlogs);

export default router;

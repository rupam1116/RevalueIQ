import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import { errorHandler } from './middlewares/error.middleware';
import logger from './logs/logger';

// Routes imports will go here
import deviceRoutes from './routes/device.routes';
import repairShopRoutes from './routes/maps.routes';
import newsletterRoutes from './routes/news.routes';
import supportRoutes from './routes/support.routes';
import profileRoutes from './routes/profile.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Security Middlewares
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(compression()); // Compress responses

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Parsers & Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Routes
app.use('/api/v1/device', deviceRoutes);
app.use('/api/v1/maps', repairShopRoutes);
app.use('/api/v1/news', newsletterRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/auth', authRoutes);

// Health Checks
app.get('/', (req, res) => {
  res.status(200).json({ status: 'running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;

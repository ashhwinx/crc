import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS configuration supporting Vite development servers
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local development testing
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Rate limiting for public submission endpoints
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 submissions per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many submissions received from this network. Please wait a few moments before trying again.',
  },
});

// Mount API routes
app.use('/api', healthRoutes);
app.use('/api', equipmentRoutes);
app.use('/api', submissionLimiter, inquiryRoutes);
app.use('/api', submissionLimiter, bookingRoutes);

// 404 & Centralized Error Handler
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server after connecting to database
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` COAST ROAD CAPITAL (CRC) API SERVER ONLINE`);
    console.log(` Port:    http://localhost:${PORT}`);
    console.log(` Health:  http://localhost:${PORT}/api/health`);
    console.log(` Catalog: http://localhost:${PORT}/api/equipment`);
    console.log(`=======================================================`);
  });
}

startServer();

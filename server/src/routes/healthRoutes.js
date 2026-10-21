import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Coast Road Capital API',
    version: '1.0.0 (Phase 1)',
    database: {
      state: statusMap[dbStatus] || 'unknown',
      connected: dbStatus === 1,
    },
    phase: 'Phase 1 - Production Ready MERN Corporate Platform',
  });
});

export default router;

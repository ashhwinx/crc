import express from 'express';
import {
  calculateEstimate,
  saveEstimate,
  getEstimateByRef,
} from '../controllers/estimatorController.js';

const router = express.Router();

// Dynamic calculation engine
router.post('/estimator/calculate', calculateEstimate);

// Save formal estimate (generates CRC-EST-XXXXXX)
router.post('/estimator/save', saveEstimate);

// Fetch saved estimate for sharing or review
router.get('/estimator/:reference', getEstimateByRef);

export default router;

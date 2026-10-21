import { Router } from 'express';
import { createInquiry } from '../controllers/inquiryController.js';

const router = Router();

router.post('/inquiries', createInquiry);

export default router;

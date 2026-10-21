import { Router } from 'express';
import { createBookingRequest } from '../controllers/bookingController.js';

const router = Router();

router.post('/bookings/request', createBookingRequest);

export default router;

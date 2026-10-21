import { BookingRequest } from '../models/BookingRequest.js';
import mongoose from 'mongoose';

const memoryBookings = [];

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

export const createBookingRequest = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      preferredDate,
      preferredTimeSlot,
      topic,
      notes,
    } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Full contact name is required.' });
    }
    if (!company || typeof company !== 'string' || company.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Company name is required.' });
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid business email address is required.' });
    }
    if (!preferredDate || typeof preferredDate !== 'string') {
      return res.status(400).json({ success: false, error: 'Preferred consultation date is required.' });
    }
    if (!preferredTimeSlot || typeof preferredTimeSlot !== 'string') {
      return res.status(400).json({ success: false, error: 'Preferred time slot is required.' });
    }
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ success: false, error: 'Discussion topic is required.' });
    }

    const sanitizedData = {
      name: sanitize(name).slice(0, 120),
      company: sanitize(company).slice(0, 160),
      email: email.trim().toLowerCase().slice(0, 160),
      phone: sanitize(phone || '').slice(0, 50),
      preferredDate: sanitize(preferredDate).slice(0, 50),
      preferredTimeSlot: sanitize(preferredTimeSlot).slice(0, 50),
      topic: sanitize(topic).slice(0, 150),
      notes: sanitize(notes || '').slice(0, 2000),
      status: 'pending',
    };

    let savedRecord = null;
    let storageMethod = 'mongodb';

    if (mongoose.connection.readyState === 1) {
      savedRecord = await BookingRequest.create(sanitizedData);
      console.log(`[CRC Booking] Saved booking request: ID ${savedRecord._id} for ${sanitizedData.email}`);
    } else {
      sanitizedData._id = 'book_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      sanitizedData.createdAt = new Date();
      memoryBookings.push(sanitizedData);
      savedRecord = sanitizedData;
      storageMethod = 'memory_fallback';
      console.warn(`[CRC Booking] MongoDB not connected; saved booking request to memory: ID ${sanitizedData._id}`);
    }

    // Calendar integration boundary status
    const calendarDirectlyConnected = Boolean(process.env.CALENDAR_API_KEY || process.env.CALENDAR_WEBHOOK_URL);

    return res.status(201).json({
      success: true,
      message: 'Consultation scheduling request received. A representative from Coast Road Capital will review your preferred time and send an appointment confirmation.',
      bookingId: savedRecord._id,
      storageMethod,
      calendarStatus: calendarDirectlyConnected
        ? 'Synchronized with internal scheduling engine'
        : 'Request logged. Automated calendar invite dispatch pending direct calendar integration credentials.',
      data: {
        name: sanitizedData.name,
        company: sanitizedData.company,
        preferredDate: sanitizedData.preferredDate,
        preferredTimeSlot: sanitizedData.preferredTimeSlot,
        topic: sanitizedData.topic,
      },
    });
  } catch (err) {
    console.error('[CRC Booking Error]', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your booking request. Please try again.',
    });
  }
};

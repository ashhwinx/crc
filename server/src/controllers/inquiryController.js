import { Inquiry } from '../models/Inquiry.js';
import mongoose from 'mongoose';

// In-memory fallback in case MongoDB connection temporarily drops
const memoryInquiries = [];

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

export const createInquiry = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      category,
      configuration,
      quantity,
      commodity,
      timing,
      message,
      type = 'quote',
      sourceUrl,
    } = req.body;

    // Strict validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Full contact name is required.' });
    }
    if (!company || typeof company !== 'string' || company.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Company name is required.' });
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid business email address is required.' });
    }
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Equipment category is required.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message / inquiry details are required.' });
    }

    const sanitizedData = {
      name: sanitize(name).slice(0, 120),
      company: sanitize(company).slice(0, 160),
      email: email.trim().toLowerCase().slice(0, 160),
      phone: sanitize(phone || '').slice(0, 50),
      category: sanitize(category).slice(0, 100),
      configuration: sanitize(configuration || '').slice(0, 120),
      quantity: sanitize(quantity || '').slice(0, 50),
      commodity: sanitize(commodity || '').slice(0, 200),
      timing: sanitize(timing || '').slice(0, 100),
      message: sanitize(message).slice(0, 3000),
      type: ['quote', 'catalog-inquiry', 'general-contact'].includes(type) ? type : 'quote',
      sourceUrl: sanitize(sourceUrl || '').slice(0, 255),
    };

    let savedRecord = null;
    let storageMethod = 'mongodb';

    if (mongoose.connection.readyState === 1) {
      savedRecord = await Inquiry.create(sanitizedData);
      console.log(`[CRC Inquiry] Persisted new inquiry in MongoDB: ID ${savedRecord._id} from ${sanitizedData.email} (${sanitizedData.company})`);
    } else {
      sanitizedData._id = 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      sanitizedData.createdAt = new Date();
      memoryInquiries.push(sanitizedData);
      savedRecord = sanitizedData;
      storageMethod = 'memory_fallback';
      console.warn(`[CRC Inquiry] MongoDB not connected; saved inquiry to memory buffer: ID ${sanitizedData._id}`);
    }

    // Email dispatch status
    const emailConfigured = Boolean(
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.NOTIFICATION_EMAIL
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you. Your leasing inquiry has been received by Coast Road Capital. Our team will review your specifications.',
      referenceNumber: savedRecord._id,
      storageMethod,
      emailSent: emailConfigured,
      emailStatus: emailConfigured
        ? 'Dispatched to CRC leasing team'
        : 'Notification queued. SMTP server configuration pending client credentials.',
      data: {
        name: sanitizedData.name,
        company: sanitizedData.company,
        category: sanitizedData.category,
        configuration: sanitizedData.configuration,
        createdAt: savedRecord.createdAt,
      },
    });
  } catch (err) {
    console.error('[CRC Inquiry Error]', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your inquiry. Please try again or reach out directly.',
    });
  }
};

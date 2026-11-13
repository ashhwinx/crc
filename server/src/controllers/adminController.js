import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { Inquiry } from '../models/Inquiry.js';
import { Estimate } from '../models/Estimate.js';
import { BookingRequest } from '../models/BookingRequest.js';
import { CmsContent } from '../models/CmsContent.js';
import { DEFAULT_CMS_CONTENT } from '../data/cmsDefaultData.js';
import { inMemoryInquiries, inMemoryEstimates, inMemoryBookings } from '../data/inMemoryStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../../client/public/uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// In-memory fallback stores
let inMemoryCmsContent = { ...DEFAULT_CMS_CONTENT, updatedAt: new Date() };

// Admin authentication credentials (configurable via env)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@coastroadcapital.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'crc2026!admin';
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'crc_secret_jwt_admin_key_2026';

// Helper to generate a session token
function generateToken(user) {
  const payload = {
    email: user.email,
    role: 'superadmin',
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      const user = {
        name: 'Samuel Lowe',
        title: 'Founder & Principal / Administrator',
        email: ADMIN_EMAIL,
        role: 'superadmin',
      };
      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Authentication successful. Welcome to CRC Management Portal.',
        token,
        user,
      });
    }

    return res.status(401).json({ success: false, error: 'Invalid administrative credentials.' });
  } catch (err) {
    console.error('[Admin Login Error]', err);
    return res.status(500).json({ success: false, error: 'Internal authentication error.' });
  }
};

export const adminVerify = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      name: 'Samuel Lowe',
      title: 'Founder & Principal / Administrator',
      email: ADMIN_EMAIL,
      role: 'superadmin',
    },
  });
};

export const getDashboardStats = async (req, res) => {
  try {
    const isMongo = mongoose.connection.readyState === 1;

    let inquiries = [];
    let estimates = [];
    let bookings = [];

    if (isMongo) {
      inquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(200).lean();
      estimates = await Estimate.find().sort({ createdAt: -1 }).limit(200).lean();
      bookings = await BookingRequest.find().sort({ createdAt: -1 }).limit(100).lean();
    } else {
      inquiries = inMemoryInquiries;
      estimates = inMemoryEstimates;
      bookings = inMemoryBookings;
    }

    // Compute metrics
    const totalInquiries = inquiries.length;
    const newInquiries = inquiries.filter((i) => !i.status || i.status === 'new').length;
    const reviewingInquiries = inquiries.filter((i) => i.status === 'reviewing').length;
    const closedInquiries = inquiries.filter((i) => i.status === 'closed').length;

    // Breakdown by equipment category
    const categoryCounts = {};
    inquiries.forEach((item) => {
      const cat = item.category || 'Unspecified';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const totalEstimates = estimates.length;
    let totalEstimatedCars = 0;
    let totalEstimatedValue = 0;

    estimates.forEach((e) => {
      totalEstimatedCars += Number(e.quantity) || 0;
      totalEstimatedValue += Number(e.rates?.totalMaxMonthly) || 0;
    });

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

    // Combined recent activity feed
    const activityFeed = [
      ...inquiries.slice(0, 8).map((i) => ({
        id: i._id,
        type: 'inquiry',
        title: `Quote Request: ${i.company || i.name}`,
        subtitle: `${i.category} • ${i.quantity || '1+'} units`,
        time: i.createdAt,
        status: i.status || 'new',
      })),
      ...estimates.slice(0, 5).map((e) => ({
        id: e._id || e.estimateReference,
        type: 'estimate',
        title: `Cost Estimate Generated: ${e.category}`,
        subtitle: `${e.quantity} cars • $${e.rates?.minMonthlyPerCar}-$${e.rates?.maxMonthlyPerCar}/mo`,
        time: e.createdAt,
        status: e.status || 'active',
      })),
      ...bookings.slice(0, 5).map((b) => ({
        id: b._id,
        type: 'booking',
        title: `Call Booked: ${b.company || b.name}`,
        subtitle: `${b.topic} on ${b.preferredDate} (${b.preferredTimeSlot})`,
        time: b.createdAt,
        status: b.status || 'pending',
      })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalInquiries,
          newInquiries,
          reviewingInquiries,
          closedInquiries,
          totalEstimates,
          totalEstimatedCars,
          totalEstimatedValue,
          totalBookings,
          pendingBookings,
        },
        categoryDemand: categoryCounts,
        recentActivity: activityFeed,
        databaseConnected: isMongo,
      },
    });
  } catch (err) {
    console.error('[Dashboard Stats Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve administrative analytics.' });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    const isMongo = mongoose.connection.readyState === 1;

    let items = [];
    let totalCount = 0;

    if (isMongo) {
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      if (category && category !== 'all') filter.category = category;
      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [{ name: regex }, { company: regex }, { email: regex }, { message: regex }];
      }

      totalCount = await Inquiry.countDocuments(filter);
      items = await Inquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean();
    } else {
      items = inMemoryInquiries.filter((item) => {
        if (status && status !== 'all' && item.status !== status) return false;
        if (category && category !== 'all' && item.category !== category) return false;
        if (search) {
          const q = search.toLowerCase();
          const match =
            item.name?.toLowerCase().includes(q) ||
            item.company?.toLowerCase().includes(q) ||
            item.email?.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      });
      totalCount = items.length;
    }

    return res.status(200).json({
      success: true,
      data: items,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(totalCount / Number(limit)) || 1,
      },
    });
  } catch (err) {
    console.error('[Get Inquiries Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve quote inquiries.' });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, internalNote } = req.body;

    const validStatuses = ['new', 'reviewing', 'contacted', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid inquiry status.' });
    }

    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const updated = await Inquiry.findByIdAndUpdate(
        id,
        {
          $set: {
            status,
            ...(internalNote ? { internalNote } : {}),
            updatedAt: new Date(),
          },
        },
        { new: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Inquiry record not found.' });
      }

      return res.status(200).json({ success: true, data: updated });
    } else {
      const idx = inMemoryInquiries.findIndex((i) => i._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Inquiry record not found.' });
      }
      inMemoryInquiries[idx].status = status;
      if (internalNote) inMemoryInquiries[idx].internalNote = internalNote;
      inMemoryInquiries[idx].updatedAt = new Date();

      return res.status(200).json({ success: true, data: inMemoryInquiries[idx] });
    }
  } catch (err) {
    console.error('[Update Inquiry Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to update inquiry status.' });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      await Inquiry.findByIdAndDelete(id);
    } else {
      inMemoryInquiries = inMemoryInquiries.filter((i) => i._id !== id);
    }

    return res.status(200).json({ success: true, message: 'Inquiry removed successfully.' });
  } catch (err) {
    console.error('[Delete Inquiry Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to delete inquiry.' });
  }
};

export const exportInquiriesCsv = async (req, res) => {
  try {
    const isMongo = mongoose.connection.readyState === 1;
    const inquiries = isMongo
      ? await Inquiry.find().sort({ createdAt: -1 }).lean()
      : inMemoryInquiries;

    const headers = ['ID', 'Date', 'Name', 'Company', 'Email', 'Phone', 'Category', 'Quantity', 'Status', 'Message'];
    const rows = inquiries.map((i) => [
      `"${i._id}"`,
      `"${new Date(i.createdAt).toISOString()}"`,
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.company || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.category || '').replace(/"/g, '""')}"`,
      `"${(i.quantity || '').replace(/"/g, '""')}"`,
      `"${(i.status || 'new').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=crc_inquiries_${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('[CSV Export Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to generate inquiries CSV export.' });
  }
};

export const getEstimates = async (req, res) => {
  try {
    const isMongo = mongoose.connection.readyState === 1;
    const estimates = isMongo
      ? await Estimate.find().sort({ createdAt: -1 }).limit(100).lean()
      : inMemoryEstimates;

    return res.status(200).json({ success: true, data: estimates });
  } catch (err) {
    console.error('[Get Estimates Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve cost estimator logs.' });
  }
};

export const getBookings = async (req, res) => {
  try {
    const isMongo = mongoose.connection.readyState === 1;
    const bookings = isMongo
      ? await BookingRequest.find().sort({ createdAt: -1 }).limit(100).lean()
      : inMemoryBookings;

    return res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error('[Get Bookings Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve bookings.' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const updated = await BookingRequest.findByIdAndUpdate(id, { $set: { status } }, { new: true });
      return res.status(200).json({ success: true, data: updated });
    } else {
      const idx = inMemoryBookings.findIndex((b) => b._id === id);
      if (idx !== -1) inMemoryBookings[idx].status = status;
      return res.status(200).json({ success: true, data: inMemoryBookings[idx] });
    }
  } catch (err) {
    console.error('[Update Booking Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to update booking status.' });
  }
};

// ============================================================================
// CMS (CONTENT MANAGEMENT SYSTEM) CONTROLLERS
// ============================================================================

export const getCmsContent = async (req, res) => {
  try {
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      let doc = await CmsContent.findOne({ key: 'main' }).lean();
      if (!doc) {
        doc = await CmsContent.create(DEFAULT_CMS_CONTENT);
      } else {
        // Deep merge with DEFAULT_CMS_CONTENT so newly added sections/fields are never undefined
        doc = {
          ...DEFAULT_CMS_CONTENT,
          ...doc,
          home: {
            ...DEFAULT_CMS_CONTENT.home,
            ...(doc.home || {}),
            hero: { ...DEFAULT_CMS_CONTENT.home?.hero, ...(doc.home?.hero || {}) },
            servicesHeader: { ...DEFAULT_CMS_CONTENT.home?.servicesHeader, ...(doc.home?.servicesHeader || {}) },
            services: doc.home?.services && doc.home.services.length > 0 ? doc.home.services : DEFAULT_CMS_CONTENT.home?.services,
            whoWeAre: { ...DEFAULT_CMS_CONTENT.home?.whoWeAre, ...(doc.home?.whoWeAre || {}) },
            estimatorCallout: { ...DEFAULT_CMS_CONTENT.home?.estimatorCallout, ...(doc.home?.estimatorCallout || {}) },
            deliveryProcess: {
              ...DEFAULT_CMS_CONTENT.home?.deliveryProcess,
              ...(doc.home?.deliveryProcess || {}),
              steps: doc.home?.deliveryProcess?.steps && doc.home.deliveryProcess.steps.length > 0 ? doc.home.deliveryProcess.steps : DEFAULT_CMS_CONTENT.home?.deliveryProcess?.steps,
            },
            railroadSupportBento: doc.home?.railroadSupportBento || DEFAULT_CMS_CONTENT.home?.railroadSupportBento,
            partnerCarrier: { ...DEFAULT_CMS_CONTENT.home?.partnerCarrier, ...(doc.home?.partnerCarrier || {}) },
          },
          about: {
            ...DEFAULT_CMS_CONTENT.about,
            ...(doc.about || {}),
            hero: { ...DEFAULT_CMS_CONTENT.about?.hero, ...(doc.about?.hero || {}) },
            heritage: { ...DEFAULT_CMS_CONTENT.about?.heritage, ...(doc.about?.heritage || {}) },
            leadership: { ...DEFAULT_CMS_CONTENT.about?.leadership, ...(doc.about?.leadership || {}) },
          },
          companyValues: {
            ...DEFAULT_CMS_CONTENT.companyValues,
            ...(doc.companyValues || {}),
            hero: { ...DEFAULT_CMS_CONTENT.companyValues?.hero, ...(doc.companyValues?.hero || {}) },
            values: doc.companyValues?.values && doc.companyValues.values.length > 0 ? doc.companyValues.values : DEFAULT_CMS_CONTENT.companyValues?.values,
          },
          railroadPartnerships: {
            ...DEFAULT_CMS_CONTENT.railroadPartnerships,
            ...(doc.railroadPartnerships || {}),
            hero: { ...DEFAULT_CMS_CONTENT.railroadPartnerships?.hero, ...(doc.railroadPartnerships?.hero || {}) },
            bentoCards: doc.railroadPartnerships?.bentoCards && doc.railroadPartnerships.bentoCards.length > 0 ? doc.railroadPartnerships.bentoCards : DEFAULT_CMS_CONTENT.railroadPartnerships?.bentoCards,
            partnerCarrier: { ...DEFAULT_CMS_CONTENT.railroadPartnerships?.partnerCarrier, ...(doc.railroadPartnerships?.partnerCarrier || {}) },
          },
          costEstimator: {
            ...DEFAULT_CMS_CONTENT.costEstimator,
            ...(doc.costEstimator || {}),
            categoryRates:
              doc.costEstimator?.categoryRates && doc.costEstimator.categoryRates.length > 0
                ? doc.costEstimator.categoryRates
                : DEFAULT_CMS_CONTENT.costEstimator?.categoryRates,
            termFactors:
              doc.costEstimator?.termFactors && doc.costEstimator.termFactors.length > 0
                ? doc.costEstimator.termFactors
                : DEFAULT_CMS_CONTENT.costEstimator?.termFactors,
            volumeTiers:
              doc.costEstimator?.volumeTiers && doc.costEstimator.volumeTiers.length > 0
                ? doc.costEstimator.volumeTiers
                : DEFAULT_CMS_CONTENT.costEstimator?.volumeTiers,
            regionFactors:
              doc.costEstimator?.regionFactors && doc.costEstimator.regionFactors.length > 0
                ? doc.costEstimator.regionFactors
                : DEFAULT_CMS_CONTENT.costEstimator?.regionFactors,
          },
          companyInfo: { ...DEFAULT_CMS_CONTENT.companyInfo, ...(doc.companyInfo || {}) },
          hero: { ...DEFAULT_CMS_CONTENT.hero, ...(doc.hero || {}) },
          announcement: { ...DEFAULT_CMS_CONTENT.announcement, ...(doc.announcement || {}) },
        };
      }
      return res.status(200).json({ success: true, data: doc });
    } else {
      return res.status(200).json({ success: true, data: inMemoryCmsContent });
    }
  } catch (err) {
    console.error('[Get CMS Content Error]', err);
    return res.status(200).json({ success: true, data: inMemoryCmsContent });
  }
};

export const updateCmsContent = async (req, res) => {
  try {
    const updates = req.body;
    const isMongo = mongoose.connection.readyState === 1;

    const payload = {
      ...updates,
      lastUpdatedBy: updates.lastUpdatedBy || 'Samuel Lowe (Administrator)',
      updatedAt: new Date(),
    };

    if (isMongo) {
      const doc = await CmsContent.findOneAndUpdate(
        { key: 'main' },
        { $set: payload },
        { new: true, upsert: true }
      ).lean();
      return res.status(200).json({
        success: true,
        message: 'Website content updated successfully. Live across client applications.',
        data: doc,
      });
    } else {
      inMemoryCmsContent = {
        ...inMemoryCmsContent,
        ...payload,
      };
      return res.status(200).json({
        success: true,
        message: 'Website content updated successfully (in memory).',
        data: inMemoryCmsContent,
      });
    }
  } catch (err) {
    console.error('[Update CMS Content Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to update website content.' });
  }
};

export const getMediaLibrary = async (req, res) => {
  try {
    const isMongo = mongoose.connection.readyState === 1;
    let mediaList = [];

    if (isMongo) {
      const doc = await CmsContent.findOne({ key: 'main' }).lean();
      mediaList = doc?.media || DEFAULT_CMS_CONTENT.media;
    } else {
      mediaList = inMemoryCmsContent.media || DEFAULT_CMS_CONTENT.media;
    }

    return res.status(200).json({ success: true, data: mediaList });
  } catch (err) {
    console.error('[Get Media Library Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve media library.' });
  }
};

export const addMediaAsset = async (req, res) => {
  try {
    const { title, url, category = 'general' } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, error: 'Asset title and URL path are required.' });
    }

    const newAsset = {
      id: 'media_' + Date.now(),
      title,
      url,
      category,
      dateAdded: new Date(),
    };

    const isMongo = mongoose.connection.readyState === 1;
    if (isMongo) {
      await CmsContent.findOneAndUpdate(
        { key: 'main' },
        { $push: { media: newAsset } },
        { upsert: true }
      );
    } else {
      inMemoryCmsContent.media = [...(inMemoryCmsContent.media || []), newAsset];
    }

    return res.status(201).json({ success: true, message: 'Media asset registered.', data: newAsset });
  } catch (err) {
    console.error('[Add Media Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to add media asset.' });
  }
};

export const uploadAndCompressImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }

    const { oldUrl, category = 'general' } = req.body;
    const originalSize = req.file.size;

    // Generate clean unique filename
    const timestamp = Date.now();
    const rand = Math.random().toString(36).substring(2, 8);
    const filename = `crc_${timestamp}_${rand}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    // Compress & resize with sharp:
    // Resize high-res images to max 1920 width, rotate based on EXIF orientation, convert to webp quality 80
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();

    let transform = image.rotate();
    if (metadata.width && metadata.width > 1920) {
      transform = transform.resize({ width: 1920, withoutEnlargement: true });
    }

    const compressedBuffer = await transform
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    await fs.promises.writeFile(outputPath, compressedBuffer);
    const compressedSize = compressedBuffer.length;
    const savedPercent =
      originalSize > 0 ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) : 0;

    const newUrl = `/uploads/${filename}`;

    // Safely delete previous image if it was an uploaded file in /uploads/
    if (oldUrl && typeof oldUrl === 'string') {
      try {
        const cleanOldUrl = oldUrl.split('?')[0].trim();
        if (cleanOldUrl.startsWith('/uploads/')) {
          const oldFilename = path.basename(cleanOldUrl);
          const oldFilePath = path.join(UPLOADS_DIR, oldFilename);
          if (oldFilePath.startsWith(UPLOADS_DIR) && fs.existsSync(oldFilePath)) {
            await fs.promises.unlink(oldFilePath);
            console.log(`[Media Upload] Old uploaded image removed from disk: ${oldFilename}`);
          }
        }
      } catch (cleanupErr) {
        console.warn('[Media Upload] Old image cleanup notice:', cleanupErr?.message);
      }
    }

    // Register into Media Library in CmsContent so it is also saved in media gallery
    const newMediaAsset = {
      id: `media_${timestamp}`,
      title: req.file.originalname ? req.file.originalname.replace(/\.[^/.]+$/, '') : `Asset ${timestamp}`,
      url: newUrl,
      category,
      dateAdded: new Date(),
    };

    const isMongo = mongoose.connection.readyState === 1;
    if (isMongo) {
      await CmsContent.findOneAndUpdate(
        { key: 'main' },
        { $push: { media: newMediaAsset } },
        { upsert: true }
      );
    } else {
      inMemoryCmsContent.media = [...(inMemoryCmsContent.media || []), newMediaAsset];
    }

    return res.status(200).json({
      success: true,
      message: 'Image compressed to WebP and uploaded successfully.',
      url: newUrl,
      originalSize,
      compressedSize,
      savedPercent,
      asset: newMediaAsset,
    });
  } catch (err) {
    console.error('[Upload & Compress Error]', err);
    return res.status(500).json({ success: false, error: err.message || 'Image compression/upload failed.' });
  }
};

export const deleteMediaAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongo = mongoose.connection.readyState === 1;

    let targetAsset = null;
    if (isMongo) {
      const doc = await CmsContent.findOne({ key: 'main' }).lean();
      targetAsset = (doc?.media || []).find((m) => m.id === id);
      await CmsContent.findOneAndUpdate(
        { key: 'main' },
        { $pull: { media: { id } } }
      );
    } else {
      targetAsset = (inMemoryCmsContent.media || []).find((m) => m.id === id);
      inMemoryCmsContent.media = (inMemoryCmsContent.media || []).filter((m) => m.id !== id);
    }

    if (targetAsset?.url && targetAsset.url.startsWith('/uploads/')) {
      try {
        const filename = path.basename(targetAsset.url.split('?')[0]);
        const filePath = path.join(UPLOADS_DIR, filename);
        if (filePath.startsWith(UPLOADS_DIR) && fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
          console.log(`[Media Delete] File removed from disk: ${filename}`);
        }
      } catch (fErr) {
        console.warn('[Media Delete] File removal warning:', fErr?.message);
      }
    }

    return res.status(200).json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (err) {
    console.error('[Delete Media Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to delete media asset.' });
  }
};

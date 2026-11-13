import { Router } from 'express';
import multer from 'multer';
import {
  adminLogin,
  adminVerify,
  getDashboardStats,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  exportInquiriesCsv,
  getEstimates,
  getBookings,
  updateBookingStatus,
  getCmsContent,
  updateCmsContent,
  getMediaLibrary,
  addMediaAsset,
  uploadAndCompressImage,
  deleteMediaAsset,
} from '../controllers/adminController.js';
import { verifyAdminToken } from '../middleware/adminAuth.js';

const router = Router();

// Configure multer for memory buffer uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max upload
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP, SVG, GIF, AVIF) are permitted.'));
    }
  },
});

// Public auth & CMS content endpoints
router.post('/admin/login', adminLogin);
router.get('/cms/content', getCmsContent);

// Protected Admin Portal routes
router.get('/admin/verify', verifyAdminToken, adminVerify);
router.get('/admin/stats', verifyAdminToken, getDashboardStats);

// Inquiries oversight
router.get('/admin/inquiries', verifyAdminToken, getInquiries);
router.get('/admin/inquiries/export', verifyAdminToken, exportInquiriesCsv);
router.patch('/admin/inquiries/:id', verifyAdminToken, updateInquiryStatus);
router.delete('/admin/inquiries/:id', verifyAdminToken, deleteInquiry);

// Estimates & Bookings oversight
router.get('/admin/estimates', verifyAdminToken, getEstimates);
router.get('/admin/bookings', verifyAdminToken, getBookings);
router.patch('/admin/bookings/:id', verifyAdminToken, updateBookingStatus);

// CMS Content Management
router.get('/admin/cms/content', verifyAdminToken, getCmsContent);
router.put('/admin/cms/content', verifyAdminToken, updateCmsContent);
router.get('/admin/media', verifyAdminToken, getMediaLibrary);
router.post('/admin/media', verifyAdminToken, addMediaAsset);
router.post('/admin/media/upload', verifyAdminToken, upload.single('file'), uploadAndCompressImage);
router.delete('/admin/media/:id', verifyAdminToken, deleteMediaAsset);

export default router;


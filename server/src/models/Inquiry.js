import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [160, 'Company name cannot exceed 160 characters'],
    },
    email: {
      type: String,
      required: [true, 'Business email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid business email address'],
      maxlength: [160, 'Email cannot exceed 160 characters'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [50, 'Phone cannot exceed 50 characters'],
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Railcar category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    configuration: {
      type: String,
      trim: true,
      maxlength: [120, 'Configuration cannot exceed 120 characters'],
      default: '',
    },
    quantity: {
      type: String,
      trim: true,
      maxlength: [50, 'Quantity cannot exceed 50 characters'],
      default: '',
    },
    commodity: {
      type: String,
      trim: true,
      maxlength: [200, 'Commodity/Application cannot exceed 200 characters'],
      default: '',
    },
    timing: {
      type: String,
      trim: true,
      maxlength: [100, 'Timing cannot exceed 100 characters'],
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message or requirements description is required'],
      trim: true,
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    type: {
      type: String,
      enum: ['quote', 'catalog-inquiry', 'general-contact'],
      default: 'quote',
    },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'contacted', 'closed'],
      default: 'new',
    },
    sourceUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ email: 1 });
inquirySchema.index({ category: 1 });

export const Inquiry = mongoose.model('Inquiry', inquirySchema);

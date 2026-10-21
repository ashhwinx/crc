import mongoose from 'mongoose';

const bookingRequestSchema = new mongoose.Schema(
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
    preferredDate: {
      type: String,
      required: [true, 'Preferred date is required'],
      trim: true,
    },
    preferredTimeSlot: {
      type: String,
      required: [true, 'Preferred time slot is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Discussion topic is required'],
      trim: true,
      maxlength: [150, 'Topic cannot exceed 150 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rescheduled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

bookingRequestSchema.index({ createdAt: -1 });

export const BookingRequest = mongoose.model('BookingRequest', bookingRequestSchema);

import mongoose from 'mongoose';

const estimateSchema = new mongoose.Schema(
  {
    estimateReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Railcar category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    categorySlug: {
      type: String,
      trim: true,
      default: '',
    },
    configuration: {
      type: String,
      required: [true, 'Car size configuration is required'],
      trim: true,
      maxlength: [150, 'Configuration cannot exceed 150 characters'],
    },
    leaseType: {
      type: String,
      enum: ['full', 'net'],
      default: 'full',
    },
    termId: {
      type: String,
      default: 'medium',
    },
    termName: {
      type: String,
      default: '3-Year Standard',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity of railcars is required'],
      min: [1, 'Quantity must be at least 1 car'],
      max: [500, 'Quantity cannot exceed 500 cars per online estimate'],
    },
    regionId: {
      type: String,
      default: 'gulf-coast',
    },
    regionName: {
      type: String,
      default: 'Gulf Coast & Texas Petrochemical Corridor',
    },
    rates: {
      minMonthlyPerCar: { type: Number, required: true },
      maxMonthlyPerCar: { type: Number, required: true },
      totalMinMonthly: { type: Number, required: true },
      totalMaxMonthly: { type: Number, required: true },
      totalMinAnnual: { type: Number, required: true },
      totalMaxAnnual: { type: Number, required: true },
      volumeDiscountPct: { type: Number, default: 0 },
    },
    metrics: {
      trucksReplacedMin: { type: Number, default: 0 },
      trucksReplacedMax: { type: Number, default: 0 },
      totalPayloadTons: { type: Number, default: 0 },
    },
    contactInfo: {
      name: { type: String, trim: true, default: '' },
      company: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
    },
    status: {
      type: String,
      enum: ['active', 'converted_to_quote', 'archived'],
      default: 'active',
    },
    inquiryReference: {
      type: String,
      default: null,
    },
    source: {
      type: String,
      default: 'web_estimator',
    },
  },
  {
    timestamps: true,
  }
);

estimateSchema.index({ createdAt: -1 });
estimateSchema.index({ 'contactInfo.email': 1 });

export const Estimate = mongoose.model('Estimate', estimateSchema);

import mongoose from 'mongoose';

const cmsContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main',
    },
    companyInfo: {
      name: { type: String, default: 'Coast Road Capital' },
      phone: { type: String, default: '919-670-7979' },
      email: { type: String, default: 'contact@coastroadcapital.com' },
      address: { type: String, default: '3730 Midtown Drive, #1228, Tampa, Florida' },
      googleMapsUrl: {
        type: String,
        default: 'https://www.google.com/maps/search/3730+Midtown+Drive,+%231228+Tampa,+Florida',
      },
      hours: { type: String, default: 'Mon – Fri: 8:00 AM – 6:00 PM EST' },
    },
    hero: {
      eyebrow: { type: String, default: 'Coast Road Capital • Industrial Freight & Rail Solutions' },
      headline: { type: String, default: 'Capital Solutions for Freight Rail Transportation' },
      subheadline: {
        type: String,
        default:
          'Coast Road Capital provides railcar leasing, industrial rail infrastructure development, and freight logistics solutions across North America.',
      },
      badge1: { type: String, default: '7 Industrial Freight Car Classes' },
      badge2: { type: String, default: 'Full-Service & Net Leases' },
      badge3: { type: String, default: 'North America Coverage' },
    },
    announcement: {
      active: { type: Boolean, default: false },
      text: {
        type: String,
        default: 'Now accepting inquiries for 2026/2027 railcar fleet sourcing and industrial spur feasibility.',
      },
      link: { type: String, default: '/quote' },
    },
    equipmentOverrides: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, default: '' },
        typicalCommodities: { type: String, default: '' },
        baseMonthlyRate: { type: Number, default: 0 },
        availableStatus: { type: String, default: 'Available for Inquiries' },
      },
    ],
    faqs: [
      {
        id: { type: String, default: '' },
        q: { type: String, required: true },
        a: { type: String, required: true },
        category: { type: String, default: 'general' },
      },
    ],
    media: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        url: { type: String, required: true },
        category: { type: String, default: 'general' },
        dateAdded: { type: Date, default: Date.now },
      },
    ],
    lastUpdatedBy: {
      type: String,
      default: 'admin@coastroadcapital.com',
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const CmsContent = mongoose.model('CmsContent', cmsContentSchema);


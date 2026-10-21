export interface EquipmentConfiguration {
  name: string;
  note: string;
}

export interface EquipmentCategory {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  imageAlt: string;
  configurations: EquipmentConfiguration[];
  typicalCommodities: string[];
  loadingProfile: string;
  inquiryNotice: string;
}

export interface InquiryPayload {
  name: string;
  company: string;
  email: string;
  phone?: string;
  category: string;
  configuration?: string;
  quantity?: string;
  commodity?: string;
  timing?: string;
  message: string;
  type?: 'quote' | 'catalog-inquiry' | 'general-contact';
  sourceUrl?: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  referenceNumber?: string;
  referenceId?: string;
  storageMethod?: string;
  emailSent?: boolean;
  emailStatus?: string;
  error?: string;
  data?: {
    name: string;
    company: string;
    category: string;
    configuration?: string;
    createdAt?: string;
  };
}

export interface BookingPayload {
  name: string;
  company: string;
  email: string;
  phone?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  topic: string;
  notes?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
  referenceId?: string;
  storageMethod?: string;
  calendarStatus?: string;
  error?: string;
  data?: {
    name: string;
    company: string;
    preferredDate: string;
    preferredTimeSlot: string;
    topic: string;
  };
}

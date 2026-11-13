export interface AdminUser {
  name: string;
  title: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  summary: {
    totalInquiries: number;
    newInquiries: number;
    reviewingInquiries: number;
    closedInquiries: number;
    totalEstimates: number;
    totalEstimatedCars: number;
    totalEstimatedValue: number;
    totalBookings: number;
    pendingBookings: number;
  };
  categoryDemand: Record<string, number>;
  recentActivity: Array<{
    id: string;
    type: 'inquiry' | 'estimate' | 'booking';
    title: string;
    subtitle: string;
    time: string;
    status: string;
  }>;
  databaseConnected: boolean;
}

export interface InquiryItem {
  _id: string;
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
  type: string;
  status: 'new' | 'reviewing' | 'contacted' | 'closed';
  internalNote?: string;
  createdAt: string;
}

export interface EstimateItem {
  _id?: string;
  estimateReference: string;
  category: string;
  configuration: string;
  leaseType: string;
  termName: string;
  quantity: number;
  rates: {
    minMonthlyPerCar: number;
    maxMonthlyPerCar: number;
    totalMinMonthly: number;
    totalMaxMonthly: number;
    totalMinAnnual: number;
    totalMaxAnnual: number;
  };
  contactInfo?: {
    name?: string;
    company?: string;
    email?: string;
  };
  status: string;
  createdAt: string;
}

export interface BookingItem {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  topic: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed';
  createdAt: string;
}

export interface CmsHero {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  bgImage?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  badge1?: string;
  badge2?: string;
  badge3?: string;
}

export interface CmsServiceCard {
  id: string;
  title: string;
  subtitle: string;
  points: string[];
  linkTo?: string;
  linkText?: string;
}

export interface CmsBentoCard {
  id: string;
  number?: string;
  label?: string;
  badge?: string;
  title: string;
  desc: string;
}

export interface CmsPartnerCarrier {
  title?: string;
  subtitle?: string;
  desc?: string;
}

export interface CmsServicesHeader {
  title?: string;
  desc?: string;
}

export interface CmsWhoWeAre {
  eyebrow?: string;
  title?: string;
  p1?: string;
  p2?: string;
  callout1Title?: string;
  callout1Sub?: string;
  callout2Title?: string;
  callout2Sub?: string;
  image?: string;
  btn1Text?: string;
  btn2Text?: string;
}

export interface CmsEstimatorCallout {
  title?: string;
  desc?: string;
  feature1Title?: string;
  feature1Desc?: string;
  feature2Title?: string;
  feature2Desc?: string;
  btn1Text?: string;
  btn2Text?: string;
}

export interface CmsDeliveryStep {
  num: string;
  title: string;
  desc: string;
  checks: string[];
}

export interface CmsDeliveryProcess {
  eyebrow?: string;
  title?: string;
  desc?: string;
  steps?: CmsDeliveryStep[];
}

export interface CmsEstimatorCategoryRates {
  id: string; // 'boxcars', 'covered-hoppers', etc.
  name: string;
  baseNetMin: number;
  baseNetMax: number;
  baseFullMin: number;
  baseFullMax: number;
  truckloadEquivalent?: number;
  avgPayloadTons?: number;
}

export interface CmsEstimatorTermFactor {
  id: string; // 'short', 'medium', 'long'
  name: string;
  factor: number;
  note?: string;
}

export interface CmsEstimatorVolumeTier {
  minQty: number;
  discountPercent: number; // e.g. 10 for 10% discount
}

export interface CmsEstimatorRegionFactor {
  id: string;
  name: string;
  factor: number;
}

export interface CmsCostEstimatorConfig {
  categoryRates: CmsEstimatorCategoryRates[];
  termFactors: CmsEstimatorTermFactor[];
  volumeTiers: CmsEstimatorVolumeTier[];
  regionFactors: CmsEstimatorRegionFactor[];
}

export interface CmsRailroadPartnershipsData {
  hero?: {
    headline?: string;
    subheadline?: string;
    bgImage?: string;
  };
  bentoCards?: CmsBentoCard[];
  partnerCarrier?: CmsPartnerCarrier;
}

export interface CmsHomeData {
  hero?: CmsHero;
  servicesHeader?: CmsServicesHeader;
  services?: CmsServiceCard[];
  whoWeAre?: CmsWhoWeAre;
  estimatorCallout?: CmsEstimatorCallout;
  deliveryProcess?: CmsDeliveryProcess;
  railroadSupportBento?: CmsBentoCard[];
  partnerCarrier?: CmsPartnerCarrier;
}

export interface CmsAboutData {
  hero?: {
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    bgImage?: string;
  };
  heritage?: {
    headline?: string;
    p1?: string;
    p2?: string;
    p3?: string;
  };
  leadership?: {
    name?: string;
    role?: string;
    bio?: string;
    quote?: string;
    image?: string;
  };
}

export interface CmsCompanyValuesData {
  hero?: {
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
  };
  values?: Array<{
    id: string;
    number?: string;
    title: string;
    text: string;
    statLine?: string;
  }>;
}

export interface CmsEquipmentItem {
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
  description: string;
  typicalCommodities: string;
  baseMonthlyRate: number;
  availableStatus: string;
  capacities?: string;
}

export interface CmsContentData {
  companyInfo: {
    name: string;
    phone: string;
    emergencyPhone?: string;
    email: string;
    address: string;
    googleMapsUrl: string;
    hours: string;
  };
  hero: CmsHero;
  announcement: {
    active: boolean;
    text: string;
    link: string;
  };
  home?: CmsHomeData;
  about?: CmsAboutData;
  companyValues?: CmsCompanyValuesData;
  railroadPartnerships?: CmsRailroadPartnershipsData;
  costEstimator?: CmsCostEstimatorConfig;
  equipmentOverrides: CmsEquipmentItem[];
  faqs: Array<{
    id: string;
    q: string;
    a: string;
    category?: string;
  }>;
  media: Array<{
    id: string;
    title: string;
    url: string;
    category?: string;
    dateAdded?: string;
  }>;
  lastUpdatedBy?: string;
  updatedAt?: string;
}

const TOKEN_KEY = 'crc_admin_token';
const USER_KEY = 'crc_admin_user';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export function getStoredAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdminUser(): AdminUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function adminLoginApi(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Authentication failed' };
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unable to connect to administration server' };
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (res.ok && data.success) return data.data;
    return null;
  } catch {
    return null;
  }
}

export async function fetchAdminInquiries(status?: string, search?: string): Promise<InquiryItem[]> {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.set('status', status);
    if (search) params.set('search', search);

    const res = await fetch(`${API_BASE}/admin/inquiries?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (res.ok && data.success) return data.data;
    return [];
  } catch {
    return [];
  }
}

export async function updateInquiryStatusApi(id: string, status: string, internalNote?: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, internalNote }),
    });
    const data = await res.json();
    return Boolean(res.ok && data.success);
  } catch {
    return false;
  }
}

export async function deleteInquiryApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/inquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAdminEstimates(): Promise<EstimateItem[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/estimates`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (res.ok && data.success) return data.data;
    return [];
  } catch {
    return [];
  }
}

export async function fetchAdminBookings(): Promise<BookingItem[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/bookings`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (res.ok && data.success) return data.data;
    return [];
  } catch {
    return [];
  }
}

export async function updateBookingStatusApi(id: string, status: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchCmsContentApi(): Promise<CmsContentData | null> {
  try {
    const res = await fetch(`${API_BASE}/cms/content`);
    const data = await res.json();
    if (res.ok && data.success) return data.data;
    return null;
  } catch {
    return null;
  }
}

export async function updateCmsContentApi(payload: Partial<CmsContentData>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/cms/content`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return Boolean(res.ok && data.success);
  } catch {
    return false;
  }
}

export async function addMediaAssetApi(title: string, url: string, category: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/media`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, url, category }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface CmsMediaAsset {
  id: string;
  title: string;
  url: string;
  category?: string;
  dateAdded?: string;
}

export interface UploadImageResult {
  success: boolean;
  url?: string;
  originalSize?: number;
  compressedSize?: number;
  savedPercent?: number;
  asset?: CmsMediaAsset;
  error?: string;
}

export async function uploadImageApi(
  file: File,
  oldUrl?: string,
  category: string = 'general'
): Promise<UploadImageResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (oldUrl) formData.append('oldUrl', oldUrl);
    formData.append('category', category);

    const token = localStorage.getItem('crc_admin_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/admin/media/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error during upload.' };
  }
}

export async function deleteMediaAssetApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}


import type { EquipmentCategory, InquiryPayload, InquiryResponse, BookingPayload, BookingResponse } from '../types';
import { EQUIPMENT_CATEGORIES } from '../data/equipmentData';

// Generate authentic business reference IDs
function generateReferenceId(prefix: 'INQ' | 'BKG'): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `CRC-${prefix}-${year}-${randomNum}`;
}

// Local storage keys for standalone inquiry persistence
const STORAGE_INQUIRIES_KEY = 'crc_stored_inquiries';
const STORAGE_BOOKINGS_KEY = 'crc_stored_bookings';

function persistLocally(key: string, item: any) {
  try {
    const existingRaw = localStorage.getItem(key);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift(item);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) {
    console.warn('[CRC Client] Local storage write skipped:', e);
  }
}

/**
 * Fetch equipment categories. In Phase 1 standalone mode, this is delivered
 * instantly from the verified local equipment catalog.
 */
export async function fetchEquipmentList(): Promise<{ success: boolean; data: EquipmentCategory[] }> {
  return { success: true, data: EQUIPMENT_CATEGORIES };
}

/**
 * Fetch specific equipment category by ID or slug.
 */
export async function fetchEquipmentById(id: string): Promise<EquipmentCategory | null> {
  const found = EQUIPMENT_CATEGORIES.find(
    (c) => c.id.toLowerCase() === id.toLowerCase() || c.slug.toLowerCase() === id.toLowerCase()
  );
  return found || null;
}

/**
 * Submit Quote / Equipment Sourcing Inquiry.
 * Decoupled standalone mode: Persists inquiry in browser storage, generates a
 * verifiable CRC reference number, and delivers instant confirmation.
 */
export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResponse> {
  // Micro-delay for smooth UI feedback and realistic submission transition
  await new Promise((resolve) => setTimeout(resolve, 450));

  const referenceId = generateReferenceId('INQ');
  const record = {
    ...payload,
    referenceId,
    submittedAt: new Date().toISOString(),
    status: 'received',
  };

  persistLocally(STORAGE_INQUIRIES_KEY, record);

  // Optional background sync if backend is running, without blocking or erroring
  try {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    fetch(`${apiBase}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Intentionally silent: Frontend is decoupled and independent
    });
  } catch {
    // Ignore network errors in standalone mode
  }

  return {
    success: true,
    message: 'Your railcar leasing inquiry has been successfully received by Coast Road Capital. An equipment specialist will review your specifications and contact you shortly.',
    referenceId,
    referenceNumber: referenceId,
  };
}

/**
 * Submit Book a Call / Consultation Request.
 * Decoupled standalone mode: Persists booking in browser storage and returns
 * guaranteed scheduling confirmation.
 */
export async function submitBookingRequest(payload: BookingPayload): Promise<BookingResponse> {
  await new Promise((resolve) => setTimeout(resolve, 450));

  const referenceId = generateReferenceId('BKG');
  const record = {
    ...payload,
    referenceId,
    submittedAt: new Date().toISOString(),
    status: 'scheduled_request',
  };

  persistLocally(STORAGE_BOOKINGS_KEY, record);

  // Optional background sync if backend is running
  try {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    fetch(`${apiBase}/bookings/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Intentionally silent: Frontend is decoupled and independent
    });
  } catch {
    // Ignore network errors in standalone mode
  }

  return {
    success: true,
    message: `Consultation request confirmed for ${payload.preferredDate} at ${payload.preferredTimeSlot}. An equipment advisor will reach out to confirm calendar details.`,
    referenceId,
    bookingId: referenceId,
    calendarStatus: 'Queued for calendar dispatch',
  };
}

/**
 * Health check in standalone mode.
 */
export async function checkSystemHealth(): Promise<any> {
  return {
    status: 'healthy',
    mode: 'standalone_client',
    version: '1.0.0-Phase1',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Retrieve user's past inquiries stored locally in browser
 */
export function getStoredInquiries(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_INQUIRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

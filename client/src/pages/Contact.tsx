import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle2, RefreshCw, Clock, Copy, Check, Calendar as CalendarIcon } from 'lucide-react';
import { submitInquiry, submitBookingRequest } from '../services/api';
import type { InquiryResponse, BookingResponse } from '../types';

const TIME_SLOTS = [
  '09:00 AM – 10:00 AM CST',
  '10:30 AM – 11:30 AM CST',
  '01:00 PM – 02:00 PM CST',
  '02:30 PM – 03:30 PM CST',
  '04:00 PM – 05:00 PM CST',
];

const CONSULTATION_TOPICS = [
  'Railcar Sourcing & Market Availability',
  'Fleet Lease Terms (Full-Service vs. Net)',
  'Equipment Technical Specifications Review',
  'Seasonal Surge Allocation & Dedicated Sets',
  'General Rail Logistics Advisory',
];

export const Contact: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'booking' ? 'booking' : 'inquiry';
  const [activeTab, setActiveTab] = useState<'inquiry' | 'booking'>(initialTab);

  // Inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: 'General Corporate Inquiry',
    message: '',
  });

  // Booking form state
  const [bookingData, setBookingData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTimeSlot: TIME_SLOTS[0],
    topic: CONSULTATION_TOPICS[0],
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<InquiryResponse | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Min date for booking = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  // Sync URL with tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'booking') setActiveTab('booking');
  }, [searchParams]);

  const handleTabChange = (tab: 'inquiry' | 'booking') => {
    setActiveTab(tab);
    setSearchParams(tab === 'booking' ? { tab: 'booking' } : {});
    setErrors({});
    setSubmitResult(null);
    setBookingResult(null);
  };

  // Validate inquiry form
  const validateInquiry = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Please enter your message';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate booking form
  const validateBooking = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!bookingData.name.trim()) newErrors.name = 'Full name is required';
    if (!bookingData.company.trim()) newErrors.company = 'Company name is required';
    if (!bookingData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(bookingData.email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!bookingData.preferredDate) newErrors.preferredDate = 'Please select a date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInquiry()) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    const payload = {
      ...formData,
      type: 'general-contact' as const,
      sourceUrl: window.location.href,
    };

    const result = await submitInquiry(payload);
    setIsSubmitting(false);
    setSubmitResult(result);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBooking()) return;

    setIsSubmitting(true);
    setBookingResult(null);

    const result = await submitBookingRequest(bookingData);
    setIsSubmitting(false);
    setBookingResult(result);
  };

  const handleReset = () => {
    setSubmitResult(null);
    setBookingResult(null);
    setFormData({ name: '', company: '', email: '', phone: '', category: 'General Corporate Inquiry', message: '' });
    setBookingData({ name: '', company: '', email: '', phone: '', preferredDate: '', preferredTimeSlot: TIME_SLOTS[0], topic: CONSULTATION_TOPICS[0], notes: '' });
    setErrors({});
    setCopied(false);
  };

  const copyRef = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="contact-page">
      {/* Compact Header */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '3.5rem 0 2.5rem',
          borderBottom: '3px solid #AA2E1F',
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Contact Us
          </h1>
          <p style={{ fontSize: '1.08rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '600px', margin: 0 }}>
            Get in touch with our leasing team or schedule a consultation call.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section" style={{ paddingTop: '3rem', paddingBottom: '4rem', backgroundColor: '#FAF9F7' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              gap: '3rem',
              alignItems: 'flex-start',
            }}
            className="contact-grid"
          >
            {/* Left Column: Contact Details */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '1.5rem' }}>
                Direct Contact
              </h3>

              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FDF3F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={18} style={{ color: '#AA2E1F' }} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0A0A09', marginBottom: '0.15rem' }}>
                    Phone
                  </strong>
                  <a href="tel:+18325551200" style={{ fontSize: '0.92rem', color: '#475569', textDecoration: 'none' }}>
                    (832) 555-1200
                  </a>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FDF3F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={18} style={{ color: '#AA2E1F' }} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0A0A09', marginBottom: '0.15rem' }}>
                    Email
                  </strong>
                  <a href="mailto:leasing@coastroadcapital.com" style={{ fontSize: '0.92rem', color: '#475569', textDecoration: 'none' }}>
                    leasing@coastroadcapital.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#FDF3F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={18} style={{ color: '#AA2E1F' }} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0A0A09', marginBottom: '0.15rem' }}>
                    Headquarters
                  </strong>
                  <span style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, display: 'block' }}>
                    Houston, TX<br />
                    United States
                  </span>
                </div>
              </div>

              {/* Hours */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={18} style={{ color: '#64748B' }} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0A0A09', marginBottom: '0.15rem' }}>
                    Business Hours
                  </strong>
                  <span style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, display: 'block' }}>
                    Mon – Fri: 8:00 AM – 5:00 PM CST<br />
                    Inquiries reviewed within 1 business day
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Tabbed Forms */}
            <div
              className="card"
              style={{
                borderRadius: '14px',
                padding: 0,
                boxShadow: '0 4px 16px -2px rgba(15,23,42,0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Tab switcher */}
              <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => handleTabChange('inquiry')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    fontWeight: activeTab === 'inquiry' ? 700 : 500,
                    color: activeTab === 'inquiry' ? '#AA2E1F' : '#64748B',
                    background: activeTab === 'inquiry' ? '#FFFFFF' : '#F8FAFC',
                    border: 'none',
                    cursor: 'pointer',
                    borderBottom: activeTab === 'inquiry' ? '2px solid #AA2E1F' : '2px solid transparent',
                    transition: 'all 150ms ease',
                  }}
                >
                  <Mail size={16} style={{ marginRight: '0.4rem', verticalAlign: '-3px' }} />
                  Send Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('booking')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    fontWeight: activeTab === 'booking' ? 700 : 500,
                    color: activeTab === 'booking' ? '#AA2E1F' : '#64748B',
                    background: activeTab === 'booking' ? '#FFFFFF' : '#F8FAFC',
                    border: 'none',
                    cursor: 'pointer',
                    borderBottom: activeTab === 'booking' ? '2px solid #AA2E1F' : '2px solid transparent',
                    transition: 'all 150ms ease',
                  }}
                >
                  <CalendarIcon size={16} style={{ marginRight: '0.4rem', verticalAlign: '-3px' }} />
                  Book a Call
                </button>
              </div>

              <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                {/* ==================== INQUIRY TAB ==================== */}
                {activeTab === 'inquiry' && (
                  <>
                    {submitResult?.success ? (
                      <div style={{ textAlign: 'center', padding: '2rem 0.5rem' }}>
                        <CheckCircle2 size={48} style={{ color: '#059669', margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                          Message Sent
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                          {submitResult.message}
                        </p>
                        {submitResult.referenceId && (
                          <div
                            style={{
                              backgroundColor: '#F7F4EB',
                              border: '1px solid #DCD3BF',
                              padding: '0.6rem 1rem',
                              borderRadius: '8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.88rem',
                              color: '#0A0A09',
                              fontWeight: 600,
                              marginBottom: '1.5rem',
                            }}
                          >
                            Ref: {submitResult.referenceId}
                            <button
                              type="button"
                              onClick={() => copyRef(submitResult.referenceId!)}
                              style={{
                                background: '#FFFFFF',
                                border: '1px solid #CBD5E1',
                                borderRadius: '4px',
                                padding: '0.2rem 0.4rem',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                color: copied ? '#059669' : '#475569',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                              }}
                            >
                              {copied ? <Check size={11} /> : <Copy size={11} />}
                              {copied ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        )}
                        <div>
                          <button type="button" onClick={handleReset} className="btn btn-secondary">
                            Send Another Message
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleInquirySubmit} noValidate>
                        {submitResult?.error && (
                          <div style={{ backgroundColor: '#FEF2F2', borderLeft: '3px solid #EF4444', padding: '0.75rem 1rem', borderRadius: '0 6px 6px 0', marginBottom: '1.25rem', color: '#991B1B', fontSize: '0.88rem' }}>
                            {submitResult.message}
                          </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label" htmlFor="contact-name">Full Name <span className="required-star">*</span></label>
                            <input id="contact-name" type="text" className={`form-control ${errors.name ? 'error' : ''}`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="David Ross" />
                            {errors.name && <div className="form-error">{errors.name}</div>}
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="contact-company">Company <span className="required-star">*</span></label>
                            <input id="contact-company" type="text" className={`form-control ${errors.company ? 'error' : ''}`} value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Great Plains Grain" />
                            {errors.company && <div className="form-error">{errors.company}</div>}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label" htmlFor="contact-email">Email <span className="required-star">*</span></label>
                            <input id="contact-email" type="email" className={`form-control ${errors.email ? 'error' : ''}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="dross@greatplains.com" />
                            {errors.email && <div className="form-error">{errors.email}</div>}
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="contact-phone">Phone (Optional)</label>
                            <input id="contact-phone" type="tel" className="form-control" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="(555) 456-7890" />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="contact-category">Topic</label>
                          <select id="contact-category" className="form-control" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            <option value="General Corporate Inquiry">General Inquiry</option>
                            <option value="Railcar Sourcing & Leasing">Railcar Sourcing & Leasing</option>
                            <option value="Fleet Maintenance Terms">Fleet Maintenance</option>
                            <option value="Partnership / Carrier Relations">Partnership / Carriers</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="contact-message">Message <span className="required-star">*</span></label>
                          <textarea id="contact-message" rows={4} className={`form-control ${errors.message ? 'error' : ''}`} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us about your railcar needs..." />
                          {errors.message && <div className="form-error">{errors.message}</div>}
                        </div>

                        <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                          {isSubmitting ? (
                            <>
                              <RefreshCw size={16} className="animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              Send Inquiry
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </>
                )}

                {/* ==================== BOOKING TAB ==================== */}
                {activeTab === 'booking' && (
                  <>
                    {bookingResult?.success ? (
                      <div style={{ textAlign: 'center', padding: '2rem 0.5rem' }}>
                        <CheckCircle2 size={48} style={{ color: '#059669', margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                          Call Requested
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                          {bookingResult.message}
                        </p>
                        {(bookingResult.bookingId || bookingResult.referenceId) && (
                          <div style={{ backgroundColor: '#F7F4EB', border: '1px solid #DCD3BF', borderRadius: '8px', padding: '1rem', maxWidth: '360px', margin: '0 auto 1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span style={{ color: '#64748B' }}>Booking ID:</span>
                              <strong style={{ color: '#0A0A09' }}>{bookingResult.bookingId || bookingResult.referenceId}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span style={{ color: '#64748B' }}>Date:</span>
                              <strong style={{ color: '#0A0A09' }}>{bookingData.preferredDate}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#64748B' }}>Time:</span>
                              <strong style={{ color: '#0A0A09' }}>{bookingData.preferredTimeSlot}</strong>
                            </div>
                          </div>
                        )}
                        <button type="button" onClick={handleReset} className="btn btn-secondary">
                          Schedule Another Call
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleBookingSubmit} noValidate>
                        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                          Select your preferred time and we'll confirm via email with a calendar invite.
                        </p>

                        {bookingResult?.error && (
                          <div style={{ backgroundColor: '#FEF2F2', borderLeft: '3px solid #EF4444', padding: '0.75rem 1rem', borderRadius: '0 6px 6px 0', marginBottom: '1.25rem', color: '#991B1B', fontSize: '0.88rem' }}>
                            {bookingResult.message}
                          </div>
                        )}

                        <div className="form-group">
                          <label className="form-label" htmlFor="booking-topic">Discussion Topic <span className="required-star">*</span></label>
                          <select id="booking-topic" className="form-control" value={bookingData.topic} onChange={(e) => setBookingData({ ...bookingData, topic: e.target.value })}>
                            {CONSULTATION_TOPICS.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label" htmlFor="booking-date">Preferred Date <span className="required-star">*</span></label>
                            <input id="booking-date" type="date" min={minDateString} className={`form-control ${errors.preferredDate ? 'error' : ''}`} value={bookingData.preferredDate} onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })} />
                            {errors.preferredDate && <div className="form-error">{errors.preferredDate}</div>}
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="booking-slot">Time Slot (CST) <span className="required-star">*</span></label>
                            <select id="booking-slot" className="form-control" value={bookingData.preferredTimeSlot} onChange={(e) => setBookingData({ ...bookingData, preferredTimeSlot: e.target.value })}>
                              {TIME_SLOTS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label" htmlFor="booking-name">Full Name <span className="required-star">*</span></label>
                            <input id="booking-name" type="text" className={`form-control ${errors.name ? 'error' : ''}`} value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} placeholder="Rachel Miller" />
                            {errors.name && <div className="form-error">{errors.name}</div>}
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="booking-company">Company <span className="required-star">*</span></label>
                            <input id="booking-company" type="text" className={`form-control ${errors.company ? 'error' : ''}`} value={bookingData.company} onChange={(e) => setBookingData({ ...bookingData, company: e.target.value })} placeholder="Apex Bulk Logistics" />
                            {errors.company && <div className="form-error">{errors.company}</div>}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label" htmlFor="booking-email">Email <span className="required-star">*</span></label>
                            <input id="booking-email" type="email" className={`form-control ${errors.email ? 'error' : ''}`} value={bookingData.email} onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })} placeholder="rmiller@apexlogistics.com" />
                            {errors.email && <div className="form-error">{errors.email}</div>}
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="booking-phone">Phone (Optional)</label>
                            <input id="booking-phone" type="tel" className="form-control" value={bookingData.phone} onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })} placeholder="(555) 345-6789" />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="booking-notes">Notes (Optional)</label>
                          <textarea id="booking-notes" rows={2} className="form-control" value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })} placeholder="Fleet size, car types, siding requirements..." />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                          {isSubmitting ? (
                            <>
                              <RefreshCw size={16} className="animate-spin" />
                              Scheduling...
                            </>
                          ) : (
                            <>
                              <CalendarIcon size={16} />
                              Request Consultation
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

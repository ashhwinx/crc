import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, RefreshCw, Info, Check, Copy } from 'lucide-react';
import { submitBookingRequest } from '../services/api';
import type { BookingResponse } from '../types';

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

export const BookCall: React.FC = () => {
  const [formData, setFormData] = useState({
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
  const [submitResult, setSubmitResult] = useState<BookingResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Set min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full contact name is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Business email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid business email address';
    }
    if (!formData.preferredDate) newErrors.preferredDate = 'Please select a preferred date';
    if (!formData.preferredTimeSlot) newErrors.preferredTimeSlot = 'Please select a time window';
    if (!formData.topic) newErrors.topic = 'Please choose a discussion topic';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    const result = await submitBookingRequest(formData);
    setIsSubmitting(false);
    setSubmitResult(result);
  };

  const handleReset = () => {
    setSubmitResult(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      preferredDate: '',
      preferredTimeSlot: TIME_SLOTS[0],
      topic: CONSULTATION_TOPICS[0],
      notes: '',
    });
    setErrors({});
    setCopied(false);
  };

  const copyBookingId = () => {
    if (submitResult?.bookingId || submitResult?.referenceId) {
      const id = submitResult.bookingId || submitResult.referenceId || '';
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="book-call-page">
      {/* Header */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#EDE6D4',
          padding: '5.5rem 0 4rem',
          borderBottom: '3px solid #AA2E1F',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '840px' }}>
           
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 3.85rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              Schedule a Rail Equipment Consultation
            </h1>
            <p style={{ fontSize: '1.18rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '2rem' }}>
              Book a dedicated telephone or video consultation with a Coast Road Capital leasing specialist. Review equipment availability, compare car capacities, and discuss contract terms tailored to your freight volume.
            </p>

            {/* Integration Notice */}
            <div
              style={{
                backgroundColor: '#141413',
                border: '1px solid #2B2B28',
                padding: '1.1rem 1.4rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                fontSize: '0.88rem',
                color: '#EDE6D4',
                lineHeight: 1.6,
              }}
            >
              <Info size={19} style={{ color: '#AA2E1F', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>SCHEDULING NOTICE:</strong> This interface records your preferred appointment window and topics. Once submitted, our team will review schedule availability and dispatch a formal calendar invitation (Google Meet / Microsoft Teams / Direct Phone).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Booking Content */}
      <section className="section section-subtle">
        <div className="container" style={{ maxWidth: '920px' }}>
          {submitResult?.success ? (
            /* Success Confirmation */
            <div
              className="card"
              style={{
                borderRadius: '16px',
                borderTop: '4px solid #059669',
                padding: '3.5rem 2.5rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <CheckCircle2 size={60} style={{ color: '#059669', margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.75rem' }}>
                Consultation Request Logged
              </h2>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.65, maxWidth: '640px', margin: '0 auto 2rem' }}>
                {submitResult.message}
              </p>

              {/* Summary Card */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream-light)',
                  border: '1px solid var(--color-cream-border)',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  maxWidth: '560px',
                  margin: '0 auto 2.5rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-cream-border)' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748B' }}>Booking ID:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.96rem', color: '#AA2E1F' }}>
                      {submitResult.bookingId || submitResult.referenceId || 'CRC-BK-LOGGED'}
                    </span>
                    <button
                      type="button"
                      onClick={copyBookingId}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        padding: '0.2rem 0.45rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color: copied ? '#059669' : '#475569',
                      }}
                      title="Copy Reference"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748B' }}>Requested Date:</span>
                  <strong style={{ color: '#0A0A09' }}>{formData.preferredDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748B' }}>Time Window:</span>
                  <strong style={{ color: '#0A0A09' }}>{formData.preferredTimeSlot}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748B' }}>Topic:</span>
                  <strong style={{ color: '#0A0A09' }}>{formData.topic}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#059669', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #E2E8F0' }}>
                  <span>Calendar Integration:</span>
                  <span style={{ fontWeight: 600 }}>Queued for Team Calendar Dispatch</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
              >
                <RefreshCw size={16} />
                Schedule Another Request
              </button>
            </div>
          ) : (
            /* Booking Form Card */
            <div
              className="card"
              style={{
                borderRadius: '16px',
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {submitResult?.error && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    borderLeft: '4px solid #EF4444',
                    padding: '1rem',
                    borderRadius: '0 8px 8px 0',
                    marginBottom: '2rem',
                    color: '#991B1B',
                    fontSize: '0.92rem',
                  }}
                >
                  {submitResult.message}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* 1. Appointment Preferences */}
                <div style={{ marginBottom: '3rem' }}>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#0A0A09',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.65rem',
                      borderBottom: '2px solid #E2E8F0',
                    }}
                  >
                    1. Consultation Topic &amp; Timing
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="booking-topic">
                      Primary Discussion Topic <span className="required-star">*</span>
                    </label>
                    <select
                      id="booking-topic"
                      className={`form-control ${errors.topic ? 'error' : ''}`}
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    >
                      {CONSULTATION_TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.topic && <div className="form-error">{errors.topic}</div>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.35rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-date">
                        Preferred Date <span className="required-star">*</span>
                      </label>
                      <input
                        id="booking-date"
                        type="date"
                        min={minDateString}
                        className={`form-control ${errors.preferredDate ? 'error' : ''}`}
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      />
                      {errors.preferredDate && <div className="form-error">{errors.preferredDate}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-slot">
                        Preferred Time Slot (CST) <span className="required-star">*</span>
                      </label>
                      <select
                        id="booking-slot"
                        className={`form-control ${errors.preferredTimeSlot ? 'error' : ''}`}
                        value={formData.preferredTimeSlot}
                        onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      {errors.preferredTimeSlot && <div className="form-error">{errors.preferredTimeSlot}</div>}
                    </div>
                  </div>
                </div>

                {/* 2. Customer Information */}
                <div style={{ marginBottom: '3rem' }}>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#0A0A09',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.65rem',
                      borderBottom: '2px solid #E2E8F0',
                    }}
                  >
                    2. Your Contact Information
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.35rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-name">
                        Full Name <span className="required-star">*</span>
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        className={`form-control ${errors.name ? 'error' : ''}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rachel Miller"
                      />
                      {errors.name && <div className="form-error">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-company">
                        Company Name <span className="required-star">*</span>
                      </label>
                      <input
                        id="booking-company"
                        type="text"
                        className={`form-control ${errors.company ? 'error' : ''}`}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Apex Bulk Logistics"
                      />
                      {errors.company && <div className="form-error">{errors.company}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-email">
                        Business Email <span className="required-star">*</span>
                      </label>
                      <input
                        id="booking-email"
                        type="email"
                        className={`form-control ${errors.email ? 'error' : ''}`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rmiller@apexlogistics.com"
                      />
                      {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-phone">
                        Direct Phone (Optional)
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 345-6789"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Operational Notes */}
                <div style={{ marginBottom: '3rem' }}>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#0A0A09',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.65rem',
                      borderBottom: '2px solid #E2E8F0',
                    }}
                  >
                    3. Discussion Context &amp; Fleet Overview
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="booking-notes">
                      Brief Operational Notes
                    </label>
                    <textarea
                      id="booking-notes"
                      rows={3}
                      className="form-control"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Share estimated fleet size (e.g., 5-10 cars), preferred car categories, or current siding requirements to help us prepare."
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.5rem',
                    paddingTop: '1.75rem',
                    borderTop: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ fontSize: '0.88rem', color: '#64748B' }}>
                    Consultation requests are reviewed and confirmed by our commercial rail team.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Scheduling Call...
                      </>
                    ) : (
                      <>
                        <CalendarIcon size={18} />
                        Request Sourcing Consultation
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, RefreshCw, Clock, Copy, Check } from 'lucide-react';
import { submitInquiry } from '../services/api';
import type { InquiryResponse } from '../types';
import { TrackMotif } from '../components/common/TrackMotif';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: 'General Corporate Inquiry',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<InquiryResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full contact name is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Business email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid business email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Please enter your message';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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

  const handleReset = () => {
    setSubmitResult(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      category: 'General Corporate Inquiry',
      message: '',
    });
    setErrors({});
    setCopied(false);
  };

  const copyRef = () => {
    if (submitResult?.referenceId) {
      navigator.clipboard.writeText(submitResult.referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="contact-page">
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
              Contact Coast Road Capital
            </h1>
            <p style={{ fontSize: '1.18rem', color: '#CBD5E1', lineHeight: 1.7 }}>
              Connect with our management and equipment leasing team. Whether discussing prospective fleet acquisitions, lease structuring, or corporate rail logistics advisory, we look forward to assisting your operation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Contact Info on Left, Form on Right */}
      <section className="section section-subtle">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Column: Direct Channels & Operational Hours */}
            <div>
              <span className="eyebrow">Corporate Channels</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '1.5rem', lineHeight: 1.25 }}>
                Direct Rail Inquiries
              </h2>
              <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2.25rem' }}>
                Use the inquiry form to outline your business requirements. All messages are received directly by our operations team and logged for prompt commercial review.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {/* Channel 1 */}
                <div
                  className="card hover-lift"
                  style={{
                    padding: '1.5rem 1.75rem',
                    borderRadius: '12px',
                    borderLeft: '4px solid #AA2E1F',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--color-red-light)',
                      color: '#AA2E1F',
                      padding: '0.75rem',
                      borderRadius: '8px',
                    }}
                  >
                    <Mail size={22} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', color: '#0A0A09', marginBottom: '0.35rem' }}>
                      Commercial Leasing Inquiries
                    </strong>
                    <span style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6 }}>
                      Submit your railcar specifications via our online quote and inquiry forms for direct team dispatch.
                    </span>
                  </div>
                </div>

                {/* Channel 2 */}
                <div
                  className="card hover-lift"
                  style={{
                    padding: '1.5rem 1.75rem',
                    borderRadius: '12px',
                    borderLeft: '4px solid #0A0A09',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--color-cream-light)',
                      color: '#0A0A09',
                      padding: '0.75rem',
                      borderRadius: '8px',
                    }}
                  >
                    <Clock size={22} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', color: '#0A0A09', marginBottom: '0.35rem' }}>
                      Response Window
                    </strong>
                    <span style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6 }}>
                      Standard business inquiries are acknowledged within 1 business day during standard central business hours.
                    </span>
                  </div>
                </div>

                {/* Channel 3: Location / Map Verification Notice */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '1.5rem 1.75rem',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    borderLeft: '4px solid #AA2E1F',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.25rem',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--color-cream-light)',
                      color: '#AA2E1F',
                      padding: '0.75rem',
                      borderRadius: '8px',
                    }}
                  >
                    <MapPin size={22} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', color: '#0A0A09', marginBottom: '0.35rem' }}>
                      Headquarters &amp; Physical Office
                    </strong>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                      Interactive Google Maps integration is established in the application architecture. In accordance with client accuracy requirements, the live map embed will be activated upon client verification of the primary operating corporate headquarters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Authentic Client Infrastructure Feature */}
              <div
                className="card"
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img
                    src="/images/track-construction-2.jpg"
                    alt="Direct North American Rail Siding Connection"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '1.25rem 1.4rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#AA2E1F',
                      marginBottom: '0.45rem',
                    }}
                  >
                    <span style={{ width: '16px', height: '2px', backgroundColor: '#AA2E1F', display: 'inline-block', borderRadius: '1px' }} />
                    <span>Continental Siding Interchange</span>
                  </div>
                  <span style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, display: 'block' }}>
                    Coordinating direct rolling stock deliveries across Class I railroads, regional shortlines, and private customer sidings nationwide.
                  </span>
                </div>
              </div>

              <div style={{ maxWidth: '320px' }}>
                <TrackMotif />
              </div>
            </div>

            {/* Right Column: Contact Inquiry Form */}
            <div
              className="card"
              style={{
                borderRadius: '16px',
                padding: 'clamp(2rem, 5vw, 3rem)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {submitResult?.success ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <CheckCircle2 size={56} style={{ color: '#059669', margin: '0 auto 1.25rem' }} />
                  <h3 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.75rem' }}>
                    Message Received
                  </h3>
                  <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                    {submitResult.message}
                  </p>
                  <div
                    style={{
                      backgroundColor: 'var(--color-cream-light)',
                      border: '1px solid var(--color-cream-border)',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem',
                      color: '#AA2E1F',
                      fontWeight: 700,
                      marginBottom: '2rem',
                    }}
                  >
                    <span>Ref: {submitResult.referenceId}</span>
                    <button
                      type="button"
                      onClick={copyRef}
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
                  <div>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-secondary"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: '#0A0A09',
                      marginBottom: '1.5rem',
                      paddingBottom: '0.65rem',
                      borderBottom: '2px solid #E2E8F0',
                    }}
                  >
                    Submit an Inquiry
                  </h3>

                  {submitResult?.error && (
                    <div
                      style={{
                        backgroundColor: '#FEF2F2',
                        borderLeft: '4px solid #EF4444',
                        padding: '0.85rem 1rem',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: '1.5rem',
                        color: '#991B1B',
                        fontSize: '0.88rem',
                      }}
                    >
                      {submitResult.message}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">
                      Full Name <span className="required-star">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      className={`form-control ${errors.name ? 'error' : ''}`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. David Ross"
                    />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-company">
                      Company Name <span className="required-star">*</span>
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      className={`form-control ${errors.company ? 'error' : ''}`}
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Great Plains Grain Terminal"
                    />
                    {errors.company && <div className="form-error">{errors.company}</div>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-email">
                        Business Email <span className="required-star">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        className={`form-control ${errors.email ? 'error' : ''}`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="dross@greatplains.com"
                      />
                      {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-phone">
                        Phone (Optional)
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 456-7890"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-category">
                      Inquiry Category
                    </label>
                    <select
                      id="contact-category"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="General Corporate Inquiry">General Corporate Inquiry</option>
                      <option value="Railcar Sourcing & Leasing">Railcar Sourcing &amp; Leasing</option>
                      <option value="Fleet Maintenance Terms">Fleet Maintenance Terms</option>
                      <option value="Partnership / Carrier Relations">Partnership / Carrier Relations</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">
                      Message Details <span className="required-star">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      className={`form-control ${errors.message ? 'error' : ''}`}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your railcar or logistics inquiry here..."
                    />
                    {errors.message && <div className="form-error">{errors.message}</div>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '0.75rem' }}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Transmitting Message...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Transmit Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

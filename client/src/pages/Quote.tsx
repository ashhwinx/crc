import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, CheckCircle2, AlertCircle, RefreshCw, Info, Copy, Check, ArrowRight } from 'lucide-react';
import { EQUIPMENT_CATEGORIES } from '../data/equipmentData';
import { submitInquiry } from '../services/api';
import type { InquiryResponse } from '../types';

export const Quote: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Boxcars';
  const initialConfig = searchParams.get('config') || '';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: initialCategory,
    configuration: initialConfig,
    quantity: '',
    commodity: '',
    timing: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<InquiryResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Synchronize category from URL if changed
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFormData((prev) => ({
        ...prev,
        category: cat,
        configuration: searchParams.get('config') || '',
      }));
    }
  }, [searchParams]);

  // Find currently selected category object to show valid configurations
  const currentCategoryObj = EQUIPMENT_CATEGORIES.find(
    (c) => c.name.toLowerCase() === formData.category.toLowerCase()
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full contact name is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Business email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid business email address';
    }
    if (!formData.category) newErrors.category = 'Please select a railcar category';
    if (!formData.message.trim()) newErrors.message = 'Please provide details or operational notes';

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
      type: 'quote' as const,
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
      category: 'Boxcars',
      configuration: '',
      quantity: '',
      commodity: '',
      timing: '',
      message: '',
    });
    setErrors({});
    setCopied(false);
  };

  const copyRefId = () => {
    if (submitResult?.referenceId) {
      navigator.clipboard.writeText(submitResult.referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="quote-page">
      {/* Page Header */}
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
            <span className="eyebrow eyebrow-dark">
              Equipment Sourcing &bull; Quote Request
            </span>
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
              Request a Railcar Lease Quote
            </h1>
            <p style={{ fontSize: '1.18rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '2rem' }}>
              Submit your equipment specifications, intended lading, volume requirements, and timeline. Our commercial leasing specialists will review current market sourcing options and prepare a tailored proposal.
            </p>

            {/* Direct Consultation Notice */}
            <div
              style={{
                backgroundColor: '#141413',
                border: '1px solid #2B2B28',
                borderLeft: '4px solid #AA2E1F',
                padding: '1rem 1.35rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                fontSize: '0.88rem',
                color: '#A8A29E',
                lineHeight: 1.6,
              }}
            >
              <Info size={18} style={{ color: '#AA2E1F', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#F8FAFC' }}>Direct Review:</strong> All inquiries receive personalized analysis from CRC leasing professionals to ensure accurate car matching, facility clearance verification, and competitive lease terms.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="section section-subtle">
        <div className="container" style={{ maxWidth: '960px' }}>
          {submitResult?.success ? (
            /* Submission Success Screen */
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
                Leasing Inquiry Submitted Successfully
              </h2>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.65, maxWidth: '640px', margin: '0 auto 2rem' }}>
                {submitResult.message}
              </p>

              {/* Reference ID and Summary Box */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  maxWidth: '580px',
                  margin: '0 auto 2.5rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748B' }}>Inquiry Reference ID:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.98rem', color: '#AA2E1F' }}>
                      {submitResult.referenceId || 'CRC-INQ-SUBMITTED'}
                    </span>
                    <button
                      type="button"
                      onClick={copyRefId}
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
                      title="Copy Reference ID"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748B' }}>Contact Name:</span>
                  <strong style={{ color: '#0A0A09' }}>{formData.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748B' }}>Company:</span>
                  <strong style={{ color: '#0A0A09' }}>{formData.company}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748B' }}>Equipment Category:</span>
                  <strong style={{ color: '#0A0A09' }}>{formData.category}</strong>
                </div>
                {formData.configuration && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.92rem' }}>
                    <span style={{ color: '#64748B' }}>Target Configuration:</span>
                    <strong style={{ color: '#0A0A09' }}>{formData.configuration}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#059669', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #E2E8F0' }}>
                  <span>Status:</span>
                  <span style={{ fontWeight: 600 }}>Active in Local Inquiry Queue</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-secondary"
                >
                  <RefreshCw size={16} />
                  Submit Another Inquiry
                </button>
                <Link to="/railcar-leasing" className="btn btn-primary">
                  Return to Equipment Catalog
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            /* Inquiry Form Card */
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <div>{submitResult.message}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Section 1: Contact Details */}
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
                    1. Contact Information
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.35rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="quote-name">
                        Full Name <span className="required-star">*</span>
                      </label>
                      <input
                        id="quote-name"
                        type="text"
                        className={`form-control ${errors.name ? 'error' : ''}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Henderson"
                      />
                      {errors.name && <div className="form-error">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="quote-company">
                        Company Name <span className="required-star">*</span>
                      </label>
                      <input
                        id="quote-company"
                        type="text"
                        className={`form-control ${errors.company ? 'error' : ''}`}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Midwest Freight Logistics LLC"
                      />
                      {errors.company && <div className="form-error">{errors.company}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="quote-email">
                        Business Email <span className="required-star">*</span>
                      </label>
                      <input
                        id="quote-email"
                        type="email"
                        className={`form-control ${errors.email ? 'error' : ''}`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jhenderson@midwestfreight.com"
                      />
                      {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="quote-phone">
                        Phone Number (Optional)
                      </label>
                      <input
                        id="quote-phone"
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 234-5678"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Equipment Requirements */}
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
                    2. Railcar Specifications &amp; Allocation
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.35rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="quote-category">
                        Primary Equipment Category <span className="required-star">*</span>
                      </label>
                      <select
                        id="quote-category"
                        className={`form-control ${errors.category ? 'error' : ''}`}
                        value={formData.category}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          const foundCat = EQUIPMENT_CATEGORIES.find((c) => c.name === newCat);
                          setFormData({
                            ...formData,
                            category: newCat,
                            configuration: foundCat?.configurations[0]?.name || '',
                          });
                        }}
                      >
                        {EQUIPMENT_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && <div className="form-error">{errors.category}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="quote-config">
                        Desired Size / Configuration
                      </label>
                      <select
                        id="quote-config"
                        className="form-control"
                        value={formData.configuration}
                        onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                      >
                        <option value="">-- General / Flexible Configuration --</option>
                        {currentCategoryObj?.configurations.map((cfg) => (
                          <option key={cfg.name} value={cfg.name}>
                            {cfg.name}
                          </option>
                        ))}
                      </select>
                      <div className="form-help">
                        Configurations sourced from client-approved specifications.
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="quote-quantity">
                        Estimated Number of Cars
                      </label>
                      <input
                        id="quote-quantity"
                        type="text"
                        className="form-control"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="e.g. 10 cars, 25-car unit set"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="quote-timing">
                        Desired Delivery / Lease Timing
                      </label>
                      <input
                        id="quote-timing"
                        type="text"
                        className="form-control"
                        value={formData.timing}
                        onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                        placeholder="e.g. Immediate, Q1 2027, Seasonal"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="form-label" htmlFor="quote-commodity">
                      Intended Commodity / Industry Application
                    </label>
                    <input
                      id="quote-commodity"
                      type="text"
                      className="form-control"
                      value={formData.commodity}
                      onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                      placeholder="e.g. Corn &amp; Grain Byproducts, Portland Cement, Coil Steel, Lumber"
                    />
                  </div>

                  {currentCategoryObj && (
                    <div
                      style={{
                        marginTop: '1.5rem',
                        padding: '1.25rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div
                        style={{
                          width: '140px',
                          height: '95px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#0A0A09',
                        }}
                      >
                        <img
                          src={currentCategoryObj.image}
                          alt={currentCategoryObj.imageAlt}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span className="badge badge-red" style={{ fontSize: '0.7rem' }}>
                            {currentCategoryObj.eyebrow}
                          </span>
                          <strong style={{ fontSize: '1.02rem', color: '#0A0A09' }}>
                            {currentCategoryObj.name}
                          </strong>
                        </div>
                        <p style={{ margin: '0 0 0.45rem 0', fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5 }}>
                          {currentCategoryObj.shortDescription}
                        </p>
                        <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                          <strong style={{ color: '#0A0A09' }}>Typical Cargo:</strong>{' '}
                          {currentCategoryObj.typicalCommodities.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 3: Operational Requirements & Notes */}
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
                    3. Route, Siding &amp; Lease Specifics
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="quote-message">
                      Operational Requirements &amp; Notes <span className="required-star">*</span>
                    </label>
                    <textarea
                      id="quote-message"
                      rows={4}
                      className={`form-control ${errors.message ? 'error' : ''}`}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please outline origin and destination railroads or sidings, preferred lease type (Full-Service vs. Net Lease), expected turnaround cycles, or any specific mechanical parameters."
                    />
                    {errors.message && <div className="form-error">{errors.message}</div>}
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
                    Inquiries are reviewed by our equipment leasing team within one business day.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Submitting Inquiry...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Leasing Inquiry
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

import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Mail,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import {
  IconPhone,
} from '@tabler/icons-react';
import { submitInquiry } from '../services/api';
import { useCms } from '../context/CmsContext';

const PARTNERSHIP_AREA_OPTIONS = [
  { id: 'Business Development & Shipper Acquisition', label: 'Shipper Acquisition', category: 'Carload Growth' },
  { id: 'Industrial Site & Siding Development', label: 'Site & Siding Planning', category: 'Industrial Spurs' },
  { id: 'Railcar & Equipment Sourcing', label: 'Equipment Sourcing', category: 'Private Rolling Stock' },
  { id: 'Transloading & Multimodal Solutions', label: 'Transloading Solutions', category: 'Highway Diversion' },
  { id: 'Customer Relations & Project Coordination', label: 'Customer Coordination', category: 'Operational Liaison' },
  { id: 'General Commercial Partnership', label: 'General Commercial', category: 'Network Expansion' },
];

export const RailroadPartnerships: React.FC = () => {
  const { cms } = useCms();
  // Dedicated Railroad Partnership Inquiry Form state
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    railroadName: '',
    contactName: '',
    position: '',
    email: '',
    phone: '',
    territory: '',
    areasOfInterest: [] as string[],
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const toggleAreaOfInterest = (areaId: string) => {
    setFormData((prev) => {
      const exists = prev.areasOfInterest.includes(areaId);
      return {
        ...prev,
        areasOfInterest: exists
          ? prev.areasOfInterest.filter((a) => a !== areaId)
          : [...prev.areasOfInterest, areaId],
      };
    });
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.railroadName.trim()) errs.railroadName = 'Railroad or company name is required';
    if (!formData.contactName.trim()) errs.contactName = 'Contact name is required';
    if (!formData.position.trim()) errs.position = 'Title or position is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.railroadName.trim()) errs.railroadName = 'Railroad or company name is required';
    if (!formData.contactName.trim()) errs.contactName = 'Contact name is required';
    if (!formData.position.trim()) errs.position = 'Title or position is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.description.trim()) errs.description = 'Please provide a brief description of the opportunity';
    setErrors(errs);
    if (errs.railroadName || errs.contactName || errs.position || errs.email) {
      setFormStep(1);
      return false;
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const notes = [
        `[Railroad Partnership Inquiry]`,
        `• Railroad: ${formData.railroadName}`,
        `• Contact: ${formData.contactName} (${formData.position})`,
        `• Territory / Service Area: ${formData.territory || 'Not specified'}`,
        `• Primary Areas of Interest: ${formData.areasOfInterest.length ? formData.areasOfInterest.join(', ') : 'General'}`,
        `• Opportunity Description:`,
        formData.description,
      ].join('\n');

      const res = await submitInquiry({
        name: formData.contactName,
        company: formData.railroadName,
        email: formData.email,
        phone: formData.phone || '919-670-7979',
        category: 'Railroad Partnership Inquiry',
        message: notes,
      });

      if (res.success) {
        setSubmittedRef(res.referenceId || res.referenceNumber || 'CRC-RR-PARTNER');
      }
    } catch (err) {
      console.error('Partnership inquiry submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="railroad-partnerships-page">
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '4.75rem 0 3.75rem',
          overflow: 'hidden',
          borderBottom: '3px solid #AA2E1F',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <img
            src={cms.railroadPartnerships?.hero?.bgImage || '/images/hero/DSC_0004.jpg'}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 38%',
              opacity: 0.26,
            }}
          />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
           
            <h1
              style={{
                fontSize: 'clamp(2.3rem, 4.6vw, 3.5rem)',
                color: '#FFFFFF',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: '1.25rem',
              }}
            >
              {cms.railroadPartnerships?.hero?.headline || 'Connecting Railroads With New Business Opportunities'}
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: 1.7, maxWidth: '720px' }}>
              {cms.railroadPartnerships?.hero?.subheadline || 'Coast Road Capital works to bridge the gap between freight railroads and the businesses they serve — serving as an external commercial development and customer relations resource.'}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CORE PARTNERSHIP VALUE PROPOSITION
          ========================================================================= */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="eyebrow">Commercial Expansion</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '1.25rem', lineHeight: 1.25 }}>
                An External Business Development Resource for Freight Carriers
              </h2>
              <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '1.2rem' }}>
                We recognize that many short-line and regional railroads have the infrastructure and capacity to support additional customers, but identifying those opportunities, developing relationships, and guiding prospective shippers through the process can require significant time and resources.
              </p>
              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                Our goal is to serve as an external business development and customer relations resource for railroad partners, helping identify potential shippers, evaluate new freight opportunities, and develop practical transportation solutions.
              </p>

              <div
                style={{
                  backgroundColor: '#FAF9F7',
                  border: '1px solid #EADBCC',
                  borderRadius: '6px',
                  padding: '1.15rem 1.35rem',
                }}
              >
                <strong style={{ display: 'block', fontSize: '0.94rem', color: '#0A0A09', marginBottom: '0.35rem' }}>
                  Complimentary Commercial Capability
                </strong>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                  We do not replace your sales team — we generate qualified leads, educate prospective shippers on rail operations, and bring ready-to-execute traffic opportunities to your line.
                </p>
              </div>
            </div>

            <div>
              <div
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 6px 20px -3px rgba(15, 23, 42, 0.08)',
                }}
              >
                <img
                  src="/images/Trains serving industries-additional railcar images/DSC09750(1).jpg"
                  alt="Industrial switching operations connecting mainline freight"
                  width={600}
                  height={380}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6 SUPPORT PILLARS - PINTEREST / MASONRY LAYOUT
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Capabilities</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.85rem' }}>
              How We Can Support Your Railroad
            </h2>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, margin: 0 }}>
              End-to-end commercial facilitation designed to convert industrial prospects into active rail shippers along your network.
            </p>
          </div>

          <div className="mobile-bento-swipe-hint">
            <span>Swipe to explore capabilities</span>
            <ArrowRight size={13} />
          </div>

          <div className="bento-grid">
            {(cms.railroadPartnerships?.bentoCards && cms.railroadPartnerships.bentoCards.length > 0
              ? cms.railroadPartnerships.bentoCards
              : [
                  {
                    id: 'bento-1',
                    number: '01',
                    label: 'Outreach & Acquisition',
                    title: 'Business Development & Shipper Acquisition',
                    desc: 'Identify prospective rail customers, industrial properties, and businesses with freight volumes suitable for rail transportation. We lead initial outreach, educate prospective shippers, and develop qualified leads that generate incremental carload traffic for your line.',
                  },
                  {
                    id: 'bento-2',
                    number: '02',
                    label: 'Shipper Liaison',
                    title: 'Customer Relations & Coordination',
                    desc: 'Serve as a dedicated external liaison for businesses exploring rail service, gathering shipping requirements and bridging communication with your railroad operating teams.',
                  },
                  {
                    id: 'bento-3',
                    number: '03',
                    label: 'Site Planning',
                    title: 'Industrial Site Development',
                    desc: 'Identify rail-served industrial real estate, evaluate inactive spurs for conversion, and explore track-side property development to unlock new carload originations.',
                  },
                  {
                    id: 'bento-4',
                    number: '04',
                    label: 'Rolling Stock',
                    title: 'Railcar & Equipment Sourcing',
                    desc: 'Source and structure private equipment solutions for emerging shippers — covering hoppers, boxcars, gondolas, and tank cars — with zero capital expenditure required from your railroad.',
                  },
                  {
                    id: 'bento-5',
                    number: '05',
                    label: 'Intermodal & Drayage',
                    title: 'Transloading & First/Last-Mile Solutions',
                    desc: 'Connect off-line industrial shippers directly to your rail network by establishing transload partnerships, utilizing regional team tracks, and coordinating first/last-mile truck delivery programs to capture highway freight.',
                  },
                  {
                    id: 'bento-6',
                    number: '06',
                    label: 'Execution',
                    title: 'Project Coordination',
                    desc: 'Facilitate the complete onboarding journey from initial siding reconnaissance and track alignment review to railroad engineering coordination and switch submission.',
                  },
                ]
            ).map((card, idx) => {
              const spans = ['bento-span-6', 'bento-span-3', 'bento-span-3', 'bento-span-3', 'bento-span-6', 'bento-span-3'];
              const spanClass = spans[idx % spans.length];
              const cardNum = card.number || `0${idx + 1}`;
              const cardLabel = card.label || card.badge || 'Capability';
              return (
                <div key={card.id || idx} className={`bento-card ${spanClass}`}>
                  <div className="bento-card-top">
                    <span className="bento-number">{cardNum}</span>
                    <span className="bento-label">{cardLabel}</span>
                  </div>
                  <h3 className="bento-title">{card.title}</h3>
                  <p className="bento-desc">{card.desc}</p>
                  <a href="#partnership-form" className="bento-link">
                    <span>Inquire about this capability</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          A COLLABORATIVE APPROACH
          ========================================================================= */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Philosophy</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '1.25rem' }}>
              A Collaborative Approach
            </h2>
            <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.35rem' }}>
              We do not intend to replace a railroad&apos;s existing sales, marketing, or operating departments. Instead, Coast Road Capital aims to complement those efforts by providing additional resources, identifying opportunities, and helping prospective customers navigate the process of establishing rail service.
            </p>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.8, margin: 0 }}>
              Our objective is to develop relationships that benefit both the railroad and its customers, creating sustainable freight opportunities while making rail transportation easier for businesses to understand and utilize.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DEDICATED RAILROAD PARTNERSHIP INQUIRY FORM
          ========================================================================= */}
      <section id="partnership-form" className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="eyebrow" style={{ justifyContent: 'center' }}>Direct Carrier Channel</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
                {cms.railroadPartnerships?.partnerCarrier?.title || 'Partner With Coast Road Capital'}
              </h2>
              <p className="partnership-header-desc" style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.65, maxWidth: '680px', margin: '0 auto' }}>
                {cms.railroadPartnerships?.partnerCarrier?.desc || 'Whether your railroad is looking to develop new freight business, reconnect with potential customers, or explore industrial development opportunities along your network, we welcome the opportunity to discuss how Coast Road Capital can support your commercial development efforts.'}
              </p>
            </div>

            {submittedRef ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #BBF7D0',
                  borderRadius: '16px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0A0A09', marginBottom: '0.5rem' }}>
                  Partnership Inquiry Received
                </h3>
                <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.6, maxWidth: '540px', margin: '0 auto 1.5rem' }}>
                  Thank you for reaching out. A Coast Road Capital principal will review your railroad&apos;s territory and service capabilities and contact you within one business day.
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '0.65rem 1.25rem',
                    marginBottom: '2rem',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block' }}>Partnership Reference Code</span>
                  <strong style={{ fontSize: '1.05rem', color: '#0A0A09', fontFamily: 'monospace' }}>
                    {submittedRef}
                  </strong>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setFormStep(1);
                      setFormData({
                        railroadName: '',
                        contactName: '',
                        position: '',
                        email: '',
                        phone: '',
                        territory: '',
                        areasOfInterest: [],
                        description: '',
                      });
                    }}
                    className="btn btn-secondary"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="partnership-form-card"
              >
                {/* Stepper Navigation */}
                <div className="partnership-step-indicator">
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className={`step-btn ${formStep === 1 ? 'step-active' : 'step-complete'}`}
                  >
                    <span className="step-num">{formStep === 2 ? <Check size={13} strokeWidth={3} /> : '1'}</span>
                    <span className="step-text">Carrier &amp; Contact</span>
                  </button>
                  <div className="step-divider" />
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setFormStep(2);
                    }}
                    className={`step-btn ${formStep === 2 ? 'step-active' : ''}`}
                  >
                    <span className="step-num">2</span>
                    <span className="step-text">Commercial Scope</span>
                  </button>
                </div>

                {formStep === 1 && (
                  <div className="form-step-pane">
                    <div className="form-grid-row">
                      {/* Railroad Name */}
                      <div>
                        <label className="form-field-label">
                          Railroad or Company Name *
                        </label>
                        <input
                          type="text"
                          value={formData.railroadName}
                          onChange={(e) => setFormData({ ...formData, railroadName: e.target.value })}
                          placeholder="e.g. Piedmont &amp; Northern Railway"
                          className={`form-field-input ${errors.railroadName ? 'input-error' : ''}`}
                        />
                        {errors.railroadName && <span className="field-error-msg">{errors.railroadName}</span>}
                      </div>

                      {/* Railroad Territory / Service Area */}
                      <div>
                        <label className="form-field-label">
                          Territory or Service Area
                        </label>
                        <input
                          type="text"
                          value={formData.territory}
                          onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                          placeholder="e.g. Carolinas, interchange with CSX / NS"
                          className="form-field-input"
                        />
                      </div>
                    </div>

                    <div className="form-grid-row mobile-two-col">
                      {/* Contact Name */}
                      <div>
                        <label className="form-field-label">
                          Contact Name *
                        </label>
                        <input
                          type="text"
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          placeholder="Full Name"
                          className={`form-field-input ${errors.contactName ? 'input-error' : ''}`}
                        />
                        {errors.contactName && <span className="field-error-msg">{errors.contactName}</span>}
                      </div>

                      {/* Position / Title */}
                      <div>
                        <label className="form-field-label">
                          Title / Position *
                        </label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          placeholder="e.g. VP Commercial"
                          className={`form-field-input ${errors.position ? 'input-error' : ''}`}
                        />
                        {errors.position && <span className="field-error-msg">{errors.position}</span>}
                      </div>
                    </div>

                    <div className="form-grid-row mobile-two-col" style={{ marginBottom: '1.5rem' }}>
                      {/* Email */}
                      <div>
                        <label className="form-field-label">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@railroad.com"
                          className={`form-field-input ${errors.email ? 'input-error' : ''}`}
                        />
                        {errors.email && <span className="field-error-msg">{errors.email}</span>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="form-field-label">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. (919) 670-7979"
                          className="form-field-input"
                        />
                      </div>
                    </div>

                    {/* Step 1 Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) setFormStep(2);
                      }}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.5rem', fontSize: '0.96rem' }}
                    >
                      <span>Continue to Commercial Scope</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="form-step-pane">
                    {/* Primary Areas of Interest */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
                        <label className="form-field-label" style={{ margin: 0 }}>
                          Areas of Interest
                        </label>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Select all that apply</span>
                      </div>
                      <div className="interest-cards-grid">
                        {PARTNERSHIP_AREA_OPTIONS.map((area) => {
                          const isSelected = formData.areasOfInterest.includes(area.id);
                          return (
                            <button
                              key={area.id}
                              type="button"
                              onClick={() => toggleAreaOfInterest(area.id)}
                              className={`interest-card-item ${isSelected ? 'active' : ''}`}
                            >
                              <div className="interest-check-box">
                                {isSelected ? <Check size={12} strokeWidth={3} /> : null}
                              </div>
                              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                <div className="interest-card-title">{area.label}</div>
                                <div className="interest-card-sub">{area.category}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Brief description of opportunity */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label className="form-field-label">
                        Opportunity Details or Assistance Requested *
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide details on available siding trackage, prospective industrial tenants, commodity volumes, or customer acquisition support needed..."
                        className={`form-field-input ${errors.description ? 'input-error' : ''}`}
                      />
                      {errors.description && <span className="field-error-msg">{errors.description}</span>}
                    </div>

                    {/* Submit Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.5rem', fontSize: '0.96rem' }}
                      >
                        <Send size={16} />
                        <span>{isSubmitting ? 'Transmitting Inquiry...' : 'Submit Partnership Inquiry to CRC'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="btn-back-step"
                      >
                        <ArrowLeft size={14} />
                        <span>Back to Carrier &amp; Contact Info</span>
                      </button>
                    </div>

                    <p style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center', margin: '0.85rem 0 0', lineHeight: 1.4 }}>
                      All railroad operating parameters, customer inquiries, and commercial communications are held in strict commercial confidence.
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLOSING CTA & DIRECT CONTACT
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '4rem 0',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ color: '#FFFFFF', marginBottom: '0.85rem', fontSize: 'clamp(1.75rem, 3.2vw, 2.3rem)' }}>
              Direct Rail Carrier Line
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Prefer to speak directly with our commercial desk? Reach out to our team in Tampa, Florida.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <a href="tel:+19196707979" className="btn btn-primary">
                <IconPhone size={17} stroke={1.8} />
                Call 919-670-7979
              </a>
              <a href="mailto:leasing@coastroadcapital.com" className="btn btn-outline-white">
                <Mail size={17} />
                leasing@coastroadcapital.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Minimal Bento Grid layout matching wireframe */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
        }

        .bento-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
        }

        .bento-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.08);
          border-color: #CBD5E1;
        }

        .bento-span-6 {
          grid-column: span 6;
        }

        .bento-span-3 {
          grid-column: span 3;
        }

        @media (max-width: 980px) and (min-width: 769px) {
          .bento-span-6 {
            grid-column: span 12;
          }
          .bento-span-3 {
            grid-column: span 6;
          }
        }

        /* Mobile Horizontal Sliding Carousel */
        @media (max-width: 768px) {
          .bento-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 1.15rem;
            padding: 0.5rem 1rem 1.75rem 1rem;
            margin-left: -1rem;
            margin-right: -1rem;
            scrollbar-width: none;
          }

          .bento-grid::-webkit-scrollbar {
            display: none;
          }

          .bento-card {
            flex: 0 0 82%;
            max-width: 325px;
            min-width: 275px;
            scroll-snap-align: center;
            padding: 1.75rem 1.45rem;
            border-radius: 18px;
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
          }

          .bento-span-6,
          .bento-span-3 {
            grid-column: unset;
          }
        }

        .mobile-bento-swipe-hint {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-bento-swipe-hint {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            font-size: 0.74rem;
            font-weight: 600;
            color: #94A3B8;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 1.25rem;
          }
        }

        .bento-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .bento-number {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 800;
          color: #AA2E1F;
          letter-spacing: 0.05em;
        }

        .bento-label {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #64748B;
        }

        .bento-title {
          font-family: var(--font-heading);
          font-size: 1.22rem;
          font-weight: 700;
          color: #0A0A09;
          line-height: 1.35;
          margin: 0 0 0.85rem 0;
          letter-spacing: -0.01em;
        }

        .bento-desc {
          color: #475569;
          font-size: 0.92rem;
          line-height: 1.65;
          margin: 0 0 1.5rem 0;
          flex-grow: 1;
        }

        .bento-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #AA2E1F;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: gap 140ms ease, color 140ms ease;
          margin-top: auto;
        }

        .bento-link:hover {
          gap: 0.55rem;
          color: #8C2417;
        }

        .form-field-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.45rem;
        }

        .form-field-input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid #CBD5E1;
          border-radius: 4px;
          font-size: 0.90rem;
          color: #0A0A09;
          background-color: #FFFFFF;
          outline: none;
          box-sizing: border-box;
          transition: border-color 150ms ease;
        }

        .form-field-input:focus {
          border-color: #AA2E1F;
        }

        .form-field-input.input-error {
          border-color: #DC2626;
          background-color: #FEF2F2;
        }

        .field-error-msg {
          display: block;
          font-size: 0.74rem;
          color: #DC2626;
          margin-top: 0.3rem;
          font-weight: 500;
        }

        .partnership-form-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 2.25rem 2.5rem;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06);
        }

        .partnership-step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .step-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          transition: all 150ms ease;
        }

        .step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          background-color: #F1F5F9;
          color: #64748B;
          transition: all 150ms ease;
        }

        .step-text {
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748B;
          letter-spacing: -0.01em;
        }

        .step-btn.step-active .step-num {
          background-color: #AA2E1F;
          color: #FFFFFF;
        }

        .step-btn.step-active .step-text {
          color: #0A0A09;
        }

        .step-btn.step-complete .step-num {
          background-color: #ECFDF5;
          color: #059669;
        }

        .step-btn.step-complete .step-text {
          color: #334155;
        }

        .step-divider {
          width: 32px;
          height: 1px;
          background-color: #CBD5E1;
        }

        .form-grid-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.15rem;
          margin-bottom: 1.15rem;
        }

        .btn-back-step {
          background: none;
          border: none;
          color: #64748B;
          font-size: 0.82rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          cursor: pointer;
          padding: 0.4rem 0.6rem;
          border-radius: 4px;
          transition: color 150ms ease;
        }

        .btn-back-step:hover {
          color: #0A0A09;
        }

        .interest-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.65rem;
        }

        .interest-card-item {
          background-color: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          cursor: pointer;
          transition: all 150ms ease;
          text-align: left;
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          box-sizing: border-box;
        }

        .interest-card-item:hover {
          background-color: #FFFFFF;
          border-color: #94A3B8;
        }

        .interest-card-item.active {
          background-color: #FFF8F8;
          border-color: #AA2E1F;
        }

        .interest-check-box {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1.5px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          color: transparent;
          transition: all 150ms ease;
        }

        .interest-card-item.active .interest-check-box {
          background-color: #AA2E1F;
          border-color: #AA2E1F;
          color: #FFFFFF;
        }

        .interest-card-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #1E293B;
          line-height: 1.3;
          margin-bottom: 0.15rem;
        }

        .interest-card-sub {
          font-size: 0.70rem;
          color: #64748B;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          #partnership-form {
            padding: 2.75rem 0 !important;
          }

          .partnership-header-desc {
            font-size: 0.90rem !important;
            line-height: 1.55 !important;
          }

          .partnership-form-card {
            padding: 1.35rem 1.05rem !important;
            border-radius: 16px !important;
          }

          .partnership-step-indicator {
            gap: 0.4rem !important;
            margin-bottom: 1.25rem !important;
            padding-bottom: 0.85rem !important;
          }

          .form-grid-row {
            grid-template-columns: 1fr !important;
            gap: 0.85rem !important;
            margin-bottom: 0.85rem !important;
          }

          .form-grid-row.mobile-two-col {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.65rem !important;
          }

          .interest-cards-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.45rem !important;
          }

          .interest-card-item {
            padding: 0.55rem 0.55rem !important;
          }

          .interest-card-title {
            font-size: 0.74rem !important;
          }

          .interest-card-sub {
            font-size: 0.65rem !important;
          }

          .step-btn {
            padding: 0.25rem 0.35rem !important;
          }

          .step-text {
            font-size: 0.76rem !important;
          }

          .step-divider {
            width: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

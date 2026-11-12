import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import {
  IconTrain,
  IconRoute,
  IconBuildingWarehouse,
  IconTruck,
  IconUsers,
  IconBriefcase,
  IconPhone,
} from '@tabler/icons-react';
import { submitInquiry } from '../services/api';

const PARTNERSHIP_AREAS = [
  'Business Development & Shipper Acquisition',
  'Industrial Site & Siding Development',
  'Railcar & Equipment Sourcing',
  'Transloading & Multimodal Solutions',
  'Customer Relations & Project Coordination',
  'General Commercial Partnership',
];

export const RailroadPartnerships: React.FC = () => {
  // Dedicated Railroad Partnership Inquiry Form state
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

  const toggleAreaOfInterest = (area: string) => {
    setFormData((prev) => {
      const exists = prev.areasOfInterest.includes(area);
      return {
        ...prev,
        areasOfInterest: exists
          ? prev.areasOfInterest.filter((a) => a !== area)
          : [...prev.areasOfInterest, area],
      };
    });
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
          <picture>
            <source srcSet="/images/hero/DSC_0004.webp" type="image/webp" />
            <img
              src="/images/hero/DSC_0004.jpg"
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
          </picture>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            <span className="eyebrow eyebrow-dark">
              Short-Line &bull; Regional &bull; Terminal &bull; Class I Railroads
            </span>
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
              Connecting Railroads With New Business Opportunities
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: 1.7, maxWidth: '720px' }}>
              Coast Road Capital works to bridge the gap between freight railroads and the businesses they serve — serving as an external commercial development and customer relations resource.
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
          6 SUPPORT PILLARS
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Capabilities</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.85rem' }}>
              How We Can Support Your Railroad
            </h2>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7 }}>
              End-to-end commercial facilitation designed to convert industrial prospects into active rail shippers along your network.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* 1. Business Development & Customer Acquisition */}
            <div className="partner-card">
              <div className="partner-icon-wrap">
                <IconBriefcase size={28} stroke={1.6} />
              </div>
              <h3 className="partner-card-title">
                Business Development &amp; Customer Acquisition
              </h3>
              <p className="partner-card-desc">
                Identify prospective rail customers, industrial properties, and businesses with freight volumes that may benefit from rail transportation. Assist with initial outreach, customer education, and developing opportunities into qualified leads.
              </p>
            </div>

            {/* 2. Customer Relations & Coordination */}
            <div className="partner-card">
              <div className="partner-icon-wrap">
                <IconUsers size={28} stroke={1.6} />
              </div>
              <h3 className="partner-card-title">
                Customer Relations &amp; Coordination
              </h3>
              <p className="partner-card-desc">
                Serve as an additional point of contact for prospective customers exploring rail service. Help explain the process, gather shipping requirements, and coordinate discussions between businesses and railroad representatives.
              </p>
            </div>

            {/* 3. Industrial Site Development */}
            <div className="partner-card">
              <div className="partner-icon-wrap">
                <IconBuildingWarehouse size={28} stroke={1.6} />
              </div>
              <h3 className="partner-card-title">
                Industrial Site Development
              </h3>
              <p className="partner-card-desc">
                Identify potential rail-served industrial developments, existing facilities suitable for rail conversion, and opportunities for new sidings or transloading operations along active line segments.
              </p>
            </div>

            {/* 4. Railcar & Equipment Sourcing */}
            <div className="partner-card">
              <div className="partner-icon-wrap">
                <IconTrain size={28} stroke={1.6} />
              </div>
              <h3 className="partner-card-title">
                Railcar &amp; Equipment Sourcing
              </h3>
              <p className="partner-card-desc">
                Assist prospective customers in identifying railcar types and equipment requirements, and explore sourcing opportunities that may support new freight business without capital strain on the carrier.
              </p>
            </div>

            {/* 5. Transloading & First/Last-Mile Solutions */}
            <div className="partner-card">
              <div className="partner-icon-wrap">
                <IconTruck size={28} stroke={1.6} />
              </div>
              <h3 className="partner-card-title">
                Transloading &amp; First/Last-Mile Solutions
              </h3>
              <p className="partner-card-desc">
                Help develop transportation arrangements that combine the advantages of rail with the flexibility of trucking, including transload facilities, team tracks, and local delivery partnerships.
              </p>
            </div>

            {/* 6. Project Coordination */}
            <div className="partner-card">
              <div className="partner-icon-wrap">
                <IconRoute size={28} stroke={1.6} />
              </div>
              <h3 className="partner-card-title">
                Project Coordination
              </h3>
              <p className="partner-card-desc">
                Support the early planning process for new rail-served customers by organizing site information, preliminary concepts, equipment needs, and communication among all parties involved.
              </p>
            </div>
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
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="eyebrow" style={{ justifyContent: 'center' }}>Direct Carrier Channel</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '0.85rem' }}>
                Partner With Coast Road Capital
              </h2>
              <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.65 }}>
                Whether your railroad is looking to develop new freight business, reconnect with potential customers, or explore industrial development opportunities along your network, we welcome the opportunity to discuss how Coast Road Capital can support your commercial development efforts.
              </p>
            </div>

            {submittedRef ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #BBF7D0',
                  borderRadius: '8px',
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
                    borderRadius: '4px',
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
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '2.5rem',
                  boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="form-two-col">
                  {/* Railroad Name */}
                  <div>
                    <label className="form-field-label">
                      Railroad or Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.railroadName}
                      onChange={(e) => setFormData({ ...formData, railroadName: e.target.value })}
                      placeholder="e.g. Piedmont & Northern Railway"
                      className={`form-field-input ${errors.railroadName ? 'input-error' : ''}`}
                    />
                    {errors.railroadName && <span className="field-error-msg">{errors.railroadName}</span>}
                  </div>

                  {/* Railroad Territory / Service Area */}
                  <div>
                    <label className="form-field-label">
                      Railroad Territory or Service Area
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="form-two-col">
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
                      Position or Title *
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g. VP Commercial Development, Trainmaster"
                      className={`form-field-input ${errors.position ? 'input-error' : ''}`}
                    />
                    {errors.position && <span className="field-error-msg">{errors.position}</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }} className="form-two-col">
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
                      Direct Phone Number
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

                {/* Primary Areas of Interest */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="form-field-label" style={{ marginBottom: '0.65rem' }}>
                    Primary Areas of Interest (Select All That Apply)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {PARTNERSHIP_AREAS.map((area) => {
                      const isSelected = formData.areasOfInterest.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => toggleAreaOfInterest(area)}
                          className={`area-interest-pill ${isSelected ? 'active' : ''}`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brief description of opportunity */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <label className="form-field-label">
                    Brief Description of the Opportunity or Assistance Requested *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide details on available siding trackage, prospective industrial tenants, commodity volumes, or customer acquisition support needed..."
                    className={`form-field-input ${errors.description ? 'input-error' : ''}`}
                  />
                  {errors.description && <span className="field-error-msg">{errors.description}</span>}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.5rem', fontSize: '0.96rem' }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Transmitting Inquiry...' : 'Submit Partnership Inquiry to CRC'}</span>
                </button>

                <p style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center', margin: '0.85rem 0 0', lineHeight: 1.4 }}>
                  All railroad operating parameters, customer inquiries, and commercial communications are held in strict commercial confidence.
                </p>
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
        .partner-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 1.85rem 1.65rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }

        .partner-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.08);
          border-color: #CBD5E1;
        }

        .partner-icon-wrap {
          color: #AA2E1F;
          margin-bottom: 1.15rem;
          display: flex;
          align-items: center;
        }

        .partner-card-title {
          font-family: var(--font-heading);
          font-size: 1.18rem;
          font-weight: 700;
          color: #0A0A09;
          margin: 0 0 0.65rem 0;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .partner-card-desc {
          color: #475569;
          font-size: 0.90rem;
          line-height: 1.65;
          margin: 0;
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

        .area-interest-pill {
          background-color: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 4px;
          padding: 0.32rem 0.65rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 140ms ease;
          text-align: left;
        }

        .area-interest-pill:hover {
          background-color: #FFFFFF;
          border-color: #94A3B8;
          color: #0A0A09;
        }

        .area-interest-pill.active {
          background-color: #AA2E1F;
          border-color: #AA2E1F;
          color: #FFFFFF;
        }

        @media (max-width: 640px) {
          .form-two-col {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

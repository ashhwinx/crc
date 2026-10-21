import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, X, Send, Layers } from 'lucide-react';
import { EQUIPMENT_CATEGORIES } from '../data/equipmentData';
import type { EquipmentCategory } from '../types';
import { submitInquiry } from '../services/api';

export const RailcarLeasing: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [modalCategory, setModalCategory] = useState<EquipmentCategory | null>(null);
  const [modalConfig, setModalConfig] = useState<string>('');
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState<string | null>(null);
  const [quickRefId, setQuickRefId] = useState<string | null>(null);
  const [quickError, setQuickError] = useState<string | null>(null);
  const location = useLocation();

  // Quick form state
  const [quickForm, setQuickForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    quantity: '',
    timing: '',
    message: '',
  });

  // Handle hash scrolling on page load or anchor click
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  const filteredCategories =
    activeCategory === 'all'
      ? EQUIPMENT_CATEGORIES
      : EQUIPMENT_CATEGORIES.filter((c) => c.slug === activeCategory);

  const handleOpenQuickInquiry = (cat: EquipmentCategory, configName?: string) => {
    setModalCategory(cat);
    setModalConfig(configName || (cat.configurations[0]?.name ?? ''));
    setQuickSuccess(null);
    setQuickRefId(null);
    setQuickError(null);
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCategory) return;
    setQuickSubmitting(true);
    setQuickError(null);

    const payload = {
      name: quickForm.name,
      company: quickForm.company,
      email: quickForm.email,
      phone: quickForm.phone,
      category: modalCategory.name,
      configuration: modalConfig,
      quantity: quickForm.quantity,
      timing: quickForm.timing,
      message: quickForm.message || `Quick inquiry for ${modalCategory.name} (${modalConfig})`,
      type: 'catalog-inquiry' as const,
      sourceUrl: window.location.href,
    };

    const res = await submitInquiry(payload);
    setQuickSubmitting(false);

    if (res.success) {
      setQuickSuccess(res.message);
      setQuickRefId(res.referenceId || null);
      setQuickForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        quantity: '',
        timing: '',
        message: '',
      });
    } else {
      setQuickError(res.message || 'Submission failed. Please try again.');
    }
  };

  return (
    <div className="railcar-leasing-page">
      {/* Header Banner */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '5.5rem 0 4rem',
          borderBottom: '3px solid #AA2E1F',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '860px' }}>
            <span className="badge badge-amber" style={{ marginBottom: '1.25rem' }}>
              <Layers size={14} style={{ color: '#D97706' }} />
              Equipment Catalog &bull; Phase 1 Sourcing Discovery
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
              Railcar Leasing &amp; Equipment Catalog
            </h1>
            <p style={{ fontSize: '1.18rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '2rem' }}>
              Discover typical capacities, dimensions, commodities, and loading specifications across our seven primary freight equipment classes. Use this catalog to explore sourcing possibilities and submit a leasing inquiry.
            </p>

            {/* Factual Disclaimer Banner */}
            <div
              style={{
                backgroundColor: '#141413',
                border: '1px solid #2B2B28',
                borderLeft: '4px solid #AA2E1F',
                padding: '1.1rem 1.4rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                color: '#A8A29E',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#F8FAFC' }}>SOURCING INQUIRY NOTICE:</strong> This catalog serves as an equipment discovery and leasing inquiry platform. Specifications reflect standard industry builds. Specific car availability, mechanical series, and delivery schedules are confirmed upon direct consultation with CRC.
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Navigation Bar */}
      <div
        style={{
          position: 'sticky',
          top: 'var(--header-height)',
          zIndex: 90,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.05)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <div className="container" style={{ display: 'flex', gap: '0.65rem', padding: '0.85rem 1rem' }}>
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.88rem',
              fontWeight: 600,
              padding: '0.45rem 1.15rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: activeCategory === 'all' ? '#0A0A09' : '#E2E8F0',
              backgroundColor: activeCategory === 'all' ? '#0A0A09' : '#FFFFFF',
              color: activeCategory === 'all' ? '#EDE6D4' : '#334155',
              cursor: 'pointer',
              transition: 'all 160ms ease',
            }}
          >
            All Categories (7)
          </button>

          {EQUIPMENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.slug);
                const el = document.getElementById(cat.slug);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '0.45rem 1.15rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: activeCategory === cat.slug ? '#AA2E1F' : '#E2E8F0',
                backgroundColor: activeCategory === cat.slug ? '#FDF3F2' : '#FFFFFF',
                color: activeCategory === cat.slug ? '#AA2E1F' : '#334155',
                cursor: 'pointer',
                transition: 'all 160ms ease',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Items Presentation */}
      <section className="section section-white">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
            {filteredCategories.map((cat, idx) => (
              <div
                key={cat.id}
                id={cat.slug}
                className="card"
                style={{
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-md)',
                  scrollMarginTop: '160px',
                }}
              >
                {/* Category Header Bar */}
                <div
                  style={{
                    backgroundColor: '#0A0A09',
                    color: '#FFFFFF',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    borderBottom: '3px solid #AA2E1F',
                  }}
                >
                  <div>
                    <span
                      className="scl-speed-lettering"
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        color: '#EDE6D4',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '0.35rem',
                      }}
                    >
                      CATEGORY REF 0{idx + 1} &bull; {cat.eyebrow}
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      {cat.name}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenQuickInquiry(cat)}
                      className="btn btn-primary btn-sm"
                    >
                      Quick Inquiry
                    </button>
                    <Link
                      to={`/quote?category=${encodeURIComponent(cat.name)}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Full Quote Request
                    </Link>
                  </div>
                </div>

                {/* Main Content Body */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '3rem',
                    padding: '2.5rem',
                  }}
                >
                  {/* Left Column: Image & Operational Descriptions */}
                  <div>
                    <div
                      className="card-image-wrap"
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #E2E8F0',
                        marginBottom: '1.75rem',
                        height: '290px',
                      }}
                    >
                      <img src={cat.image} alt={cat.imageAlt} />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '0.65rem 1rem',
                          fontSize: '0.78rem',
                          color: '#EDE6D4',
                          backgroundColor: 'rgba(10, 10, 9, 0.88)',
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span className="scl-speed-lettering" style={{ letterSpacing: '0.06em', fontWeight: 800 }}>REPRESENTATIVE FLEET EQUIPMENT</span>
                        <span className="scl-speed-lettering" style={{ color: '#EDE6D4', fontWeight: 800, letterSpacing: '0.06em' }}>CRC SPECIFICATIONS</span>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', color: '#0A0A09', fontWeight: 700, marginBottom: '0.65rem' }}>
                      Operational Overview
                    </h4>
                    <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                      {cat.fullDescription}
                    </p>

                    <h4 style={{ fontSize: '1.15rem', color: '#0A0A09', fontWeight: 700, marginBottom: '0.65rem' }}>
                      Typical Commodity Applications
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {cat.typicalCommodities.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.92rem', color: '#334155' }}>
                          <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        padding: '1.25rem',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.88rem',
                      }}
                    >
                      <strong style={{ color: '#0A0A09', display: 'block', marginBottom: '0.35rem' }}>
                        Loading &amp; Discharge Profile:
                      </strong>
                      <p style={{ color: '#64748B', margin: 0, lineHeight: 1.6 }}>
                        {cat.loadingProfile}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Verified Configurations & Specs */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.25rem',
                        borderBottom: '2px solid #E2E8F0',
                        paddingBottom: '0.65rem',
                      }}
                    >
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0A0A09', margin: 0 }}>
                        Verified Configurations &amp; Sizes
                      </h3>
                      <span className="badge badge-dark">
                        {cat.configurations.length} Specifications
                      </span>
                    </div>

                    <div className="spec-panel" style={{ marginBottom: '1.75rem' }}>
                      {cat.configurations.map((cfg, cfgIdx) => (
                        <div
                          key={cfgIdx}
                          style={{
                            padding: '1.1rem 1.35rem',
                            borderBottom: cfgIdx === cat.configurations.length - 1 ? 'none' : '1px solid #F1F5F9',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                            backgroundColor: cfgIdx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                            transition: 'background-color 150ms ease',
                          }}
                          className="spec-item-row"
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            <strong
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.05rem',
                                fontWeight: 700,
                                color: '#0A0A09',
                              }}
                            >
                              {cfg.name}
                            </strong>

                            <button
                              type="button"
                              onClick={() => handleOpenQuickInquiry(cat, cfg.name)}
                              className="btn btn-secondary btn-sm"
                              style={{
                                fontSize: '0.8rem',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                              }}
                            >
                              Inquire Size &rarr;
                            </button>
                          </div>
                          <span style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5 }}>
                            {cfg.note}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Notice Callout */}
                    <div
                      style={{
                        backgroundColor: 'var(--color-cream-light)',
                        borderLeft: '4px solid var(--color-red)',
                        padding: '1rem 1.25rem',
                        borderRadius: '0 8px 8px 0',
                        fontSize: '0.86rem',
                        color: 'var(--color-dark)',
                        lineHeight: 1.6,
                        marginBottom: '1.75rem',
                      }}
                    >
                      {cat.inquiryNotice}
                    </div>

                    {/* Action Bar */}
                    <div
                      style={{
                        padding: '1.35rem 1.5rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ fontSize: '0.92rem', color: '#0A0A09', fontWeight: 600 }}>
                        Need an allocation proposal for this equipment?
                      </div>
                      <Link
                        to={`/quote?category=${encodeURIComponent(cat.name)}`}
                        className="btn btn-primary btn-sm"
                      >
                        Submit {cat.name} Request
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Inquiry Modal (Refined, Modern, Decoupled) */}
      {modalCategory && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1050,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setModalCategory(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '560px',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeIn 0.3s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                backgroundColor: '#0A0A09',
                color: '#EDE6D4',
                padding: '1.35rem 1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '3px solid #AA2E1F',
              }}
            >
              <div>
                <span className="scl-speed-lettering" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EDE6D4', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.2rem' }}>
                  Equipment Leasing Sourcing
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Inquire: {modalCategory.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalCategory(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  padding: '0.4rem',
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2rem', overflowY: 'auto' }}>
              {quickSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <CheckCircle2 size={52} style={{ color: '#059669', margin: '0 auto 1.25rem' }} />
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                    Inquiry Confirmed
                  </h3>
                  {quickRefId && (
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '0.4rem 0.9rem',
                        backgroundColor: 'var(--color-cream-light)',
                        border: '1px solid var(--color-cream-border)',
                        borderRadius: '6px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0A0A09',
                        marginBottom: '1rem',
                      }}
                    >
                      Reference: {quickRefId}
                    </div>
                  )}
                  <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: 1.65, marginBottom: '2rem' }}>
                    {quickSuccess}
                  </p>
                  <button
                    type="button"
                    onClick={() => setModalCategory(null)}
                    className="btn btn-primary"
                  >
                    Done &bull; Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit}>
                  {quickError && (
                    <div
                      style={{
                        backgroundColor: '#FEF2F2',
                        borderLeft: '4px solid #EF4444',
                        padding: '0.85rem 1rem',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: '1.25rem',
                        color: '#991B1B',
                        fontSize: '0.88rem',
                      }}
                    >
                      {quickError}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">
                      Target Configuration
                    </label>
                    <select
                      className="form-control"
                      value={modalConfig}
                      onChange={(e) => setModalConfig(e.target.value)}
                    >
                      {modalCategory.configurations.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">
                        Your Name <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={quickForm.name}
                        onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Company Name <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={quickForm.company}
                        onChange={(e) => setQuickForm({ ...quickForm, company: e.target.value })}
                        placeholder="Industrial Rail Inc."
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">
                        Business Email <span className="required-star">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        value={quickForm.email}
                        onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                        placeholder="user@company.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        value={quickForm.phone}
                        onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Estimated Quantity</label>
                      <input
                        type="text"
                        className="form-control"
                        value={quickForm.quantity}
                        onChange={(e) => setQuickForm({ ...quickForm, quantity: e.target.value })}
                        placeholder="e.g. 10 - 25 cars"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Desired Timing</label>
                      <input
                        type="text"
                        className="form-control"
                        value={quickForm.timing}
                        onChange={(e) => setQuickForm({ ...quickForm, timing: e.target.value })}
                        placeholder="e.g. Q1 2027"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specific Needs / Commodity</label>
                    <textarea
                      className="form-control"
                      style={{ minHeight: '80px' }}
                      value={quickForm.message}
                      onChange={(e) => setQuickForm({ ...quickForm, message: e.target.value })}
                      placeholder="Enter lading commodity, track limits, or lease preferences..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={quickSubmitting}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    {quickSubmitting ? 'Transmitting Inquiry...' : 'Submit Equipment Inquiry'}
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .spec-item-row:hover {
          background-color: #EFF6FF !important;
        }
      `}</style>
    </div>
  );
};

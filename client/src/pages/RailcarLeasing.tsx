import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { EQUIPMENT_CATEGORIES } from '../data/equipmentData';

export const RailcarLeasing: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const location = useLocation();

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

  return (
    <div className="railcar-leasing-page">
      {/* Header Banner */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '5rem 0 3.5rem',
          borderBottom: '3px solid #AA2E1F',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '860px' }}>
            <span className="eyebrow eyebrow-dark">
              Equipment Catalog &bull; Sourcing Guide
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
              Railcar Equipment Catalog
            </h1>
            <p style={{ fontSize: '1.18rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '2rem' }}>
              Explore standard dimensions, capacities, commodity applications, and discharge profiles across our seven primary freight equipment classes.
            </p>

            {/* Factual Notice Banner */}
            <div
              style={{
                backgroundColor: '#141413',
                border: '1px solid #2B2B28',
                borderLeft: '4px solid #AA2E1F',
                padding: '1rem 1.35rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                color: '#A8A29E',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#F8FAFC' }}>EQUIPMENT NOTE:</strong> Specifications reflect typical industry standards. Car availability, mechanical series, and lease structures are confirmed upon direct review with our leasing team.
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Navigation Bar */}
      <div
        style={{
          position: 'sticky',
          top: 'var(--header-offset, var(--header-height))',
          transition: 'top 320ms cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 90,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <div className="container" style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem' }}>
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
      <section className="section section-white" style={{ paddingTop: '3.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {filteredCategories.map((cat, idx) => (
              <div
                key={cat.id}
                id={cat.slug}
                className="card"
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px -2px rgba(15,23,42,0.07)',
                  scrollMarginTop: '160px',
                  border: '1px solid #E2E8F0',
                }}
              >
                {/* Category Header Bar — 1 clean primary CTA */}
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
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#F87171',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '0.3rem',
                      }}
                    >
                      0{idx + 1} &bull; {cat.eyebrow}
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      {cat.name}
                    </h2>
                  </div>

                  <Link
                    to={`/quote?category=${encodeURIComponent(cat.name)}`}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: '8px' }}
                  >
                    <FileText size={15} />
                    Request Quote
                  </Link>
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
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #E2E8F0',
                        marginBottom: '1.75rem',
                        height: '280px',
                        backgroundColor: '#0A0A09',
                      }}
                    >
                      <img
                        src={cat.image}
                        alt={cat.imageAlt}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>

                    <h4 style={{ fontSize: '1.15rem', color: '#0A0A09', fontWeight: 700, marginBottom: '0.65rem' }}>
                      Operational Overview
                    </h4>
                    <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>
                      {cat.fullDescription}
                    </p>

                    <h4 style={{ fontSize: '1.15rem', color: '#0A0A09', fontWeight: 700, marginBottom: '0.65rem' }}>
                      Typical Commodity Applications
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {cat.typicalCommodities.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.94rem', color: '#334155' }}>
                          <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div
                      style={{
                        backgroundColor: '#FAF9F7',
                        padding: '1.25rem',
                        borderRadius: '10px',
                        border: '1px solid #E8E5DF',
                      }}
                    >
                      <strong style={{ color: '#0A0A09', display: 'block', fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                        Loading &amp; Discharge Profile
                      </strong>
                      <p style={{ color: '#475569', margin: 0, fontSize: '0.9rem', lineHeight: 1.65 }}>
                        {cat.loadingProfile}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Verified Configurations & Clean Specs Table */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', margin: 0 }}>
                        Configurations &amp; Capacities
                      </h3>
                      <span className="badge badge-dark">
                        {cat.configurations.length} Variations
                      </span>
                    </div>

                    {/* Spec Panel without repetitive buttons */}
                    <div className="spec-panel" style={{ marginBottom: '1.75rem', flex: 1 }}>
                      {cat.configurations.map((cfg, cfgIdx) => (
                        <div
                          key={cfgIdx}
                          style={{
                            padding: '1rem 1.25rem',
                            borderBottom: cfgIdx === cat.configurations.length - 1 ? 'none' : '1px solid #F1F5F9',
                            backgroundColor: cfgIdx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                            transition: 'background-color 150ms ease',
                          }}
                          className="spec-item-row"
                        >
                          <strong
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: '#0A0A09',
                              display: 'block',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {cfg.name}
                          </strong>
                          <span style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, display: 'block' }}>
                            {cfg.note}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Unified Bottom Sourcing Action */}
                    <div
                      style={{
                        padding: '1.25rem 1.5rem',
                        backgroundColor: '#FAF9F7',
                        borderRadius: '10px',
                        border: '1px solid #E8E5DF',
                        borderLeft: '4px solid #AA2E1F',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ flex: '1 1 220px' }}>
                        <strong style={{ display: 'block', fontSize: '0.94rem', color: '#0A0A09', marginBottom: '0.2rem' }}>
                          Custom Specifications &amp; Allocation
                        </strong>
                        <span style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5, display: 'block' }}>
                          {cat.inquiryNotice}
                        </span>
                      </div>
                      <Link
                        to={`/quote?category=${encodeURIComponent(cat.name)}`}
                        className="btn btn-primary btn-sm"
                        style={{ borderRadius: '8px' }}
                      >
                        Request Sourcing
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '4.5rem 0',
          borderTop: '3px solid #AA2E1F',
          marginTop: '4rem',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '680px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#FFFFFF', marginBottom: '1rem' }}>
            Need Specific Equipment Not Listed Here?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Coast Road Capital sources specialized railcars, custom dimensions, and dedicated fleet allocations across North America.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem' }}>
            <Link to="/quote" className="btn btn-primary btn-lg">
              <FileText size={18} />
              Request a Custom Quote
            </Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .spec-item-row:hover {
          background-color: #F8FAFC !important;
        }
      `}</style>
    </div>
  );
};

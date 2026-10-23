import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  FileText,
  Check,
  Calculator,
  Truck,
  SlidersHorizontal,
  ShieldCheck,
} from 'lucide-react';
import { EQUIPMENT_CATEGORIES } from '../data/equipmentData';

// Interactive Sample Estimates for Homepage Benchmark Card
const HOME_SAMPLE_ESTIMATES = {
  'covered-hoppers': {
    category: 'Covered Hoppers',
    size: '5,161–5,400 cu ft Grain / Fertilizer',
    quantity: 10,
    term: 'Medium-Term (1–3 Years)',
    rateMin: '$780',
    rateMax: '$1,150',
    totalMin: '$7,800',
    totalMax: '$11,500',
    structure: 'Full-Service (Maint. Included)',
    trucks: '40 highway semi-truckloads',
    cargo: 'Grain, Fertilizer & Dry Bulk',
  },
  'boxcars': {
    category: 'Boxcars',
    size: '50-ft Standard (5,200 cu ft)',
    quantity: 5,
    term: 'Medium-Term (1–3 Years)',
    rateMin: '$637',
    rateMax: '$960',
    totalMin: '$3,185',
    totalMax: '$4,800',
    structure: 'Full-Service (Maint. Included)',
    trucks: '15–20 highway semi-truckloads',
    cargo: 'Palletized Goods & Paper Rolls',
  },
  'tank-cars': {
    category: 'Tank Cars',
    size: '25,000–28,000 Gal General Purpose',
    quantity: 8,
    term: 'Long-Term (3–5 Years)',
    rateMin: '$880',
    rateMax: '$1,420',
    totalMin: '$7,040',
    totalMax: '$11,360',
    structure: 'Full-Service (Maint. Included)',
    trucks: '30–35 liquid tanker trucks',
    cargo: 'Biofuels, Chemicals & Food Oils',
  },
};

// Show only first 4 categories on home (preview, not duplicate of leasing page)
const PREVIEW_CATEGORIES = EQUIPMENT_CATEGORIES.slice(0, 4);

// Specs for preview cards
const CATEGORY_TECH_SPECS: Record<
  string,
  { specs: { label: string; value: string }[] }
> = {
  boxcars: {
    specs: [
      { label: 'Lengths', value: "50' & 60'" },
      { label: 'Payload', value: '70T – 100T' },
      { label: 'Access', value: 'Plug / Sliding' },
    ],
  },
  'covered-hoppers': {
    specs: [
      { label: 'Volume', value: '3,230–6,541 cu ft' },
      { label: 'Discharge', value: 'Gravity & PD' },
      { label: 'Hatches', value: 'Trough & Round' },
    ],
  },
  'open-top-hoppers': {
    specs: [
      { label: 'Volume', value: '2,400–4,000 cu ft' },
      { label: 'Gate', value: 'Manual & Rapid' },
      { label: 'Body', value: 'All-Welded Steel' },
    ],
  },
  gondolas: {
    specs: [
      { label: 'Lengths', value: "42' – 66' Mill" },
      { label: 'Loading', value: 'Crane & Magnet' },
      { label: 'Couplers', value: 'Rotary & Standard' },
    ],
  },
  'centerbeam-flatcars': {
    specs: [
      { label: 'Lengths', value: "65' & 73'" },
      { label: 'Deck', value: 'Riser & Riserless' },
      { label: 'Access', value: '2-Side Ground' },
    ],
  },
  'bulkhead-general-flatcars': {
    specs: [
      { label: 'Lengths', value: "50' – 89'" },
      { label: 'Bulkheads', value: 'Fixed' },
      { label: 'Deck', value: 'Heavy-Duty Steel' },
    ],
  },
  'tank-cars': {
    specs: [
      { label: 'Volume', value: '13k – 30k+ Gal' },
      { label: 'Thermal', value: 'Insulated & Coiled' },
      { label: 'Pressure', value: 'Pressurized & Non' },
    ],
  },
};

export const Home: React.FC = () => {
  const [sampleCategory, setSampleCategory] = useState<'covered-hoppers' | 'boxcars' | 'tank-cars'>('covered-hoppers');
  const activeSample = HOME_SAMPLE_ESTIMATES[sampleCategory];

  return (
    <div className="home-page">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '5rem 0 4.5rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            backgroundImage: `url('/images/railroad-hero-yard.jpg')`,
            backgroundPosition: 'center 35%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            transform: 'scale(1.02)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: 'linear-gradient(90deg, rgba(10,10,9,0.96) 0%, rgba(10,10,9,0.88) 45%, rgba(10,10,9,0.55) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: '#AA2E1F',
            zIndex: 4,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
          <div style={{ maxWidth: '780px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 5.2vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                marginBottom: '1.5rem',
              }}
            >
              Railcar Leasing &amp; Sourcing <br />
              <span style={{ color: '#F87171' }}>Built Around</span> Your Operation.
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.2rem)',
                lineHeight: 1.7,
                color: '#CBD5E1',
                marginBottom: '2.5rem',
                maxWidth: '660px',
              }}
            >
              Coast Road Capital helps North American shippers, manufacturers, and bulk processors find the right railcar equipment and lease terms for their supply chain.
            </p>

            {/* Primary CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center', marginBottom: '3rem' }}>
              <Link to="/quote" className="btn btn-primary btn-lg">
                <FileText size={18} />
                Request a Quote
              </Link>
              <Link
                to="/cost-estimator"
                className="btn btn-outline-white btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}
              >
                <Calculator size={18} />
                Cost Estimator
              </Link>
              <Link
                to="/railcar-leasing"
                style={{
                  color: '#CBD5E1',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.8rem 0.25rem',
                  transition: 'color 180ms ease',
                }}
                className="hero-text-link"
              >
                Browse Equipment Catalog
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* Trust Highlights */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.75rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.14)',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>7 Equipment Categories</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>Standard &amp; Custom Sizes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>Flexible Lease Terms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BUSINESS INTRODUCTION
          ========================================================================= */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="eyebrow">Who We Are</span>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                  color: '#0A0A09',
                  marginBottom: '1.5rem',
                  lineHeight: 1.25,
                }}
              >
                Equipment Sourcing For North American Rail Freight
              </h2>
              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Coast Road Capital connects industrial enterprises with railcar equipment solutions. Whether expanding a private fleet, managing seasonal volume, or transitioning freight from highway to rail, we help companies find the right railcar types and lease terms.
              </p>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                We work across seven foundational equipment classes — including boxcars, covered hoppers, open-top hoppers, gondolas, centerbeam flatcars, bulkhead flatcars, and tank cars.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.15rem', backgroundColor: '#FAF9F7', borderRadius: '10px', border: '1px solid #E8E5DF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#AA2E1F' }} />
                    <strong style={{ fontSize: '0.92rem', color: '#0A0A09' }}>Flexible Leasing</strong>
                  </div>
                  <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
                    Full-service, net lease, short to multi-year terms.
                  </span>
                </div>
                <div style={{ padding: '1.15rem', backgroundColor: '#FAF9F7', borderRadius: '10px', border: '1px solid #E8E5DF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#AA2E1F' }} />
                    <strong style={{ fontSize: '0.92rem', color: '#0A0A09' }}>Multi-Industry</strong>
                  </div>
                  <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
                    Agriculture, forest products, minerals, steel, chemicals.
                  </span>
                </div>
              </div>

              <Link to="/about" className="btn btn-secondary">
                About Coast Road Capital
                <ChevronRight size={17} />
              </Link>
            </div>

            {/* Right side: relevant industry image instead of SCL locomotive */}
            <div>
              <div
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 8px 24px -4px rgba(15,23,42,0.08)',
                }}
              >
                <img
                  src="/images/railcar-leasing-overview.webp"
                  alt="Industrial railcar fleet and yard operations"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WHY PARTNER WITH US (Clean, no buzzword badges)
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
              Why Shippers Choose Coast Road Capital
            </h2>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7 }}>
              Acquiring rail equipment requires precision matching, commercial flexibility, and dependable route interchange. Here's how we support your supply chain.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
            }}
            className="pillars-grid"
          >
            {/* Pillar 1 */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                borderTop: '3px solid #0A0A09',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img
                  src="/images/railcar-operations.webp"
                  alt="Railcar yard inspection"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.75rem', flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                  AAR &amp; FRA Mechanical Vetting
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                  Every car is verified against AAR structural standards, safety appliance rules, and FRA field service guidelines.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                borderTop: '3px solid #AA2E1F',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img
                  src="/images/railcar-leasing-overview.webp"
                  alt="Commercial railcar leasing"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.75rem', flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                  Tailored Lease Terms
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                  Full-service or net lease, from seasonal surges to multi-year allocations — structured around your operation.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                borderTop: '3px solid #D97706',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img
                  src="/images/track-construction-1.jpg"
                  alt="Railway routing and siding"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.75rem', flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                  Continental Routing
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                  Connecting plants across Class I trunk lines and regional shortlines with verified track interchange to your siding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EQUIPMENT PREVIEW (4 categories only — not 7 duplicate)
          ========================================================================= */}
      <section className="section section-white">
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1.5rem',
              marginBottom: '2.5rem',
            }}
          >
            <div>
            
              <h2 style={{ color: '#0A0A09', marginBottom: '0.5rem' }}>
                Railcar Categories
              </h2>
              <p style={{ color: '#64748B', maxWidth: '560px', fontSize: '1rem' }}>
                Explore dimensions, capacities, and applications across our seven freight car types.
              </p>
            </div>

            <Link to="/railcar-leasing" className="btn btn-secondary">
              View All 7 Categories
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* 4 categories in 2x2 grid — no orphans */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2rem',
            }}
            className="preview-grid"
          >
            {PREVIEW_CATEGORIES.map((cat) => {
              const tech = CATEGORY_TECH_SPECS[cat.slug];

              return (
                <div
                  key={cat.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'box-shadow 250ms ease, transform 250ms ease',
                  }}
                  className="preview-card"
                >
                  <div style={{ height: '190px', overflow: 'hidden' }}>
                    <img
                      src={cat.image}
                      alt={cat.imageAlt}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                      {cat.name}
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                      {cat.shortDescription}
                    </p>

                    {/* Spec strip */}
                    {tech && (
                      <div className="spec-metric-strip" style={{ marginBottom: '1.25rem' }}>
                        {tech.specs.map((s, i) => (
                          <div key={i} className="spec-metric-item">
                            <span className="spec-metric-label">{s.label}</span>
                            <span className="spec-metric-val">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                      <Link
                        to={`/railcar-leasing#${cat.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          color: '#0A0A09',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        View Details
                        <ChevronRight size={15} style={{ color: '#AA2E1F' }} />
                      </Link>

                      <Link
                        to={`/quote?category=${encodeURIComponent(cat.name)}`}
                        className="btn btn-primary btn-sm"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          COST ESTIMATOR FEATURE CALLOUT SECTION (Executive Interactive Benchmark)
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#FAF8F5',
          borderTop: '1px solid #EADBCC',
          borderBottom: '1px solid #EADBCC',
          padding: '4.5rem 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Clear Value Proposition with Domain Icons */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#AA2E1F',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.5rem',
                }}
              >
                Capital Planning &amp; Fleet Budgeting
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
                  color: '#0A0A09',
                  marginBottom: '1rem',
                  lineHeight: 1.22,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                Model Real-Time Equipment Lease Rates Before You Commit Capital
              </h2>
              <p
                style={{
                  color: '#475569',
                  fontSize: '1.02rem',
                  lineHeight: 1.7,
                  marginBottom: '2rem',
                }}
              >
                Eliminate the guesswork of freight logistics budgeting. Model realistic per-car and fleet monthly lease costs across North America's seven primary equipment classes in seconds — with instant maintenance scope comparisons.
              </p>

              {/* 3 Domain-Specific Specialized Feature Points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: '#FDF2F0',
                      border: '1px solid #FCDAD7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <SlidersHorizontal size={18} style={{ color: '#AA2E1F' }} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.98rem', color: '#0A0A09', marginBottom: '0.2rem' }}>
                      7 Railcar Categories &amp; Sizing Specs
                    </strong>
                    <span style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5, display: 'block' }}>
                      Detailed cubic volume, GRL weight limits, and commodity matching across Boxcars, Hoppers, Gondolas, Flatcars, and Tank Cars.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <ShieldCheck size={18} style={{ color: '#059669' }} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.98rem', color: '#0A0A09', marginBottom: '0.2rem' }}>
                      Full-Service vs. Net Lease Modeling
                    </strong>
                    <span style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5, display: 'block' }}>
                      Compare lessor-managed AAR Rule 88 mechanical maintenance and wheelset renewals against shipper-managed net leases.
                    </span>
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <Link to="/cost-estimator" className="btn btn-primary btn-lg">
                  <Calculator size={18} />
                  Launch Cost Estimator
                </Link>
                <Link to="/railcar-leasing" className="btn btn-secondary btn-lg">
                  View Full Catalog
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            {/* Right Column: Executive Interactive Benchmark Card */}
            <div>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DCE3EB',
                  borderRadius: '14px',
                  boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
                  overflow: 'hidden',
                  padding: '1.5rem',
                }}
              >
                <div>
                  {/* Interactive Quick-Switcher Pills */}
                  <div style={{ marginBottom: '1.15rem' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.35rem',
                        backgroundColor: '#F1F5F9',
                        padding: '0.25rem',
                        borderRadius: '8px',
                      }}
                    >
                      {(
                        [
                          { id: 'covered-hoppers', label: 'Hoppers' },
                          { id: 'boxcars', label: 'Boxcars' },
                          { id: 'tank-cars', label: 'Tank Cars' },
                        ] as const
                      ).map((tab) => {
                        const isActive = sampleCategory === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSampleCategory(tab.id)}
                            style={{
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.45rem 0.35rem',
                              fontSize: '0.78rem',
                              fontWeight: isActive ? 700 : 500,
                              cursor: 'pointer',
                              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                              color: isActive ? '#0A0A09' : '#64748B',
                              boxShadow: isActive ? '0 1px 4px rgba(15, 23, 42, 0.08)' : 'none',
                              transition: 'all 150ms ease',
                            }}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sample Title & Spec */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#0A0A09', margin: '0 0 0.15rem 0', lineHeight: 1.25 }}>
                      {activeSample.category}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, lineHeight: 1.35 }}>
                      {activeSample.size} &bull; <strong>{activeSample.quantity} Railcars</strong>
                    </p>
                  </div>

                  {/* Primary Rate Box with Green Number */}
                  <div
                    style={{
                      background: 'linear-gradient(180deg, #FAF8F5 0%, #F5F1EB 100%)',
                      border: '1px solid #EADBCC',
                      borderLeft: '3px solid #059669',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      marginBottom: '0.95rem',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#8C7B68',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.15rem',
                      }}
                    >
                      Estimated Monthly Rate
                    </span>
                    <div
                      style={{
                        fontSize: '1.65rem',
                        fontWeight: 800,
                        color: '#047857',
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        marginBottom: '0.15rem',
                      }}
                    >
                      {activeSample.rateMin} – {activeSample.rateMax}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                      per car / month &bull; {activeSample.structure}
                    </div>
                  </div>

                  {/* Ledger Breakdown Rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.15rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #DCFCE7',
                        borderRadius: '6px',
                        padding: '0.45rem 0.65rem',
                        fontSize: '0.82rem',
                      }}
                    >
                      <span style={{ color: '#475569' }}>Monthly Fleet Total</span>
                      <strong style={{ color: '#047857', fontWeight: 800, fontSize: '0.92rem' }}>
                        {activeSample.totalMin} – {activeSample.totalMax}/mo
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.82rem' }}>
                      <span style={{ color: '#475569' }}>Term Commitment</span>
                      <strong style={{ color: '#0A0A09', fontWeight: 600 }}>{activeSample.term}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.82rem' }}>
                      <span style={{ color: '#475569' }}>Typical Cargo</span>
                      <span style={{ color: '#0A0A09', fontWeight: 500 }}>{activeSample.cargo}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.35rem', fontSize: '0.80rem', color: '#334155' }}>
                      <Truck size={14} style={{ color: '#2563EB', flexShrink: 0 }} />
                      <span>{activeSample.trucks} displaced per turn</span>
                    </div>
                  </div>

                  {/* Direct Action Link */}
                  <Link
                    to={`/cost-estimator?category=${sampleCategory}`}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.8rem 1.25rem',
                      borderRadius: '8px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      marginBottom: '0.65rem',
                    }}
                  >
                    <span>Customize This Fleet in Full Estimator</span>
                    <ArrowRight size={16} />
                  </Link>

                  <p style={{ fontSize: '0.66rem', color: '#94A3B8', margin: 0, textAlign: 'center', lineHeight: 1.35 }}>
                    *Indicative market rate for capital budgeting. Formal quote confirmed upon siding inspection and credit review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SOURCING PROCESS (Clean 3-step, no buzzwords)
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
              How It Works
            </h2>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7 }}>
              A straightforward, three-step process from initial inquiry to railcar delivery at your siding.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
            }}
            className="steps-grid"
          >
            {/* Step 1 */}
            <div className="timeline-card">
              <div
                className="timeline-node"
                style={{ borderColor: '#0A0A09', color: '#0A0A09' }}
              >
                01
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                Match &amp; Verify Equipment
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                We match your cargo type and facility specs against the right car configurations — clearance, volume, and discharge.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: '#334155' }}>
                  <Check size={14} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  Clearance &amp; dock alignment
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: '#334155' }}>
                  <Check size={14} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  Payload density optimization
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: '#334155' }}>
                  <Check size={14} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  Discharge interface matching
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="timeline-card">
              <div
                className="timeline-node"
                style={{ borderColor: '#AA2E1F', color: '#AA2E1F' }}
              >
                02
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                Sourcing &amp; Terms
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                Submit your fleet requirements. Our team reviews market pools, interchange routing, and custom lease structures.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: '#334155' }}>
                  <Check size={14} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  Regional car set sourcing
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: '#334155' }}>
                  <Check size={14} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  Full-service vs. net lease options
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: '#334155' }}>
                  <Check size={14} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  Delivery timeline commitment
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="timeline-card">
              <div
                className="timeline-node"
                style={{ borderColor: '#059669', color: '#059669' }}
              >
                03
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                Inspection &amp; Delivery
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                We finalize mechanical inspection, coordinate interchange handover, and deliver cars to your siding.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: '#334155' }}>
                  <Check size={14} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  Pre-trip mechanical sign-off
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: '#334155' }}>
                  <Check size={14} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  Class I interchange dispatch
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: '#334155' }}>
                  <Check size={14} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  Dedicated contact throughout lease
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLOSING CTA (Simple, one primary CTA)
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '5rem 0',
          borderTop: '3px solid #AA2E1F',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.85rem)',
                color: '#FFFFFF',
                marginBottom: '1rem',
                lineHeight: 1.2,
              }}
            >
              Ready to Discuss Your Railcar Requirements?
            </h2>
            <p
              style={{
                color: '#94A3B8',
                fontSize: '1.08rem',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              Submit a quote request or contact us directly to review equipment availability, specifications, and lease structures.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem' }}>
              <Link to="/quote" className="btn btn-primary btn-lg">
                <FileText size={18} />
                Request a Quote
              </Link>
              <Link to="/contact" className="btn btn-outline-white btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-text-link:hover {
          color: #FFFFFF !important;
        }
        .preview-card {
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 260ms cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .preview-card:hover {
          transform: translateY(-4px) translateZ(0) !important;
          box-shadow: 0 14px 28px -4px rgba(15,23,42,0.12) !important;
        }
        .preview-card img {
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .preview-card:hover img {
          transform: scale(1.04) translateZ(0);
        }
        @media (max-width: 768px) {
          .pillars-grid,
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
          .preview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

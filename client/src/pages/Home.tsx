import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Search,
  FileText,
  PhoneCall,
  ShieldCheck,
  TrainTrack,
  Check,
  Layers,
} from 'lucide-react';
import { TrackMotif } from '../components/common/TrackMotif';
import { EQUIPMENT_CATEGORIES } from '../data/equipmentData';

// Technical AAR mechanical classifications and micro-spec metrics for each category
const CATEGORY_TECH_SPECS: Record<
  string,
  {
    aarClass: string;
    specs: { label: string; value: string }[];
    topCommodities: string[];
  }
> = {
  boxcars: {
    aarClass: 'AAR: XM / XP / RBL',
    specs: [
      { label: 'Lengths', value: "50' & 60'" },
      { label: 'Payload', value: '70T – 100T' },
      { label: 'Access', value: 'Plug / Sliding' },
    ],
    topCommodities: ['Roll Paper', 'Finished Goods', 'Building Products', 'Insulated Food'],
  },
  'covered-hoppers': {
    aarClass: 'AAR: C113 / C114',
    specs: [
      { label: 'Cubic Volume', value: '3,230–6,541 cu ft' },
      { label: 'Discharge', value: 'Gravity & PD' },
      { label: 'Hatches', value: 'Trough & Round' },
    ],
    topCommodities: ['Grains & DDGS', 'Portland Cement', 'Plastic Resins', 'Fertilizer'],
  },
  'open-top-hoppers': {
    aarClass: 'AAR: H412 / H414',
    specs: [
      { label: 'Cubic Volume', value: '2,400–4,000 cu ft' },
      { label: 'Gate Mechanism', value: 'Manual & Rapid' },
      { label: 'Body Style', value: 'All-Welded Steel' },
    ],
    topCommodities: ['Track Ballast', 'Crushed Aggregate', 'Petroleum Coke', 'Dense Ores'],
  },
  gondolas: {
    aarClass: 'AAR: GS / GT / GB',
    specs: [
      { label: 'Lengths', value: "42' – 66' Mill" },
      { label: 'Loading', value: 'Crane & Magnet' },
      { label: 'Couplers', value: 'Rotary & Standard' },
    ],
    topCommodities: ['Steel Coils', 'Structural Beams', 'Heavy Scrap', 'Castings'],
  },
  'centerbeam-flatcars': {
    aarClass: 'AAR: FBC / FMS',
    specs: [
      { label: 'Lengths', value: "65' & 73' Standard" },
      { label: 'Deck Design', value: 'Riser & Riserless' },
      { label: 'Forklift Access', value: '2-Side Ground' },
    ],
    topCommodities: ['Dimensional Lumber', 'Roof Trusses', 'Plywood', 'Wallboard'],
  },
  'bulkhead-general-flatcars': {
    aarClass: 'AAR: FB / FM / FW',
    specs: [
      { label: 'Lengths', value: "50' – 89' Specialty" },
      { label: 'End Bulkheads', value: "Fixed Bulkhead" },
      { label: 'Deck Rating', value: 'Heavy-Duty Steel' },
    ],
    topCommodities: ['Steel Pipe', 'Rebar Bundles', 'Machinery', 'Over-Dimensional'],
  },
  'tank-cars': {
    aarClass: 'DOT-111 / 117 / CPC-1232',
    specs: [
      { label: 'Shell Volume', value: '13k – 30k+ Gal' },
      { label: 'Thermal Profile', value: 'Insulated & Coiled' },
      { label: 'Pressure Class', value: 'Pressurized & Non' },
    ],
    topCommodities: ['Liquid Fertilizer', 'Chemical Reagents', 'Biofuels', 'Edible Oils'],
  },
};

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'freight' | 'bulk' | 'specialty'>('all');

  const filteredCategories = EQUIPMENT_CATEGORIES.filter((cat) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'freight') return cat.slug === 'boxcars' || cat.slug === 'bulkhead-general-flatcars';
    if (activeTab === 'bulk') return cat.slug === 'covered-hoppers' || cat.slug === 'open-top-hoppers' || cat.slug === 'gondolas';
    if (activeTab === 'specialty') return cat.slug === 'centerbeam-flatcars' || cat.slug === 'tank-cars';
    return true;
  });

  return (
    <div className="home-page">
      {/* =========================================================================
          SECTION A: HERO SECTION
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '5.5rem 0 5rem',
        }}
      >
        {/* Background Image with Dark Vignette */}
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
        {/* Red Rail Bottom Accent Line */}
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
          <div style={{ maxWidth: '820px' }}>
           

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 5.2vw, 4.25rem)',
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

            {/* Supporting Copy */}
            <p
              style={{
                fontSize: 'clamp(1.08rem, 1.8vw, 1.25rem)',
                lineHeight: 1.7,
                color: '#CBD5E1',
                marginBottom: '2.5rem',
                maxWidth: '720px',
              }}
            >
              Coast Road Capital helps North American shippers, manufacturers, and bulk processors discover equipment configurations, evaluate typical technical specifications, and submit tailored leasing inquiries for their supply chain.
            </p>

            {/* Hero CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '3rem' }}>
              <Link to="/railcar-leasing" className="btn btn-primary btn-lg">
                <Search size={19} />
                Explore Railcars Catalog
              </Link>
              <Link to="/quote" className="btn btn-outline-white btn-lg">
                <FileText size={19} />
                Request a Quote
              </Link>
              <Link to="/book-a-call" className="btn btn-white btn-lg" style={{ color: '#0A0A09' }}>
                <PhoneCall size={18} style={{ color: '#AA2E1F' }} />
                Schedule Consultation
              </Link>
            </div>

            {/* Trust Highlights Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.14)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 500 }}>
                  7 Equipment Categories
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#60A5FA' }} />
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 500 }}>
                  Standard &amp; Custom Sizes
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FBBF24' }} />
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 500 }}>
                  Tailored Lease Terms
                </span>
              </div>
            
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: BUSINESS INTRODUCTION
          ========================================================================= */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left: Text Content */}
            <div>
              <span className="eyebrow">Company Profile</span>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.4vw, 2.75rem)',
                  color: '#0A0A09',
                  marginBottom: '1.5rem',
                  lineHeight: 1.25,
                }}
              >
                Dedicated Equipment Sourcing For North American Rail Freight
              </h2>
              <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Coast Road Capital connects industrial enterprises with modern railcar equipment solutions. Whether expanding an existing private fleet, managing seasonal volume surges, or transitioning freight from highway to rail, we assist companies in identifying the appropriate railcar types and lease terms for their operations.
              </p>
              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                We work across seven foundational equipment classes—including boxcars, covered hoppers, open-top hoppers, gondolas, centerbeam flatcars, bulkhead flatcars, and tank cars. Our focus is straightforward: clear equipment communication, practical specifications, and responsive leasing inquiries.
              </p>

              {/* Multi-Tone Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.25rem' }}>
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#AA2E1F' }} />
                    <strong style={{ fontSize: '0.96rem', color: '#0A0A09' }}>Flexible Lease Structures</strong>
                  </div>
                  <span style={{ fontSize: '0.86rem', color: '#64748B' }}>
                    Full-service, net lease, and short-to-medium durations.
                  </span>
                </div>

                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#AA2E1F' }} />
                    <strong style={{ fontSize: '0.96rem', color: '#0A0A09' }}>Multi-Industry Scope</strong>
                  </div>
                  <span style={{ fontSize: '0.86rem', color: '#64748B' }}>
                    Agriculture, forest products, minerals, steel, and chemicals.
                  </span>
                </div>
              </div>

              <div>
                <Link to="/about" className="btn btn-secondary">
                  Learn More About CRC Story
                  <ChevronRight size={17} />
                </Link>
              </div>
            </div>

            {/* Right: Historic SCL #1637 Locomotive Feature Card */}
            <div>
              <div
                className="card"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '0.85rem',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div style={{ overflow: 'hidden', borderRadius: '10px', position: 'relative' }}>
                  <img
                    src="/images/historic-scl-1637.png"
                    alt="Historic Seaboard Coast Line GP40-2 Locomotive 1637 Pulling For You"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                    }}
                    className="locomotive-img"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#F8FAFC',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    Historic SCL GP40-2 #1637
                  </div>
                </div>

                <div
                  style={{
                    padding: '1.15rem 0.75rem 0.4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <span style={{ fontWeight: 700, color: '#0A0A09', fontSize: '0.92rem', lineHeight: 1.3 }}>
                      Heritage Inspiration
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      "Pulling For You!" &bull; SCL Speed Lettering
                    </span>
                  </div>
                  <span className="badge badge-red" style={{ flexShrink: 0 }}>
                    CRC Brand Roots
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: SOURCING PILLARS (Authentic Industrial Capabilities)
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-dark" style={{ marginBottom: '1rem' }}>
              <Layers size={14} style={{ color: '#AA2E1F' }} />
              Operational Reliability
            </span>
            <h2 style={{ color: '#0A0A09', marginBottom: '1rem' }}>
              Why Industrial Shippers Partner With Coast Road Capital
            </h2>
            <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.7 }}>
              Acquiring rail equipment requires precision mechanical matching, commercial flexibility, and dependable route interchange. Here is how we support your supply chain.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {/* Pillar 1 */}
            <div
              className="card hover-lift"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #0A0A09',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/railcar-operations.webp"
                  alt="AAR & FRA mechanical vetting and railcar yard inspection"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="pillar-card-img"
                />
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', margin: 0 }}>
                    AAR &amp; FRA Mechanical Vetting
                  </h3>
                </div>
                <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '1.25rem', flex: 1 }}>
                  Every car configuration is verified against Association of American Railroads (AAR) structural standards, safety appliance rules, and FRA field service guidelines.
                </p>
                <div style={{ paddingTop: '1rem', borderTop: '1px solid #F1F5F9', fontSize: '0.82rem', color: '#AA2E1F', fontWeight: 600 }}>
                  &bull; Full Clearance &amp; Tare Weight Alignment
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div
              className="card hover-lift"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #AA2E1F',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/railcar-leasing-overview.webp"
                  alt="Tailored commercial railcar leasing and fleet management"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="pillar-card-img"
                />
               
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', margin: 0 }}>
                    Tailored Lease Architectures
                  </h3>
                </div>
                <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '1.25rem', flex: 1 }}>
                  Choose between Full-Service agreements with mechanical maintenance management, or Net Leases tailored for operators with internal maintenance programs.
                </p>
                <div style={{ paddingTop: '1rem', borderTop: '1px solid #F1F5F9', fontSize: '0.82rem', color: '#AA2E1F', fontWeight: 600 }}>
                  &bull; Seasonal Surges &amp; Multi-Year Allocations
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div
              className="card hover-lift"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #0A0A09',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/track-construction-1.jpg"
                  alt="Continental railway routing and industrial siding trackage"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="pillar-card-img"
                />
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
               
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', margin: 0 }}>
                    Continental Railway Routing
                  </h3>
                </div>
                <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '1.25rem', flex: 1 }}>
                  Connecting industrial plants across Class I trunk lines and regional shortline railroads with verified track interchange capabilities to your private siding.
                </p>
                <div style={{ paddingTop: '1rem', borderTop: '1px solid #F1F5F9', fontSize: '0.82rem', color: '#AA2E1F', fontWeight: 600 }}>
                  &bull; North American Siding Coordination
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: EQUIPMENT CATEGORY OVERVIEW (Premium Industrial Spec Cards)
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
              <span className="badge badge-red" style={{ marginBottom: '0.85rem' }}>
                Equipment Portfolio &bull; 7 Primary Classes
              </span>
              <h2 style={{ color: '#0A0A09', marginBottom: '0.5rem' }}>
                Primary Railcar Categories
              </h2>
              <p style={{ color: '#64748B', maxWidth: '640px', fontSize: '1.02rem' }}>
                Explore verified dimensions, cubic capacities, and applications for all seven client-approved freight car types.
              </p>
            </div>

            <Link to="/railcar-leasing" className="btn btn-secondary">
              View All 7 Categories in Detail
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Interactive Filter Pills */}
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Categories (7)
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'freight' ? 'active' : ''}`}
              onClick={() => setActiveTab('freight')}
            >
              Boxcars &amp; Flatcars
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'bulk' ? 'active' : ''}`}
              onClick={() => setActiveTab('bulk')}
            >
              Hoppers &amp; Gondolas
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'specialty' ? 'active' : ''}`}
              onClick={() => setActiveTab('specialty')}
            >
              Centerbeams &amp; Tank Cars
            </button>
          </div>

          {/* 7 Categories Grid with Premium Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2.25rem',
            }}
          >
            {filteredCategories.map((cat, idx) => {
              const tech = CATEGORY_TECH_SPECS[cat.slug] || {
                aarClass: 'AAR Standard',
                specs: [
                  { label: 'Configurations', value: `${cat.configurations.length} Options` },
                  { label: 'Status', value: 'Sourcing Active' },
                  { label: 'Inspection', value: 'FRA Verified' },
                ],
                topCommodities: cat.typicalCommodities.slice(0, 4),
              };

              return (
                <div key={cat.id} className="equipment-card-premium">
                 

                  {/* Image Viewport with Zoom Effect */}
                  <div className="card-image-wrap" style={{ height: '210px' }}>
                    <img src={cat.image} alt={cat.imageAlt} />
                    <div
                      className="scl-speed-lettering"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(10, 10, 9, 0.88)',
                        backdropFilter: 'blur(4px)',
                        color: '#EDE6D4',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(237, 230, 212, 0.25)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      CAT 0{idx + 1}
                    </div>

                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(0deg, rgba(10,10,9,0.9) 0%, rgba(10,10,9,0) 100%)',
                        color: '#EDE6D4',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                      }}
                    >
                      {cat.eyebrow}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                      {cat.name}
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.35rem', flex: 1 }}>
                      {cat.shortDescription}
                    </p>

                    {/* 3-Metric Industrial Spec Strip */}
                    <div className="spec-metric-strip">
                      {tech.specs.map((item, sIdx) => (
                        <div key={sIdx} className="spec-metric-item">
                          <span className="spec-metric-label">{item.label}</span>
                          <span className="spec-metric-val">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Commodity Chips */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: '#64748B',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          marginBottom: '0.45rem',
                        }}
                      >
                        Target Cargo:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {tech.topCommodities.map((comm) => (
                          <span
                            key={comm}
                            style={{
                              fontSize: '0.76rem',
                              backgroundColor: '#F1F5F9',
                              color: '#334155',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              fontWeight: 500,
                            }}
                          >
                            {comm}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Split Actions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid #F1F5F9',
                      }}
                    >
                      <Link
                        to={`/railcar-leasing#${cat.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: '#0A0A09',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                        className="category-spec-link"
                      >
                        Full Specs
                        <ChevronRight size={16} style={{ color: '#AA2E1F' }} />
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
          SECTION E: THE CRC SOURCING JOURNEY (Transparent Railroad Workflow)
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '4.5rem' }}>
            <span className="badge badge-amber" style={{ marginBottom: '1rem' }}>
              <TrainTrack size={14} style={{ color: '#AA2E1F' }} />
              Bespoke Railroad Dispatch Architecture
            </span>
            <h2 style={{ color: '#0A0A09', marginBottom: '1rem' }}>
              The CRC Sourcing Journey: From Spec to Siding
            </h2>
            <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.7 }}>
              We have eliminated the opacity of industrial equipment leasing. Follow our transparent, milestone-driven workflow designed around real North American rail logistics.
            </p>
          </div>

          {/* Workflow Connected Rail Container */}
          <div className="timeline-workflow-wrap">
            {/* Horizontal Connecting Steel Rail (Hidden on small mobile) */}
            <div className="timeline-rail-line desktop-only" />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                gap: '2.5rem',
              }}
            >
              {/* MILEPOST 01 */}
              <div className="timeline-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="timeline-node" style={{ borderColor: '#0A0A09', color: '#0A0A09' }}>
                    01
                  </div>
                 
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.75rem' }}>
                  Equipment Match &amp; Clearance Verification
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  Explore verified equipment classes and match your cargo chemistry, density, and discharge mechanisms against facility parameters.
                </p>

                {/* Milestone Detail Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#334155' }}>
                    <Check size={16} style={{ color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Clearance Profile:</strong> Height, curvature radius &amp; dock alignment.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }}>
                    <Check size={16} style={{ color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Payload Density:</strong> Maximize cubic volume vs. gross rail load.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }}>
                    <Check size={16} style={{ color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Discharge Interface:</strong> Gravity slide, pneumatic, or PD manifold.</span>
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--color-cream-light)',
                    border: '1px solid var(--color-cream-border)',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: '#0A0A09',
                    fontWeight: 600,
                  }}
                >
                  Action: Explore Catalog &amp; Configure Size
                </div>
              </div>

              {/* MILEPOST 02 */}
              <div className="timeline-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="timeline-node" style={{ borderColor: '#AA2E1F', color: '#AA2E1F' }}>
                    02
                  </div>
                 
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.75rem' }}>
                  Route Sourcing &amp; Commercial Terms
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  Submit required fleet sets. Our commercial team reviews real-time market sourcing pools, interchange routing, and custom lease terms.
                </p>

                {/* Milestone Detail Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#334155' }}>
                    <Check size={16} style={{ color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Network Sourcing:</strong> Verified regional car sets and shortlines.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#334155' }}>
                    <Check size={16} style={{ color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Lease Engineering:</strong> Full-Service vs. Triple-Net structures.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#334155' }}>
                    <Check size={16} style={{ color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Timeline Commitment:</strong> Immediate delivery or seasonal reservation.</span>
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: '#FDF3F2',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: '#8F2417',
                    fontWeight: 600,
                  }}
                >
                  Action: Submit Inquiry (1-Day Review Window)
                </div>
              </div>

              {/* MILEPOST 03 */}
              <div className="timeline-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="timeline-node" style={{ borderColor: '#0A0A09', color: '#0A0A09' }}>
                    03
                  </div>
                  
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.75rem' }}>
                  Mechanical Compliance &amp; Siding Delivery
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  Direct consultation with CRC management to finalize delivery logistics, interchange junctions, and pre-trip mechanical inspection sign-off.
                </p>

                {/* Milestone Detail Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#334155' }}>
                    <Check size={16} style={{ color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Mechanical Sign-Off:</strong> Wheelsets, airbrakes, safety valves tested.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }}>
                    <Check size={16} style={{ color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Interchange Dispatch:</strong> Coordinated handover across Class I carriers.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }}>
                    <Check size={16} style={{ color: '#AA2E1F', marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Continuous Advisory:</strong> Dedicated point of contact throughout lease.</span>
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--color-cream-light)',
                    border: '1px solid var(--color-cream-border)',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: '#0A0A09',
                    fontWeight: 600,
                  }}
                >
                  Action: Siding Handover &amp; Dedicated Operations
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Reassurance Banner */}
          <div className="commitment-card" style={{ marginTop: '3.75rem' }}>
            {/* Top Mechanical Accent Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #AA2E1F 0%, #E05240 40%, #0F172A 100%)',
              }}
            />

            {/* Left Content Area with ShieldCheck Icon & Professional Typography */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: 1 }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#AA2E1F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(170, 46, 31, 0.08)',
                  marginTop: '2px',
                }}
              >
                <ShieldCheck size={26} style={{ color: '#AA2E1F' }} />
              </div>

              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#AA2E1F',
                    marginBottom: '0.35rem',
                  }}
                >
                  <span>CRC INTEGRITY GUARANTEE</span>
                  <span style={{ color: '#CBD5E1' }}>&bull;</span>
                  <span style={{ color: '#64748B' }}>REAL LOGISTICS</span>
                </div>

                <h4
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#0A0A09',
                    margin: '0 0 0.35rem 0',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Truth-in-Equipment Commitment
                </h4>

                <p
                  style={{
                    fontSize: '0.92rem',
                    color: '#475569',
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: '620px',
                  }}
                >
                  No fabricated live inventory counts or synthetic urgency timers. Every quote is grounded in verified rail availability, authentic interchange routes, and mechanical inspection sign-off.
                </p>
              </div>
            </div>

            {/* Equal-Sized Action Buttons */}
            <div className="commitment-card-actions">
              <Link to="/quote" className="btn btn-primary commitment-btn">
                <FileText size={16} />
                Initiate Quote Inquiry
              </Link>
              <Link to="/book-a-call" className="btn btn-secondary commitment-btn">
                <PhoneCall size={16} />
                Schedule a Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F: ABOUT CRC PREVIEW
          ========================================================================= */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div
            className="roots-preview-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left: Historic Photograph */}
            <div className="roots-preview-card">
              <div
                className="card"
                style={{
                  padding: '0.85rem',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div style={{ overflow: 'hidden', borderRadius: '10px' }}>
                  <img
                    src="/images/historic-milwaukee-967.png"
                    alt="Milwaukee Road 967 Locomotive with cab window herald"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                    }}
                    className="locomotive-img"
                  />
                </div>
                <div
                  style={{
                    padding: '1.15rem 0.75rem 0.4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <span style={{ fontWeight: 700, color: '#0A0A09', fontSize: '0.92rem', lineHeight: 1.3 }}>
                      Milwaukee Road #967
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      Heritage Lineage &bull; Cab Window Herald
                    </span>
                  </div>
                  <span className="badge badge-amber" style={{ flexShrink: 0 }}>
                    CRC Identity
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Text Preview */}
            <div className="roots-preview-text">
              <span className="eyebrow">Railroad Roots</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '1.5rem', lineHeight: 1.25 }}>
                Founded on Railroad Craft &amp; Practical Industrial Service
              </h2>
              <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                The visual identity of Coast Road Capital is rooted in American railroad history—drawing design inspiration from the historic Seaboard Coast Line’s bold speed lettering and the iconic herald of the Milwaukee Road.
              </p>
              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                In business practice, we carry forward that same dedication to dependable rail transport. We do not over-promise or show unverified inventory badges. Instead, we provide honest equipment expertise, clear communication, and tailored railcar leasing solutions.
              </p>
              <Link to="/about" className="btn btn-primary">
                Read Our Company Story
                <ChevronRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION G: CLOSING INQUIRY CTA
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#EDE6D4',
          padding: '6rem 0',
          position: 'relative',
          borderTop: '3px solid #AA2E1F',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                backgroundColor: 'rgba(170, 46, 31, 0.22)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                color: '#FFFFFF',
                padding: '0.45rem 1.15rem',
                borderRadius: '30px',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
                boxShadow: '0 2px 10px rgba(170, 46, 31, 0.15)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  boxShadow: '0 0 8px #EF4444',
                  display: 'inline-block',
                }}
              />
              Connect With Coast Road Capital
            </span>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
                color: '#FFFFFF',
                marginBottom: '1.25rem',
                lineHeight: 1.2,
              }}
            >
              Ready to Discuss Your Railcar Requirements?
            </h2>
            <p
              style={{
                color: '#94A3B8',
                fontSize: '1.15rem',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
              }}
            >
              Submit a formal quote request or schedule a one-on-one consultation with our equipment team to review availability, specifications, and lease structures.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <Link to="/quote" className="btn btn-primary btn-lg">
                <FileText size={18} />
                Request a Quote
              </Link>
              <Link to="/book-a-call" className="btn btn-secondary btn-lg">
                <PhoneCall size={18} />
                Book Consultation Call
              </Link>
              <Link to="/contact" className="btn btn-outline-white btn-lg">
                Contact CRC Directly
              </Link>
            </div>

            <div style={{ marginTop: '3.5rem', maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto' }}>
              <TrackMotif dark />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .locomotive-img:hover {
          transform: scale(1.03);
        }
        .pillar-card-img:hover {
          transform: scale(1.04);
        }
        .category-spec-link:hover {
          color: #AA2E1F !important;
        }
        .commitment-card {
          position: relative;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2.25rem 2.5rem;
          box-shadow: 0 8px 30px -4px rgba(15, 23, 42, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2.5rem;
          overflow: hidden;
        }
        .commitment-card-actions {
          display: flex;
          gap: 0.85rem;
          align-items: center;
          flex-shrink: 0;
        }
        .commitment-btn {
          width: 210px !important;
          height: 46px !important;
          padding: 0 1rem !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 0.92rem !important;
          font-weight: 600 !important;
          gap: 0.55rem !important;
          border-radius: 8px !important;
          box-sizing: border-box !important;
          text-align: center !important;
          white-space: nowrap !important;
        }
        @media (max-width: 960px) {
          .desktop-only {
            display: none !important;
          }
          .commitment-card {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 1.75rem !important;
            padding: 1.75rem 1.5rem !important;
          }
          .commitment-card-actions {
            width: 100% !important;
            flex-direction: column !important;
          }
          .commitment-btn {
            width: 100% !important;
          }
          .roots-preview-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 2.25rem !important;
          }
          .roots-preview-text {
            order: 1 !important;
          }
          .roots-preview-card {
            order: 2 !important;
          }
        }
      `}</style>
    </div>
  );
};

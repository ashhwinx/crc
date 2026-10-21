import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, Compass, FileText, PhoneCall, History } from 'lucide-react';
import { TrackMotif } from '../components/common/TrackMotif';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '5.5rem 0 4.5rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/images/railroad-hero-yard.jpg')`,
            backgroundPosition: 'center 30%',
            backgroundSize: 'cover',
            opacity: 0.22,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-amber" style={{ marginBottom: '1.25rem' }}>
              <History size={14} style={{ color: '#D97706' }} />
              About Coast Road Capital
            </span>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                color: '#FFFFFF',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.5rem',
              }}
            >
              Railroad Grounding. <br />
              <span style={{ color: '#F87171' }}>Industrial Focus.</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#CBD5E1', lineHeight: 1.7, maxWidth: '720px' }}>
              Coast Road Capital is dedicated to simplifying freight railcar leasing and equipment sourcing for industrial shippers, manufacturers, and logistics operators across North America.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview & Mission */}
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
            <div>
              <span className="eyebrow">Company Overview</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '1.5rem', lineHeight: 1.25 }}>
                Bridging Equipment Demand With Operational Rail Reality
              </h2>
              <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Rail transportation remains the most fuel-efficient, dependable method for transporting heavy industrial, agricultural, and manufactured bulk freight across the continent. Yet acquiring the proper rail equipment can often feel opaque and rigid.
              </p>
              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                Coast Road Capital was established to deliver straightforward railcar equipment leasing. We focus on providing accurate car specifications, flexible leasing frameworks, and attentive customer service so your operations stay fluid.
              </p>
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderLeft: '4px solid #AA2E1F',
                  padding: '1.35rem 1.65rem',
                  borderRadius: '0 10px 10px 0',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <h4 style={{ fontSize: '1.1rem', color: '#0A0A09', fontWeight: 700, marginBottom: '0.45rem' }}>
                  Our Operating Principle
                </h4>
                <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: 1.65, margin: 0 }}>
                  We believe industrial customers deserve honest equipment data, clear terms, and direct consultation without bloated promises or unverified availability.
                </p>
              </div>
            </div>

            <div>
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
                    src="/images/historic-scl-1637.png"
                    alt="Seaboard Coast Line GP40-2 1637 Locomotive"
                    style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease' }}
                    className="about-loco-img"
                  />
                </div>
                <div
                  style={{
                    padding: '1.1rem 0.75rem 0.4rem',
                    fontSize: '0.82rem',
                    color: '#64748B',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#0A0A09' }}>SCL Speed Lettering Heritage</span>
                  <span className="badge badge-red">CRC Identity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Focus & Leasing Approach */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Equipment Strategy</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '1rem' }}>
              Our Approach to Railcar Leasing
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7 }}>
              We structure railcar agreements around the commercial, physical, and financial needs of our industrial clients.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.25rem',
            }}
          >
            <div className="card hover-lift" style={{ padding: '2.5rem 2rem', borderTop: '4px solid #0A0A09', borderRadius: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'var(--color-cream-light)',
                  color: '#0A0A09',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                }}
              >
                <Target size={24} />
              </div>
              <span className="badge badge-dark" style={{ marginBottom: '0.65rem', fontSize: '0.72rem' }}>
                INFRASTRUCTURE MATCH
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.75rem' }}>
                Operational Trackage Compatibility
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                Every terminal facility has unique clearance envelopes, dock heights, crane setups, and discharge hoppers. We evaluate your trackage to ensure equipment compatibility.
              </p>
              <div style={{ fontSize: '0.82rem', color: '#AA2E1F', fontWeight: 600 }}>
                &bull; Clearance &bull; Weight Rating &bull; Turn Radius
              </div>
            </div>

            <div className="card hover-lift" style={{ padding: '2.5rem 2rem', borderTop: '4px solid #AA2E1F', borderRadius: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#FDF3F2',
                  color: '#AA2E1F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                }}
              >
                <Shield size={24} />
              </div>
              <span className="badge badge-red" style={{ marginBottom: '0.65rem', fontSize: '0.72rem' }}>
                CAPITAL FLEXIBILITY
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.75rem' }}>
                Adaptive Commercial Terms
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                From short-term project leases and seasonal surges to multi-year capital commitments, we assist in establishing agreements that balance capital outlay and operational risk.
              </p>
              <div style={{ fontSize: '0.82rem', color: '#AA2E1F', fontWeight: 600 }}>
                &bull; Full-Service &bull; Net Lease &bull; Surge Reserves
              </div>
            </div>

            <div className="card hover-lift" style={{ padding: '2.5rem 2rem', borderTop: '4px solid #059669', borderRadius: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                }}
              >
                <Compass size={24} />
              </div>
              <span className="badge badge-emerald" style={{ marginBottom: '0.65rem', fontSize: '0.72rem' }}>
                SAFETY & COMPLIANCE
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.75rem' }}>
                AAR &amp; DOT Mechanical Standards
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                Our sourcing evaluations adhere strictly to Association of American Railroads (AAR) and Department of Transportation (DOT) safety and maintenance guidelines.
              </p>
              <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
                &bull; FRA Part 215 &bull; Wheel Profile &bull; Tank Vetting
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Infrastructure & Transloading Showcase (Client Photos) */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-amber" style={{ marginBottom: '1rem' }}>
              Site &amp; Siding Operations
            </span>
            <h2 style={{ color: '#0A0A09', marginBottom: '1rem' }}>
              Transloading Facilities &amp; Track Infrastructure
            </h2>
            <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.7 }}>
              Bridging mainline rail carriers and private industrial sidings requires direct expertise in track clearance, transloading yards, and physical car placement.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {/* Real Client Photo 1: Site Selection & Transloading */}
            <div className="card hover-lift" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/transloading-site.jpg"
                  alt="Railcar transloading facility and bulk cargo siding"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="about-loco-img"
                />
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
                  FIELD OPERATIONS
                </div>
              </div>
              <div style={{ padding: '1.75rem' }}>
                <span className="badge badge-dark" style={{ marginBottom: '0.65rem', fontSize: '0.72rem' }}>
                  TRANSLOAD LOGISTICS
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                  Site Selection &amp; Transload Evaluation
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  Assisting shippers in evaluating transload points, truck-to-rail transfer yards, and track layouts designed for bulk and manifest freight throughput.
                </p>
              </div>
            </div>

            {/* Real Client Photo 2: Track Construction & Infrastructure */}
            <div className="card hover-lift" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/track-construction-1.jpg"
                  alt="Railroad track construction and maintenance engineering"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="about-loco-img"
                />
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
                  TRACKAGE & SIDING
                </div>
              </div>
              <div style={{ padding: '1.75rem' }}>
                <span className="badge badge-dark" style={{ marginBottom: '0.65rem', fontSize: '0.72rem' }}>
                  TRACK ENGINEERING
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                  Siding Layout &amp; Track Assessment
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  Verifying track curvature, weight capacity (263k vs 286k GRL), and switch turnout compatibility before dispatching railcar sets to your facility.
                </p>
              </div>
            </div>

            {/* Real Client Photo 3: Track Maintenance & Infrastructure */}
            <div className="card hover-lift" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/track-maintenance.jpg"
                  alt="Railroad track maintenance, ties, and turnout engineering"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="about-loco-img"
                />
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
                  TRACKAGE MAINTENANCE
                </div>
              </div>
              <div style={{ padding: '1.75rem' }}>
                <span className="badge badge-amber" style={{ marginBottom: '0.65rem', fontSize: '0.72rem' }}>
                  CORRIDOR RELIABILITY
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                  Track Maintenance &amp; Turnout Clearance
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  Continuous evaluation of switch points, rail joint integrity, and industrial spur ballasting to guarantee safe car movement and zero siding derailment risks.
                </p>
              </div>
            </div>

            {/* Real Client Photo 4: Railcar Operations & Fleet Overview */}
            <div className="card hover-lift" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/railcar-leasing-overview.webp"
                  alt="Industrial railcar leasing yard and fleet operations"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="about-loco-img"
                />
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
                  FLEET SOURCING
                </div>
              </div>
              <div style={{ padding: '1.75rem' }}>
                <span className="badge badge-red" style={{ marginBottom: '0.65rem', fontSize: '0.72rem' }}>
                  LEASING ALLOCATION
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                  Active Railcar Deployment
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  Coordinating dedicated equipment groups, seasonal surge sets, and long-term lease allocations across North America’s rail interchange network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Railroad Heritage & Brand Identity Section */}
      <section className="section section-dark">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  backgroundColor: '#1E293B',
                  padding: '0.85rem',
                  borderRadius: '16px',
                  border: '1px solid #334155',
                }}
              >
                <div style={{ overflow: 'hidden', borderRadius: '10px' }}>
                  <img
                    src="/images/historic-milwaukee-967.png"
                    alt="Historic Milwaukee Road Locomotive 967"
                    style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease' }}
                    className="about-loco-img"
                  />
                </div>
                <div
                  style={{
                    padding: '1.1rem 0.75rem 0.4rem',
                    fontSize: '0.82rem',
                    color: '#94A3B8',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#E2E8F0' }}>Milwaukee Road Cab Herald Inspiration</span>
                  <span className="badge badge-amber">CRC Logo Roots</span>
                </div>
              </div>
            </div>

            <div>
              <span className="badge badge-red" style={{ marginBottom: '1.25rem' }}>
                Design Origins &amp; Heritage
              </span>
              <h2 style={{ color: '#FFFFFF', marginBottom: '1.5rem', lineHeight: 1.25 }}>
                Inspired by Two Great American Railroads
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>
                The Coast Road Capital brand identity and visual language pay homage to the rich visual history of North American railroading. Our branding draws distinct lineage from two legendary namesake carriers:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#1E293B',
                    borderRadius: '10px',
                    borderLeft: '4px solid #AA2E1F',
                  }}
                >
                  <strong style={{ color: '#FFFFFF', fontSize: '1.05rem', display: 'block', marginBottom: '0.35rem' }}>
                    Seaboard Coast Line (SCL) "Speed Lettering"
                  </strong>
                  <span style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    Influencing our bold typography, reflecting forward momentum, dependability, and industrial precision.
                  </span>
                </div>

                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#1E293B',
                    borderRadius: '10px',
                    borderLeft: '4px solid #D97706',
                  }}
                >
                  <strong style={{ color: '#FFFFFF', fontSize: '1.05rem', display: 'block', marginBottom: '0.35rem' }}>
                    The Milwaukee Road Herald
                  </strong>
                  <span style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    The angular red and black diamond badge geometry of the original CRC logo draws inspiration from the cab herald of the Chicago, Milwaukee, St. Paul and Pacific.
                  </span>
                </div>
              </div>

              <div style={{ maxWidth: '320px' }}>
                <TrackMotif dark />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section section-white" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Start the Conversation</span>
          <h2 style={{ color: '#0A0A09', marginBottom: '1.25rem' }}>
            Work With Coast Road Capital
          </h2>
          <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.7, marginBottom: '2.25rem' }}>
            Let us know your car requirements, delivery timeframe, and route details. Our leasing specialists will review current market options.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/quote" className="btn btn-primary btn-lg">
              <FileText size={18} />
              Submit Quote Inquiry
            </Link>
            <Link to="/book-a-call" className="btn btn-secondary btn-lg">
              <PhoneCall size={18} />
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .about-loco-img:hover {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
};

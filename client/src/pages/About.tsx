import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, Compass, FileText, PhoneCall } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '4.5rem 0 3.5rem',
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
          <div style={{ maxWidth: '720px' }}>
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)',
                color: '#FFFFFF',
                fontWeight: 800,
                lineHeight: 1.18,
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem',
              }}
            >
              About Coast Road Capital
            </h1>
            <p style={{ fontSize: '1.12rem', color: '#CBD5E1', lineHeight: 1.7, maxWidth: '640px' }}>
              Simplifying freight railcar leasing and equipment sourcing for industrial shippers, manufacturers, and logistics operators across North America.
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
              gap: '4rem',
              alignItems: 'start',
            }}
          >
            <div>
        
              <h2 style={{ color: '#0A0A09', marginBottom: '1.5rem', lineHeight: 1.25 }}>
                Bridging Equipment Demand With Operational Reality
              </h2>
              <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Rail transportation remains the most fuel-efficient, dependable method for transporting heavy industrial, agricultural, and manufactured bulk freight across the continent. Yet acquiring the proper rail equipment can often feel opaque and rigid.
              </p>
              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                Coast Road Capital was established to deliver straightforward railcar equipment leasing. We focus on providing accurate car specifications, flexible leasing frameworks, and attentive customer service so your operations stay fluid.
              </p>

              {/* Simple & Basic Operating Principle */}
              <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#0A0A09', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Our Operating Principle
                </h3>
                <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.7, margin: 0 }}>
                  We believe industrial customers deserve honest equipment data, clear terms, and direct consultation without bloated promises or unverified availability.
                </p>
              </div>
            </div>

            <div>
              <div
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px -2px rgba(15,23,42,0.08)',
                }}
              >
                <img
                  src="/images/railcar-operations.webp"
                  alt="Railcar fleet operations and yard logistics"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Focus & Leasing Approach */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Our Approach</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
              How We Structure Railcar Leasing
            </h2>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7 }}>
              We build leasing agreements around the commercial, physical, and financial needs of each industrial client.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
            }}
            className="approach-grid"
          >
            <div style={{ padding: '2rem 1.75rem', borderTop: '3px solid #AA2E1F', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderTopColor: '#AA2E1F', borderTopWidth: '3px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#FDF3F2',
                  color: '#AA2E1F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                }}
              >
                <Target size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                Track & Facility Compatibility
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                We evaluate your terminal clearances, dock heights, and discharge systems to ensure every car we source physically fits your operation.
              </p>
            </div>

            <div style={{ padding: '2rem 1.75rem', borderTop: '3px solid #0A0A09', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderTopColor: '#0A0A09', borderTopWidth: '3px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#F1F5F9',
                  color: '#0A0A09',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                }}
              >
                <Shield size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                Flexible Lease Structures
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                From short-term project leases and seasonal surges to multi-year commitments — full-service or net lease, we tailor terms to balance your cost and risk.
              </p>
            </div>

            <div style={{ padding: '2rem 1.75rem', borderTop: '3px solid #D97706', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderTopColor: '#D97706', borderTopWidth: '3px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                }}
              >
                <Compass size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                AAR & DOT Compliance
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                Our sourcing adheres strictly to Association of American Railroads and DOT safety and maintenance guidelines for every car type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Infrastructure & Transloading — 2-column grid (no orphans) */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Operations</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
              Site & Siding Infrastructure
            </h2>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7 }}>
              Bridging mainline carriers and private industrial sidings with direct expertise in track clearance, transloading, and car placement.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2rem',
            }}
            className="infra-grid"
          >
            {/* Card 1 */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img
                  src="/images/transloading-site.jpg"
                  alt="Railcar transloading facility"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                  Transload Site Evaluation
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Evaluating transfer yards, truck-to-rail points, and track layouts for bulk and manifest freight operations.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img
                  src="/images/track-construction-1.jpg"
                  alt="Railroad track construction"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                  Siding & Track Assessment
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Verifying track curvature, weight capacity (263k vs 286k GRL), and switch turnout compatibility before dispatching cars.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img
                  src="/images/track-maintenance.jpg"
                  alt="Railroad track maintenance"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                  Track Maintenance & Safety
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Evaluating switch points, rail joint integrity, and ballasting to ensure safe car movement on your siding.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img
                  src="/images/railcar-leasing-overview.webp"
                  alt="Industrial railcar fleet"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.5rem' }}>
                  Fleet Deployment
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Coordinating dedicated car sets, seasonal reserves, and long-term allocations across North America's rail network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section" style={{ textAlign: 'center', backgroundColor: '#0A0A09', padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 style={{ color: '#FFFFFF', marginBottom: '1rem', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
            Ready to Work With Us?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Tell us your car requirements, delivery timeframe, and route details. Our leasing team will review current market options.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem' }}>
            <Link to="/quote" className="btn btn-primary">
              <FileText size={17} />
              Request a Quote
            </Link>
            <Link to="/contact?tab=booking" className="btn btn-outline-white">
              <PhoneCall size={17} />
              Book a Call
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .approach-grid {
            grid-template-columns: 1fr !important;
          }
          .infra-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

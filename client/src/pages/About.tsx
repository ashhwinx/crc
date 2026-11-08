import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, PhoneCall } from 'lucide-react';
import { IconRulerMeasure, IconScale, IconCertificate } from '@tabler/icons-react';

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
                opacity: 0.3,
              }}
            />
          </picture>
        </div>
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

              {/* Operating Principle & Values Link */}
              <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#0A0A09', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Our Operating Principle
                </h3>
                <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                  We believe industrial customers deserve honest equipment data, clear terms, and direct consultation without bloated promises or unverified availability.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                  <Link
                    to="/company-values"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#AA2E1F',
                      textDecoration: 'none',
                    }}
                  >
                    View Our Company Values &amp; Standards &rarr;
                  </Link>
                  <Link
                    to="/faq"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#475569',
                      textDecoration: 'none',
                    }}
                  >
                    Frequently Asked Questions &rarr;
                  </Link>
                </div>
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
                  src="/images/Trains serving industries-additional railcar images/DSC06309 (1).jpg"
                  alt="Railcar fleet haulage and mainline interchange"
                  width={600}
                  height={340}
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

          <div className="approach-grid">
            {/* Card 1: Track & Facility Compatibility */}
            <div className="approach-card">
              <div className="approach-card-header">
                <div className="approach-icon-wrap">
                  <IconRulerMeasure size={30} stroke={1.6} />
                </div>
                <span className="approach-tag">01 / FACILITY FIT</span>
              </div>
              <h3 className="approach-title">
                Track &amp; Facility Compatibility
              </h3>
              <p className="approach-desc">
                We evaluate your terminal clearances, dock heights, switch curvature, and discharge systems to ensure every car sourced physically integrates with your plant.
              </p>
              <div className="approach-specs">
                <span className="approach-spec-item">Plate B/C/F Clearances</span>
                <span className="approach-spec-item">263k vs 286k GRL Verification</span>
                <span className="approach-spec-item">Discharge Gate Alignment</span>
              </div>
            </div>

            {/* Card 2: Flexible Lease Structures */}
            <div className="approach-card">
              <div className="approach-card-header">
                <div className="approach-icon-wrap">
                  <IconScale size={30} stroke={1.6} />
                </div>
                <span className="approach-tag">02 / CAPITAL TERMS</span>
              </div>
              <h3 className="approach-title">
                Flexible Lease Structures
              </h3>
              <p className="approach-desc">
                From seasonal project surge leases to multi-year master commitments — full-service turnkey maintenance or shipper-managed net leases to balance cash flow and risk.
              </p>
              <div className="approach-specs">
                <span className="approach-spec-item">Full-Service &amp; Net Structures</span>
                <span className="approach-spec-item">3 Mo to 5+ Yr Commitments</span>
                <span className="approach-spec-item">Sale-Leaseback Options</span>
              </div>
            </div>

            {/* Card 3: AAR & DOT Compliance */}
            <div className="approach-card">
              <div className="approach-card-header">
                <div className="approach-icon-wrap">
                  <IconCertificate size={30} stroke={1.6} />
                </div>
                <span className="approach-tag">03 / COMPLIANCE</span>
              </div>
              <h3 className="approach-title">
                AAR &amp; DOT Compliance
              </h3>
              <p className="approach-desc">
                All car sets undergo strict Association of American Railroads Rule 88 mechanical qualification and FRA safety inspection before delivery to interchange tracks.
              </p>
              <div className="approach-specs">
                <span className="approach-spec-item">AAR Rule 88 Mechanical Review</span>
                <span className="approach-spec-item">FRA 49 CFR Safety Appliances</span>
                <span className="approach-spec-item">Full Umler &amp; OT-5 Authority</span>
              </div>
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
                  src="/images/Trains serving industries-additional railcar images/DSC09750(1).jpg"
                  alt="Locomotive switching cars on industrial siding turnout"
                  width={400}
                  height={220}
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
                  src="/images/Trains serving industries-additional railcar images/16424.jpg"
                  alt="Rail delivery to industrial processing facility"
                  width={400}
                  height={220}
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
                  src="/images/Trains serving industries-additional railcar images/16410.jpg"
                  alt="Track maintenance and siding inspection with railcar staging"
                  width={400}
                  height={220}
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
                  src="/images/Trains serving industries-additional railcar images/16397.jpg"
                  alt="High-cube boxcar deployed on industrial freight corridor"
                  width={400}
                  height={220}
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
        .approach-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .approach-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 4px;
          padding: 1.75rem 1.6rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
          position: relative;
        }

        .approach-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.08);
          border-color: #CBD5E1;
        }

        .approach-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.15rem;
        }

        .approach-icon-wrap {
          color: #AA2E1F;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .approach-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: #94A3B8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .approach-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #0A0A09;
          margin: 0 0 0.65rem 0;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .approach-desc {
          color: #64748B;
          font-size: 0.88rem;
          line-height: 1.6;
          margin: 0 0 1.25rem 0;
          flex-grow: 1;
        }

        .approach-specs {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-top: 1rem;
          border-top: 1px dashed #E2E8F0;
        }

        .approach-spec-item {
          font-size: 0.78rem;
          color: #475569;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .approach-spec-item::before {
          content: '·';
          color: #AA2E1F;
          font-size: 1.3rem;
          line-height: 0;
          font-weight: 900;
        }

        @media (max-width: 900px) {
          .approach-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.25rem !important;
          }
        }

        @media (max-width: 640px) {
          .approach-grid {
            grid-template-columns: 1fr !important;
          }
          .approach-card {
            padding: 1.35rem 1.2rem !important;
          }
          .infra-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

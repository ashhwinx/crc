import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Scale,
  Zap,
  Handshake,
  Leaf,
  Clock,
  ArrowRight,
  FileText,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  Award,
} from 'lucide-react';
import {
  IconRulerMeasure,
  IconRoute,
  IconCertificate,
  IconShieldCheck,
  IconPhone,
} from '@tabler/icons-react';

export const CompanyValues: React.FC = () => {
  // Update document title and canonical tag for SEO
  useEffect(() => {
    document.title = 'Company Values & Operating Principles | Coast Road Capital';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore Coast Road Capital\'s company values: mechanical rigor, transparent commercial leasing, shipper partnership, environmental stewardship, and fleet safety.'
      );
    }
  }, []);

  const values = [
    {
      id: 'safety',
      number: '01',
      icon: ShieldCheck,
      title: 'Safety',
      text: 'Rail safety protects cargo, crew, and community. Every car undergoes thorough mechanical qualification and pre-trip inspection before interchange.',
      statLine: 'AAR Rule 88 · FRA 49 CFR · Pre-trip inspection',
    },
    {
      id: 'clear-deals',
      number: '02',
      icon: Scale,
      title: 'Clear Deals',
      text: 'Predictable capital budgeting with transparent commercial ledgers, itemized maintenance scopes, verified car availability, and zero hidden per-diem fees.',
      statLine: 'Line-item maintenance scope · No hidden per-diem fees',
    },
    {
      id: 'flexibility',
      number: '03',
      icon: Zap,
      title: 'Flexibility',
      text: 'Lease structures engineered around your specific production and harvest cycles, with tailored terms from seasonal surge to multi-year master leases.',
      statLine: '3–12 mo · 1–3 yr · 3–5+ yr terms',
    },
    {
      id: 'partnership',
      number: '04',
      icon: Handshake,
      title: 'Partnership',
      text: 'We partner directly with plant managers and Class I railroads across North America to ensure seamless interchange routing and active fleet execution.',
      statLine: '6 Class I railroads · US, Canada & Mexico',
    },
    {
      id: 'environment',
      number: '05',
      icon: Leaf,
      title: 'Environment',
      text: 'Moving freight from highway to rail cuts fuel use and emissions on every load, which helps shippers meet their sustainability targets.',
      statLine: '~500 mi per ton per gallon · Up to 75% fewer emissions · 3–4 trucks per car',
    },
    {
      id: 'response',
      number: '06',
      icon: Clock,
      title: 'Response',
      text: 'In heavy manufacturing, delayed cars cause production shutdowns. Our Houston desk responds promptly with direct specialist access when minutes matter.',
      statLine: '24-hour quote turnaround · Direct line to a specialist',
    },
  ];

  return (
    <div className="company-values-page">
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '5rem 0 4.5rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/images/hero/DSC_0004.jpg')`,
            backgroundPosition: 'center 38%',
            backgroundSize: 'cover',
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,9,0.7) 0%, rgba(10,10,9,0.95) 100%)',
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
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px' }}>
            
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 3.5rem)',
                color: '#FFFFFF',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: '1.25rem',
              }}
            >
              Our Company Values &amp; Operating Principles
            </h1>
            <p
              style={{
                fontSize: '1.15rem',
                color: '#CBD5E1',
                lineHeight: 1.75,
                maxWidth: '680px',
                marginBottom: '2rem',
              }}
            >
              At Coast Road Capital, our values are not generic boardroom slogans. They are the operational standards that govern every railcar lease, mechanical verification, and shipper relationship we manage.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link to="/railcar-leasing" className="btn btn-primary btn-lg">
                <FileText size={18} />
                Explore Railcar Fleet
              </Link>
              <Link to="/about" className="btn btn-outline-white btn-lg">
                About Our Company
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXECUTIVE PHILOSOPHY CALLOUT
          ========================================================================= */}
      {/* =========================================================================
          EXECUTIVE PHILOSOPHY CALLOUT (The Coast Road Capital Promise)
          ========================================================================= */}
      <section className="section promise-section" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div className="promise-card">
            <div className="promise-card-grid">
              {/* Left Column: Executive Quote & Identity */}
              <div className="promise-quote-col">
                <div>
                  <span className="promise-eyebrow">
                    The Coast Road Capital Promise
                  </span>
                  <blockquote className="promise-quote-text">
                    &ldquo;In freight rail logistics, reliability is not measured by promises &mdash;
                    it is measured by on-track execution, verified car specs, and steadfast communication.&rdquo;
                  </blockquote>
                </div>
                <div className="promise-author-tag">
                  <span>Houston Commercial Equipment Desk &bull; Coast Road Capital</span>
                </div>
              </div>

              {/* Right Column: Operational Commitment & Guarantees */}
              <div className="promise-detail-col">
                <div>
                  <h2 className="promise-detail-heading">Our Operational Commitment</h2>
                  <p className="promise-detail-text">
                    Industrial shippers face razor-thin plant operating margins and tight delivery windows.
                    Our commitment is simple: provide vetted railcars that fit your facility clearance,
                    deliver them on schedule, and stand behind every lease structure from start to finish.
                  </p>

                  {/* Clean, authentic spec commitments */}
                  <div className="promise-checklist">
                    <div className="promise-check-item">
                      <div className="promise-check-icon-wrap">
                        <IconRulerMeasure size={16} stroke={1.75} />
                      </div>
                      <div className="promise-check-content">
                        <strong>100% Siding Clearance Match</strong>
                        <span>Plate B/C/F &amp; gross weight verified before switch delivery</span>
                      </div>
                    </div>

                    <div className="promise-check-item">
                      <div className="promise-check-icon-wrap">
                        <IconRoute size={16} stroke={1.75} />
                      </div>
                      <div className="promise-check-content">
                        <strong>On-Schedule Class I Interchange</strong>
                        <span>Real-time route tracking across all 6 North American carriers</span>
                      </div>
                    </div>

                    <div className="promise-check-item">
                      <div className="promise-check-icon-wrap">
                        <IconCertificate size={16} stroke={1.75} />
                      </div>
                      <div className="promise-check-content">
                        <strong>Transparent Lease Framework</strong>
                        <span>Clear maintenance scopes with zero hidden per-diem fees</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desk Verification Footer */}
                <div className="promise-col-footer">
                  <div className="promise-spec-badge">
                    <IconShieldCheck size={16} stroke={1.75} style={{ color: '#AA2E1F' }} />
                    <span>AAR Rule 88 &amp; FRA Compliant Fleet</span>
                  </div>
                  <a href="tel:+18325551200" className="promise-phone-btn">
                    <IconPhone size={14} stroke={1.75} />
                    <span>Direct Desk: (832) 555-1200</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CORE VALUES GRID (Redesigned per Client Sketch: No Boxes, Large Icon, Stat Line)
          ========================================================================= */}
      <section className="section section-subtle values-sketch-section" style={{ borderBottom: '1px solid #E2E8F0', padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Six Core Pillars</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
              How Our Values Power Your Supply Chain
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Every car placement, rate negotiation, and customer touchpoint is guided by these six foundational standards.
            </p>
          </div>

          <div className="values-sketch-grid">
            {values.map((v, vIdx) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.id}
                  className="value-pillar-item"
                  style={{ animationDelay: `${vIdx * 90}ms` }}
                >
                  {/* Number Eyebrow */}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#AA2E1F',
                      letterSpacing: '0.08em',
                      marginBottom: '0.85rem',
                      display: 'block',
                    }}
                  >
                    {v.number}
                  </span>

                  {/* 1. Large Lead Icon: 64–80px, brand red line icon, no box or pill behind it */}
                  <div
                    style={{
                      color: '#AA2E1F',
                      marginBottom: '1.35rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '74px',
                    }}
                  >
                    <Icon size={70} strokeWidth={1.5} />
                  </div>

                  {/* 2. Short Title: One or two words */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: '#0A0A09',
                      margin: '0 0 0.85rem 0',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {v.title}
                  </h3>

                  {/* 3. Text: Tight 2-3 lines description, why it matters to the shipper */}
                  <p
                    style={{
                      fontSize: '0.94rem',
                      color: '#475569',
                      lineHeight: 1.65,
                      margin: '0 0 1.5rem 0',
                      maxWidth: '340px',
                      flex: 1,
                    }}
                  >
                    {v.text}
                  </p>

                  {/* 4. Stat Line: Larger and bolder than text, with divider dots */}
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      color: '#0A0A09',
                      lineHeight: 1.5,
                      letterSpacing: '-0.01em',
                      paddingTop: '1.15rem',
                      borderTop: '1px solid #E2E8F0',
                      width: '100%',
                      maxWidth: '320px',
                    }}
                  >
                    {v.statLine}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          VALUES IN ACTION: QUANTIFIABLE METRICS
          ========================================================================= */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="eyebrow">Field-Tested Standards</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '1.15rem' }}>
                How Our Standards Work on the Active Rail Line
              </h2>
              <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Rail equipment isn't leased in an abstract boardroom. It is operated on physical plant sidings and tight delivery windows. Here is how our Houston team maintains operational discipline every day.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <TrendingUp size={16} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 600 }}>
                    Active interchange routing across all 6 Class I carriers
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <ShieldCheck size={16} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 600 }}>
                    Pre-trip mechanical inspection prior to siding switch
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Award size={16} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 600 }}>
                    Transparent lease terms with no hidden per-diem fees
                  </span>
                </div>
              </div>
            </div>

            <div className="standards-grid">
              {/* Card 1 */}
              <div className="standard-card">
                <div className="standard-card-header">
                  <div className="standard-icon-wrap">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="standard-metric-pill">Rule 88 Standard</span>
                </div>
                <h3 className="standard-title">Pre-Trip Mechanical Vetting</h3>
                <p className="standard-desc">
                  Wheelset flange depth, draft gear travel, and brake systems are physically gauged in the yard before interchange release.
                </p>
              </div>

              {/* Card 2 */}
              <div className="standard-card">
                <div className="standard-card-header">
                  <div className="standard-icon-wrap">
                    <PhoneCall size={16} />
                  </div>
                  <span className="standard-metric-pill">&lt; 2 Hr Response</span>
                </div>
                <h3 className="standard-title">Direct Specialist Desk</h3>
                <p className="standard-desc">
                  Direct phone access to Houston equipment professionals who know track geometry and mechanical codes — zero automated queues.
                </p>
              </div>

              {/* Card 3 */}
              <div className="standard-card">
                <div className="standard-card-header">
                  <div className="standard-icon-wrap">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="standard-metric-pill">100% Siding Fit</span>
                </div>
                <h3 className="standard-title">Clearance Verification</h3>
                <p className="standard-desc">
                  Plate B/C/F clearance, truck center radius, and 263k/286k gross rail loads verified against plant track blueprints in advance.
                </p>
              </div>

              {/* Card 4 */}
              <div className="standard-card">
                <div className="standard-card-header">
                  <div className="standard-icon-wrap">
                    <Scale size={16} />
                  </div>
                  <span className="standard-metric-pill">Zero Hidden Fees</span>
                </div>
                <h3 className="standard-title">Transparent Line-Item Terms</h3>
                <p className="standard-desc">
                  Predictable monthly lease ledgers with explicit maintenance boundaries, pre-agreed wheel wear terms, and no surprise charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERNAL LINKS & NEXT STEPS
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#FAF9F7',
          padding: '4rem 0',
          borderBottom: '1px solid #E8E5DF',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#0A0A09', marginBottom: '0.65rem' }}>
              Explore How We Can Help Your Operations
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.96rem' }}>
              Continue exploring our equipment catalog, model leasing costs in our interactive calculator, or read our answers to frequently asked questions.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <Link
              to="/railcar-leasing"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                textDecoration: 'none',
                color: '#0A0A09',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
              className="quick-link-card"
            >
              <strong style={{ fontSize: '1.05rem', color: '#AA2E1F', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Railcar Catalog <ArrowRight size={15} />
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Browse specs for Boxcars, Hoppers, Tank Cars, Gondolas, and Flatcars.
              </span>
            </Link>

            <Link
              to="/cost-estimator"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                textDecoration: 'none',
                color: '#0A0A09',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
              className="quick-link-card"
            >
              <strong style={{ fontSize: '1.05rem', color: '#AA2E1F', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Cost Estimator <ArrowRight size={15} />
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Model realistic per-car and fleet lease costs with our interactive tool.
              </span>
            </Link>

            <Link
              to="/faq"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                textDecoration: 'none',
                color: '#0A0A09',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
              className="quick-link-card"
            >
              <strong style={{ fontSize: '1.05rem', color: '#AA2E1F', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Leasing FAQs <ArrowRight size={15} />
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Review full-service vs net lease terms, delivery timelines, and inspections.
              </span>
            </Link>

            <Link
              to="/about"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                textDecoration: 'none',
                color: '#0A0A09',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
              className="quick-link-card"
            >
              <strong style={{ fontSize: '1.05rem', color: '#AA2E1F', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                About Coast Road <ArrowRight size={15} />
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Learn about our heritage, Houston headquarters, and team background.
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLOSING CTA
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '4.5rem 0',
          borderTop: '3px solid #AA2E1F',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: '#FFFFFF', marginBottom: '0.85rem' }}>
              Partner With a Team That Shares Your Standards
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Whether you are replacing expiring leases or expanding siding capacity, we are ready to discuss your railcar requirements.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem' }}>
              <Link to="/quote" className="btn btn-primary btn-lg">
                <FileText size={18} />
                Request a Quote
              </Link>
              <Link to="/contact" className="btn btn-outline-white btn-lg">
                <PhoneCall size={18} />
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* =========================================================================
           Executive Promise Card (Simple, Authentic & Clean - Non-AI Style)
           ========================================================================= */
        .promise-section {
          padding: 4rem 0;
          background-color: #FAF9F7;
        }

        .promise-card {
          max-width: 1040px;
          margin: 0 auto;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .promise-card-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          align-items: stretch;
        }

        .promise-quote-col {
          padding: 2.75rem 2.5rem 2.25rem;
          background: #FAF9F7;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid #E2E8F0;
        }

        .promise-eyebrow {
          display: inline-block;
          color: #AA2E1F;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .promise-quote-text {
          font-family: var(--font-heading);
          font-size: clamp(1.22rem, 2vw, 1.5rem);
          font-weight: 700;
          color: #0A0A09;
          line-height: 1.45;
          letter-spacing: -0.015em;
          margin: 0 0 1.75rem 0;
          padding: 0;
        }

        .promise-author-tag {
          font-size: 0.82rem;
          color: #64748B;
          font-weight: 600;
          line-height: 1.4;
          letter-spacing: 0.01em;
        }

        .promise-detail-col {
          padding: 2.75rem 2.5rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #FFFFFF;
        }

        .promise-detail-heading {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #0A0A09;
          margin: 0 0 0.65rem 0;
          letter-spacing: -0.01em;
        }

        .promise-detail-text {
          color: #475569;
          font-size: 0.92rem;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
        }

        .promise-checklist {
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
          margin-bottom: 1.75rem;
        }

        .promise-check-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .promise-check-icon-wrap {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          background-color: #FAF9F7;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #AA2E1F;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .promise-check-content {
          display: flex;
          flex-direction: column;
          line-height: 1.4;
        }

        .promise-check-content strong {
          font-size: 0.88rem;
          color: #0F172A;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .promise-check-content span {
          font-size: 0.82rem;
          color: #64748B;
          line-height: 1.45;
        }

        .promise-col-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid #F1EFE9;
        }

        .promise-spec-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.78rem;
          color: #64748B;
          font-weight: 600;
        }

        .promise-phone-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #1E293B;
          text-decoration: none;
          padding: 0.4rem 0.8rem;
          background: #FAF9F7;
          border-radius: 4px;
          border: 1px solid #E2E8F0;
          transition: all 150ms ease;
        }

        .promise-phone-btn:hover {
          background: #FFFFFF;
          border-color: #AA2E1F;
          color: #AA2E1F;
        }

        @media (max-width: 860px) {
          .promise-section {
            padding: 2.5rem 0 !important;
          }
          .promise-card-grid {
            grid-template-columns: 1fr !important;
          }
          .promise-quote-col {
            padding: 1.75rem 1.25rem !important;
            border-right: none !important;
            border-bottom: 1px solid #E2E8F0 !important;
          }
          .promise-quote-text {
            font-size: 1.15rem !important;
            line-height: 1.4 !important;
            margin-bottom: 1.25rem !important;
          }
          .promise-detail-col {
            padding: 1.75rem 1.25rem !important;
          }
          .promise-detail-heading {
            font-size: 1.1rem !important;
          }
          .promise-detail-text {
            font-size: 0.88rem !important;
            margin-bottom: 1.25rem !important;
          }
          .promise-checklist {
            gap: 0.85rem !important;
            margin-bottom: 1.5rem !important;
          }
          .promise-col-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          .promise-phone-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 0.45rem 0.75rem !important;
          }
        }

        /* =========================================================================
           Minimalist Standards Cards (Calm, Non-Aggressive, Refined)
           ========================================================================= */
        .standards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .standard-card {
          background-color: #FFFFFF;
          border: 1px solid #E8E5DF;
          border-radius: 10px;
          padding: 1.35rem 1.25rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .standard-card:hover {
          border-color: #CBD5E1;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
        }

        .standard-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }

        .standard-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: #FAF9F7;
          border: 1px solid #EAE6DF;
          color: #AA2E1F;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .standard-metric-pill {
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          color: #334155;
          background: #F1F5F9;
          padding: 0.22rem 0.55rem;
          border-radius: 5px;
          letter-spacing: 0.02em;
        }

        .standard-title {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 0.35rem 0;
          line-height: 1.3;
        }

        .standard-desc {
          font-size: 0.81rem;
          color: #64748B;
          line-height: 1.55;
          margin: 0;
        }

        @media (max-width: 640px) {
          .standards-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .standard-card {
            padding: 1.15rem 1.1rem;
          }
        }

        /* =========================================================================
           Values Grid: Redesigned per Client Sketch (3x2 Grid, Dividers, No Boxes)
           ========================================================================= */
        .values-sketch-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          max-width: 1180px;
          margin: 0 auto;
        }

        .value-pillar-item {
          padding: 3rem 2.25rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          background: transparent;
          animation: valueFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* Thin vertical rules between columns on desktop */
        .value-pillar-item:not(:nth-child(3n)) {
          border-right: 1px solid #E2E8F0;
        }

        /* One thin horizontal rule between row 1 and row 2 */
        .value-pillar-item:nth-child(-n+3) {
          border-bottom: 1px solid #E2E8F0;
        }

        @keyframes valueFadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .value-pillar-item {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        @media (max-width: 991px) {
          .values-sketch-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .value-pillar-item:not(:nth-child(3n)) {
            border-right: none;
          }
          .value-pillar-item:nth-child(-n+3) {
            border-bottom: none;
          }
          .value-pillar-item:not(:nth-child(2n)) {
            border-right: 1px solid #E2E8F0;
          }
          .value-pillar-item:nth-child(-n+4) {
            border-bottom: 1px solid #E2E8F0;
          }
        }

        @media (max-width: 640px) {
          .values-sketch-grid {
            grid-template-columns: 1fr;
          }
          .value-pillar-item {
            border-right: none !important;
            border-bottom: 1px solid #E2E8F0 !important;
            padding: 2.25rem 1rem !important;
          }
          .value-pillar-item:last-child {
            border-bottom: none !important;
          }
        }

        .quick-link-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px -2px rgba(15,23,42,0.08);
          border-color: #CBD5E1 !important;
        }
      `}</style>
    </div>
  );
};

export default CompanyValues;

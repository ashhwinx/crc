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
      icon: ShieldCheck,
      number: '01',
      title: 'Mechanical Rigor & Fleet Safety First',
      summary: 'Adherence to AAR, FRA, and Transport Canada standards is never compromised.',
      description:
        'Rail safety protects cargo, crew, and community. Every boxcar, covered hopper, tank car, and flatcar in our sourcing pool undergoes thorough mechanical inspection, Rule 88 reconditioning checks, and wheelset qualification before delivery to your plant siding.',
      points: [
        'AAR Rule 88 structural & component verification',
        'FRA Title 49 CFR safety appliance compliance',
        'Pre-trip certified inspection reports prior to interchange',
      ],
      badgeColor: '#AA2E1F',
      accentBg: '#FDF2F0',
    },
    {
      id: 'transparency',
      icon: Scale,
      number: '02',
      title: 'Transparent Commercial Deal-Making',
      summary: 'Honest car availability, clear rate ledgers, and zero hidden per-diem fees.',
      description:
        'Too often, rail equipment sourcing is clouded by speculative listings and ambiguous maintenance scopes. We present transparent monthly lease rates, explicit full-service vs. net lease boundaries, and genuine market availability you can take to your board.',
      points: [
        'Line-item maintenance scope documentation',
        'Accurate equipment availability verified directly with fleet owners',
        'Predictable capital budgeting without surprise fees',
      ],
      badgeColor: '#0A0A09',
      accentBg: '#F8FAFC',
    },
    {
      id: 'agility',
      icon: Zap,
      number: '03',
      title: 'Operational Agility & Fleet Flexibility',
      summary: 'Lease structures engineered around your specific production and harvest cycles.',
      description:
        'Industrial supply chains are dynamic. Whether you require a short-term 6-month surge fleet for a seasonal grain harvest or a 5-year master lease for private chemical distribution, we tailor our lease duration, delivery cadence, and car set sizing to your facility.',
      points: [
        'Short-term surge, medium-term (1–3 yr), and long-term commitments',
        'Flexible fleet expansion and staged delivery options',
        'Purchase-leaseback structures to unlock balance sheet capital',
      ],
      badgeColor: '#D97706',
      accentBg: '#FEF3C7',
    },
    {
      id: 'partnership',
      icon: Handshake,
      number: '04',
      title: 'Continental Shipper Partnership',
      summary: 'Acting as an extension of your logistics desk across Class I and short-line railroads.',
      description:
        'We do not view ourselves as an impersonal equipment broker. We partner directly with industrial plant managers, logistics directors, and Class I railroads (BNSF, UP, CSX, NS, CN, CPKC) to ensure seamless interchange routing, OT-5 loading authority, and ongoing fleet performance.',
      points: [
        'Interchange coordination and track routing guidance',
        'Dedicated commercial contact throughout your lease term',
        'Continental reach across United States, Canada, and Mexico',
      ],
      badgeColor: '#2563EB',
      accentBg: '#EFF6FF',
    },
    {
      id: 'stewardship',
      icon: Leaf,
      number: '05',
      title: 'Environmental & Energy Stewardship',
      summary: 'Championing North American rail freight as the cleanest overland transport.',
      description:
        'Railroads move one ton of freight approximately 500 miles on a single gallon of diesel fuel, generating up to 75% fewer greenhouse gas emissions than heavy highway trucking. We actively assist industrial shippers in transitioning freight to rail to meet Scope 1 and Scope 3 ESG targets.',
      points: [
        '~75% lower emissions per ton-mile compared to semi-trucks',
        'Relieving highway congestion and road infrastructure strain',
        'High-density payload optimization reducing total fuel consumed',
      ],
      badgeColor: '#059669',
      accentBg: '#ECFDF5',
    },
    {
      id: 'responsiveness',
      icon: Clock,
      number: '06',
      title: 'Direct Accountability & Rapid Response',
      summary: 'Prompt answers from knowledgeable rail professionals when minutes matter.',
      description:
        'In heavy manufacturing, delayed cars cause production shutdowns. When you request equipment specs, need emergency car replacements, or require mechanical records, our team in Houston responds promptly with decisive, knowledgeable support.',
      points: [
        'Direct phone access to commercial leasing specialists',
        'Rapid 24-hour turnaround on initial quote proposals',
        'Proactive tracking and milestone communication',
      ],
      badgeColor: '#7C3AED',
      accentBg: '#F5F3FF',
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
                  <div className="promise-eyebrow">
                    <span className="promise-dot" />
                    <span>The Coast Road Capital Promise</span>
                  </div>
                  <div className="promise-quote-mark">&ldquo;</div>
                  <blockquote className="promise-quote-text">
                    In freight rail logistics, reliability is not measured by promises &mdash;
                    it is measured by <em>on-track execution</em>, <em>verified car specs</em>,
                    and <em>steadfast communication</em>.
                  </blockquote>
                </div>
                <div className="promise-author-tag">
                  <span className="promise-author-line" />
                  <span>Houston Commercial Equipment Desk</span>
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

                  {/* Clean, unboxed checklist */}
                  <div className="promise-checklist">
                    <div className="promise-check-item">
                      <div className="promise-check-icon-wrap">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="promise-check-content">
                        <strong>100% Siding Clearance Match</strong>
                        <span>Plate B/C/F &amp; gross weight verified before switch delivery</span>
                      </div>
                    </div>

                    <div className="promise-check-item">
                      <div className="promise-check-icon-wrap">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="promise-check-content">
                        <strong>On-Schedule Class I Interchange</strong>
                        <span>Real-time route tracking across all 6 North American carriers</span>
                      </div>
                    </div>

                    <div className="promise-check-item">
                      <div className="promise-check-icon-wrap">
                        <CheckCircle2 size={16} />
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
                    <ShieldCheck size={14} style={{ color: '#AA2E1F' }} />
                    <span>AAR Rule 88 &amp; FRA Compliant Fleet</span>
                  </div>
                  <a href="tel:+18325551200" className="promise-phone-btn">
                    <PhoneCall size={13} />
                    <span>(832) 555-1200</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CORE VALUES GRID (6 Detailed Value Pillars)
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Six Core Pillars</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
              How Our Values Power Your Supply Chain
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Every car placement, rate negotiation, and customer touchpoint is guided by these six foundational standards.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2rem',
            }}
          >
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    borderTop: `4px solid ${v.badgeColor}`,
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                    transition: 'transform 200ms ease, box-shadow 200ms ease',
                  }}
                  className="value-card"
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '10px',
                        backgroundColor: v.accentBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={22} style={{ color: v.badgeColor }} />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-railroad)',
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        color: '#94A3B8',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {v.number}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.22rem',
                      fontWeight: 700,
                      color: '#0A0A09',
                      marginBottom: '0.5rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {v.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: v.badgeColor,
                      marginBottom: '1rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {v.summary}
                  </p>

                  <p
                    style={{
                      fontSize: '0.94rem',
                      color: '#475569',
                      lineHeight: 1.68,
                      marginBottom: '1.5rem',
                      flex: 1,
                    }}
                  >
                    {v.description}
                  </p>

                  <div
                    style={{
                      paddingTop: '1.25rem',
                      borderTop: '1px solid #F1F5F9',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.55rem',
                    }}
                  >
                    {v.points.map((pt, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          fontSize: '0.84rem',
                          color: '#334155',
                          lineHeight: 1.45,
                        }}
                      >
                        <CheckCircle2 size={15} style={{ color: v.badgeColor, flexShrink: 0, marginTop: '2px' }} />
                        <span>{pt}</span>
                      </div>
                    ))}
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
              <strong style={{ fontSize: '1.05rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
              <strong style={{ fontSize: '1.05rem', color: '#2563EB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
              <strong style={{ fontSize: '1.05rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
           Executive Promise Card (Unified 2-Column Arrangement - No inner boxes)
           ========================================================================= */
        .promise-section {
          padding: 4.5rem 0;
          background-color: #FAF8F5;
        }

        .promise-card {
          max-width: 1040px;
          margin: 0 auto;
          background: #FFFFFF;
          border: 1px solid #E8E5DF;
          border-top: 4px solid #AA2E1F;
          border-radius: 16px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02);
          overflow: hidden;
        }

        .promise-card-grid {
          display: grid;
          grid-template-columns: 1.12fr 1fr;
          align-items: stretch;
        }

        .promise-quote-col {
          padding: 3rem 2.75rem 2.5rem;
          background: linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid #F0EDE6;
        }

        .promise-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: #AA2E1F;
          font-family: var(--font-heading);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .promise-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #AA2E1F;
        }

        .promise-quote-mark {
          font-family: Georgia, serif;
          font-size: 3.5rem;
          line-height: 1;
          color: rgba(170, 46, 31, 0.18);
          margin-bottom: -1.15rem;
          user-select: none;
        }

        .promise-quote-text {
          font-family: var(--font-heading);
          font-size: clamp(1.35rem, 2.2vw, 1.7rem);
          font-weight: 700;
          color: #0A0A09;
          line-height: 1.38;
          letter-spacing: -0.015em;
          margin: 0 0 1.75rem 0;
          padding: 0;
        }

        .promise-quote-text em {
          font-style: normal;
          color: #AA2E1F;
          font-weight: 800;
        }

        .promise-author-tag {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.82rem;
          color: #64748B;
          font-weight: 600;
        }

        .promise-author-line {
          width: 28px;
          height: 2px;
          background-color: #AA2E1F;
        }

        .promise-detail-col {
          padding: 3rem 2.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #FFFFFF;
        }

        .promise-detail-heading {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 700;
          color: #0A0A09;
          margin: 0 0 0.75rem 0;
          letter-spacing: -0.01em;
        }

        .promise-detail-text {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.65;
          margin: 0 0 1.5rem 0;
        }

        .promise-checklist {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          margin-bottom: 2rem;
        }

        .promise-check-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
        }

        .promise-check-icon-wrap {
          color: #059669;
          margin-top: 1px;
          flex-shrink: 0;
        }

        .promise-check-content {
          display: flex;
          flex-direction: column;
          line-height: 1.4;
        }

        .promise-check-content strong {
          font-size: 0.88rem;
          color: #0F172A;
          font-weight: 700;
        }

        .promise-check-content span {
          font-size: 0.8rem;
          color: #64748B;
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
          gap: 0.4rem;
          font-size: 0.78rem;
          color: #64748B;
          font-weight: 600;
        }

        .promise-phone-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #AA2E1F;
          text-decoration: none;
          padding: 0.35rem 0.75rem;
          background: #FDF2F0;
          border-radius: 6px;
          border: 1px solid #FCDAD7;
          transition: all 150ms ease;
        }

        .promise-phone-btn:hover {
          background: #AA2E1F;
          color: #FFFFFF;
        }

        @media (max-width: 860px) {
          .promise-section {
            padding: 2.75rem 0 !important;
          }
          .promise-card-grid {
            grid-template-columns: 1fr !important;
          }
          .promise-quote-col {
            padding: 2rem 1.35rem 1.75rem !important;
            border-right: none !important;
            border-bottom: 1px solid #F0EDE6 !important;
          }
          .promise-quote-mark {
            font-size: 2.75rem !important;
            margin-bottom: -0.85rem !important;
          }
          .promise-quote-text {
            font-size: 1.25rem !important;
            line-height: 1.35 !important;
            margin-bottom: 1.25rem !important;
          }
          .promise-detail-col {
            padding: 1.75rem 1.35rem !important;
          }
          .promise-detail-heading {
            font-size: 1.1rem !important;
          }
          .promise-detail-text {
            font-size: 0.9rem !important;
            margin-bottom: 1.25rem !important;
          }
          .promise-checklist {
            gap: 0.8rem !important;
            margin-bottom: 1.5rem !important;
          }
          .promise-col-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.65rem !important;
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

        .value-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(15,23,42,0.08) !important;
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

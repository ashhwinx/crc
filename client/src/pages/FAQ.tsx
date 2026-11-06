import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  PhoneCall,
  FileText,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'leasing' | 'sourcing' | 'maintenance' | 'equipment';
  categoryLabel: string;
  question: string;
  answer: string;
  points?: { title: string; text: string }[];
  cta?: { text: string; link: string };
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'no-rail-siding',
    category: 'sourcing',
    categoryLabel: 'Sourcing & Delivery',
    question: "I don't have a rail siding. Can I still use railcars?",
    answer: 'Yes. Three common ways in:',
    points: [
      {
        title: 'Transload',
        text: 'Ship through a nearby transload facility, where cargo moves between truck and railcar.',
      },
      {
        title: 'Team track',
        text: 'Load at a railroad-owned public track near you.',
      },
      {
        title: 'Your own track',
        text: 'Reactivate dormant track on your property, or add a new spur. We can help you find rail-compatible sites, too.',
      },
    ],
    cta: {
      text: 'Tell us your location',
      link: '/quote?notes=' + encodeURIComponent('Inquiry: Shippers without rail siding (Transload / Team Track / Track Activation)'),
    },
  },
  {
    id: 'full-service-vs-net',
    category: 'leasing',
    categoryLabel: 'Lease Structures',
    question: 'What is the operational difference between a Full-Service Lease and a Net Lease?',
    answer:
      'In a Full-Service Lease, Coast Road Capital (or the car owner) assumes responsibility and cost for all routine mechanical maintenance, periodic qualification, wheelset renewals, and AAR Rule 88 wear repairs, giving the shipper predictable monthly budgeting. In a Net Lease, the lessee (shipper) manages day-to-day maintenance and repairs, resulting in a lower base monthly lease rate. Net leases are typically preferred by high-volume shippers with dedicated railcar repair capabilities.',
  },
  {
    id: 'lease-durations',
    category: 'leasing',
    categoryLabel: 'Lease Structures',
    question: 'What lease terms and fleet commitments are available?',
    answer:
      'We offer flexible durations customized to your production requirements: Short-Term Surge Leases (6 to 12 months) for seasonal harvests or temporary turnarounds, Medium-Term Leases (1 to 3 years) for steady industrial supply contracts, and Long-Term Master Leases (3 to 7+ years) with discounted monthly rates for permanent dedicated fleets. Minimum car commitments typically start at 5 railcars, scaling up to unit-train sets of 100+ cars.',
  },
  {
    id: 'sourcing-lead-time',
    category: 'sourcing',
    categoryLabel: 'Sourcing & Delivery',
    question: 'How long does it take from quote sign-off to delivery at our facility siding?',
    answer:
      'For readily available fleet sets positioned in regional storage yards, transit to your industrial siding typically takes between 2 to 4 weeks depending on Class I railroad interchange routing and mechanical pre-trip sign-offs. For specialized configurations requiring custom relining, stenciling, or modifications, lead times average 6 to 10 weeks.',
  },
  {
    id: 'interchange-routing',
    category: 'sourcing',
    categoryLabel: 'Sourcing & Delivery',
    question: 'How do you coordinate railroad interchange to our facility siding?',
    answer:
      'Coast Road Capital works directly with Class I carriers (BNSF, Union Pacific, CSX, Norfolk Southern, Canadian National, and CPKC) and regional short lines. We verify route clearance codes, arrange OT-5 loading authority, coordinate waybilling, and provide continuous car location messages (CLM) from origin interchange to your plant siding switch.',
  },
  {
    id: 'mechanical-inspection',
    category: 'maintenance',
    categoryLabel: 'Maintenance & Compliance',
    question: 'What mechanical standards and inspections are performed prior to handover?',
    answer:
      'Every railcar is inspected by certified railroad mechanical personnel under Association of American Railroads (AAR) Interchange Rules and Federal Railroad Administration (FRA) Title 49 CFR safety requirements. Inspection checkpoints include wheelset tread wear, draft gear, roller bearings, air brakes, handbrakes, safety appliances, and commodity discharge gates/hatches.',
  },
  {
    id: 'maintenance-breakdown',
    category: 'maintenance',
    categoryLabel: 'Maintenance & Compliance',
    question: 'What happens if a railcar is bad-ordered or damaged in transit?',
    answer:
      'If a railcar is bad-ordered by a handling carrier, the railroad routes the car to an authorized contract repair shop. Under full-service agreements, our operations desk monitors the repair progress, coordinates AAR billing authorization directly with the shop, and expedites the car back into active service. If a car experiences prolonged downtime, replacement equipment options are coordinated.',
  },
  {
    id: 'specialized-equipment',
    category: 'equipment',
    categoryLabel: 'Equipment & Cargo',
    question: 'Can you source specialized cars for hazardous materials or sensitive bulk products?',
    answer:
      'Yes. Our sourcing pool includes DOT-111, DOT-117, and CPC-1232 tank cars (insulated, coiled, or lined for chemicals, biofuels, and crude oil), food-grade lined covered hoppers for flour and sugar, pneumatic differential pressure (PD) hoppers for fine cement and flour, and specialized centerbeams for weather-wrapped building materials.',
  },
  {
    id: 'track-clearance-matching',
    category: 'equipment',
    categoryLabel: 'Equipment & Cargo',
    question: 'How do we know if a railcar type fits our loading dock and track curves?',
    answer:
      'Our team evaluates your facility siding parameters against AAR Plate clearances (Plate B, C, F), Gross Rail Load (GRL) track weight limits (e.g. 263,000 lbs vs 286,000 lbs), minimum track curvature radius, and overhead clearance. You can also utilize our interactive Track Layout Analysis tool to simulate track geometry and siding car capacities.',
  },
  {
    id: 'purchase-leasebacks',
    category: 'leasing',
    categoryLabel: 'Lease Structures',
    question: 'Do you offer purchase-leaseback arrangements for shipper-owned railcar fleets?',
    answer:
      'Yes. If your company owns an existing fleet of railcars and seeks to unlock liquidity for plant expansion or core business operations, Coast Road Capital can structure a purchase-leaseback. We acquire the fleet at fair market value and immediately lease the cars back to your operation without interrupting physical freight movements.',
  },
  {
    id: 'early-termination-extensions',
    category: 'leasing',
    categoryLabel: 'Lease Structures',
    question: 'Can leases be extended or adjusted as our freight volumes change?',
    answer:
      'Yes. We offer structured renewal options that allow shippers to extend favorable lease rates without re-sourcing cars. If your shipping lanes shift or your plant demands higher-capacity cars (such as moving from 4,750 cu ft to 5,200 cu ft covered hoppers), we work with you to execute orderly fleet transitions.',
  },
];

export const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'full-service-vs-net': true,
    'lease-durations': true,
  });

  // Dynamic SEO & Title
  useEffect(() => {
    document.title = 'Frequently Asked Questions (FAQ) | Railcar Leasing & Sourcing | Coast Road Capital';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Find answers to common questions about freight railcar leasing: full-service vs net leases, interchange routing, AAR inspections, delivery lead times, and fleet sizing.'
      );
    }
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Schema.org FAQPage structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="faq-page">
      {/* Inject FAQ Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '5rem 0 4rem',
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
            opacity: 0.28,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,9,0.7) 0%, rgba(10,10,9,0.96) 100%)',
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
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#F87171',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.85rem',
              }}
            >
              <HelpCircle size={15} />
              Help &amp; Knowledge Base
            </span>
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
              Frequently Asked Questions
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
              Clear answers regarding railcar lease structures, maintenance responsibilities, interchange delivery timelines, and fleet sourcing specifications.
            </p>

            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                maxWidth: '560px',
              }}
            >
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. net lease, interchange, AAR, lead time)..."
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem 0.9rem 2.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  fontSize: '0.96rem',
                  outline: 'none',
                  transition: 'border-color 180ms ease, background-color 180ms ease',
                }}
                className="faq-search-input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ CONTENT SECTION
          ========================================================================= */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '2.5rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid #E2E8F0',
            }}
          >
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'leasing', label: 'Lease Structures' },
              { id: 'sourcing', label: 'Sourcing & Delivery' },
              { id: 'maintenance', label: 'Maintenance & Compliance' },
              { id: 'equipment', label: 'Equipment & Cargo' },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#0A0A09' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: '1px solid',
                    borderColor: isActive ? '#0A0A09' : '#E2E8F0',
                    transition: 'all 160ms ease',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Accordion Questions List */}
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {filteredFAQs.length === 0 ? (
              <div
                style={{
                  padding: '3rem',
                  textAlign: 'center',
                  backgroundColor: '#FAF9F7',
                  borderRadius: '12px',
                  border: '1px solid #E8E5DF',
                }}
              >
                <HelpCircle size={36} style={{ color: '#94A3B8', marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#0A0A09', marginBottom: '0.5rem' }}>
                  No matching questions found
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  Have a specific question about your railcar requirements? Contact our leasing desk directly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Clear Search &amp; Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredFAQs.map((faq) => {
                  const isOpen = !!openItems[faq.id];
                  return (
                    <div
                      key={faq.id}
                      style={{
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: isOpen ? '#CBD5E1' : '#E2E8F0',
                        backgroundColor: '#FFFFFF',
                        boxShadow: isOpen
                          ? '0 4px 12px -2px rgba(15,23,42,0.06)'
                          : '0 1px 3px rgba(15,23,42,0.03)',
                        overflow: 'hidden',
                        transition: 'border-color 180ms ease, box-shadow 180ms ease',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(faq.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '1.35rem 1.5rem',
                          background: isOpen ? '#FAF9F7' : '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1.25rem',
                          transition: 'background-color 150ms ease',
                        }}
                        aria-expanded={isOpen}
                      >
                        <div>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              color: '#AA2E1F',
                              marginBottom: '0.35rem',
                            }}
                          >
                            {faq.categoryLabel}
                          </span>
                          <h3
                            style={{
                              fontSize: '1.08rem',
                              fontWeight: 700,
                              color: isOpen ? '#0A0A09' : '#1E293B',
                              margin: 0,
                              lineHeight: 1.35,
                            }}
                          >
                            {faq.question}
                          </h3>
                        </div>

                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: isOpen ? '#AA2E1F' : '#F1F5F9',
                            color: isOpen ? '#FFFFFF' : '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'transform 200ms ease, background-color 200ms ease, color 200ms ease',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        >
                          <ChevronDown size={16} />
                        </div>
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            padding: '1.25rem 1.5rem 1.5rem',
                            borderTop: '1px solid #F1F5F9',
                            backgroundColor: '#FFFFFF',
                          }}
                        >
                          <p
                            style={{
                              color: '#334155',
                              fontSize: '0.98rem',
                              lineHeight: 1.75,
                              margin: 0,
                            }}
                          >
                            {faq.answer}
                          </p>

                          {faq.points && faq.points.length > 0 && (
                            <ul
                              style={{
                                marginTop: '0.85rem',
                                marginBottom: faq.cta ? '1.25rem' : '0',
                                paddingLeft: '1.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.65rem',
                              }}
                            >
                              {faq.points.map((pt, i) => (
                                <li key={i} style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.65 }}>
                                  <strong style={{ color: '#0A0A09' }}>{pt.title}:</strong> {pt.text}
                                </li>
                              ))}
                            </ul>
                          )}

                          {faq.cta && (
                            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed #E2E8F0' }}>
                              <Link
                                to={faq.cta.link}
                                className="btn btn-primary btn-sm"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                              >
                                {faq.cta.text}
                                <ArrowRight size={14} />
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          DIRECT CONSULTATION & TOOL BRIDGES
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#FAF8F5',
          borderBottom: '1px solid #EADBCC',
          padding: '4.5rem 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="eyebrow">Still Have Questions?</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '1rem' }}>
                Speak Directly With Our Railcar Sourcing Desk
              </h2>
              <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Every shipper's track layout, lading density, and interchange logistics are unique. Our commercial team in Houston is available to answer questions and prepare tailored availability schedules.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                <a
                  href="tel:+18325551200"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textDecoration: 'none',
                    color: '#0A0A09',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#FDF2F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#AA2E1F',
                    }}
                  >
                    <PhoneCall size={18} />
                  </div>
                  <span>(832) 555-1200</span>
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>
                  <CheckCircle2 size={15} style={{ color: '#059669' }} />
                  <span>Monday – Friday, 8:00 AM – 6:00 PM CST</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                <Link to="/contact" className="btn btn-primary">
                  Contact Sourcing Team
                </Link>
                <Link to="/quote" className="btn btn-secondary">
                  <FileText size={16} />
                  Request a Quote
                </Link>
              </div>
            </div>

            {/* Quick Tools Box */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #DCE3EB',
                padding: '2rem',
                boxShadow: '0 8px 24px -4px rgba(15,23,42,0.06)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: '#0A0A09', marginBottom: '1rem', fontWeight: 800 }}>
                Explore Interactive Rail Tools
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Use our self-service engineering and budgeting calculators to model realistic numbers before contacting our desk.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link
                  to="/cost-estimator"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FAF9F7',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 150ms ease, background-color 150ms ease',
                  }}
                  className="faq-tool-link"
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      backgroundColor: '#ECFDF5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                      flexShrink: 0,
                    }}
                  >
                    <Calculator size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0A0A09', marginBottom: '0.2rem' }}>
                      Railcar Cost Estimator
                    </strong>
                    <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
                      Model monthly lease rates and compare full-service vs net maintenance across 7 car classes.
                    </span>
                  </div>
                </Link>

                <Link
                  to="/railcar-leasing"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FAF9F7',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 150ms ease, background-color 150ms ease',
                  }}
                  className="faq-tool-link"
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563EB',
                      flexShrink: 0,
                    }}
                  >
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0A0A09', marginBottom: '0.2rem' }}>
                      Railcar Fleet Catalog
                    </strong>
                    <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
                      Review complete technical specifications for Boxcars, Covered Hoppers, Gondolas, Flatcars, and Tank Cars.
                    </span>
                  </div>
                </Link>

                <Link
                  to="/company-values"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FAF9F7',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 150ms ease, background-color 150ms ease',
                  }}
                  className="faq-tool-link"
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      backgroundColor: '#FDF2F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#AA2E1F',
                      flexShrink: 0,
                    }}
                  >
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0A0A09', marginBottom: '0.2rem' }}>
                      Company Values &amp; Principles
                    </strong>
                    <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
                      Read our operating philosophy regarding safety, transparent deal-making, and shipper partnerships.
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .faq-search-input:focus {
          border-color: #F87171 !important;
          background-color: rgba(255, 255, 255, 0.14) !important;
        }
        .faq-tool-link:hover {
          border-color: #CBD5E1 !important;
          background-color: #FFFFFF !important;
        }
      `}</style>
    </div>
  );
};

export default FAQ;

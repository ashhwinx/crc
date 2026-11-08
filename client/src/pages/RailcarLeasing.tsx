import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  ArrowRight,
  FileText,
  SlidersHorizontal,
  Package,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { EQUIPMENT_CATEGORIES } from '../data/equipmentData';

// Technical highlights for quick visual identification
const CATEGORY_KEY_METRICS: Record<string, { label: string; value: string }[]> = {
  boxcars: [
    { label: 'Lengths', value: "50' & 60'" },
    { label: 'Payload', value: '70T – 100T' },
    { label: 'Access', value: 'Plug / Sliding' },
  ],
  'covered-hoppers': [
    { label: 'Volume', value: '3,230–6,541 cu ft' },
    { label: 'Discharge', value: 'Gravity & PD' },
    { label: 'Hatches', value: 'Trough & Round' },
  ],
  'open-top-hoppers': [
    { label: 'Volume', value: '2,400–4,000 cu ft' },
    { label: 'Gate', value: 'Manual & Rapid' },
    { label: 'Body', value: 'All-Welded Steel' },
  ],
  gondolas: [
    { label: 'Lengths', value: "42' – 66' Mill" },
    { label: 'Loading', value: 'Crane & Magnet' },
    { label: 'Couplers', value: 'Rotary & Standard' },
  ],
  'centerbeam-flatcars': [
    { label: 'Lengths', value: "65' & 73'" },
    { label: 'Deck', value: 'Riser & Riserless' },
    { label: 'Access', value: '2-Side Ground' },
  ],
  'bulkhead-general-flatcars': [
    { label: 'Lengths', value: "50' – 89'" },
    { label: 'Bulkheads', value: 'Fixed & General' },
    { label: 'Deck', value: 'Heavy-Duty Steel' },
  ],
  'tank-cars': [
    { label: 'Volume', value: '13k – 30k+ Gal' },
    { label: 'Thermal', value: 'Insulated / Coiled' },
    { label: 'Pressure', value: 'Pressurized & Non' },
  ],
};

export const RailcarLeasing: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cardTabs, setCardTabs] = useState<Record<string, 'specs' | 'overview' | 'commodities'>>({});
  const location = useLocation();
  const isFirstRender = useRef(true);

  // Smooth scroll helper accounting for sticky navbar
  const scrollToTarget = (targetId: string) => {
    const el = document.getElementById(targetId) || document.getElementById('catalog-presentation');
    if (!el) return;

    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 74;
    const totalOffset = -(headerH + 20);

    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(el, { offset: totalOffset, duration: 0.8 });
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY + totalOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  // Scroll smoothly to category selection bar so active filter and catalog cards are in focus
  const scrollToCategoryBar = () => {
    const el = document.getElementById('catalog-category-bar') || document.querySelector('.category-nav-bar');
    if (!el) return;

    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 74;
    const totalOffset = -(headerH + 12);

    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(el, { offset: totalOffset, duration: 0.6 });
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY + totalOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  // Handle category filter clicks with auto-scroll and horizontal pill center
  const handleCategorySelect = (slug: string, buttonEl?: HTMLElement) => {
    if (buttonEl) {
      const container = buttonEl.closest('.category-nav-container')?.parentElement || buttonEl.parentElement;
      if (container) {
        const btnRect = buttonEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollLeft =
          container.scrollLeft + (btnRect.left - containerRect.left) - containerRect.width / 2 + btnRect.width / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }

    if (activeCategory === slug) {
      // Re-scroll directly to category bar if already active
      scrollToCategoryBar();
    } else {
      setActiveCategory(slug);
    }
  };

  // Scroll to category bar when category changes, so active selection and cards are neatly in view
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      scrollToCategoryBar();
    }, 50);

    return () => clearTimeout(timer);
  }, [activeCategory]);

  // Handle hash scrolling on page load or anchor click
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        scrollToTarget(targetId);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  const filteredCategories =
    activeCategory === 'all'
      ? EQUIPMENT_CATEGORIES
      : EQUIPMENT_CATEGORIES.filter((c) => c.slug === activeCategory);

  const getActiveTab = (catId: string) => cardTabs[catId] || 'specs';
  const handleTabClick = (catId: string, tab: 'specs' | 'overview' | 'commodities') => {
    setCardTabs((prev) => ({ ...prev, [catId]: tab }));
  };

  return (
    <div className="railcar-leasing-page">
      {/* Header Banner */}
      <section className="catalog-hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
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
                opacity: 0.28,
              }}
            />
          </picture>
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,9,0.72) 0%, rgba(10,10,9,0.96) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '860px' }}>
            <h1 className="catalog-hero-title">
              Railcar Equipment Catalog
            </h1>
            <p className="catalog-hero-desc">
              Explore standard dimensions, capacities, commodity applications, and discharge profiles across our seven primary freight equipment classes.
            </p>

            {/* 3D Railcar Viewer Studio CTA */}
            <div style={{ marginTop: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                to="/railcar-viewer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#AA2E1F',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  padding: '0.65rem 1.15rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 8px rgba(170, 46, 31, 0.25)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <Package size={16} />
                <span>Launch Interactive 3D Railcar Studio</span>
              </Link>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                3D turntable, live loading/unloading demos &amp; capacity calculator
              </span>
            </div>

            {/* Terms & Equipment Disclaimer Footnote */}
            <p className="catalog-disclaimer-note">
              <span className="disclaimer-star">*</span>
              <span>
                <strong>Equipment &amp; Terms Notice:</strong> Specifications reflect typical industry standards. Car availability, mechanical series, and lease structures are confirmed upon direct consultation with our leasing team.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Category Quick Navigation Bar (Scrolls with page content) */}
      <div id="catalog-category-bar" className="category-nav-bar category-sticky-bar">
        <div className="container category-nav-container">
          <button
            type="button"
            onClick={(e) => handleCategorySelect('all', e.currentTarget)}
            className={`category-pill-btn ${activeCategory === 'all' ? 'active' : ''}`}
          >
            All Categories (7)
          </button>

          {EQUIPMENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={(e) => handleCategorySelect(cat.slug, e.currentTarget)}
              className={`category-pill-btn ${activeCategory === cat.slug ? 'active' : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Items Presentation */}
      <section id="catalog-presentation" className="catalog-presentation-section">
        <div className="container">
          <div className="catalog-cards-stack">
            {filteredCategories.map((cat, idx) => {
              const currentTab = getActiveTab(cat.id);
              const metrics = CATEGORY_KEY_METRICS[cat.slug];

              return (
                <div
                  key={cat.id}
                  id={cat.slug}
                  className="catalog-card"
                >
                  {/* Category Header Bar */}
                  <div className="catalog-card-header">
                    <div className="catalog-card-title-wrap">
                      <span className="catalog-card-eyebrow">
                        0{idx + 1} &bull; {cat.eyebrow}
                      </span>
                      <h2 className="catalog-card-title">
                        {cat.name}
                      </h2>
                    </div>

                    <Link
                      to={`/quote?category=${encodeURIComponent(cat.name)}`}
                      className="btn btn-primary btn-sm catalog-header-cta"
                    >
                      <FileText size={15} />
                      Request Sourcing
                    </Link>
                  </div>

                  {/* Visual Media & Quick Metrics Summary */}
                  <div className="catalog-media-strip">
                    <div className="catalog-image-box">
                      <img
                        src={cat.image}
                        alt={cat.imageAlt}
                        width={420}
                        height={260}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="catalog-media-details">
                      <p className="catalog-short-summary">
                        {cat.shortDescription}
                      </p>

                      {/* 3 Key Metrics Pills */}
                      {metrics && (
                        <div className="catalog-metrics-grid">
                          {metrics.map((m, mi) => (
                            <div key={mi} className="catalog-metric-pill">
                              <span className="catalog-metric-label">{m.label}</span>
                              <strong className="catalog-metric-val">{m.value}</strong>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Sub-Tabs Bar: Cuts card scroll height by 75% */}
                  <div className="catalog-tab-bar">
                    <button
                      type="button"
                      onClick={() => handleTabClick(cat.id, 'specs')}
                      className={`catalog-tab-btn ${currentTab === 'specs' ? 'active' : ''}`}
                    >
                      <SlidersHorizontal size={13} />
                      <span className="tab-label-desktop">Sizes &amp; Configs ({cat.configurations.length})</span>
                      <span className="tab-label-mobile">Sizes ({cat.configurations.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabClick(cat.id, 'overview')}
                      className={`catalog-tab-btn ${currentTab === 'overview' ? 'active' : ''}`}
                    >
                      <FileText size={13} />
                      <span className="tab-label-desktop">Overview &amp; Profile</span>
                      <span className="tab-label-mobile">Overview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabClick(cat.id, 'commodities')}
                      className={`catalog-tab-btn ${currentTab === 'commodities' ? 'active' : ''}`}
                    >
                      <Package size={13} />
                      <span className="tab-label-desktop">Commodities ({cat.typicalCommodities.length})</span>
                      <span className="tab-label-mobile">Cargo ({cat.typicalCommodities.length})</span>
                    </button>
                  </div>

                  {/* Tab Panels */}
                  <div className="catalog-tab-content">
                    {/* TAB 1: SIZES & CONFIGURATIONS */}
                    {currentTab === 'specs' && (
                      <div className="tab-pane animate-fade-in">
                        <div className="catalog-specs-header">
                          <h3 className="catalog-specs-title">
                            Standard Configurations &amp; Capacities
                          </h3>
                          <span className="badge badge-dark">
                            {cat.configurations.length} Options
                          </span>
                        </div>

                        <div className="catalog-spec-panel">
                          {cat.configurations.map((cfg, cfgIdx) => {
                            const estimatorUrl = `/cost-estimator?category=${encodeURIComponent(cat.slug)}&size=${encodeURIComponent(cfg.name)}`;
                            return (
                              <Link
                                key={cfgIdx}
                                to={estimatorUrl}
                                className="catalog-spec-row catalog-spec-row-selectable"
                                title={`Configure ${cat.name} (${cfg.name}) in Cost Estimator`}
                              >
                                <div className="catalog-spec-info">
                                  <strong className="catalog-spec-name">
                                    {cfg.name}
                                  </strong>
                                  <span className="catalog-spec-note">
                                    {cfg.note}
                                  </span>
                                </div>

                                <span className="catalog-spec-inquire-link">
                                  Inquire Size
                                  <ChevronRight size={14} />
                                </span>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Sourcing Callout */}
                        <div className="catalog-sourcing-bar">
                          <div className="catalog-sourcing-text">
                            <strong className="catalog-sourcing-heading">
                              Allocation &amp; Mechanical Delivery
                            </strong>
                            <span className="catalog-sourcing-desc">
                              {cat.inquiryNotice}
                            </span>
                          </div>
                          <Link
                            to={`/quote?category=${encodeURIComponent(cat.name)}`}
                            className="btn btn-primary btn-sm catalog-sourcing-btn"
                          >
                            Request {cat.name} Sourcing
                            <ArrowRight size={15} />
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: OPERATIONAL OVERVIEW */}
                    {currentTab === 'overview' && (
                      <div className="tab-pane animate-fade-in">
                        <h4 className="catalog-section-h4">
                          Operational Overview
                        </h4>
                        <p className="catalog-desc-p">
                          {cat.fullDescription}
                        </p>

                        <div className="catalog-profile-box">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <Layers size={16} style={{ color: '#AA2E1F' }} />
                            <strong className="catalog-profile-title" style={{ margin: 0 }}>
                              Loading &amp; Discharge Interface
                            </strong>
                          </div>
                          <p className="catalog-profile-text">
                            {cat.loadingProfile}
                          </p>
                        </div>

                        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                          <span style={{ fontSize: '0.86rem', color: '#64748B' }}>
                            Verified against AAR structural standards and FRA mechanical rules.
                          </span>
                          <Link
                            to={`/quote?category=${encodeURIComponent(cat.name)}`}
                            className="btn btn-primary btn-sm"
                          >
                            Submit Lease Inquiry
                            <ArrowRight size={15} />
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: COMMODITIES */}
                    {currentTab === 'commodities' && (
                      <div className="tab-pane animate-fade-in">
                        <h4 className="catalog-section-h4">
                          Typical Commodity Applications
                        </h4>
                        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1rem' }}>
                          Standard commodities loaded, hauled, and transferred across Class I networks:
                        </p>

                        <div className="catalog-commodities-wrap">
                          {cat.typicalCommodities.map((item, i) => (
                            <span key={i} className="catalog-commodity-chip">
                              {item}
                            </span>
                          ))}
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '0.9rem 1.15rem', backgroundColor: '#FAF9F7', borderRadius: '4px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
                          <span style={{ fontSize: '0.86rem', color: '#334155', fontWeight: 500 }}>
                            Shipping specialized chemicals, bulk minerals, or custom goods?
                          </span>
                          <Link
                            to={`/quote?category=${encodeURIComponent(cat.name)}`}
                            className="btn btn-primary btn-sm"
                          >
                            Review Car Compatibility
                            <ArrowRight size={15} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trains Serving Industries - Field Operations Showcase */}
      <section className="industry-operations-section" style={{ backgroundColor: '#F8FAFC', padding: '4.5rem 0 4rem', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '780px', marginBottom: '2.5rem' }}>
            <span style={{ color: '#AA2E1F', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.8rem', display: 'inline-block', marginBottom: '0.5rem' }}>
              Field Operations &bull; Siding Logistics
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800, color: '#0A0A09', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Trains Serving Industries Across North America
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>
              Coast Road Capital coordinates with shortline, regional, and Class I railroads to ensure your leased fleet transitions smoothly from mainline interchange to customer plant siding.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Spotlight 1 */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -4px rgba(15,23,42,0.06)' }}>
              <div style={{ height: '210px', overflow: 'hidden' }}>
                <img
                  src="/images/Trains serving industries-additional railcar images/DSC09750(1).jpg"
                  alt="Industrial siding turnout switching"
                  width={400}
                  height={210}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '1.25rem 1.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#AA2E1F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Customer Siding
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A0A09', margin: '0.35rem 0 0.5rem' }}>
                  Industrial Spur Switching
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  Spotting cars on private facility turnouts for clean truck-to-rail loading and hopper discharge.
                </p>
              </div>
            </div>

            {/* Spotlight 2 */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -4px rgba(15,23,42,0.06)' }}>
              <div style={{ height: '210px', overflow: 'hidden' }}>
                <img
                  src="/images/Trains serving industries-additional railcar images/16424.jpg"
                  alt="Rail delivery to industrial processing facility"
                  width={400}
                  height={210}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '1.25rem 1.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#AA2E1F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Facility Delivery
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A0A09', margin: '0.35rem 0 0.5rem' }}>
                  Plant Processing Delivery
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  Delivering cuts of covered and open-top hoppers directly into processing plant sidings.
                </p>
              </div>
            </div>

            {/* Spotlight 3 */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -4px rgba(15,23,42,0.06)' }}>
              <div style={{ height: '210px', overflow: 'hidden' }}>
                <img
                  src="/images/Trains serving industries-additional railcar images/DSC06309 (1).jpg"
                  alt="Mainline freight rail delivery"
                  width={400}
                  height={210}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '1.25rem 1.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#AA2E1F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Line-Haul Transit
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A0A09', margin: '0.35rem 0 0.5rem' }}>
                  Mainline Freight Haulage
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  Multi-railroad interchange routing ensuring reliable transit times between production plants and receivers.
                </p>
              </div>
            </div>

            {/* Spotlight 4 */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -4px rgba(15,23,42,0.06)' }}>
              <div style={{ height: '210px', overflow: 'hidden' }}>
                <img
                  src="/images/Trains serving industries-additional railcar images/16410.jpg"
                  alt="Track siding inspection and maintenance"
                  width={400}
                  height={210}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '1.25rem 1.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#AA2E1F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Track Assessment
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A0A09', margin: '0.35rem 0 0.5rem' }}>
                  Siding Maintenance &amp; Safety
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  Verifying track integrity, tie condition, and clearance profiles to protect loaded cars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="catalog-closing-section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '680px' }}>
          <h2 className="catalog-closing-title">
            Need Specific Equipment Not Listed Here?
          </h2>
          <p className="catalog-closing-desc">
            Coast Road Capital sources specialized railcars, custom dimensions, and dedicated fleet allocations across North America.
          </p>
          <div className="catalog-closing-actions">
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
        /* Hero Section */
        .catalog-hero-section {
          background-color: #0A0A09;
          color: #FFFFFF;
          padding: 4.5rem 0 3.5rem;
          border-bottom: 3px solid #AA2E1F;
          position: relative;
        }
        .catalog-hero-title {
          font-size: clamp(2.2rem, 4.5vw, 3.85rem);
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
        }
        .catalog-hero-desc {
          font-size: 1.15rem;
          color: #CBD5E1;
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }
        .catalog-disclaimer-note {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-top: 1.5rem;
          font-size: 0.84rem;
          color: #94A3B8;
          line-height: 1.6;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1.1rem;
        }
        .disclaimer-star {
          color: #EF4444;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.2;
          flex-shrink: 0;
        }
        .catalog-disclaimer-note strong {
          color: #CBD5E1;
          font-weight: 600;
        }

        /* Category Navigation Bar: Scrolls naturally with the page content */
        .category-nav-bar,
        .category-sticky-bar {
          position: relative;
          z-index: 20;
          background-color: #FFFFFF;
          border-top: 1px solid #E2E8F0;
          border-bottom: 1px solid #E2E8F0;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          scroll-margin-top: calc(var(--header-height, 74px) + 12px);
        }
        .category-nav-bar::-webkit-scrollbar,
        .category-sticky-bar::-webkit-scrollbar {
          display: none;
        }
        .category-nav-container {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
        }
        .category-pill-btn {
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 600;
          padding: 0.45rem 1.15rem;
          border-radius: 9999px;
          border: 1px solid #E2E8F0;
          background-color: #FFFFFF;
          color: #334155;
          cursor: pointer;
          transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease;
          flex-shrink: 0;
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .category-pill-btn:hover {
          border-color: #AA2E1F;
          color: #AA2E1F;
        }
        .category-pill-btn.active {
          border-color: #0A0A09;
          background-color: #0A0A09;
          color: #EDE6D4;
        }

        /* Presentation Section & Stack */
        .catalog-presentation-section {
          padding-top: 3rem;
          padding-bottom: 4rem;
          background-color: #FAF9F7;
        }
        .catalog-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          width: 100%;
        }

        /* Card Root: Hardware-accelerated and stable */
        .catalog-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06);
          scroll-margin-top: calc(var(--header-height, 74px) + 20px);
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transition: box-shadow 260ms cubic-bezier(0.16, 1, 0.3, 1), border-color 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .catalog-card:hover {
          box-shadow: 0 10px 32px -4px rgba(15, 23, 42, 0.1);
        }

        /* Card Header */
        .catalog-card-header {
          background-color: #0A0A09;
          color: #FFFFFF;
          padding: 1.25rem 2rem;
          display: flex;
          flex-wrap: wrap;
          justifyContent: space-between;
          align-items: center;
          gap: 1rem;
          border-bottom: 3px solid #AA2E1F;
          box-sizing: border-box;
          width: 100%;
        }
        .catalog-card-title-wrap {
          flex: 1 1 auto;
          min-width: 0;
        }
        .catalog-card-eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          color: #F87171;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.25rem;
          line-height: 1.3;
        }
        .catalog-card-title {
          font-size: clamp(1.6rem, 2.8vw, 2.1rem);
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.2;
          word-break: break-word;
        }
        .catalog-header-cta {
          border-radius: 8px;
          flex-shrink: 0;
        }

        /* Visual Media & Metrics Strip */
        .catalog-media-strip {
          padding: 1.75rem 2rem 1.25rem;
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 2rem;
          align-items: center;
          border-bottom: 1px solid #F1F5F9;
          background-color: #FFFFFF;
          box-sizing: border-box;
        }
        .catalog-image-box {
          height: 190px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #E2E8F0;
          background-color: #0A0A09;
          box-sizing: border-box;
        }
        .catalog-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .catalog-media-details {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          min-width: 0;
        }
        .catalog-short-summary {
          font-size: 0.98rem;
          color: #475569;
          line-height: 1.65;
          margin: 0;
        }
        .catalog-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          box-sizing: border-box;
        }
        .catalog-metric-pill {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 0.6rem 0.85rem;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .catalog-metric-label {
          font-size: 0.72rem;
          color: #64748B;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 0.15rem;
        }
        .catalog-metric-val {
          font-size: 0.88rem;
          color: #0A0A09;
          font-weight: 700;
          line-height: 1.3;
        }

        /* Interactive Tab Bar */
        .catalog-tab-bar {
          display: flex;
          background-color: #F1F5F9;
          padding: 6px;
          border-bottom: 1px solid #E2E8F0;
          gap: 6px;
          box-sizing: border-box;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
        }
        .catalog-tab-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid transparent;
          background-color: transparent;
          color: #64748B;
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
          white-space: nowrap;
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .catalog-tab-btn:hover {
          color: #0A0A09;
          background-color: rgba(255, 255, 255, 0.6);
        }
        .catalog-tab-btn.active {
          background-color: #FFFFFF;
          color: #0A0A09;
          border-color: #CBD5E1;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
          font-weight: 700;
        }

        .tab-label-desktop {
          display: inline;
        }
        .tab-label-mobile {
          display: none;
        }

        /* Tab Content Panel */
        .catalog-tab-content {
          padding: 1.75rem 2rem 2rem;
          box-sizing: border-box;
          background-color: #FFFFFF;
          min-height: 220px;
        }
        .tab-pane {
          width: 100%;
          box-sizing: border-box;
        }

        /* Tab 1: Specs Table Styles */
        .catalog-specs-header {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #E2E8F0;
        }
        .catalog-specs-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0A0A09;
          margin: 0;
        }
        .catalog-spec-panel {
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          background-color: #FFFFFF;
          width: 100%;
          box-sizing: border-box;
        }
        .catalog-spec-row {
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid #F1F5F9;
          box-sizing: border-box;
          width: 100%;
          display: flex;
          justifyContent: space-between;
          align-items: center;
          gap: 1.25rem;
          transition: background-color 150ms ease, transform 150ms ease;
          text-decoration: none;
        }
        .catalog-spec-row-selectable {
          cursor: pointer;
        }
        .catalog-spec-row:nth-child(even) {
          background-color: #FAFBFD;
        }
        .catalog-spec-row:last-child {
          border-bottom: none;
        }
        .catalog-spec-row:hover {
          background-color: #F8FAFC;
        }
        .catalog-spec-row-selectable:hover .catalog-spec-inquire-link {
          background-color: #AA2E1F;
          color: #FFFFFF;
        }
        .catalog-spec-info {
          flex: 1;
          min-width: 0;
        }
        .catalog-spec-name {
          font-family: var(--font-heading);
          font-size: 0.96rem;
          font-weight: 700;
          color: #0A0A09;
          display: block;
          margin-bottom: 0.2rem;
          line-height: 1.3;
        }
        .catalog-spec-note {
          font-size: 0.86rem;
          color: #64748B;
          line-height: 1.5;
          display: block;
        }
        .catalog-spec-inquire-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 700;
          color: #AA2E1F;
          text-decoration: none;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          background-color: #FDF3F2;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
          transform: translateZ(0);
        }
        .catalog-spec-inquire-link:hover {
          background-color: #AA2E1F;
          color: #FFFFFF;
        }

        /* Tab 1 Sourcing Callout */
        .catalog-sourcing-bar {
          padding: 1.15rem 1.35rem;
          background-color: #FAF9F7;
          border-radius: 10px;
          border: 1px solid #E8E5DF;
          border-left: 4px solid #AA2E1F;
          display: flex;
          flex-wrap: wrap;
          justifyContent: space-between;
          align-items: center;
          gap: 1rem;
          box-sizing: border-box;
          width: 100%;
        }
        .catalog-sourcing-text {
          flex: 1;
          min-width: 240px;
        }
        .catalog-sourcing-heading {
          display: block;
          font-size: 0.92rem;
          color: #0A0A09;
          margin-bottom: 0.2rem;
          line-height: 1.3;
        }
        .catalog-sourcing-desc {
          font-size: 0.85rem;
          color: #64748B;
          line-height: 1.5;
          display: block;
        }
        .catalog-sourcing-btn {
          border-radius: 8px;
          flex-shrink: 0;
        }

        /* Tab 2 Overview Styles */
        .catalog-section-h4 {
          font-size: 1.15rem;
          color: #0A0A09;
          font-weight: 700;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .catalog-desc-p {
          color: #334155;
          font-size: 1rem;
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }
        .catalog-profile-box {
          background-color: #FAF9F7;
          padding: 1.25rem 1.4rem;
          border-radius: 10px;
          border: 1px solid #E8E5DF;
          box-sizing: border-box;
          width: 100%;
        }
        .catalog-profile-title {
          color: #0A0A09;
          font-size: 0.94rem;
          font-weight: 700;
        }
        .catalog-profile-text {
          color: #475569;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.65;
        }

        /* Tab 3 Commodities Styles */
        .catalog-commodities-wrap,
        .catalog-commodities-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          box-sizing: border-box;
        }
        .catalog-commodity-chip,
        .catalog-commodity-card {
          background-color: #FAF9F7;
          border: 1px solid #E2E8F0;
          border-radius: 4px;
          padding: 0.5rem 0.85rem;
          font-size: 0.86rem;
          color: #1E293B;
          font-weight: 500;
          line-height: 1.4;
          display: inline-flex;
          align-items: center;
          box-sizing: border-box;
          transition: background-color 150ms ease, border-color 150ms ease;
        }
        .catalog-commodity-chip:hover,
        .catalog-commodity-card:hover {
          background-color: #FFFFFF;
          border-color: #CBD5E1;
        }

        /* Closing Section */
        .catalog-closing-section {
          background-color: #0A0A09;
          color: #FFFFFF;
          padding: 4.5rem 0;
          border-top: 3px solid #AA2E1F;
        }
        .catalog-closing-title {
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          color: #FFFFFF;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .catalog-closing-desc {
          color: #94A3B8;
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .catalog-closing-actions {
          display: flex;
          flex-wrap: wrap;
          justifyContent: center;
          gap: 0.85rem;
        }

        /* =========================================================================
           MOBILE RESPONSIVE OVERRIDES (< 768px)
           Compact, App-Like Experience with Zero Scroll Fatigue
           ========================================================================= */
        @media (max-width: 768px) {
          .catalog-hero-section {
            padding: 2.75rem 0 2rem !important;
          }
          .catalog-hero-title {
            font-size: 1.85rem !important;
            margin-bottom: 0.85rem !important;
          }
          .catalog-hero-desc {
            font-size: 0.96rem !important;
            line-height: 1.6 !important;
            margin-bottom: 1.25rem !important;
          }
          .catalog-disclaimer-note {
            font-size: 0.78rem !important;
            margin-top: 1.15rem !important;
            padding-top: 0.85rem !important;
            line-height: 1.55 !important;
          }
          .catalog-presentation-section {
            padding-top: 1.75rem !important;
            padding-bottom: 2.5rem !important;
          }
          .catalog-cards-stack {
            gap: 1.75rem !important;
          }

          /* Card Root */
          .catalog-card {
            border-radius: 12px !important;
            scroll-margin-top: calc(var(--header-height, 72px) + 14px) !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          /* Header on Mobile */
          .catalog-card-header {
            padding: 1.15rem 1rem !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.85rem !important;
          }
          .catalog-card-title {
            font-size: 1.5rem !important;
          }
          .catalog-card-eyebrow {
            font-size: 0.74rem !important;
          }
          .catalog-header-cta {
            width: 100% !important;
            justify-content: center !important;
            padding: 0.65rem 1rem !important;
            font-size: 0.9rem !important;
          }

          /* Media & Metrics Strip on Mobile */
          .catalog-media-strip {
            padding: 1rem !important;
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .catalog-image-box {
            height: 175px !important;
            border-radius: 8px !important;
          }
          .catalog-short-summary {
            font-size: 0.88rem !important;
            line-height: 1.55 !important;
          }
          .catalog-metrics-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.5rem !important;
          }
          .catalog-metric-pill {
            padding: 0.5rem 0.55rem !important;
            min-width: 0 !important;
            overflow: hidden !important;
          }
          .catalog-metric-label {
            font-size: 0.65rem !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .catalog-metric-val {
            font-size: 0.78rem !important;
            word-break: break-word !important;
          }

          .tab-label-desktop {
            display: none !important;
          }
          .tab-label-mobile {
            display: inline !important;
          }

          /* Tab Bar on Mobile - 3 Equal Columns */
          .catalog-tab-bar {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            padding: 4px !important;
            gap: 4px !important;
            overflow-x: visible !important;
          }
          .catalog-tab-btn {
            padding: 0.55rem 0.2rem !important;
            font-size: 0.74rem !important;
            gap: 0.22rem !important;
            width: 100% !important;
            justify-content: center !important;
            white-space: nowrap !important;
            border-radius: 6px !important;
          }

          /* Tab Content on Mobile */
          .catalog-tab-content {
            padding: 1.15rem 1rem 1.25rem !important;
            min-height: auto !important;
          }

          /* Spec Rows on Mobile */
          .catalog-specs-header {
            margin-bottom: 0.75rem !important;
          }
          .catalog-specs-title {
            font-size: 1rem !important;
          }
          .catalog-spec-panel {
            border-radius: 8px !important;
            margin-bottom: 1.15rem !important;
          }
          .catalog-spec-row {
            padding: 0.75rem 0.85rem !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
          .catalog-spec-name {
            font-size: 0.92rem !important;
          }
          .catalog-spec-note {
            font-size: 0.82rem !important;
            line-height: 1.45 !important;
          }
          .catalog-spec-inquire-link {
            font-size: 0.78rem !important;
            padding: 0.3rem 0.6rem !important;
            align-self: flex-start !important;
          }

          /* Sourcing Box on Mobile */
          .catalog-sourcing-bar {
            padding: 0.85rem 1rem !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.65rem !important;
            border-radius: 8px !important;
          }
          .catalog-sourcing-text {
            flex: none !important;
            min-width: 0 !important;
            width: 100% !important;
          }
          .catalog-sourcing-heading {
            font-size: 0.88rem !important;
            margin-bottom: 0.2rem !important;
          }
          .catalog-sourcing-desc {
            font-size: 0.82rem !important;
            line-height: 1.45 !important;
            display: block !important;
          }
          .catalog-sourcing-btn {
            width: 100% !important;
            justify-content: center !important;
            margin-top: 0.2rem !important;
          }

          /* Overview & Commodities on Mobile */
          .catalog-section-h4 {
            font-size: 1rem !important;
            margin-bottom: 0.5rem !important;
          }
          .catalog-desc-p {
            font-size: 0.88rem !important;
            line-height: 1.6 !important;
            margin-bottom: 1rem !important;
          }
          .catalog-profile-box {
            padding: 0.9rem 1rem !important;
            border-radius: 8px !important;
          }
          .catalog-profile-title {
            font-size: 0.86rem !important;
          }
          .catalog-profile-text {
            font-size: 0.82rem !important;
            line-height: 1.5 !important;
          }
          .catalog-commodities-wrap,
          .catalog-commodities-grid {
            gap: 0.45rem !important;
          }
          .catalog-commodity-chip,
          .catalog-commodity-card {
            font-size: 0.82rem !important;
            padding: 0.45rem 0.75rem !important;
          }

          /* Closing Section on Mobile */
          .catalog-closing-section {
            padding: 2.75rem 0 !important;
          }
          .catalog-closing-title {
            font-size: 1.6rem !important;
          }
          .catalog-closing-desc {
            font-size: 0.95rem !important;
            margin-bottom: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

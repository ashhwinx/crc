import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator,
  FileText,
  Truck,
  ShieldCheck,
  Wrench,
  Copy,
  Check,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import {
  ESTIMATOR_EQUIPMENT_DATA,
  LEASE_TERM_OPTIONS,
  INTERCHANGE_REGIONS,
  type EquipmentEstimatorItem,
  type CarSizeOption,
} from '../data/estimatorData';

export const CostEstimator: React.FC = () => {
  const navigate = useNavigate();

  // State: Interactive selections
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('boxcars');
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);
  const [leaseType, setLeaseType] = useState<'full' | 'net'>('full');
  const [termId, setTermId] = useState<string>('medium');
  const [quantity, setQuantity] = useState<number>(5);
  const [regionId, setRegionId] = useState<string>('gulf-coast');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeGuideTab, setActiveGuideTab] = useState<string>('boxcars');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Active equipment object
  const currentCategory: EquipmentEstimatorItem = useMemo(() => {
    return (
      ESTIMATOR_EQUIPMENT_DATA.find((item) => item.slug === selectedCategorySlug) ||
      ESTIMATOR_EQUIPMENT_DATA[0]
    );
  }, [selectedCategorySlug]);

  // Active size object
  const currentSize: CarSizeOption = useMemo(() => {
    return currentCategory.sizesAndCapacities[selectedSizeIndex] || currentCategory.sizesAndCapacities[0];
  }, [currentCategory, selectedSizeIndex]);

  // When category changes, reset size index if out of range
  const handleCategoryChange = (slug: string) => {
    setSelectedCategorySlug(slug);
    setSelectedSizeIndex(0);
  };

  // Term factor
  const termOption = useMemo(() => {
    return LEASE_TERM_OPTIONS.find((t) => t.id === termId) || LEASE_TERM_OPTIONS[1];
  }, [termId]);

  // Region factor
  const regionOption = useMemo(() => {
    return INTERCHANGE_REGIONS.find((r) => r.id === regionId) || INTERCHANGE_REGIONS[0];
  }, [regionId]);

  // Volume discount calculation
  const volumeDiscount = useMemo(() => {
    if (quantity >= 50) return 0.90; // 10% discount
    if (quantity >= 20) return 0.93; // 7% discount
    if (quantity >= 10) return 0.96; // 4% discount
    if (quantity >= 5) return 0.98;  // 2% discount
    return 1.0;
  }, [quantity]);

  // Dynamic cost calculations
  const calculation = useMemo(() => {
    const baseRange =
      leaseType === 'full' ? currentCategory.baseMonthlyFull : currentCategory.baseMonthlyNet;
    const sizeMultiplier = currentSize.multiplier;
    const termFactor = termOption.factor;
    const regFactor = regionOption.factor;

    const minRate = Math.round(
      baseRange[0] * sizeMultiplier * termFactor * regFactor * volumeDiscount
    );
    const maxRate = Math.round(
      baseRange[1] * sizeMultiplier * termFactor * regFactor * volumeDiscount
    );

    const totalMinMonthly = minRate * quantity;
    const totalMaxMonthly = maxRate * quantity;

    const totalMinAnnual = totalMinMonthly * 12;
    const totalMaxAnnual = totalMaxMonthly * 12;

    const trucksReplacedMin = Math.round(quantity * (currentCategory.truckloadEquivalent - 0.5));
    const trucksReplacedMax = Math.round(quantity * (currentCategory.truckloadEquivalent + 0.5));
    const totalPayloadTons = Math.round(quantity * currentCategory.avgPayloadTons);

    return {
      minRate,
      maxRate,
      totalMinMonthly,
      totalMaxMonthly,
      totalMinAnnual,
      totalMaxAnnual,
      trucksReplacedMin,
      trucksReplacedMax,
      totalPayloadTons,
    };
  }, [
    currentCategory,
    currentSize,
    leaseType,
    termOption,
    regionOption,
    volumeDiscount,
    quantity,
  ]);

  // Format currency
  const formatCur = (val: number) => {
    return '$' + val.toLocaleString('en-US');
  };

  // Copy summary to clipboard
  const handleCopySummary = () => {
    const summary = `Coast Road Capital Railcar Lease Estimate:
Equipment: ${currentCategory.name} - ${currentSize.name}
Capacity: ${currentSize.capacity}
Structure: ${leaseType === 'full' ? 'Full-Service Lease (Maintenance Included)' : 'Net Lease (Shipper Maintained)'}
Term: ${termOption.name}
Quantity: ${quantity} Car(s)
Delivery Gateway: ${regionOption.name}
Estimated Rate / Car: ${formatCur(calculation.minRate)} – ${formatCur(calculation.maxRate)} / month
Estimated Total Fleet Cost: ${formatCur(calculation.totalMinMonthly)} – ${formatCur(calculation.totalMaxMonthly)} / month
Annualized Fleet Budget: ${formatCur(calculation.totalMinAnnual)} – ${formatCur(calculation.totalMaxAnnual)} / year
Truckloads Replaced: ~${calculation.trucksReplacedMin} to ${calculation.trucksReplacedMax} highway semi-trucks`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Direct transfer to quote page
  const handleTransferToQuote = () => {
    const params = new URLSearchParams({
      category: currentCategory.name,
      config: currentSize.name,
      quantity: quantity.toString(),
      timing: termOption.name,
      leaseType: leaseType === 'full' ? 'Full-Service Lease' : 'Net Lease',
      notes: `Generated via CRC Cost Estimator. Estimated range: ${formatCur(calculation.minRate)} - ${formatCur(calculation.maxRate)}/car/mo. Interchange: ${regionOption.name}.`,
    });
    navigate(`/quote?${params.toString()}`);
  };

  // Toggle FAQ
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is the main financial difference between a Full-Service and Net Lease?',
      a: 'Under a Full-Service Lease, Coast Road Capital absorbs the risk and cost of routine mechanical maintenance, wheelset changeouts, AAR Rule 88 brake tests, and regulatory safety test certifications. Under a Net Lease, the lessee pays a lower base monthly rate but assumes full administrative and financial responsibility for repairs, preventative service, and FRA compliance.',
    },
    {
      q: 'How accurate are these estimated lease rates?',
      a: 'These figures reflect current North American rail leasing market averages for standard 1 to 5-year commercial commitments. Actual contract rates depend on current equipment pool availability, customer credit rating, commodity corrosiveness, and specific interchange delivery sidings.',
    },
    {
      q: 'Can I lease just 1 or 2 railcars, or is there a minimum fleet size?',
      a: 'We work with single spot railcars as well as 100+ car unit-train blocks. While per-car administration is slightly higher for 1–2 car placements, we support small-volume shippers who need seasonal bridge capacity or trial sidings.',
    },
    {
      q: 'How does railcar leasing compare to long-haul semi-trucking costs?',
      a: 'A single modern railcar carries between 3 and 4 semi-truckloads (up to 110 tons). On haul lengths exceeding 400 miles, shipping by rail typically reduces ton-mile transportation costs by 40% to 65% while reducing fuel consumption and greenhouse gas emissions by up to 75%.',
    },
    {
      q: 'Are wheelset wear and scheduled teardown inspections covered?',
      a: 'Yes, on all Full-Service lease agreements, ordinary wheelset flange wear, brake shoe renewals, and scheduled FRA quadrennial inspections are covered by the lessor. Damage caused by improper terminal loading or derailment remains the lessee’s responsibility under standard AAR interchange rules.',
    },
  ];

  return (
    <div className="cost-estimator-page">
      {/* =========================================================================
          HERO BANNER (Solid Deep Black #0A0A09 with Red Accent Border)
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#EDE6D4',
          padding: '5rem 0 4rem',
          borderBottom: '3px solid #AA2E1F',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '860px' }}>
            <span className="eyebrow eyebrow-dark">
              Financial Planning &bull; Equipment Cost Calculator
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
              Railcar Lease Cost Estimator
            </h1>
            <p style={{ fontSize: '1.18rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '2rem' }}>
              Calculate realistic monthly and annual lease rates across all seven railcar categories.
              Select your car size, lease structure (Full-Service vs. Net), term duration, and fleet count
              to obtain immediate budget projections.
            </p>

            {/* Trust Highlights with clean solid dots */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.75rem',
                alignItems: 'center',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.14)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>Transparent Ballpark Benchmarks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>Full-Service &amp; Net Lease Options</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>Direct RFP &amp; Quote Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN ESTIMATOR INTERFACE (2-Column Architecture)
          ========================================================================= */}
      <section className="section section-white" style={{ paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
        <div className="container">
          <div className="estimator-layout">
            {/* -------------------------------------------------------------------
                LEFT COLUMN: INTERACTIVE CONTROLS
                ------------------------------------------------------------------- */}
            <div className="estimator-controls-panel">
              {/* Step 1: Equipment Class Picker */}
              <div className="estimator-step-card">
                <div className="step-badge-row">
                  <span className="step-num-pill">01</span>
                  <label className="step-label">Select Railcar Category</label>
                </div>
                <p className="step-instruction">
                  Choose from North America's seven primary industrial freight car types:
                </p>

                <div className="equipment-selector-grid">
                  {ESTIMATOR_EQUIPMENT_DATA.map((item) => {
                    const isSelected = item.slug === selectedCategorySlug;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleCategoryChange(item.slug)}
                        className={`equipment-select-btn ${isSelected ? 'active' : ''}`}
                      >
                        <div className="equipment-btn-thumb">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="equipment-btn-info">
                          <span className="equipment-btn-title">{item.name}</span>
                          <span className="equipment-btn-sub">{item.eyebrow}</span>
                        </div>
                        {isSelected && (
                          <div className="selected-indicator-dot">
                            <Check size={12} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Car Sizes & Capacities */}
              <div className="estimator-step-card">
                <div className="step-badge-row">
                  <span className="step-num-pill">02</span>
                  <label className="step-label">Select Size &amp; Cubic / Gallon Capacity</label>
                </div>
                <p className="step-instruction">
                  Specific dimensional configurations for <strong>{currentCategory.name}</strong>:
                </p>

                <div className="size-options-list">
                  {currentCategory.sizesAndCapacities.map((size, idx) => {
                    const isChosen = selectedSizeIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`size-card-btn ${isChosen ? 'selected' : ''}`}
                      >
                        <div className="size-card-header">
                          <strong className="size-name">{size.name}</strong>
                          <span className="size-capacity-tag">{size.capacity}</span>
                        </div>
                        <p className="size-desc">{size.description}</p>
                        <div className="size-cargo">
                          <span className="cargo-label">Typical Cargo:</span> {size.commonCargo}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Lease Structure (Full-Service vs. Net) */}
              <div className="estimator-step-card">
                <div className="step-badge-row">
                  <span className="step-num-pill">03</span>
                  <label className="step-label">Select Lease Structure</label>
                </div>
                <p className="step-instruction">
                  Determine whether you require full maintenance coverage or will maintain the equipment in-house:
                </p>

                <div className="lease-type-grid">
                  <div
                    onClick={() => setLeaseType('full')}
                    className={`lease-type-card ${leaseType === 'full' ? 'active' : ''}`}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="lease-type-header">
                      <div className="lease-type-title-wrap">
                        <ShieldCheck size={18} style={{ color: leaseType === 'full' ? '#AA2E1F' : '#64748B' }} />
                        <strong>Full-Service Lease</strong>
                      </div>
                      <span className="badge-recommended">Recommended</span>
                    </div>
                    <p className="lease-type-desc">
                      Lessor manages routine wheelset renewals, brake tests, FRA safety certifications, and running repairs.
                      Zero unpredictable maintenance exposure for shippers.
                    </p>
                    <div className="lease-type-perks">
                      <span>&bull; AAR mechanical risk covered</span>
                      <span>&bull; 24/7 technical dispatch</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setLeaseType('net')}
                    className={`lease-type-card ${leaseType === 'net' ? 'active' : ''}`}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="lease-type-header">
                      <div className="lease-type-title-wrap">
                        <Wrench size={18} style={{ color: leaseType === 'net' ? '#AA2E1F' : '#64748B' }} />
                        <strong>Net Lease</strong>
                      </div>
                      <span className="badge-lower-cost">Lower Base Rate</span>
                    </div>
                    <p className="lease-type-desc">
                      Lessee assumes direct financial and administrative responsibility for all maintenance, inspections,
                      and wheelset wear during the lease term.
                    </p>
                    <div className="lease-type-perks">
                      <span>&bull; Best for large fleet operators</span>
                      <span>&bull; Reduced monthly fixed cost</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Term & Fleet Quantity */}
              <div className="estimator-step-card">
                <div className="step-badge-row">
                  <span className="step-num-pill">04</span>
                  <label className="step-label">Lease Term &amp; Fleet Quantity</label>
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                  <label className="sub-input-label">Lease Duration</label>
                  <div className="term-cards-grid">
                    {LEASE_TERM_OPTIONS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTermId(t.id)}
                        className={`term-btn ${termId === t.id ? 'active' : ''}`}
                      >
                        <strong>{t.name}</strong>
                        <span>{t.note}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <label className="sub-input-label" style={{ margin: 0 }}>Fleet Size (Number of Cars)</label>
                    <span className="quantity-count-badge">
                      <strong>{quantity}</strong> {quantity === 1 ? 'Railcar' : 'Railcars'}
                      {volumeDiscount < 1.0 && (
                        <span className="volume-discount-pill">
                          -{Math.round((1 - volumeDiscount) * 100)}% Volume Tier
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="quantity-slider"
                  />

                  {/* Quantity Preset Buttons */}
                  <div className="quantity-presets">
                    {[1, 5, 10, 20, 35, 50].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuantity(num)}
                        className={`preset-btn ${quantity === num ? 'active' : ''}`}
                      >
                        {num} {num === 1 ? 'Car' : 'Cars'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 5: Interchange Gateway */}
              <div className="estimator-step-card">
                <div className="step-badge-row">
                  <span className="step-num-pill">05</span>
                  <label className="step-label">Delivery Region &amp; Interchange Gateway</label>
                </div>
                <p className="step-instruction">
                  Select your primary Class I interchange origin or destination area:
                </p>

                <div className="region-select-wrap">
                  <select
                    value={regionId}
                    onChange={(e) => setRegionId(e.target.value)}
                    className="region-select"
                  >
                    {INTERCHANGE_REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                RIGHT COLUMN: EXECUTIVE COMMERCIAL TERM SHEET CARD (Sticky)
                ------------------------------------------------------------------- */}
            {/* -------------------------------------------------------------------
                RIGHT COLUMN: INDICATIVE MARKET BENCHMARK CARD (Sticky & Compact)
                ------------------------------------------------------------------- */}
            <div className="estimator-sidebar-col">
              <div className="estimator-summary-card">
                {/* Executive Top Banner */}
                <div className="benchmark-card-header">
                  <div className="benchmark-header-left">
                    <span className="benchmark-dot" />
                    <span className="benchmark-eyebrow">CRC Rail Desk</span>
                  </div>
           
                </div>

                <div className="summary-card-body">
                  {/* Category Title & Equipment Profile */}
                  <div className="summary-header">
                    <h3 className="summary-title">{currentCategory.name}</h3>
                    <div className="summary-subtitle">
                      {currentSize.name} &bull; <strong>{quantity} {quantity === 1 ? 'Railcar' : 'Railcars'}</strong>
                    </div>
                  </div>

                  {/* Primary Rate Box */}
                  <div className="summary-rate-box">
                    <span className="summary-rate-label">Estimated Monthly Rate</span>
                    <div className="summary-rate-value">
                      {formatCur(calculation.minRate)} – {formatCur(calculation.maxRate)}
                    </div>
                    <div className="summary-rate-unit">
                      per car / month &bull; {leaseType === 'full' ? 'Full-Service (Maintenance Included)' : 'Net Lease (Lessee Maintained)'}
                    </div>
                  </div>

                  {/* Clean Ledger Breakdown */}
                  <div className="summary-metrics-list">
                    <div className="summary-metric-row highlight">
                      <span className="metric-label">Monthly Fleet Total</span>
                      <strong className="metric-val primary">
                        {formatCur(calculation.totalMinMonthly)} – {formatCur(calculation.totalMaxMonthly)}/mo
                      </strong>
                    </div>

                    <div className="summary-metric-row">
                      <span className="metric-label">Annualized Fleet Budget</span>
                      <strong className="metric-val">
                        {formatCur(calculation.totalMinAnnual)} – {formatCur(calculation.totalMaxAnnual)}/yr
                      </strong>
                    </div>

                    <div className="summary-metric-row">
                      <span className="metric-label">Term Commitment</span>
                      <span className="metric-text">{termOption.name}</span>
                    </div>

                    {volumeDiscount < 1.0 && (
                      <div className="summary-metric-row discount-row">
                        <span className="metric-label">Volume Tier Discount</span>
                        <span className="discount-tag">
                          -{Math.round((1 - volumeDiscount) * 100)}% Volume Applied
                        </span>
                      </div>
                    )}

                    <div className="summary-metric-row subtle-row">
                      <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Truck size={13} style={{ color: '#2563EB' }} />
                        Highway Relief
                      </span>
                      <span className="metric-text">
                        ~{calculation.trucksReplacedMin}–{calculation.trucksReplacedMax} semi-trucks
                      </span>
                    </div>
                  </div>

                  {/* Primary Call to Action */}
                  <div className="summary-actions">
                    <button
                      type="button"
                      onClick={handleTransferToQuote}
                      className="summary-cta-btn"
                    >
                      <span>Request Official Quote with Estimate</span>
                      <ArrowRight size={17} style={{ flexShrink: 0 }} />
                    </button>

                    <div className="summary-secondary-actions">
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="sublink-btn"
                      >
                        {copied ? <Check size={13} style={{ color: '#059669' }} /> : <Copy size={13} />}
                        <span>{copied ? 'Summary Copied!' : 'Copy Estimate'}</span>
                      </button>

                      <Link
                        to="/book-a-call"
                        className="sublink-btn"
                      >
                        <PhoneCall size={13} />
                        <span>Speak with Desk</span>
                      </Link>
                    </div>
                  </div>

                  {/* Footnote */}
                  <p className="summary-disclaimer">
                    *Indicative benchmark for capital budgeting. Formal quote confirmed upon siding inspection and credit review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DETAILED EQUIPMENT GUIDE: SIZES, CAPACITIES & INDUSTRIES SERVED
          (Directly fulfilling user's explicit outline specification)
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow">Comprehensive Equipment Reference</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.85rem' }}>
              Equipment Sizing, Capacities &amp; Industries Served
            </h2>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7 }}>
              Review detailed dimensions, cubic volume configurations, and industrial applications
              across each of our seven primary freight equipment categories.
            </p>
          </div>

          {/* Guide Category Tabs */}
          <div className="guide-tabs-container">
            {ESTIMATOR_EQUIPMENT_DATA.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setActiveGuideTab(item.slug)}
                className={`guide-tab-btn ${activeGuideTab === item.slug ? 'active' : ''}`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Active Guide Card */}
          {(() => {
            const guideItem =
              ESTIMATOR_EQUIPMENT_DATA.find((item) => item.slug === activeGuideTab) ||
              ESTIMATOR_EQUIPMENT_DATA[0];

            return (
              <div className="guide-card-full">
                {/* Top Section */}
                <div className="guide-card-top-grid">
                  <div className="guide-img-container">
                    <img
                      src={guideItem.image}
                      alt={guideItem.imageAlt}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="guide-img-overlay">
                      <span className="guide-tag">{guideItem.eyebrow}</span>
                    </div>
                  </div>

                  <div className="guide-header-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <span className="guide-type-eyebrow">Equipment Profile</span>
                        <h3 className="guide-title">{guideItem.name}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategorySlug(guideItem.slug);
                          setSelectedSizeIndex(0);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <Calculator size={14} />
                        Load Into Estimator
                      </button>
                    </div>

                    <div className="guide-industry-callout">
                      <h4 className="guide-industry-title">
                        {guideItem.industriesServed.title}
                      </h4>
                      <p className="guide-industry-desc">
                        {guideItem.industriesServed.description}
                      </p>

                      <div className="guide-sectors-chips">
                        {guideItem.industriesServed.sectors.map((sec, sIdx) => (
                          <span key={sIdx} className="sector-chip">
                            &bull; {sec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sizes and Capacities Breakdown Table */}
                <div style={{ padding: '2rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '1.25rem' }}>
                    Available Car Sizes, Cubic Dimensions &amp; Typical Cargo
                  </h4>

                  <div className="sizes-table-wrap">
                    <table className="sizes-spec-table">
                      <thead>
                        <tr>
                          <th style={{ width: '22%' }}>Car Size / Config</th>
                          <th style={{ width: '28%' }}>Capacity &amp; Clearance</th>
                          <th style={{ width: '26%' }}>Typical Commodities</th>
                          <th style={{ width: '24%' }}>Operational Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guideItem.sizesAndCapacities.map((cfg, cIdx) => (
                          <tr key={cIdx}>
                            <td>
                              <strong>{cfg.name}</strong>
                            </td>
                            <td>
                              <span className="capacity-badge-table">{cfg.capacity}</span>
                            </td>
                            <td>{cfg.commonCargo}</td>
                            <td>
                              <span style={{ fontSize: '0.88rem', color: '#475569' }}>
                                {cfg.description}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mechanical & Discharge Strip */}
                  <div className="guide-specs-strip">
                    <div className="spec-strip-col">
                      <span className="spec-col-label">Loading &amp; Discharge Interface</span>
                      <p className="spec-col-val">{guideItem.dischargeAndLoading}</p>
                    </div>
                    <div className="spec-strip-col">
                      <span className="spec-col-label">AAR Mechanical &amp; Structural Profile</span>
                      <p className="spec-col-val">{guideItem.mechanicalProfile}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION SECTION
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow">Frequently Asked Questions</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
              Railcar Cost Estimator FAQs
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.6 }}>
              Common questions from shippers evaluating equipment lease budgets and interchange delivery.
            </p>
          </div>

          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="faq-accordion-item">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="faq-question-btn"
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{faq.q}</span>
                    <span className={`faq-icon ${isOpen ? 'open' : ''}`}>+</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
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
          padding: '5rem 0',
          borderTop: '3px solid #AA2E1F',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                color: '#FFFFFF',
                marginBottom: '1rem',
                lineHeight: 1.2,
              }}
            >
              Ready for a Binding Commercial Quote?
            </h2>
            <p
              style={{
                color: '#94A3B8',
                fontSize: '1.08rem',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              Our leasing team will cross-reference your specific siding locations, Class I railroad connections,
              and mechanical requirements to confirm exact equipment pool availability.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={handleTransferToQuote}
                className="btn btn-primary btn-lg"
              >
                <FileText size={18} />
                Submit Quote Request With Estimate
              </button>
              <Link to="/book-a-call" className="btn btn-outline-white btn-lg">
                <PhoneCall size={18} />
                Book Fleet Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Floating Sticky Action Bar */}
      <div className="mobile-floating-estimator-bar">
        <div className="mobile-dock-left">
          <span className="mobile-dock-label">
            {currentCategory.name} &bull; {quantity} {quantity === 1 ? 'Car' : 'Cars'}
          </span>
          <div className="mobile-dock-rate">
            {formatCur(calculation.minRate)} – {formatCur(calculation.maxRate)}
            <span style={{ fontSize: '0.66rem', color: '#94A3B8', fontWeight: 500, marginLeft: '3px' }}>/mo</span>
          </div>
          <span className="mobile-dock-sub">
            Fleet: {formatCur(calculation.totalMinMonthly)}–{formatCur(calculation.totalMaxMonthly)}/mo
          </span>
        </div>
        <button
          type="button"
          onClick={handleTransferToQuote}
          className="mobile-dock-btn"
        >
          <span>Get Quote</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* =========================================================================
          PAGE SPECIFIC STYLING
          ========================================================================= */}
      <style>{`
        .estimator-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2.5rem;
          alignItems: flex-start;
        }

        .estimator-controls-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .estimator-step-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.75rem;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.04);
        }

        .step-badge-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.4rem;
        }

        .step-num-pill {
          background-color: #AA2E1F;
          color: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          letter-spacing: 0.04em;
        }

        .step-label {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0A0A09;
        }

        .step-instruction {
          font-size: 0.92rem;
          color: #64748B;
          margin: 0 0 1.25rem 0;
          line-height: 1.5;
        }

        /* Equipment Category Grid */
        .equipment-selector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.85rem;
        }

        .equipment-select-btn {
          position: relative;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-align: left;
          cursor: pointer;
          transition: all 180ms ease;
        }

        .equipment-select-btn:hover {
          background-color: #FFFFFF;
          border-color: #CBD5E1;
          transform: translateY(-2px);
          box-shadow: 0 6px 14px -2px rgba(15, 23, 42, 0.06);
        }

        .equipment-select-btn.active {
          background-color: #FFFFFF;
          border-color: #AA2E1F;
          box-shadow: 0 0 0 2px rgba(170, 46, 31, 0.15), 0 8px 18px -4px rgba(170, 46, 31, 0.12);
        }

        .equipment-btn-thumb {
          width: 50px;
          height: 42px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          background-color: #E2E8F0;
        }

        .equipment-btn-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .equipment-btn-info {
          flex: 1;
          min-width: 0;
        }

        .equipment-btn-title {
          display: block;
          font-size: 0.94rem;
          font-weight: 700;
          color: #0A0A09;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .equipment-btn-sub {
          display: block;
          font-size: 0.75rem;
          color: #64748B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .selected-indicator-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          background-color: #AA2E1F;
          color: #FFFFFF;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Size Options Cards */
        .size-options-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .size-card-btn {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          text-align: left;
          cursor: pointer;
          transition: all 180ms ease;
        }

        .size-card-btn:hover {
          background-color: #FFFFFF;
          border-color: #CBD5E1;
        }

        .size-card-btn.selected {
          background-color: #FFFFFF;
          border-color: #AA2E1F;
          border-left: 4px solid #AA2E1F;
          box-shadow: 0 4px 16px -2px rgba(170, 46, 31, 0.08);
        }

        .size-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.35rem;
          flex-wrap: wrap;
        }

        .size-name {
          font-size: 1rem;
          color: #0A0A09;
        }

        .size-capacity-tag {
          font-size: 0.82rem;
          background-color: #EDE6D4;
          color: #4A3B2C;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .size-desc {
          font-size: 0.88rem;
          color: #475569;
          margin: 0 0 0.5rem 0;
          line-height: 1.5;
        }

        .size-cargo {
          font-size: 0.82rem;
          color: #64748B;
        }

        .cargo-label {
          font-weight: 600;
          color: #334155;
        }

        /* Lease Type Grid */
        .lease-type-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .lease-type-card {
          border: 2px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 180ms ease;
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
        }

        .lease-type-card:hover {
          border-color: #CBD5E1;
        }

        .lease-type-card.active {
          border-color: #AA2E1F;
          background-color: #FDFBFA;
          box-shadow: 0 6px 18px -3px rgba(170, 46, 31, 0.1);
        }

        .lease-type-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.65rem;
          gap: 0.5rem;
        }

        .lease-type-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.02rem;
          color: #0A0A09;
        }

        .badge-recommended {
          background-color: #AA2E1F;
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge-lower-cost {
          background-color: #ECFDF5;
          color: #059669;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .lease-type-desc {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 0.85rem 0;
          flex: 1;
        }

        .lease-type-perks {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.82rem;
          color: #059669;
          font-weight: 600;
        }

        /* Term Cards */
        .sub-input-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.5rem;
        }

        .term-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .term-btn {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 0.75rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          transition: all 180ms ease;
        }

        .term-btn:hover {
          background-color: #FFFFFF;
          border-color: #CBD5E1;
        }

        .term-btn.active {
          background-color: #FFFFFF;
          border-color: #AA2E1F;
          border-top: 3px solid #AA2E1F;
        }

        .term-btn strong {
          font-size: 0.88rem;
          color: #0A0A09;
        }

        .term-btn span {
          font-size: 0.76rem;
          color: #64748B;
          line-height: 1.35;
        }

        /* Quantity Slider & Presets */
        .quantity-count-badge {
          font-size: 0.95rem;
          color: #0A0A09;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .volume-discount-pill {
          background-color: #ECFDF5;
          color: #059669;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          border: 1px solid #A7F3D0;
        }

        .quantity-slider {
          width: 100%;
          height: 8px;
          border-radius: 5px;
          background: #E2E8F0;
          outline: none;
          margin: 0.75rem 0 1rem 0;
          accent-color: #AA2E1F;
          cursor: pointer;
        }

        .quantity-presets {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .preset-btn {
          background-color: #F1F5F9;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 0.35rem 0.85rem;
          font-size: 0.84rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .preset-btn:hover {
          background-color: #FFFFFF;
          border-color: #CBD5E1;
        }

        .preset-btn.active {
          background-color: #0A0A09;
          color: #FFFFFF;
          border-color: #0A0A09;
        }

        /* Region Select */
        .region-select-wrap {
          position: relative;
        }

        .region-select {
          width: 100%;
          padding: 0.85rem 1rem;
          font-size: 0.94rem;
          color: #0A0A09;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
          cursor: pointer;
          transition: border-color 180ms ease;
        }

        .region-select:focus {
          border-color: #AA2E1F;
          background-color: #FFFFFF;
        }

        /* Right Sticky Card */
        .estimator-sidebar-col {
          position: relative;
        }

        .estimator-summary-card {
          position: sticky;
          top: calc(var(--header-height, 74px) + 12px);
          background-color: #FFFFFF;
          border: 1px solid #DCE3EB;
          border-radius: 12px;
          box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04);
          overflow: hidden;
          max-height: calc(100vh - 92px);
          overflow-y: auto;
          scrollbar-width: thin;
        }

        /* Top Executive Header */
        .benchmark-card-header {
          background-color: #0A0A09;
          padding: 0.7rem 1.15rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #AA2E1F;
        }

        .benchmark-header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .benchmark-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #ffffff;
          display: inline-block;
          flex-shrink: 0;
        }

        .benchmark-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          color: #EDE6D4;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .benchmark-source-pill {
          font-size: 0.68rem;
          font-weight: 600;
          color: #94A3B8;
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.03em;
        }

        .summary-card-body {
          padding: 1rem 1.15rem 0.9rem 1.15rem;
        }

        .summary-header {
          margin-bottom: 0.75rem;
        }

        .summary-title {
          font-size: 1.22rem;
          font-weight: 800;
          color: #0A0A09;
          margin: 0 0 0.15rem 0;
          line-height: 1.2;
        }

        .summary-subtitle {
          font-size: 0.80rem;
          color: #64748B;
          line-height: 1.3;
        }

        .summary-rate-box {
          background: linear-gradient(180deg, #FAF8F5 0%, #F5F1EB 100%);
          border: 1px solid #EADBCC;
          border-left: 3px solid #059669;
          border-radius: 8px;
          padding: 0.75rem 0.95rem;
          margin-bottom: 0.75rem;
        }

        .summary-rate-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 700;
          color: #8C7B68;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.15rem;
        }

        .summary-rate-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: #047857;
          font-family: var(--font-heading);
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 0.15rem;
        }

        .summary-rate-unit {
          font-size: 0.74rem;
          color: #64748B;
          line-height: 1.2;
        }

        /* Metric Rows */
        .summary-metrics-list {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.75rem;
        }

        .summary-metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.38rem 0;
          border-bottom: 1px solid #F1F5F9;
          font-size: 0.80rem;
          gap: 0.5rem;
        }

        .summary-metric-row.highlight {
          background-color: #F0FDF4;
          border: 1px solid #DCFCE7;
          border-radius: 6px;
          padding: 0.45rem 0.6rem;
          margin: 0.1rem 0 0.25rem 0;
        }

        .summary-metric-row.subtle-row {
          border-bottom: none;
          padding-top: 0.38rem;
        }

        .metric-label {
          color: #475569;
          font-size: 0.78rem;
        }

        .metric-val {
          color: #0A0A09;
          font-weight: 700;
          text-align: right;
          font-size: 0.82rem;
        }

        .metric-val.primary {
          color: #047857;
          font-weight: 800;
          font-size: 0.90rem;
        }

        .metric-text {
          color: #0A0A09;
          font-weight: 600;
          font-size: 0.78rem;
          text-align: right;
        }

        .discount-row {
          background-color: #ECFDF5;
          border: 1px solid #A7F3D0;
          border-radius: 6px;
          padding: 0.3rem 0.5rem;
          margin: 0.15rem 0;
        }

        .discount-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #059669;
        }

        /* Actions */
        .summary-actions {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 0.6rem;
        }

        .summary-cta-btn {
          width: 100% !important;
          background-color: #AA2E1F !important;
          color: #FFFFFF !important;
          border: 1px solid #91271A !important;
          border-radius: 7px !important;
          padding: 0.75rem 0.85rem !important;
          font-size: 0.86rem !important;
          font-weight: 700 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.45rem !important;
          cursor: pointer !important;
          transition: all 180ms ease !important;
          white-space: normal !important;
          word-break: normal !important;
          text-align: center !important;
          line-height: 1.2 !important;
          box-shadow: 0 4px 12px rgba(170, 46, 31, 0.22) !important;
          text-decoration: none !important;
        }

        .summary-cta-btn:hover {
          background-color: #8F2619 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 16px rgba(170, 46, 31, 0.3) !important;
        }

        .summary-secondary-actions {
          display: flex;
          gap: 0.4rem;
        }

        .sublink-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.42rem 0.5rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          cursor: pointer;
          transition: all 160ms ease;
          white-space: nowrap;
        }

        .sublink-btn:hover {
          background-color: #EDE6D4;
          color: #0A0A09;
          border-color: #CBD5E1;
        }

        .summary-disclaimer {
          font-size: 0.66rem;
          color: #94A3B8;
          line-height: 1.35;
          margin: 0;
          text-align: center;
        }

        /* Detailed Guide Tabs */
        .guide-tabs-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.45rem;
          margin-bottom: 2rem;
          overflow: visible;
        }

        .guide-tab-btn {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 7px;
          padding: 0.45rem 0.95rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          white-space: nowrap;
          transition: all 180ms ease;
        }

        .guide-tab-btn:hover {
          background-color: #F8FAFC;
          color: #0A0A09;
          border-color: #CBD5E1;
        }

        .guide-tab-btn.active {
          background-color: #AA2E1F;
          color: #FFFFFF;
          border-color: #AA2E1F;
          box-shadow: 0 3px 10px rgba(170, 46, 31, 0.2);
        }

        .guide-card-full {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.06);
        }

        .guide-card-top-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          border-bottom: 1px solid #F1F5F9;
        }

        .guide-img-container {
          position: relative;
          height: 100%;
          min-height: 240px;
          background-color: #0A0A09;
        }

        .guide-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .guide-img-overlay {
          position: absolute;
          bottom: 12px;
          left: 12px;
        }

        .guide-tag {
          background-color: rgba(10, 10, 9, 0.85);
          color: #EDE6D4;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          letter-spacing: 0.04em;
        }

        .guide-header-info {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .guide-type-eyebrow {
          font-size: 0.78rem;
          font-weight: 700;
          color: #AA2E1F;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .guide-title {
          font-size: 1.65rem;
          font-weight: 800;
          color: #0A0A09;
          margin: 0.25rem 0 1rem 0;
        }

        .guide-industry-callout {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-left: 3px solid #AA2E1F;
          border-radius: 8px;
          padding: 1.1rem;
        }

        .guide-industry-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0A0A09;
          margin: 0 0 0.35rem 0;
        }

        .guide-industry-desc {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.55;
          margin: 0 0 0.85rem 0;
        }

        .guide-sectors-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .sector-chip {
          background-color: #FFFFFF;
          border: 1px solid #CBD5E1;
          color: #334155;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }

        /* Spec Table */
        .sizes-table-wrap {
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }

        .sizes-spec-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          text-align: left;
        }

        .sizes-spec-table th {
          background-color: #F8FAFC;
          padding: 0.75rem 1rem;
          font-weight: 700;
          color: #334155;
          border-bottom: 2px solid #E2E8F0;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sizes-spec-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: top;
          color: #334155;
        }

        .capacity-badge-table {
          display: inline-block;
          background-color: #F1F5F9;
          color: #0A0A09;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          font-size: 0.82rem;
        }

        .guide-specs-strip {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          background-color: #FAF8F5;
          border: 1px solid #EADBCC;
          border-radius: 10px;
          padding: 1.25rem;
        }

        .spec-col-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #AA2E1F;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.35rem;
        }

        .spec-col-val {
          font-size: 0.88rem;
          color: #334155;
          line-height: 1.5;
          margin: 0;
        }

        /* Lease Matrix Table */
        .lease-comparison-table-wrap {
          overflow-x: auto;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          background-color: #FFFFFF;
        }

        .lease-matrix-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.92rem;
          text-align: left;
        }

        .lease-matrix-table th {
          padding: 1.1rem 1.25rem;
          font-size: 0.94rem;
          font-weight: 700;
          color: #0A0A09;
          border-bottom: 2px solid #E2E8F0;
        }

        .lease-matrix-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
          color: #334155;
        }

        .matrix-sub {
          display: block;
          font-size: 0.78rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        .status-badge-green {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #059669;
          font-weight: 700;
          font-size: 0.88rem;
        }

        .status-badge-gray {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #64748B;
          font-weight: 500;
          font-size: 0.88rem;
        }

        /* FAQ Accordion */
        .faq-accordion-item {
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          margin-bottom: 0.75rem;
          background-color: #FFFFFF;
          overflow: hidden;
        }

        .faq-question-btn {
          width: 100%;
          padding: 1.15rem 1.35rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 1rem;
        }

        .faq-question-text {
          font-size: 1.02rem;
          font-weight: 700;
          color: #0A0A09;
        }

        .faq-icon {
          font-size: 1.35rem;
          font-weight: 400;
          color: #AA2E1F;
          line-height: 1;
          transition: transform 200ms ease;
        }

        .faq-icon.open {
          transform: rotate(45deg);
        }

        .faq-answer-panel {
          padding: 0 1.35rem 1.25rem 1.35rem;
          font-size: 0.94rem;
          color: #475569;
          line-height: 1.65;
        }

        .faq-answer-panel p {
          margin: 0;
        }

        /* =========================================================================
           MOBILE & TABLET RESPONSIVE STYLING
           ========================================================================= */
        @media (max-width: 992px) {
          .estimator-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .estimator-sidebar-col {
            order: 2;
          }

          .estimator-controls-panel {
            order: 1;
            gap: 1.25rem;
          }

          .estimator-summary-card {
            position: static;
            top: auto;
            max-height: none;
            overflow: visible;
          }

          .guide-card-top-grid {
            grid-template-columns: 1fr;
          }

          .guide-img-container {
            height: 200px;
          }
        }

        @media (max-width: 768px) {
          /* Add bottom padding so floating dock bar does not overlap content */
          .cost-estimator-page {
            padding-bottom: 78px;
          }

          /* Step cards: compact padding and clean spacing */
          .estimator-step-card {
            padding: 1rem 0.9rem;
            border-radius: 10px;
          }

          .step-badge-row {
            gap: 0.5rem;
            margin-bottom: 0.25rem;
          }

          .step-num-pill {
            font-size: 0.72rem;
            padding: 0.15rem 0.45rem;
          }

          .step-label {
            font-size: 1.02rem;
          }

          .step-instruction {
            font-size: 0.82rem;
            margin-bottom: 0.75rem;
            line-height: 1.4;
          }

          /* Step 1: Equipment Categories in a compact 2-column grid instead of 7 tall vertical cards */
          .equipment-selector-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }

          .equipment-select-btn {
            padding: 0.5rem 0.55rem;
            gap: 0.45rem;
            border-radius: 8px;
          }

          .equipment-btn-thumb {
            width: 38px;
            height: 32px;
            border-radius: 4px;
          }

          .equipment-btn-title {
            font-size: 0.80rem;
            line-height: 1.25;
            white-space: normal;
            word-break: normal;
          }

          .equipment-btn-sub {
            display: none; /* Hide verbose subtitle on mobile to keep items neat and compact */
          }

          .selected-indicator-dot {
            width: 14px;
            height: 14px;
            top: 4px;
            right: 4px;
          }

          .selected-indicator-dot svg {
            width: 9px;
            height: 9px;
          }

          /* Step 2: Compact Size Options - Unselected items collapse into neat 1-liners, selected item expands */
          .size-options-list {
            gap: 0.45rem;
          }

          .size-card-btn {
            padding: 0.55rem 0.75rem;
            border-radius: 8px;
            transition: all 180ms ease;
          }

          .size-card-btn:not(.selected) {
            background-color: #FFFFFF;
            border-color: #E2E8F0;
            padding: 0.55rem 0.75rem;
          }

          .size-card-btn:not(.selected) .size-desc,
          .size-card-btn:not(.selected) .size-cargo {
            display: none;
          }

          .size-card-btn.selected {
            background-color: #FDFBFA;
            padding: 0.75rem 0.85rem;
          }

          .size-card-header {
            margin-bottom: 0.15rem;
            gap: 0.4rem;
            align-items: baseline;
          }

          .size-card-btn:not(.selected) .size-card-header {
            margin-bottom: 0;
          }

          .size-name {
            font-size: 0.86rem;
          }

          .size-capacity-tag {
            font-size: 0.70rem;
            padding: 0.15rem 0.45rem;
          }

          .size-desc {
            font-size: 0.78rem;
            line-height: 1.35;
            margin: 0.25rem 0 0.25rem 0;
            color: #475569;
          }

          .size-cargo {
            font-size: 0.72rem;
            line-height: 1.3;
          }

          /* Step 3: Lease Types (Side-by-side 2-column) */
          .lease-type-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }

          .lease-type-card {
            padding: 0.75rem 0.65rem;
            border-radius: 8px;
          }

          .lease-type-header {
            margin-bottom: 0.35rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .lease-type-title-wrap {
            font-size: 0.86rem;
            gap: 0.35rem;
          }

          .badge-recommended, .badge-lower-cost {
            font-size: 0.64rem;
            padding: 0.1rem 0.35rem;
          }

          .lease-type-desc {
            font-size: 0.74rem;
            line-height: 1.35;
            margin-bottom: 0.35rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .lease-type-perks {
            font-size: 0.72rem;
            gap: 0.15rem;
          }

          /* Step 4: Term & Quantity (3-column compact) */
          .term-cards-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.4rem;
          }

          .term-btn {
            padding: 0.5rem 0.35rem;
            border-radius: 6px;
            text-align: center;
            align-items: center;
          }

          .term-btn strong {
            font-size: 0.76rem;
            text-align: center;
          }

          .term-btn span {
            font-size: 0.66rem;
            text-align: center;
            line-height: 1.2;
          }

          .quantity-count-badge {
            font-size: 0.84rem;
          }

          .volume-discount-pill {
            font-size: 0.68rem;
            padding: 0.1rem 0.4rem;
          }

          .quantity-presets {
            gap: 0.35rem;
          }

          .preset-btn {
            padding: 0.28rem 0.55rem;
            font-size: 0.76rem;
          }

          /* Step 5: Region Select */
          .region-select {
            padding: 0.65rem 0.75rem;
            font-size: 0.86rem;
          }

          /* Equipment Guide & Tabs */
          .guide-tabs-container {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.35rem;
            margin-bottom: 1.25rem;
            overflow: visible;
          }

          .guide-tab-btn {
            padding: 0.38rem 0.72rem;
            font-size: 0.76rem;
            border-radius: 6px;
          }

          .guide-header-info {
            padding: 1.25rem 1rem;
          }

          .guide-title {
            font-size: 1.3rem;
            margin-bottom: 0.65rem;
          }

          .guide-industry-callout {
            padding: 0.75rem 0.85rem;
          }

          .guide-industry-title {
            font-size: 0.88rem;
          }

          .guide-industry-desc {
            font-size: 0.80rem;
          }

          .sector-chip {
            font-size: 0.72rem;
          }

          .sizes-spec-table th, .sizes-spec-table td {
            padding: 0.55rem 0.65rem;
            font-size: 0.78rem;
          }

          .guide-specs-strip {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            padding: 0.85rem;
          }

          /* Floating Mobile Dock Bar */
          .mobile-floating-estimator-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background-color: #0A0A09;
            border-top: 2px solid #AA2E1F;
            padding: 0.65rem 1rem;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.35);
          }

          .mobile-dock-left {
            display: flex;
            flex-direction: column;
            gap: 0.1rem;
          }

          .mobile-dock-label {
            font-size: 0.64rem;
            font-weight: 700;
            text-transform: uppercase;
            color: #EDE6D4;
            letter-spacing: 0.05em;
          }

          .mobile-dock-rate {
            font-size: 1.15rem;
            font-weight: 800;
            color: #047857;
            background-color: #ECFDF5;
            padding: 0.1rem 0.45rem;
            border-radius: 4px;
            display: inline-flex;
            align-items: baseline;
            font-family: var(--font-heading);
            letter-spacing: -0.01em;
            line-height: 1.1;
          }

          .mobile-dock-sub {
            font-size: 0.66rem;
            color: #94A3B8;
          }

          .mobile-dock-btn {
            background-color: #AA2E1F;
            color: #FFFFFF;
            border: 1px solid #91271A;
            border-radius: 6px;
            padding: 0.6rem 0.95rem;
            font-size: 0.82rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.35rem;
            cursor: pointer;
            text-decoration: none;
            box-shadow: 0 2px 8px rgba(170, 46, 31, 0.4);
            white-space: nowrap;
          }

          .mobile-dock-btn:hover {
            background-color: #8F2619;
          }
        }

        /* Desktop: hide mobile floating dock */
        @media (min-width: 769px) {
          .mobile-floating-estimator-bar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

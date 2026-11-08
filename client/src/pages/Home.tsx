import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  FileText,
  Check,
  Calculator,
  PhoneCall,
  Building2,
  ChevronDown,
  User,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import {
  IconGasStation,
  IconTruck,
  IconChartLine,
  IconRoute,
  IconShieldCheck,
  IconHelpCircle,
  IconStack2,
  IconScale,
  IconAdjustmentsHorizontal,
  IconBuildingBank,
  IconCertificate,
  IconGitFork,
} from '@tabler/icons-react';
import { EQUIPMENT_CATEGORIES } from '../data/equipmentData';
import { submitInquiry } from '../services/api';
import type { InquiryResponse, InquiryPayload } from '../types';

// Interactive Sample Estimates for Homepage Benchmark Card
const HOME_SAMPLE_ESTIMATES = {
  'covered-hoppers': {
    category: 'Covered Hoppers',
    size: '5,161–5,400 cu ft Grain / Fertilizer',
    sizeParam: '5161-5400',
    quantity: 10,
    term: 'Medium-Term (1–3 Years)',
    termParam: 'medium',
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
    sizeParam: '50-ft-standard',
    quantity: 5,
    term: 'Medium-Term (1–3 Years)',
    termParam: 'medium',
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
    sizeParam: '25000-30000',
    quantity: 8,
    term: 'Long-Term (3–5 Years)',
    termParam: 'long',
    rateMin: '$880',
    rateMax: '$1,420',
    totalMin: '$7,040',
    totalMax: '$11,360',
    structure: 'Full-Service (Maint. Included)',
    trucks: '30–35 liquid tanker trucks',
    cargo: 'Biofuels, Chemicals & Food Oils',
  },
};

// Show only first 4 categories on home preview
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

// Hero Form Dropdown Options with Rich Metadata
const RAILCAR_TYPE_OPTIONS = [
  {
    value: 'Covered Hoppers',
    label: 'Covered Hoppers',
    detail: 'Grain, plastics & dry bulk',
    badge: 'Hoppers',
  },
  {
    value: 'Tank Cars',
    label: 'Tank Cars',
    detail: 'DOT-117, chemicals & biofuels',
    badge: 'DOT-117',
  },
  {
    value: 'Boxcars',
    label: 'Boxcars',
    detail: 'Paper rolls, food & cargo',
    badge: '50/60ft',
  },
  {
    value: 'Mill Gondolas',
    label: 'Mill Gondolas',
    detail: 'Steel coils & scrap metal',
    badge: 'Gondolas',
  },
  {
    value: 'Flatcars & Centerbeam',
    label: 'Flatcars & Centerbeam',
    detail: 'Lumber, steel & deck cargo',
    badge: 'Flatcars',
  },
  {
    value: 'Open-Top Hoppers',
    label: 'Open-Top Hoppers',
    detail: 'Aggregates, ballast & coal',
    badge: 'Aggregates',
  },
  {
    value: 'Other / Multiple Types',
    label: 'Other / Mixed Fleet',
    detail: 'Specialized equipment scope',
    badge: 'Custom',
  },
];

const QUANTITY_OPTIONS = [
  {
    value: '1–5 Cars',
    label: '1 – 5 Cars',
    detail: 'Spot & short-term surge',
    badge: 'Spot',
  },
  {
    value: '5–10 Cars',
    label: '5 – 10 Cars',
    detail: 'Standard facility car set',
    badge: 'Popular',
  },
  {
    value: '10–25 Cars',
    label: '10 – 25 Cars',
    detail: 'Commercial fleet batch',
    badge: 'Batch',
  },
  {
    value: '25–50 Cars',
    label: '25 – 50 Cars',
    detail: 'Dedicated program lease',
    badge: 'Program',
  },
  {
    value: '50+ Cars / Unit Train',
    label: '50+ Cars / Unit Train',
    detail: 'High-volume unit train',
    badge: 'Unit Train',
  },
];

// Comprehensive Services Data with Structured Points & Metadata
const SERVICES_DATA = [
  {
    id: 'full-service',
    title: 'Full-Service Operating Leases',
    subtitle: 'Turnkey fleet maintenance & capital budgeting',
    icon: IconStack2,
    iconBg: '#FDF2F0',
    iconColor: '#AA2E1F',
    points: [
      'AAR Rule 88 maintenance, repairs & wheelset renewals covered',
      'Periodic tank qualification & FRA safety inspections included',
      'Predictable fixed monthly budgeting with zero surprise repair bills',
    ],
    linkTo: '/cost-estimator',
    linkText: 'Model Full-Service Rates',
  },
  {
    id: 'net-leases',
    title: 'Net Leases & Capital Leases',
    subtitle: 'Lower base lease expense for captive loops',
    icon: IconScale,
    iconBg: '#ECFDF5',
    iconColor: '#059669',
    points: [
      'Substantially lower monthly base rental expense',
      'Shipper manages routine maintenance & authorized shop network',
      'Engineered for high-volume dedicated private carrier loops',
    ],
    linkTo: '/cost-estimator',
    linkText: 'Compare Net vs Full-Service',
  },
  {
    id: 'fleet-sourcing',
    title: 'Specialized Fleet Sourcing & Brokerage',
    subtitle: 'Immediate secondary market placement across North America',
    icon: IconAdjustmentsHorizontal,
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    points: [
      'Bypass 12–18 month OEM new car manufacturing lead times',
      'Verified secondary market car sets & off-lease private pools',
      'Immediate delivery cadence across 7 core freight railcar classes',
    ],
    linkTo: '/railcar-leasing',
    linkText: 'Explore Equipment Classes',
  },
  {
    id: 'sale-leaseback',
    title: 'Sale-Leaseback Fleet Financing',
    subtitle: 'Unlock balance sheet capital from private car fleets',
    icon: IconBuildingBank,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    points: [
      'Monetize company-owned railcars at fair market value (FMV)',
      'Immediate liquidity unlocked for plant or manufacturing expansion',
      'Cars leased right back with zero operational downtime or track shifting',
    ],
    linkTo: '/quote',
    linkText: 'Request Sourcing Proposal',
  },
  {
    id: 'aar-compliance',
    title: 'AAR Mechanical Compliance & Inspections',
    subtitle: 'Rigorous pre-trip qualification & safety appliances',
    icon: IconCertificate,
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED',
    points: [
      'Full Umler equipment registration & OT-5 loading authority',
      'Pre-trip Rule 88 certified mechanical inspection before interchange',
      'FRA Title 49 CFR safety appliance compliance across all lines',
    ],
    linkTo: '/company-values',
    linkText: 'Read Mechanical Standards',
  },
  {
    id: 'logistics-advisory',
    title: 'Siding & Interchange Logistics Advisory',
    subtitle: 'Facility track geometry & Class I carrier clearance',
    icon: IconGitFork,
    iconBg: '#FFFBEB',
    iconColor: '#B45309',
    points: [
      'Track curvature radius & AAR Plate B/C/F clearance verification',
      '263,000 lbs vs 286,000 lbs Gross Rail Load (GRL) siding match',
      'Continental interchange coordination across all 6 Class I carriers',
    ],
    linkTo: '/faq',
    linkText: 'Review Siding & Delivery FAQs',
  },
];

export const Home: React.FC = () => {
  const [sampleCategory, setSampleCategory] = useState<'covered-hoppers' | 'boxcars' | 'tank-cars'>('covered-hoppers');
  const activeSample = HOME_SAMPLE_ESTIMATES[sampleCategory];

  // Hero Equipment Sourcing Form State
  const [heroForm, setHeroForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    carType: 'Covered Hoppers',
    quantity: '5–10 Cars',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<InquiryResponse | null>(null);

  // Custom Dropdown Open States
  const [carTypeOpen, setCarTypeOpen] = useState(false);
  const [quantityOpen, setQuantityOpen] = useState(false);
  const carTypeRef = useRef<HTMLDivElement>(null);
  const quantityRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (carTypeRef.current && !carTypeRef.current.contains(e.target as Node)) {
        setCarTypeOpen(false);
      }
      if (quantityRef.current && !quantityRef.current.contains(e.target as Node)) {
        setQuantityOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCarTypeOpen(false);
        setQuantityOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.name.trim() || !heroForm.email.trim()) {
      alert('Please provide your full name and work email.');
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    const payload: InquiryPayload = {
      name: heroForm.name.trim(),
      company: heroForm.company.trim() || 'Not Specified',
      email: heroForm.email.trim(),
      phone: heroForm.phone.trim(),
      category: heroForm.carType,
      quantity: heroForm.quantity,
      message: `Hero Equipment Request: ${heroForm.carType} (${heroForm.quantity}). Company: ${heroForm.company || 'N/A'}. Phone: ${heroForm.phone || 'N/A'}. Notes: ${heroForm.notes || 'None'}`,
      type: 'quote',
      sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
    };

    const result = await submitInquiry(payload);
    setIsSubmitting(false);
    setSubmitResult(result);
  };

  const handleResetForm = () => {
    setSubmitResult(null);
    setCarTypeOpen(false);
    setQuantityOpen(false);
    setHeroForm({
      name: '',
      email: '',
      company: '',
      phone: '',
      carType: 'Covered Hoppers',
      quantity: '5–10 Cars',
      notes: '',
    });
  };

  return (
    <div className="home-page">
      {/* =========================================================================
          HERO SECTION WITH RESPONSIVE 2-COLUMN GRID & DIRECT LEAD FORM
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          minHeight: '84vh',
          display: 'flex',
          alignItems: 'center',
          padding: '4.5rem 0 4rem',
          zIndex: 5,
        }}
        className="home-hero-section"
      >
        {/* Background Image Container with overflow hidden to clip scaled image */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none' }}>
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
                transform: 'scale(1.02)',
              }}
            />
          </picture>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(10,10,9,0.97) 0%, rgba(10,10,9,0.92) 50%, rgba(10,10,9,0.72) 100%)',
            }}
          />
        </div>
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
          <div className="hero-grid">
            {/* Left Column: Heading, Proposition & Primary Links */}
            <div className="hero-text-col">
            

              {/* Semantic H1 with balanced, executive typography */}
              <h1
                className="hero-main-title"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  marginBottom: '0.85rem',
                }}
              >
                Railcar Leasing &amp; Fleet Sourcing <br />
                <span style={{ color: '#F87171' }}>Built Around</span> Your Operation.
              </h1>

              <p
                className="hero-main-desc"
                style={{
                  fontSize: 'clamp(0.92rem, 1.35vw, 1.05rem)',
                  lineHeight: 1.6,
                  color: '#CBD5E1',
                  marginBottom: '1.75rem',
                  maxWidth: '520px',
                }}
              >
                Coast Road Capital connects industrial shippers with verified railcar equipment and flexible lease frameworks across North America.
              </p>

              {/* Primary Action Buttons & Internal Links */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.85rem',
                  alignItems: 'center',
                }}
              >
                <Link to="/cost-estimator" className="btn btn-primary btn-lg">
                  <Calculator size={18} />
                  Cost Estimator
                </Link>
                <Link to="/railcar-leasing" className="btn btn-outline-white btn-lg">
                  Browse Equipment Catalog
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            {/* Right Column: Direct Railcar Equipment Lead Form */}
            <div className="hero-form-col">
              <div className="hero-lead-card">
                {/* Status Badge & Heading */}
                <div className="hero-card-header">
                  <h2 className="hero-card-title">
                    Request Railcar Availability
                  </h2>
                  <p className="hero-card-desc">
                    Direct lease pricing &amp; equipment placement across North America.
                  </p>
                </div>

                {submitResult?.success ? (
                  <div className="hero-success-state">
                    <CheckCircle2 size={32} style={{ color: '#10B981', margin: '0 auto 0.6rem' }} />
                    <h3 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '0.35rem', fontWeight: 700 }}>
                      Availability Request Received
                    </h3>
                    <p style={{ color: '#CBD5E1', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      Our commercial fleet team will verify equipment availability and respond within one business day.
                    </p>
                    <div className="hero-ref-badge">
                      Tracking Ref: <strong>{submitResult.referenceId}</strong>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="btn btn-outline-white btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.45rem 1rem' }}
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleHeroSubmit} className="hero-lead-form">
                    <div className="hero-fields-grid">
                      {/* Full Name */}
                      <div className="hero-input-group">
                        <label htmlFor="hero-name" className="hero-input-label">
                          Full Name <span className="req-star">*</span>
                        </label>
                        <div className="hero-field-wrapper">
                          <User size={15} className="hero-field-icon" />
                          <input
                            id="hero-name"
                            type="text"
                            required
                            value={heroForm.name}
                            onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                            placeholder="e.g. John Henderson"
                            className="hero-field-input"
                          />
                        </div>
                      </div>

                      {/* Work Email */}
                      <div className="hero-input-group">
                        <label htmlFor="hero-email" className="hero-input-label">
                          Work Email <span className="req-star">*</span>
                        </label>
                        <div className="hero-field-wrapper">
                          <Mail size={15} className="hero-field-icon" />
                          <input
                            id="hero-email"
                            type="email"
                            required
                            value={heroForm.email}
                            onChange={(e) => setHeroForm({ ...heroForm, email: e.target.value })}
                            placeholder="e.g. jhenderson@shipper.com"
                            className="hero-field-input"
                          />
                        </div>
                      </div>

                      {/* Company Name */}
                      <div className="hero-input-group">
                        <label htmlFor="hero-company" className="hero-input-label">
                          Company / Facility
                        </label>
                        <div className="hero-field-wrapper">
                          <Building2 size={15} className="hero-field-icon" />
                          <input
                            id="hero-company"
                            type="text"
                            value={heroForm.company}
                            onChange={(e) => setHeroForm({ ...heroForm, company: e.target.value })}
                            placeholder="e.g. Midwest Grain Logistics"
                            className="hero-field-input"
                          />
                        </div>
                      </div>

                      {/* Direct Phone */}
                      <div className="hero-input-group">
                        <label htmlFor="hero-phone" className="hero-input-label">
                          Phone Number
                        </label>
                        <div className="hero-field-wrapper">
                          <Phone size={15} className="hero-field-icon" />
                          <input
                            id="hero-phone"
                            type="tel"
                            value={heroForm.phone}
                            onChange={(e) => setHeroForm({ ...heroForm, phone: e.target.value })}
                            placeholder="e.g. (832) 555-0199"
                            className="hero-field-input"
                          />
                        </div>
                      </div>

                      {/* Railcar Category - Custom Dropdown */}
                      <div
                        className="hero-input-group"
                        ref={carTypeRef}
                        style={{ position: 'relative', zIndex: carTypeOpen ? 60 : 2 }}
                      >
                        <label className="hero-input-label" id="hero-cartype-label">
                          Railcar Type <span className="req-star">*</span>
                        </label>
                        <button
                          type="button"
                          aria-haspopup="listbox"
                          aria-expanded={carTypeOpen}
                          aria-labelledby="hero-cartype-label"
                          onClick={() => {
                            setCarTypeOpen(!carTypeOpen);
                            setQuantityOpen(false);
                          }}
                          className={`hero-custom-select-btn ${carTypeOpen ? 'active' : ''}`}
                        >
                          <span className="hero-select-value">
                            {RAILCAR_TYPE_OPTIONS.find((o) => o.value === heroForm.carType)?.label || heroForm.carType}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`hero-select-arrow ${carTypeOpen ? 'open' : ''}`}
                          />
                        </button>

                        {carTypeOpen && (
                          <div
                            role="listbox"
                            aria-labelledby="hero-cartype-label"
                            className="hero-custom-dropdown"
                          >
                            <div className="hero-dropdown-header">Select Equipment Class</div>
                            {RAILCAR_TYPE_OPTIONS.map((opt) => {
                              const isSelected = heroForm.carType === opt.value;
                              return (
                                <div
                                  key={opt.value}
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    setHeroForm({ ...heroForm, carType: opt.value });
                                    setCarTypeOpen(false);
                                  }}
                                  className={`hero-dropdown-option ${isSelected ? 'selected' : ''}`}
                                >
                                  <div className="hero-option-content">
                                    <div className="hero-option-main">
                                      <span className="hero-option-label">{opt.label}</span>
                                      {opt.badge && <span className="hero-option-badge">{opt.badge}</span>}
                                    </div>
                                    <span className="hero-option-detail">{opt.detail}</span>
                                  </div>
                                  {isSelected && <Check size={14} className="hero-option-check" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Quantity Required - Custom Dropdown */}
                      <div
                        className="hero-input-group"
                        ref={quantityRef}
                        style={{ position: 'relative', zIndex: quantityOpen ? 60 : 2 }}
                      >
                        <label className="hero-input-label" id="hero-quantity-label">
                          Quantity Required <span className="req-star">*</span>
                        </label>
                        <button
                          type="button"
                          aria-haspopup="listbox"
                          aria-expanded={quantityOpen}
                          aria-labelledby="hero-quantity-label"
                          onClick={() => {
                            setQuantityOpen(!quantityOpen);
                            setCarTypeOpen(false);
                          }}
                          className={`hero-custom-select-btn ${quantityOpen ? 'active' : ''}`}
                        >
                          <span className="hero-select-value">
                            {QUANTITY_OPTIONS.find((o) => o.value === heroForm.quantity)?.label || heroForm.quantity}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`hero-select-arrow ${quantityOpen ? 'open' : ''}`}
                          />
                        </button>

                        {quantityOpen && (
                          <div
                            role="listbox"
                            aria-labelledby="hero-quantity-label"
                            className="hero-custom-dropdown"
                          >
                            <div className="hero-dropdown-header">Select Fleet Commitment</div>
                            {QUANTITY_OPTIONS.map((opt) => {
                              const isSelected = heroForm.quantity === opt.value;
                              return (
                                <div
                                  key={opt.value}
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    setHeroForm({ ...heroForm, quantity: opt.value });
                                    setQuantityOpen(false);
                                  }}
                                  className={`hero-dropdown-option ${isSelected ? 'selected' : ''}`}
                                >
                                  <div className="hero-option-content">
                                    <div className="hero-option-main">
                                      <span className="hero-option-label">{opt.label}</span>
                                      {opt.badge && <span className="hero-option-badge">{opt.badge}</span>}
                                    </div>
                                    <span className="hero-option-detail">{opt.detail}</span>
                                  </div>
                                  {isSelected && <Check size={14} className="hero-option-check" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Notes / Siding - Full Width Span */}
                      <div className="hero-input-group hero-full-width">
                        <label htmlFor="hero-notes" className="hero-input-label">
                          Delivery Siding / Cargo Notes <span className="opt-tag">(Optional)</span>
                        </label>
                        <div className="hero-field-wrapper">
                          <MapPin size={15} className="hero-field-icon" />
                          <input
                            id="hero-notes"
                            type="text"
                            value={heroForm.notes}
                            onChange={(e) => setHeroForm({ ...heroForm, notes: e.target.value })}
                            placeholder="e.g. Origin siding, commodity type, or required delivery date"
                            className="hero-field-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="hero-submit-btn"
                    >
                      {isSubmitting ? (
                        <span>Checking Availability...</span>
                      ) : (
                        <>
                          <span>Request Equipment Availability</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    {/* Direct Contact Hotline Footer */}
                    <div className="hero-card-footer">
                      <div className="hero-footer-item">
                        <span>Direct Houston Desk:</span>
                        <a href="tel:+18325551200" className="hero-phone-link">
                          <PhoneCall size={12} style={{ color: '#AA2E1F' }} />
                          (832) 555-1200
                        </a>
                      </div>
                      <span className="hero-footer-spec">AAR &amp; FRA Verified</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Railcar Data Plate Spec Strip along bottom edge of hero */}
        <div
          className="hero-spec-strip"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(10, 10, 9, 0.94)',
            backdropFilter: 'blur(8px)',
            padding: '0.85rem 0',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.82rem',
                letterSpacing: '0.06em',
                color: '#CBD5E1',
                textTransform: 'uppercase',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ color: '#94A3B8' }}>CAR TYPES</span>
                <span style={{ color: '#AA2E1F', fontWeight: 800 }}>&bull;</span>
                <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>7</strong>
              </div>

              <div
                style={{
                  height: '16px',
                  width: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ color: '#94A3B8' }}>LEASE TERMS</span>
                <span style={{ color: '#AA2E1F', fontWeight: 800 }}>&bull;</span>
                <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>Full-service &amp; net</strong>
              </div>

              <div
                style={{
                  height: '16px',
                  width: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ color: '#94A3B8' }}>COVERAGE</span>
                <span style={{ color: '#AA2E1F', fontWeight: 800 }}>&bull;</span>
                <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>North America</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: COMPREHENSIVE SERVICES BREAKDOWN (Item 8: Expanded Content)
          ========================================================================= */}
      <section className="section section-white services-section" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          {/* Section Header */}
          <div className="services-section-header">
            <h2 className="services-main-title">
              Comprehensive Rail Equipment &amp; Sourcing Services
            </h2>
            <p className="services-main-desc">
              From initial fleet sizing to Class I interchange and routine mechanical maintenance, Coast Road Capital provides end-to-end support for industrial shippers across North America.
            </p>
          </div>

          {/* Services Text Rows (Per Client Phase 1 Spec: Large Icon on Left, Title + 1 Line on Right, Dashed Dividers) */}
          <div className="services-text-rows-list" style={{ maxWidth: '960px', margin: '0 auto' }}>
            {SERVICES_DATA.map((srv) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="service-text-row"
                >
                  {/* Left Column: Large Lead Icon (Brand Red, No Tinted Box) */}
                  <div
                    className="service-lead-icon"
                    style={{
                      color: '#AA2E1F',
                      flexShrink: 0,
                      marginTop: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComp size={38} strokeWidth={1.75} />
                  </div>

                  {/* Right Column: Large Title + One Line Description */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        marginBottom: '0.45rem',
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'clamp(1.2rem, 2.2vw, 1.4rem)',
                          fontWeight: 700,
                          color: '#0A0A09',
                          margin: 0,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {srv.title}
                      </h3>

                      <Link
                        to={srv.linkTo}
                        className="service-action-link"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: '#AA2E1F',
                          textDecoration: 'none',
                        }}
                      >
                        <span>{srv.linkText}</span>
                        <ArrowRight size={13} strokeWidth={2} />
                      </Link>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.96rem',
                        color: '#64748B',
                        lineHeight: 1.6,
                      }}
                    >
                      {srv.subtitle}. {srv.points[0]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: QUANTIFIABLE BENEFITS OF RAIL (Item 8: Expanded Content)
          ========================================================================= */}
      {/* =========================================================================
          SECTION: QUANTIFIABLE BENEFITS OF RAIL (Item 8: Expanded Content)
          ========================================================================= */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-header">
          
            <h2 className="benefits-main-title">
              Why Leading Shippers Scale on Rail Freight
            </h2>
            <p className="benefits-main-desc">
              Transitioning bulk commodities from highway drayage to dedicated railcars delivers proven cost savings, massive volume throughput, and drastic carbon reductions.
            </p>
          </div>

          <div className="benefits-grid">
            {/* Metric 1 */}
            <div className="benefit-stat-card">
              <div className="benefit-icon-wrap">
                <IconGasStation size={32} stroke={1.6} />
              </div>
              <div className="benefit-stat-num">4:1</div>
              <h3 className="benefit-stat-title">Fuel &amp; Carbon Efficiency</h3>
              <p className="benefit-stat-desc">
                Railroads move 1 ton of freight nearly 500 miles on a single gallon of diesel, cutting greenhouse gas emissions by up to 75% versus commercial semi-trucks.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="benefit-stat-card">
              <div className="benefit-icon-wrap">
                <IconTruck size={32} stroke={1.6} />
              </div>
              <div className="benefit-stat-num">3.5–4x</div>
              <h3 className="benefit-stat-title">Cargo Capacity per Railcar</h3>
              <p className="benefit-stat-desc">
                One 100-ton covered hopper or tank car replaces 3 to 4 commercial highway semi-trucks, drastically reducing dock congestion, gate labor, and driver turnaround friction.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="benefit-stat-card">
              <div className="benefit-icon-wrap">
                <IconChartLine size={32} stroke={1.6} />
              </div>
              <div className="benefit-stat-num">100%</div>
              <h3 className="benefit-stat-title">Rate Predictability</h3>
              <p className="benefit-stat-desc">
                Shield your annual supply chain budgeting from volatile spot-market trucking rates and emergency drayage surcharges with fixed multi-year lease frameworks.
              </p>
            </div>

            {/* Metric 4 */}
            <div className="benefit-stat-card">
              <div className="benefit-icon-wrap">
                <IconRoute size={32} stroke={1.6} />
              </div>
              <div className="benefit-stat-num">6 Lines</div>
              <h3 className="benefit-stat-title">Continental Class I Interchange</h3>
              <p className="benefit-stat-desc">
                Direct route coordination across all 6 North American Class I railroads (BNSF, UP, CSX, NS, CN, CPKC) with end-to-end car tracking from origin to siding switch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: ABOUT COAST ROAD CAPITAL & COMPANY COMMITMENT (Item 8)
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
                  marginBottom: '1.25rem',
                  lineHeight: 1.25,
                }}
              >
                Built For Shippers. Anchored in Houston, Serving North America.
              </h2>
              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Coast Road Capital connects industrial enterprises with verified freight rail equipment solutions. Whether expanding an active private fleet, managing seasonal harvest surges, or transitioning high-volume freight from highway to rail, we provide transparent car matching and dependable lease terms.
              </p>
              <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>
                Our commercial desk operates in Houston, Texas — the epicenter of North American energy, chemical processing, and agricultural export corridors. Shippers deal directly with experienced equipment specialists who understand track curvature, draft gear, and interchange logistics.
              </p>

              {/* 2 Callout Badges with internal links */}
              <div className="who-callout-grid">
                <Link to="/company-values" className="who-callout-card">
                  <div className="who-callout-icon-wrap">
                    <IconShieldCheck size={18} stroke={1.8} />
                  </div>
                  <div className="who-callout-body">
                    <span className="who-callout-title">Operating Values</span>
                    <span className="who-callout-sub">Safety &amp; transparent terms</span>
                  </div>
                  <ArrowRight size={13} className="who-callout-arrow" />
                </Link>

                <Link to="/faq" className="who-callout-card">
                  <div className="who-callout-icon-wrap">
                    <IconHelpCircle size={18} stroke={1.8} />
                  </div>
                  <div className="who-callout-body">
                    <span className="who-callout-title">Leasing FAQs</span>
                    <span className="who-callout-sub">Net vs full-service &amp; siding</span>
                  </div>
                  <ArrowRight size={13} className="who-callout-arrow" />
                </Link>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                <Link to="/about" className="btn btn-secondary">
                  About Coast Road Capital
                  <ChevronRight size={17} />
                </Link>
                <Link to="/contact" className="btn btn-outline-dark">
                  Contact Houston HQ
                </Link>
              </div>
            </div>

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
                  src="/images/Trains serving industries-additional railcar images/DSC06309 (1).jpg"
                  alt="Trains serving industrial shippers across North American rail corridors"
                  width={600}
                  height={400}
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
          EQUIPMENT PREVIEW (4 Categories Preview with Deep Internal Links)
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
              <span className="eyebrow">Fleet Portfolio</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '0.5rem' }}>
                Primary Railcar Categories
              </h2>
              <p style={{ color: '#64748B', maxWidth: '560px', fontSize: '1rem' }}>
                Explore dimensions, capacities, and commodity matching across our seven freight car types.
              </p>
            </div>

            <Link to="/railcar-leasing" className="btn btn-secondary">
              View All 7 Equipment Classes
              <ArrowRight size={16} />
            </Link>
          </div>

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
                      width={500}
                      height={190}
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

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '1rem',
                        borderTop: '1px solid #F1F5F9',
                      }}
                    >
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
                        Technical Specs
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
          SECTION: INTERACTIVE COST ESTIMATOR CALLOUT
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
            <div>
           
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
                Model Real-Time Equipment Lease Rates Before Committing Capital
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '4px',
                      backgroundColor: '#FAF9F7',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <IconAdjustmentsHorizontal size={20} stroke={1.8} style={{ color: '#AA2E1F' }} />
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
                      borderRadius: '4px',
                      backgroundColor: '#FAF9F7',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <IconShieldCheck size={20} stroke={1.8} style={{ color: '#AA2E1F' }} />
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

            {/* Benchmark Card (Industrial Data Plate Style) */}
            <div>
              <div className="estimator-benchmark-card">
                {/* Sliding Category Segmented Control */}
                <div className="estimator-segmented-control">
                  <div
                    className="estimator-segmented-slider"
                    style={{
                      transform: `translateX(${
                        sampleCategory === 'covered-hoppers' ? 0 : sampleCategory === 'boxcars' ? 100 : 200
                      }%)`,
                    }}
                  />
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
                        className={`estimator-segmented-btn ${isActive ? 'active' : ''}`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Equipment & Fleet Scope */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#0A0A09', margin: 0, lineHeight: 1.25, letterSpacing: '-0.015em' }}>
                      {activeSample.category}
                    </h3>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0A0A09', backgroundColor: '#F1F5F9', padding: '0.15rem 0.5rem', borderRadius: '3px' }}>
                      {activeSample.quantity} Railcars
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                    {activeSample.size}
                  </p>
                </div>

                {/* Estimated Monthly Rate Box - Clean Industrial Data Specs (No Cheap AI Green Line) */}
                <div className="estimator-rate-box">
                  <div className="estimator-rate-top">
                    <span className="estimator-rate-label">ESTIMATED MONTHLY RATE</span>
                  </div>
                  <div className="estimator-rate-display">
                    <span className="estimator-rate-numbers">{activeSample.rateMin} – {activeSample.rateMax}</span>
                    <span className="estimator-rate-unit">/ car / mo</span>
                  </div>
                  <div className="estimator-rate-desc">
                    Includes AAR Rule 88 maintenance &amp; wheelset renewals
                  </div>
                </div>

                {/* Structured Breakdown Specs */}
                <div className="estimator-specs-list">
                  <div className="estimator-fleet-total-row">
                    <span className="estimator-spec-name">Monthly Fleet Total ({activeSample.quantity} cars)</span>
                    <strong className="estimator-fleet-total-val">
                      {activeSample.totalMin} – {activeSample.totalMax} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}>/mo</span>
                    </strong>
                  </div>

                  <div className="estimator-spec-row">
                    <span className="estimator-spec-name">Term Commitment</span>
                    <strong className="estimator-spec-val">{activeSample.term}</strong>
                  </div>

                  <div className="estimator-spec-row">
                    <span className="estimator-spec-name">Typical Cargo</span>
                    <span className="estimator-spec-val" style={{ fontWeight: 500 }}>{activeSample.cargo}</span>
                  </div>

                  <div className="estimator-displacement-row">
                    <IconTruck size={15} stroke={1.8} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                    <span><strong>{activeSample.trucks}</strong> displaced per turn</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={`/cost-estimator?category=${sampleCategory}&size=${activeSample.sizeParam}&qty=${activeSample.quantity}&term=${activeSample.termParam}`}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '4px',
                    fontSize: '0.94rem',
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
      </section>

      {/* =========================================================================
          SECTION: SOURCING PROCESS (3-Step Milestone Workflow)
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Step-by-Step Delivery</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
              How Railcar Equipment Reaches Your Siding
            </h2>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7 }}>
              A straightforward, transparent three-step process from initial specification matching to on-track delivery.
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
            <div className="timeline-card">
              <div className="timeline-node" style={{ borderColor: '#0A0A09', color: '#0A0A09' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                Match &amp; Verify Equipment
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                We analyze your commodity, loading rack clearances, and siding curvature against AAR dimensions and weight limits.
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

            <div className="timeline-card">
              <div className="timeline-node" style={{ borderColor: '#AA2E1F', color: '#AA2E1F' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                Sourcing &amp; Terms
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                We secure the car set from verified regional pools and prepare flexible full-service or net lease structures.
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

            <div className="timeline-card">
              <div className="timeline-node" style={{ borderColor: '#059669', color: '#059669' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A0A09', marginBottom: '0.65rem' }}>
                Inspection &amp; Delivery
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                Pre-trip mechanical certification is completed and Class I interchange routing delivers the cars directly to your facility siding.
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
                  Dedicated Houston contact throughout
                </div>
              </div>
            </div>
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
              Submit a quote request, model your lease budget, or contact our commercial desk directly at (832) 555-1200.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem' }}>
              <Link to="/quote" className="btn btn-primary btn-lg">
                <FileText size={18} />
                Request a Formal Quote
              </Link>
              <Link to="/cost-estimator" className="btn btn-outline-white btn-lg">
                <Calculator size={18} />
                Launch Cost Estimator
              </Link>
              <Link to="/company-values" className="btn btn-secondary btn-lg">
                Company Values
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero 2-Column Responsive Grid */
        .hero-grid {
          display: grid;
          grid-template-columns: 1.08fr 0.96fr;
          gap: 2.75rem;
          align-items: center;
        }

        /* Lead Card Styling */
        .hero-lead-card {
          background-color: rgba(14, 16, 20, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-top: 3px solid #AA2E1F;
          border-radius: 12px;
          padding: 1.4rem 1.5rem;
          box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.65);
          width: 100%;
          max-width: 490px;
          margin-left: auto;
          box-sizing: border-box;
        }

        .hero-card-header {
          margin-bottom: 0.95rem;
        }

        .hero-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.2rem 0.6rem;
          background-color: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #A7F3D0;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 0.45rem;
        }

        .status-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10B981;
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.8);
        }

        .hero-card-title {
          font-family: var(--font-heading);
          font-size: 1.18rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 0.2rem;
          letter-spacing: -0.015em;
          line-height: 1.25;
        }

        .hero-card-desc {
          font-size: 0.8rem;
          color: #94A3B8;
          margin: 0;
          line-height: 1.45;
        }

        .hero-lead-form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .hero-fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.55rem 0.65rem;
        }

        .hero-full-width {
          grid-column: 1 / -1;
        }

        .hero-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .hero-input-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #CBD5E1;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .req-star {
          color: #F87171;
          font-weight: 700;
        }

        .opt-tag {
          color: #64748B;
          text-transform: none;
          font-weight: 400;
          font-size: 0.68rem;
        }

        .hero-field-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .hero-field-icon {
          position: absolute;
          left: 0.75rem;
          color: #94A3B8;
          pointer-events: none;
          transition: color 150ms ease, transform 150ms ease;
          flex-shrink: 0;
          z-index: 2;
        }

        .hero-field-wrapper:focus-within .hero-field-icon {
          color: #F87171;
          transform: scale(1.08);
        }

        .hero-field-input {
          width: 100%;
          height: 40px;
          padding: 0 0.75rem 0 2.25rem;
          border-radius: 7px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
          color: #FFFFFF;
          font-size: 0.84rem;
          font-weight: 500;
          outline: none;
          transition: border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .hero-field-input:hover {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
          border-color: rgba(255, 255, 255, 0.32);
        }

        .hero-field-input:focus {
          border-color: #F87171;
          background: rgba(255, 255, 255, 0.11);
          box-shadow: 0 0 0 3px rgba(170, 46, 31, 0.28);
        }

        .hero-field-input::placeholder {
          color: #64748B;
          font-size: 0.8rem;
          font-weight: 400;
        }

        /* Custom Interactive Dropdowns */
        .hero-custom-select-btn {
          width: 100%;
          height: 40px;
          padding: 0 0.75rem;
          border-radius: 7px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
          color: #FFFFFF;
          font-size: 0.84rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 160ms ease;
          box-sizing: border-box;
          text-align: left;
          outline: none;
        }

        .hero-custom-select-btn:hover {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
          border-color: rgba(255, 255, 255, 0.32);
        }

        .hero-custom-select-btn.active,
        .hero-custom-select-btn:focus-visible {
          border-color: #F87171;
          background: rgba(255, 255, 255, 0.11);
          box-shadow: 0 0 0 3px rgba(170, 46, 31, 0.28);
        }

        .hero-select-value {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #FFFFFF;
          font-weight: 600;
        }

        .hero-select-arrow {
          color: #94A3B8;
          transition: transform 200ms ease, color 150ms ease;
          flex-shrink: 0;
          margin-left: 0.4rem;
        }

        .hero-custom-select-btn:hover .hero-select-arrow,
        .hero-custom-select-btn.active .hero-select-arrow {
          color: #F87171;
        }

        .hero-select-arrow.open {
          transform: rotate(180deg);
        }

        /* Dropdown Popup Menu - Strict 100% Box Width Consistency */
        .hero-custom-dropdown {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          right: 0;
          width: 100%;
          min-width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          z-index: 100;
          background-color: #12151B;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 8px;
          box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08);
          max-height: 220px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0.3rem;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          animation: heroDropdownFade 140ms ease-out;
        }

        @keyframes heroDropdownFade {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .hero-custom-dropdown::-webkit-scrollbar {
          width: 5px;
        }
        .hero-custom-dropdown::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
        }
        .hero-custom-dropdown::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.22);
          border-radius: 4px;
        }
        .hero-custom-dropdown::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.36);
        }

        .hero-dropdown-header {
          padding: 0.35rem 0.55rem 0.4rem;
          font-size: 0.65rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 0.25rem;
        }

        .hero-dropdown-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.55rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 120ms ease;
          gap: 0.45rem;
          box-sizing: border-box;
          width: 100%;
        }

        .hero-dropdown-option:hover {
          background-color: rgba(255, 255, 255, 0.09);
        }

        .hero-dropdown-option.selected {
          background: linear-gradient(90deg, rgba(170, 46, 31, 0.3) 0%, rgba(170, 46, 31, 0.12) 100%);
          border-left: 3px solid #AA2E1F;
        }

        .hero-option-content {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
          flex: 1;
        }

        .hero-option-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.3rem;
          min-width: 0;
        }

        .hero-option-label {
          font-size: 0.81rem;
          font-weight: 600;
          color: #F8FAFC;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hero-dropdown-option.selected .hero-option-label {
          color: #FFFFFF;
        }

        .hero-option-badge {
          display: inline-block;
          font-size: 0.60rem;
          font-weight: 600;
          padding: 0.08rem 0.32rem;
          border-radius: 4px;
          background-color: rgba(255, 255, 255, 0.1);
          color: #E2E8F0;
          letter-spacing: 0.02em;
          flex-shrink: 0;
        }

        .hero-dropdown-option.selected .hero-option-badge {
          background-color: rgba(170, 46, 31, 0.38);
          color: #FECACA;
        }

        .hero-option-detail {
          font-size: 0.69rem;
          color: #94A3B8;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hero-option-check {
          color: #F87171;
          flex-shrink: 0;
        }

        .hero-submit-btn {
          width: 100%;
          height: 42px;
          padding: 0 1rem;
          font-weight: 700;
          font-size: 0.88rem;
          border-radius: 7px;
          background: linear-gradient(135deg, #AA2E1F 0%, #88190E 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 16px -2px rgba(170, 46, 31, 0.45);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          transition: all 160ms ease;
          margin-top: 0.25rem;
          letter-spacing: 0.01em;
        }

        .hero-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #C53030 0%, #AA2E1F 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px -2px rgba(170, 46, 31, 0.6);
        }

        .hero-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .hero-card-footer {
          padding-top: 0.6rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.74rem;
          color: #94A3B8;
        }

        .hero-footer-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .hero-phone-link {
          color: #FFFFFF;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .hero-phone-link:hover {
          color: #F87171;
        }

        .hero-footer-spec {
          color: #64748B;
          font-size: 0.7rem;
        }

        .hero-success-state {
          background-color: rgba(5, 150, 105, 0.12);
          border: 1px solid rgba(5, 150, 105, 0.4);
          border-radius: 8px;
          padding: 1.25rem;
          text-align: center;
        }

        .hero-ref-badge {
          background-color: rgba(0, 0, 0, 0.35);
          border-radius: 6px;
          padding: 0.35rem 0.65rem;
          font-size: 0.76rem;
          color: #94A3B8;
          margin-bottom: 0.85rem;
          display: inline-block;
        }

        /* =========================================================================
           Services Section (Calm, Minimal, Executive B2B Style)
           ========================================================================= */
        .services-section {
          padding: 4rem 0;
          background-color: #FFFFFF;
        }

        .services-section-header {
          max-width: 720px;
          margin: 0 auto 2.5rem;
          text-align: center;
        }

        .services-main-title {
          font-family: var(--font-heading);
          font-size: clamp(1.45rem, 2.4vw, 1.95rem);
          font-weight: 700;
          color: #0F172A;
          line-height: 1.3;
          margin-bottom: 0.65rem;
          letter-spacing: -0.015em;
        }

        .services-main-desc {
          font-size: 0.95rem;
          color: #64748B;
          line-height: 1.6;
          margin: 0 auto;
        }

        /* Services Grid (Desktop 3-Column) */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.35rem;
        }

        .service-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1.45rem 1.45rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        .service-card:hover {
          border-color: #CBD5E1;
          box-shadow: 0 4px 14px -2px rgba(15, 23, 42, 0.05);
          transform: translateY(-2px);
        }

        .service-card-top {
          display: flex;
          align-items: center;
          margin-bottom: 0.85rem;
        }

        .service-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 150ms ease;
        }

        .service-card:hover .service-icon-box {
          transform: scale(1.05);
        }

        .service-heading-wrap {
          margin-bottom: 0.85rem;
        }

        .service-title {
          font-size: 1.02rem;
          font-weight: 600;
          color: #0F172A;
          margin: 0 0 0.25rem;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .service-subtitle {
          font-size: 0.8rem;
          font-weight: 400;
          color: #64748B;
          margin: 0;
          line-height: 1.4;
        }

        .service-bullets-list {
          list-style: none;
          margin: 0 0 1.15rem;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          flex: 1;
        }

        .service-bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #475569;
          line-height: 1.45;
        }

        .service-bullet-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #94A3B8;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .service-link-wrap {
          padding-top: 0.85rem;
          border-top: 1px solid #F1F5F9;
          margin-top: auto;
        }

        .service-action-link {
          font-size: 0.83rem;
          font-weight: 700;
          color: #AA2E1F;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: color 140ms ease, gap 140ms ease;
        }

        .service-action-link:hover {
          color: #8F2417;
          gap: 0.55rem;
        }

        .mobile-services-dots-wrap {
          display: none;
        }

        /* =========================================================================
           Benefits Section & 2x2 Mobile Grid
           ========================================================================= */
        .benefits-section {
          background-color: #FAF8F5;
          border-top: 1px solid rgba(234, 219, 204, 0.45);
          border-bottom: 1px solid #EADBCC;
          padding: 4.5rem 0;
        }

        .benefits-header {
          max-width: 780px;
          margin: 0 auto 3.25rem;
          text-align: center;
        }

        .benefits-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(170, 46, 31, 0.07);
          color: #AA2E1F;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          margin-bottom: 0.85rem;
          border: 1px solid rgba(170, 46, 31, 0.16);
        }

        .benefits-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #AA2E1F;
          display: inline-block;
        }

        .benefits-main-title {
          font-family: var(--font-heading);
          font-size: clamp(1.65rem, 3.2vw, 2.35rem);
          font-weight: 800;
          color: #0A0A09;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-bottom: 0.85rem;
        }

        .benefits-main-desc {
          color: #475569;
          font-size: 1.05rem;
          line-height: 1.7;
          margin: 0 auto;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          align-items: stretch;
        }

        /* Benefit Stat Cards - Refined Industrial Design, No Cheap AI Rainbow Lines */
        .benefit-stat-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-top: 3px solid #AA2E1F;
          border-radius: 4px;
          padding: 2.25rem 1.45rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms ease, border-color 220ms ease;
        }

        .benefit-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.03);
          border-color: #CBD5E1;
          border-top-color: #AA2E1F;
        }

        .benefit-icon-wrap {
          color: #AA2E1F;
          margin-bottom: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 42px;
          transition: transform 200ms ease;
        }

        .benefit-stat-card:hover .benefit-icon-wrap {
          transform: scale(1.08);
        }

        .benefit-stat-num {
          font-family: var(--font-heading);
          font-size: 2.25rem;
          font-weight: 800;
          color: #0A0A09;
          line-height: 1.1;
          margin-bottom: 0.45rem;
          letter-spacing: -0.02em;
        }

        .benefit-stat-title {
          font-family: var(--font-heading);
          font-size: 1.02rem;
          font-weight: 700;
          color: #0A0A09;
          margin-bottom: 0.55rem;
          line-height: 1.3;
        }

        .benefit-stat-desc {
          font-size: 0.86rem;
          color: #64748B;
          line-height: 1.6;
          margin: 0;
          flex-grow: 1;
        }

        .preview-card {
          transform: translateZ(0);
          transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 260ms cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .preview-card:hover {
          transform: translateY(-4px) translateZ(0) !important;
          box-shadow: 0 14px 28px -4px rgba(15,23,42,0.12) !important;
        }

        /* Services Text Rows (Phase 1 Revision - Minimal Clean Industrial Aesthetic) */
        .services-text-rows-list {
          display: flex;
          flex-direction: column;
        }

        .service-text-row {
          display: flex;
          align-items: flex-start;
          gap: 1.75rem;
          padding: 1.5rem 1.25rem;
          border-bottom: 1px dashed #CBD5E1;
          border-radius: 4px;
          background-color: transparent;
          transition: background-color 220ms ease, transform 220ms ease, box-shadow 220ms ease;
          position: relative;
        }

        .service-text-row:last-child {
          border-bottom: none;
        }

        /* Very light, minimal and refined hover effect */
        .service-text-row:hover {
          background-color: rgba(170, 46, 31, 0.009);
          transform: translateX(2px);
        }

        .service-lead-icon {
          transition: transform 180ms ease;
        }

        .service-action-link {
          transition: color 180ms ease;
        }

        .service-action-link svg {
          transition: transform 180ms ease;
        }

        .service-text-row:hover .service-action-link {
          color: #8F2417 !important;
        }

        .service-text-row:hover .service-action-link svg {
          transform: translateX(2px);
        }

        /* "Who We Are" Minimal Compact Quick-Links */
        .who-callout-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 205px));
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }

        .who-callout-card {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 0.8rem;
          background-color: #FAF9F7;
          border: 1px solid #E2E8F0;
          border-radius: 4px;
          text-decoration: none;
          transition: all 180ms ease;
          box-sizing: border-box;
          max-width: 205px;
        }

        .who-callout-card:hover {
          background-color: #FFFFFF;
          border-color: #CBD5E1;
          box-shadow: 0 2px 8px -1px rgba(15, 23, 42, 0.06);
          transform: translateY(-1px);
        }

        .who-callout-icon-wrap {
          color: #AA2E1F;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .who-callout-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .who-callout-title {
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 700;
          color: #0A0A09;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .who-callout-sub {
          font-size: 0.72rem;
          color: #64748B;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .who-callout-arrow {
          color: #94A3B8;
          transition: transform 180ms ease, color 180ms ease;
          flex-shrink: 0;
        }

        .who-callout-card:hover .who-callout-arrow {
          color: #AA2E1F;
          transform: translateX(3px);
        }

        /* Cost Estimator Benchmark Card */
        .estimator-benchmark-card {
          background-color: #FFFFFF;
          border: 1px solid #DCE3EB;
          border-radius: 8px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06);
          padding: 1.5rem;
          box-sizing: border-box;
        }

        /* Estimator Segmented Control with Smooth Sliding Pill */
        .estimator-segmented-control {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background-color: #F1F5F9;
          border-radius: 4px;
          padding: 3px;
          margin-bottom: 1.15rem;
          border: 1px solid #E2E8F0;
          box-sizing: border-box;
        }

        .estimator-segmented-slider {
          position: absolute;
          top: 3px;
          bottom: 3px;
          left: 3px;
          width: calc((100% - 6px) / 3);
          background-color: #FFFFFF;
          border-radius: 3px;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08), 0 1px 1px rgba(15, 23, 42, 0.04);
          transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          z-index: 1;
        }

        .estimator-segmented-btn {
          position: relative;
          z-index: 2;
          border: none;
          background: transparent;
          padding: 0.5rem 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          color: #64748B;
          transition: color 200ms ease;
          text-align: center;
          border-radius: 3px;
          font-family: inherit;
        }

        .estimator-segmented-btn:hover {
          color: #0A0A09;
        }

        .estimator-segmented-btn.active {
          color: #0A0A09;
          font-weight: 700;
        }

        /* Estimated Monthly Rate Box */
        .estimator-rate-box {
          background-color: #FAF9F7;
          border: 1px solid #E2E8F0;
          border-radius: 4px;
          padding: 0.95rem 1.1rem;
          margin-bottom: 1rem;
        }

        .estimator-rate-top {
          margin-bottom: 0.35rem;
        }

        .estimator-rate-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #047857;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .estimator-rate-display {
          display: flex;
          align-items: baseline;
          gap: 0.45rem;
          margin-bottom: 0.2rem;
        }

        .estimator-rate-numbers {
          font-family: var(--font-heading);
          font-size: 1.85rem;
          font-weight: 800;
          color: #047857;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .estimator-rate-unit {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 500;
        }

        .estimator-rate-desc {
          font-size: 0.76rem;
          color: #64748B;
          line-height: 1.4;
        }

        /* Structured Spec Breakdown */
        .estimator-specs-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          margin-bottom: 1.15rem;
        }

        .estimator-fleet-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 4px;
          padding: 0.55rem 0.85rem;
          font-size: 0.82rem;
        }

        .estimator-fleet-total-val {
          color: #0A0A09;
          font-weight: 800;
          font-size: 0.95rem;
        }

        .estimator-spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0;
          border-bottom: 1px dashed #E2E8F0;
          font-size: 0.82rem;
        }

        .estimator-spec-name {
          color: #64748B;
        }

        .estimator-spec-val {
          color: #0A0A09;
          font-weight: 600;
        }

        .estimator-displacement-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-top: 0.35rem;
          font-size: 0.80rem;
          color: #475569;
        }

        @media (max-width: 960px) {
          .home-hero-section {
            padding: 3rem 0 3.25rem !important;
            min-height: auto !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.25rem !important;
          }
          .hero-lead-card {
            max-width: 100% !important;
            margin-left: 0 !important;
            padding: 1.35rem 1.15rem !important;
          }
          .preview-grid {
            grid-template-columns: 1fr !important;
          }
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.25rem !important;
          }
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.25rem !important;
          }
        }

        @media (max-width: 768px) {
          .services-section {
            padding: 2.75rem 0 2.25rem !important;
          }
          .services-section-header {
            margin-bottom: 1.25rem !important;
          }
          .services-main-title {
            font-size: 1.35rem !important;
            margin-bottom: 0.4rem !important;
          }
          .services-main-desc {
            font-size: 0.86rem !important;
            line-height: 1.5 !important;
          }
          /* Clean horizontal swipe track on mobile */
          .services-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            gap: 0.75rem !important;
            padding: 0.25rem 0.25rem 0.5rem !important;
            margin: 0 -1rem !important;
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
            scrollbar-width: none !important;
          }
          .services-grid::-webkit-scrollbar {
            display: none !important;
          }
          .services-grid .service-card {
            flex: 0 0 84% !important;
            max-width: 295px !important;
            min-width: 250px !important;
            scroll-snap-align: center !important;
            padding: 1.15rem 1.1rem !important;
          }
          /* Subtle pagination dots on mobile */
          .mobile-services-dots-wrap {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0.35rem !important;
            margin-top: 0.85rem !important;
          }
          .mobile-service-dot {
            width: 6px !important;
            height: 6px !important;
            border-radius: 50% !important;
            border: none !important;
            background: #CBD5E1 !important;
            cursor: pointer !important;
            transition: all 160ms ease !important;
            padding: 0 !important;
          }
          .mobile-service-dot.active {
            width: 18px !important;
            border-radius: 999px !important;
            background: #475569 !important;
          }
        }

        @media (max-width: 640px) {
          .home-hero-section {
            padding: 2.25rem 0 2.5rem !important;
          }
          .hero-lead-card {
            padding: 1.15rem 0.9rem !important;
            border-radius: 10px !important;
          }
          .hero-fields-grid {
            grid-template-columns: 1fr !important;
            gap: 0.65rem !important;
          }
          .hero-full-width {
            grid-column: auto !important;
          }
          /* 16px input font size prevents iOS Safari from automatically zooming the page */
          .hero-field-input,
          .hero-custom-select-btn {
            font-size: 16px !important;
            height: 42px !important;
          }
          .hero-dropdown-left,
          .hero-dropdown-right {
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            min-width: 0 !important;
          }
          .hero-submit-btn {
            height: 44px !important;
            font-size: 0.92rem !important;
          }
          .hero-card-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.35rem !important;
          }

          /* Mobile 2x2 Grid for Benefits Section */
          .benefits-section {
            padding: 2.5rem 0 2.75rem !important;
          }
          .benefits-header {
            margin-bottom: 1.35rem !important;
          }
          .benefits-eyebrow {
            font-size: 0.7rem !important;
            padding: 0.25rem 0.65rem !important;
            margin-bottom: 0.55rem !important;
          }
          .benefits-main-title {
            font-size: 1.4rem !important;
            margin-bottom: 0.45rem !important;
            line-height: 1.25 !important;
          }
          .benefits-main-desc {
            font-size: 0.84rem !important;
            line-height: 1.5 !important;
          }
          /* Show exactly 2 cards per row (2 columns, 2 rows) on mobile */
          .benefits-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .benefit-stat-card {
            padding: 1.25rem 0.85rem 1.15rem 0.85rem !important;
            border-radius: 4px !important;
          }
          .benefit-icon-wrap {
            margin-bottom: 0.65rem !important;
            height: 32px !important;
          }
          .benefit-icon-wrap svg {
            width: 24px !important;
            height: 24px !important;
          }
          .benefit-stat-num {
            font-size: 1.5rem !important;
            margin-bottom: 0.25rem !important;
            white-space: nowrap !important;
          }
          .benefit-stat-title {
            font-size: 0.82rem !important;
            line-height: 1.25 !important;
            margin-bottom: 0.4rem !important;
            min-height: 2.3em !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .benefit-stat-desc {
            font-size: 0.72rem !important;
            line-height: 1.42 !important;
          }

          /* Mobile Who We Are Callout Cards */
          .who-callout-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
          .who-callout-card {
            max-width: 260px !important;
          }

          /* Mobile Service Rows Adjustments */
          .service-text-row {
            gap: 1.15rem !important;
            padding: 1.25rem 0.65rem !important;
          }
        }

        @media (max-width: 380px) {
          .benefits-grid {
            gap: 0.55rem !important;
          }
          .benefit-stat-card {
            padding: 0.95rem 0.55rem 0.85rem 0.55rem !important;
          }
          .benefit-stat-num {
            font-size: 1.3rem !important;
          }
          .benefit-stat-title {
            font-size: 0.76rem !important;
          }
          .benefit-stat-desc {
            font-size: 0.68rem !important;
            line-height: 1.35 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;

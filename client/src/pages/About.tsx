import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, PhoneCall, ShieldCheck, TrendingUp } from 'lucide-react';
import { IconRulerMeasure, IconScale, IconCertificate, IconTruck } from '@tabler/icons-react';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0A09',
          color: '#FFFFFF',
          padding: '4.75rem 0 3.75rem',
          overflow: 'hidden',
          borderBottom: '3px solid #AA2E1F',
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
                opacity: 0.28,
              }}
            />
          </picture>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px' }}>
            <span className="eyebrow eyebrow-dark">
              Corporate Heritage &bull; Leadership &bull; Operating Philosophy
            </span>
            <h1
              style={{
                fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)',
                color: '#FFFFFF',
                fontWeight: 800,
                lineHeight: 1.16,
                letterSpacing: '-0.025em',
                marginBottom: '1.25rem',
              }}
            >
              About Coast Road Capital
            </h1>
            <p style={{ fontSize: '1.14rem', color: '#CBD5E1', lineHeight: 1.7, maxWidth: '680px' }}>
              Founded on an appreciation for the history of American railroading and a belief in its future — bridging the gap between freight railroads and the commercial enterprises they serve.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: OUR HISTORY & IDENTITY (Full Client Narrative)
          ========================================================================= */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
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
              <span className="eyebrow">Our Heritage</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '1.25rem', lineHeight: 1.25 }}>
                Our History &amp; Identity
              </h2>
              <p style={{ color: '#334155', fontSize: '1.04rem', lineHeight: 1.75, marginBottom: '1.2rem' }}>
                Coast Road Capital was founded on an appreciation for the history of American railroading and a belief in its future. Our name and identity draw inspiration from two historic railroads, the <strong>Seaboard Coast Line</strong> and the <strong>Milwaukee Road</strong>, whose legacies reflect the importance of connecting industries, communities, and markets.
              </p>
              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '1.2rem' }}>
                The visual identity of Coast Road Capital draws from the bold lettering and distinctive branding of these historic railroads, combining a respect for the industry&apos;s past with a forward-looking approach to its future.
              </p>
              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>
                While the railroads that inspired our identity belong to an earlier era, we believe the opportunities they helped create remain just as relevant today. Our objective is to carry that same spirit of industrial development, connectivity, and commercial opportunity into the modern freight transportation industry.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                <Link
                  to="/railroad-partnerships"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#AA2E1F',
                    textDecoration: 'none',
                  }}
                >
                  Explore Railroad Partnerships &rarr;
                </Link>
                <Link
                  to="/company-values"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: '#475569',
                    textDecoration: 'none',
                  }}
                >
                  View Company Values &rarr;
                </Link>
              </div>
            </div>

            <div>
              <div
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 6px 20px -3px rgba(15, 23, 42, 0.08)',
                }}
              >
                <img
                  src="/images/Trains serving industries-additional railcar images/DSC06309 (1).jpg"
                  alt="Railcar fleet haulage along North American mainline corridor"
                  width={600}
                  height={380}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: WHY WE DO WHAT WE DO (Full Client Narrative)
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="eyebrow" style={{ justifyContent: 'center' }}>Operating Philosophy</span>
              <h2 style={{ color: '#0A0A09', marginBottom: '0.85rem' }}>
                Why We Do What We Do
              </h2>
              <p style={{ color: '#64748B', fontSize: '1.04rem', lineHeight: 1.65 }}>
                Restoring transparency, trust, and practical commercial opportunity to North American freight logistics.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '2.5rem',
                boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
              }}
            >
              <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.35rem' }}>
                At Coast Road Capital, we believe the future of freight transportation should be built on transparency, trust, and opportunity. As a younger generation entering the industry, we recognize the growing disconnect between businesses and the transportation networks they depend on. Rising logistics costs, increasingly congested highways, and uncertainty surrounding freight service have left many businesses questioning their transportation options. For some, rail is no longer considered a realistic alternative, even when it may offer significant advantages.
              </p>

              <div
                style={{
                  margin: '1.75rem 0',
                  padding: '1.15rem 1.5rem',
                  backgroundColor: '#FAF9F7',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                }}
              >
                <strong style={{ display: 'block', fontSize: '1.15rem', color: '#0A0A09', fontWeight: 800, marginBottom: '0.35rem' }}>
                  We want to change that.
                </strong>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.98rem', lineHeight: 1.7 }}>
                  Our objective is not to replace trucks, but to help rail and trucking work together where each makes the most sense.
                </p>
              </div>

              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '1.35rem' }}>
                As businesses grow, relying exclusively on trucking can become increasingly expensive and operationally challenging, particularly when moving large volumes of freight over longer distances. Rail transportation offers an opportunity to consolidate shipments, improve capacity, and develop more efficient supply chains. However, we also recognize that trucking remains essential.
              </p>

              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '1.35rem' }}>
                Whether through direct rail service to a customer&apos;s facility, a nearby transloading operation, or the development of new rail-served infrastructure, we want to make these opportunities more accessible. We believe businesses should have the information, confidence, and support necessary to evaluate rail transportation without navigating the process alone.
              </p>

              <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: 1.8, margin: 0 }}>
                Our mission is not simply to generate additional freight traffic for railroads. It is to help businesses improve their operations, reach new markets, manage transportation costs, and create opportunities for sustainable growth. When our customers succeed, we believe the railroad industry benefits alongside them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: LEADERSHIP BIOGRAPHIES (Samuel Lowe & Ivan Pla)
          ========================================================================= */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Leadership</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
              Company Leadership
            </h2>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7 }}>
              Combining entrepreneurial commercial perspective with firsthand on-the-ground railroad operating experience.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2rem',
              maxWidth: '960px',
              margin: '0 auto',
            }}
          >
            {/* Samuel Lowe */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '2.25rem 2rem',
                boxShadow: '0 4px 14px -2px rgba(15, 23, 42, 0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.35rem' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '8px',
                    backgroundColor: '#FAF9F7',
                    border: '1px solid #EADBCC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#AA2E1F',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}
                >
                  SL
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0A0A09', margin: 0, lineHeight: 1.2 }}>
                    Samuel Lowe
                  </h3>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#AA2E1F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Founder &amp; Principal
                  </span>
                </div>
              </div>

              <p style={{ color: '#334155', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '1.15rem' }}>
                Samuel Lowe founded Coast Road Capital with the goal of making freight rail transportation more accessible to businesses seeking opportunities for growth and expansion. A business student at the University of Tampa with a lifelong interest in railroad history, operations, and commercial development, Samuel brings an entrepreneurial perspective to the industry.
              </p>

              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.7, margin: '0 0 1.5rem 0', flexGrow: 1 }}>
                His focus includes identifying rail-served properties, exploring equipment sourcing opportunities, developing customer relationships, and connecting businesses with the infrastructure and resources necessary to establish or expand rail operations.
              </p>

              <div style={{ paddingTop: '1.15rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>University of Tampa &bull; Commercial Development</span>
                <Link to="/contact" style={{ fontSize: '0.82rem', color: '#AA2E1F', fontWeight: 700, textDecoration: 'none' }}>
                  Direct Contact &rarr;
                </Link>
              </div>
            </div>

            {/* Ivan Pla */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '2.25rem 2rem',
                boxShadow: '0 4px 14px -2px rgba(15, 23, 42, 0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.35rem' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '8px',
                    backgroundColor: '#FAF9F7',
                    border: '1px solid #EADBCC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#AA2E1F',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}
                >
                  IP
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0A0A09', margin: 0, lineHeight: 1.2 }}>
                    Ivan Pla
                  </h3>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#AA2E1F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Co-Founder
                  </span>
                </div>
              </div>

              <p style={{ color: '#334155', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '1.15rem' }}>
                Ivan Pla is Co-Founder of Coast Road Capital and an active railroad conductor, bringing firsthand experience in railroad operations to the company.
              </p>

              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.7, margin: '0 0 1.5rem 0', flexGrow: 1 }}>
                His understanding of day-to-day rail operations provides a practical perspective on the challenges and opportunities associated with freight transportation. Working alongside Samuel Lowe, Ivan helps bridge the gap between railroad operations and business development, supporting CRC&apos;s mission to make rail transportation more accessible, efficient, and beneficial for its customers.
              </p>

              <div style={{ paddingTop: '1.15rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Active Railroad Conductor &bull; Operations</span>
                <Link to="/contact" style={{ fontSize: '0.82rem', color: '#AA2E1F', fontWeight: 700, textDecoration: 'none' }}>
                  Direct Contact &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FREIGHT RAIL TRANSPORTATION BENEFITS & INDUSTRY RESEARCH
          (Credible Data with Source Citations: FRA, DOT, BTS, CRS)
          ========================================================================= */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Industry Research &amp; Supporting Data</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.85rem' }}>
              The Operational &amp; Economic Advantages of Freight Rail
            </h2>
            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7 }}>
              As commercial businesses grow, rail becomes an increasingly attractive option for moving larger freight volumes — especially when strategically integrated with trucking networks.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            {/* Stat Card 1 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1.75rem',
                boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <TrendingUp size={18} style={{ color: '#AA2E1F' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Fuel Efficiency
                </span>
              </div>
              <strong style={{ display: 'block', fontSize: '1.85rem', fontWeight: 800, color: '#0A0A09', lineHeight: 1.15, marginBottom: '0.5rem' }}>
                ~480–500 Miles
              </strong>
              <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Freight railroads move one ton of freight an average of nearly 500 miles on a single gallon of fuel, operating at 3 to 4 times the fuel economy of long-haul highway trucking.
              </p>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', fontStyle: 'italic', borderTop: '1px dashed #E2E8F0', paddingTop: '0.65rem' }}>
                Source: Federal Railroad Administration (FRA) &amp; Bureau of Transportation Statistics (BTS)
              </span>
            </div>

            {/* Stat Card 2 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1.75rem',
                boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <IconTruck size={18} stroke={1.8} style={{ color: '#AA2E1F' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Fleet Consolidation
                </span>
              </div>
              <strong style={{ display: 'block', fontSize: '1.85rem', fontWeight: 800, color: '#0A0A09', lineHeight: 1.15, marginBottom: '0.5rem' }}>
                1 Car = ~3.5 to 4 Trucks
              </strong>
              <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Depending on commodity density, a single 100-ton boxcar or covered hopper displaces 3 to 4 highway tractor-trailers, reducing driver constraints and transit bottlenecks.
              </p>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', fontStyle: 'italic', borderTop: '1px dashed #E2E8F0', paddingTop: '0.65rem' }}>
                Source: U.S. Department of Transportation (USDOT) Freight Analysis Framework
              </span>
            </div>

            {/* Stat Card 3 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1.75rem',
                boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={18} style={{ color: '#AA2E1F' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Emissions &amp; Infrastructure
                </span>
              </div>
              <strong style={{ display: 'block', fontSize: '1.85rem', fontWeight: 800, color: '#0A0A09', lineHeight: 1.15, marginBottom: '0.5rem' }}>
                Up to 75% Lower
              </strong>
              <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Moving freight by rail reduces greenhouse gas emissions by up to 75% compared with all-highway trucking, helping commercial shippers fulfill sustainability and ESG commitments.
              </p>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', fontStyle: 'italic', borderTop: '1px dashed #E2E8F0', paddingTop: '0.65rem' }}>
                Source: Congressional Research Service &amp; EPA Freight Carbon Benchmarks
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '1.15rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
              *Note: Rail economic feasibility depends on commodity type, shipment distance, volumes, and siding access. Coast Road Capital evaluates these specific operational variables for each prospective route.
            </p>
            <Link
              to="/cost-estimator"
              style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#AA2E1F',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
              }}
            >
              Model Your Fleet Budget &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Business Focus & Leasing Approach */}
      <section className="section section-white" style={{ borderBottom: '1px solid #E2E8F0' }}>
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

      {/* Real Infrastructure & Transloading — 2-column grid */}
      <section className="section section-subtle" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Operations</span>
            <h2 style={{ color: '#0A0A09', marginBottom: '0.75rem' }}>
              Site &amp; Siding Infrastructure
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
                  Siding &amp; Track Assessment
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
                  Track Maintenance &amp; Safety
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
                  Coordinating dedicated car sets, seasonal reserves, and long-term allocations across North America&apos;s rail network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section" style={{ textAlign: 'center', backgroundColor: '#0A0A09', padding: '4.5rem 0', borderTop: '3px solid #AA2E1F' }}>
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

import React from 'react';
import { Link } from 'react-router-dom';
import { TrackMotif } from './TrackMotif';
import { Mail, Calendar, ArrowRight } from 'lucide-react';
import { EQUIPMENT_CATEGORIES } from '../../data/equipmentData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#0A0A09', color: '#EDE6D4', paddingTop: '4.5rem', paddingBottom: '3rem', borderTop: '2px solid #AA2E1F' }}>
      <div className="container">
        {/* Upper Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Column 1: Brand & Identity */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              <img
                src="/images/crc-logo-color.png"
                alt="Coast Road Capital"
                style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
              Coast Road Capital is an equipment sourcing and railcar leasing provider serving industrial shippers, manufacturing operations, agricultural processors, and energy facilities across North America.
            </p>
          </div>

          {/* Column 2: Equipment Catalog Categories */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '1.25rem',
                letterSpacing: '-0.01em',
              }}
            >
              Railcar Equipment
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {EQUIPMENT_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/railcar-leasing#${cat.slug}`}
                    style={{
                      color: '#94A3B8',
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      transition: 'color 160ms ease, transform 160ms ease',
                    }}
                    className="footer-nav-link"
                  >
                    <ArrowRight size={13} style={{ color: '#AA2E1F' }} />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Corporate Navigation */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '1.25rem',
                letterSpacing: '-0.01em',
              }}
            >
              Corporate &amp; Inquiries
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }} className="footer-nav-link">
                  Homepage Overview
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }} className="footer-nav-link">
                  About Coast Road Capital
                </Link>
              </li>
              <li>
                <Link to="/railcar-leasing" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }} className="footer-nav-link">
                  Equipment Sourcing Catalog
                </Link>
              </li>
              <li>
                <Link to="/quote" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }} className="footer-nav-link">
                  Request a Railcar Lease Quote &rarr;
                </Link>
              </li>
              <li>
                <Link to="/book-a-call" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }} className="footer-nav-link">
                  Schedule Fleet Consultation &rarr;
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }} className="footer-nav-link">
                  Direct Contact &amp; Headquarters
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Sourcing Consultation CTA Card */}
          <div
            style={{
              backgroundColor: '#1E293B',
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #334155',
            }}
          >
          
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '0.65rem',
              }}
            >
              Discuss Your Car Requirements
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Connect with Coast Road Capital to evaluate car specifications, lease durations, maintenance terms, and delivery options for your supply chain.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link to="/quote" className="btn btn-primary btn-sm" style={{ width: '100%', borderRadius: '8px' }}>
                <Mail size={14} />
                Submit Quote Inquiry
              </Link>
              <Link to="/book-a-call" className="btn btn-secondary btn-sm" style={{ width: '100%', borderRadius: '8px' }}>
                <Calendar size={14} />
                Book Consultation Call
              </Link>
            </div>
          </div>
        </div>

        {/* Track Motif Separator */}
        <TrackMotif dark />

        {/* Catalog Equipment Disclaimer */}
        <div
          style={{
            backgroundColor: '#141413',
            borderLeft: '4px solid #AA2E1F',
            border: '1px solid #2B2B28',
            borderLeftWidth: '4px',
            borderLeftColor: '#AA2E1F',
            padding: '1.1rem 1.5rem',
            borderRadius: '0 8px 8px 0',
            marginBottom: '2.5rem',
            fontSize: '0.84rem',
            color: '#A8A29E',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: '#EDE6D4' }}>DISCLAIMER &amp; SPECIFICATION NOTICE:</strong> All railcar configurations, dimensions, cubic capacities, and industry applications displayed on this website are provided as typical equipment references for leasing inquiry and equipment discovery. Coast Road Capital does not represent that specific cars are available from live stock until your requirements are reviewed and confirmed. All leasing arrangements are subject to car availability, mechanical inspection, and final contract terms.
        </div>

        {/* Lower Footer Bottom Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.25rem',
            paddingTop: '1.25rem',
            fontSize: '0.84rem',
            color: '#64748B',
            borderTop: '1px solid #1E293B',
          }}
        >
          <div>
            &copy; {currentYear} Coast Road Capital (CRC). All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#94A3B8' }}>Phase 1 Corporate Platform</span>
            <span>&bull;</span>
            <span style={{ color: '#64748B' }}>Phase 2: Dynamic Cost Estimator &amp; 3D Track Layout (Roadmap)</span>
            <span>&bull;</span>
            <span style={{ color: '#64748B' }}>Phase 3: Client CMS &amp; Admin (Roadmap)</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-nav-link:hover {
          color: #FFFFFF !important;
          transform: translateX(3px);
        }
      `}</style>
    </footer>
  );
};

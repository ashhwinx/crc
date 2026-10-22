import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { EQUIPMENT_CATEGORIES } from '../../data/equipmentData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#0A0A09',
        color: '#EDE6D4',
        borderTop: '2px solid #AA2E1F',
      }}
      className="footer-root"
    >
      <div className="container footer-container">
        {/* Main Footer Layout */}
        <div className="footer-grid">
          {/* Column 1: Brand & Identity */}
          <div className="footer-brand-col">
            <Link to="/" style={{ display: 'inline-block', marginBottom: '0.85rem' }}>
              <img
                src="/images/crc-logo-color.png"
                alt="Coast Road Capital"
                className="footer-logo"
              />
            </Link>
            <p className="footer-brand-desc">
              Equipment sourcing and railcar leasing for industrial shippers, manufacturers, and bulk processors across North America.
            </p>
            {/* Quick contact details */}
            <div className="footer-contacts">
              <a href="tel:+18325551200" className="footer-contact-link">
                <Phone size={13} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                (832) 555-1200
              </a>
              <a href="mailto:leasing@coastroadcapital.com" className="footer-contact-link">
                <Mail size={13} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                leasing@coastroadcapital.com
              </a>
              <span className="footer-contact-item">
                <MapPin size={13} style={{ color: '#AA2E1F', flexShrink: 0 }} />
                Houston, TX
              </span>
            </div>
          </div>

          {/* Navigation Columns (Grouped in 2-col on mobile) */}
          <div className="footer-nav-group">
            {/* Column 2: Equipment Catalog Categories */}
            <div>
              <h4 className="footer-col-title">
                Railcars
              </h4>
              <ul className="footer-links-list">
                {EQUIPMENT_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/railcar-leasing#${cat.slug}`}
                      className="footer-nav-link"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Corporate Navigation */}
            <div>
              <h4 className="footer-col-title">
                Company
              </h4>
              <ul className="footer-links-list">
                <li>
                  <Link to="/" className="footer-nav-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/railcar-leasing" className="footer-nav-link">
                    Equipment Catalog
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="footer-nav-link">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-nav-link">
                    Contact &amp; Siding
                  </Link>
                </li>
                <li>
                  <Link to="/quote" className="footer-nav-link">
                    Request a Quote
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Quick CTA */}
          <div className="footer-cta-col">
            <h4 className="footer-col-title">
              Request Sourcing
            </h4>
            <p className="footer-cta-desc">
              Tell us your car specifications and route requirements. Our leasing team responds within one business day.
            </p>
            <Link
              to="/quote"
              className="btn btn-primary btn-sm footer-cta-btn"
            >
              Request a Quote
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            &copy; {currentYear} Coast Road Capital (CRC). All rights reserved.
          </div>
          <div className="footer-disclaimer">
            Railcar specifications shown are standard industry references. Specific availability, series, and lease terms are confirmed upon review.
          </div>
        </div>
      </div>

      <style>{`
        .footer-container {
          padding-top: 3.5rem;
          padding-bottom: 2rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 2fr 1.1fr;
          gap: 2.5rem;
          margin-bottom: 2.5rem;
        }
        .footer-logo {
          height: 60px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .footer-brand-desc {
          color: #94A3B8;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0 0 1.25rem 0;
          max-width: 320px;
        }
        .footer-contacts {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.86rem;
        }
        .footer-contact-link {
          color: #94A3B8;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          transition: color 150ms ease;
        }
        .footer-contact-link:hover {
          color: #FFFFFF;
        }
        .footer-contact-item {
          color: #64748B;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
        }
        .footer-nav-group {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 2rem;
        }
        .footer-col-title {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }
        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-nav-link {
          color: #94A3B8;
          font-size: 0.86rem;
          text-decoration: none;
          transition: color 150ms ease;
          display: inline-block;
          line-height: 1.4;
        }
        .footer-nav-link:hover {
          color: #FFFFFF !important;
        }
        .footer-cta-desc {
          color: #94A3B8;
          font-size: 0.86rem;
          line-height: 1.55;
          margin-bottom: 1rem;
        }
        .footer-cta-btn {
          width: 100%;
          border-radius: 8px;
        }
        .footer-bottom-bar {
          display: flex;
          flex-wrap: wrap;
          justifyContent: space-between;
          align-items: center;
          gap: 1rem;
          padding-top: 1.25rem;
          font-size: 0.8rem;
          color: #64748B;
          border-top: 1px solid #1E293B;
        }
        .footer-disclaimer {
          color: #4B5563;
          font-size: 0.74rem;
          max-width: 620px;
          line-height: 1.45;
        }

        /* Tablet Responsive (601px - 900px) */
        @media (max-width: 900px) and (min-width: 601px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .footer-cta-col {
            grid-column: span 2;
          }
        }

        /* Mobile Responsive (< 600px) - COMPACT & STREAMLINED */
        @media (max-width: 600px) {
          .footer-container {
            padding-top: 2rem !important;
            padding-bottom: 1.25rem !important;
          }
          .footer-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 1.5rem !important;
            margin-bottom: 1.5rem !important;
          }
          .footer-logo {
            height: 44px !important;
            margin-bottom: 0.5rem !important;
          }
          .footer-brand-desc {
            font-size: 0.82rem !important;
            line-height: 1.5 !important;
            margin: 0 0 0.75rem 0 !important;
            max-width: 100% !important;
          }
          .footer-contacts {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 0.65rem 1rem !important;
            font-size: 0.8rem !important;
          }
          .footer-cta-col {
            display: none !important;
          }
          .footer-nav-group {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 1.25rem !important;
            padding-top: 1rem !important;
            border-top: 1px solid #1E293B !important;
          }
          .footer-col-title {
            font-size: 0.88rem !important;
            margin-bottom: 0.5rem !important;
          }
          .footer-links-list {
            gap: 0.35rem !important;
          }
          .footer-nav-link {
            font-size: 0.82rem !important;
          }
          .footer-bottom-bar {
            padding-top: 1rem !important;
            gap: 0.6rem !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .footer-copyright {
            font-size: 0.76rem !important;
          }
          .footer-disclaimer {
            font-size: 0.7rem !important;
            line-height: 1.4 !important;
          }
        }
      `}</style>
    </footer>
  );
};

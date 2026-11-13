import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall, Phone, Mail, ChevronRight, ChevronDown, FileText, Shield } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

export const Header: React.FC = () => {
  const { cms } = useCms();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu & dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
  }, [location.pathname]);

  // Track scroll position for subtle elevation shadow and compacting
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update dynamic CSS variable for sticky sub-bars (stays constant since nav bar stays visible)
  useEffect(() => {
    document.documentElement.style.setProperty('--header-offset', 'var(--header-height)');
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Primary Desktop Nav Links
  const primaryNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/railcar-leasing', label: 'Railcar Leasing' },
    { path: '/cost-estimator', label: 'Cost Estimator' },
    { path: '/railcar-viewer', label: '3D Viewer' },
    { path: '/railroad-partnerships', label: 'Railroad Partnerships' },
  ];

  // About Us Dropdown Links (Contains About Us, Company Values, FAQ, Contact)
  const aboutDropdownLinks = [
    { path: '/about', label: 'About Coast Road Capital', desc: 'Our History, Identity & Leadership' },
    { path: '/company-values', label: 'Company Values', desc: 'Operational Transparency & Standards' },
    { path: '/faq', label: 'FAQ', desc: 'Frequently Asked Questions' },
    { path: '/contact', label: 'Contact', desc: 'Inquiries & Tampa Headquarters' },
  ];

  const isAboutActive = ['/about', '/company-values', '/values', '/faq', '/faqs', '/contact'].includes(location.pathname);

  return (
    <>
      {/* =========================================================================
          EYEBROW UTILITY MENU (Top dark notification & contact bar)
          ========================================================================= */}
      <div className="eyebrow-top-bar">
        <div className="container eyebrow-container">
          {/* Left: Clickable Direct Contacts */}
          <div className="eyebrow-left">
            <a
              href={`tel:${(cms.companyInfo?.phone || '919-670-7979').replace(/\D/g, '')}`}
              className="eyebrow-contact-link"
              aria-label={`Direct Phone Line: ${cms.companyInfo?.phone || '919-670-7979'}`}
            >
              <Phone size={12} className="eyebrow-icon" />
              <span><span className="eyebrow-phone-label">Direct Line: </span><strong>{cms.companyInfo?.phone || '919-670-7979'}</strong></span>
            </a>
            <span className="eyebrow-divider">|</span>
            <a
              href={`mailto:${cms.companyInfo?.email || 'leasing@coastroadcapital.com'}`}
              className="eyebrow-contact-link"
              aria-label={`Email: ${cms.companyInfo?.email || 'leasing@coastroadcapital.com'}`}
            >
              <Mail size={12} className="eyebrow-icon" />
              <span>{cms.companyInfo?.email || 'leasing@coastroadcapital.com'}</span>
            </a>
          </div>

          {/* Right: Operational Badge & Secondary Shortcuts */}
          <div className="eyebrow-right">
            <span className="eyebrow-pill">
              <Shield size={11} style={{ color: '#AA2E1F' }} />
              AAR &amp; FRA Vetted Fleet
            </span>
            <span className="eyebrow-divider">|</span>
            <Link to="/company-values" className="eyebrow-quick-link">
              Values
            </Link>
            <span className="eyebrow-divider">|</span>
            <Link to="/faq" className="eyebrow-quick-link">
              FAQ
            </Link>
            <span className="eyebrow-divider">|</span>
            <Link to="/contact" className="eyebrow-quick-link">
              Tampa, FL HQ
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STICKY NAVIGATION BAR (Always visible when scrolling)
          ========================================================================= */}
      <header
        className={`site-header ${scrolled ? 'header-scrolled' : ''}`}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#FFFFFF',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: scrolled
            ? '0 4px 20px -2px rgba(15, 23, 42, 0.08)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
          transition: 'background-color 200ms ease, box-shadow 200ms ease, padding 200ms ease',
        }}
      >
        <div
          className="container"
          style={{
            height: scrolled ? '74px' : 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'height 200ms ease',
          }}
        >
          {/* Logo Branding */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              padding: '0.25rem 0',
            }}
            aria-label="Coast Road Capital Homepage"
          >
            <img
              src="/images/branding/crc-logo-color.png"
              alt="Coast Road Capital"
              width={260}
              height={64}
              fetchPriority="high"
              decoding="async"
              style={{
                height: scrolled ? '56px' : '64px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                transition: 'height 200ms ease',
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.75rem',
            }}
            className="desktop-nav"
          >
            {primaryNavLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.94rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#AA2E1F' : '#334155',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  position: 'relative',
                  transition: 'color 180ms ease',
                  whiteSpace: 'nowrap',
                })}
                className={({ isActive }) => (isActive ? 'nav-item-active' : 'nav-item')}
              >
                {item.label}
              </NavLink>
            ))}

            {/* About Us Hover Dropdown Menu */}
            <div
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                type="button"
                className={`nav-dropdown-trigger ${isAboutActive ? 'nav-item-active' : 'nav-item'}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.94rem',
                  fontWeight: isAboutActive ? 700 : 500,
                  color: isAboutActive ? '#AA2E1F' : '#334155',
                  background: 'transparent',
                  border: 'none',
                  padding: '0.5rem 0',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 180ms ease',
                  whiteSpace: 'nowrap',
                }}
                aria-expanded={aboutDropdownOpen}
                aria-haspopup="true"
              >
                <span>About Us</span>
                <ChevronDown
                  size={14}
                  style={{
                    color: isAboutActive ? '#AA2E1F' : '#64748B',
                    transform: aboutDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}
                />
              </button>

              {/* Dropdown Menu Box */}
              <div className="nav-dropdown-menu">
                <div className="nav-dropdown-header">
                  <span>Company &amp; Resources</span>
                </div>
                {aboutDropdownLinks.map((sub) => {
                  const isSubActive = location.pathname === sub.path;
                  return (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setAboutDropdownOpen(false)}
                      className={`nav-dropdown-item ${isSubActive ? 'nav-dropdown-item-active' : ''}`}
                    >
                      <div className="nav-dropdown-item-title">{sub.label}</div>
                      <div className="nav-dropdown-item-desc">{sub.desc}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Desktop Right Action (Clickable Direct Line Phone) */}
          <div style={{ display: 'none', alignItems: 'center' }} className="desktop-nav">
            {/* Clickable Phone Number on the Sticky Nav Bar */}
            <a
              href="tel:+19196707979"
              className="sticky-nav-phone"
              aria-label="Call Coast Road Capital at 919-670-7979"
              title="Call Coast Road Capital Direct Desk"
            >
              <div className="sticky-nav-phone-icon">
                <PhoneCall size={14} />
              </div>
              <div className="sticky-nav-phone-content">
                <span className="sticky-nav-phone-label">Direct Line</span>
                <span className="sticky-nav-phone-num">919-670-7979</span>
              </div>
            </a>
          </div>

          {/* Mobile Right Controls: Quick Call Button + Menu Toggle */}
          <div className="mobile-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Mobile Clickable Phone */}
            <a
              href="tel:+19196707979"
              className="mobile-quick-call-btn"
              aria-label="Call 919-670-7979"
              title="Call 919-670-7979"
            >
              <PhoneCall size={17} />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.55rem',
                cursor: 'pointer',
                color: '#0A0A09',
                transition: 'background-color 150ms ease',
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MOBILE NAVIGATION DRAWER
          ========================================================================= */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-drawer-panel"
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '360px',
              height: '100%',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 28px rgba(0,0,0,0.18)',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <img
                src="/images/branding/crc-logo-color.png"
                alt="Coast Road Capital"
                width={170}
                height={42}
                loading="lazy"
                decoding="async"
                style={{ height: '42px', width: 'auto' }}
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.45rem',
                  cursor: 'pointer',
                  color: '#334155',
                }}
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Prominent Clickable Phone Box */}
            <a
              href="tel:+19196707979"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#FAF8F5',
                border: '1px solid #EADBCC',
                borderRadius: '8px',
                padding: '0.75rem 0.9rem',
                marginBottom: '1.25rem',
                textDecoration: 'none',
                color: '#0A0A09',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#AA2E1F',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <PhoneCall size={16} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                  Direct Sourcing Desk
                </span>
                <strong style={{ fontSize: '0.98rem', color: '#0A0A09' }}>
                  919-670-7979
                </strong>
              </div>
            </a>

            {/* Mobile Nav Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
              {primaryNavLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.98rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#AA2E1F' : '#0A0A09',
                    textDecoration: 'none',
                    padding: '0.70rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'var(--color-red-light)' : 'transparent',
                    transition: 'all 150ms ease',
                  })}
                >
                  {item.label}
                  <ChevronRight size={16} style={{ color: '#94A3B8' }} />
                </NavLink>
              ))}

              {/* Mobile About Us & Company Sub-section */}
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                <button
                  type="button"
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.98rem',
                    fontWeight: isAboutActive ? 700 : 600,
                    color: isAboutActive ? '#AA2E1F' : '#0A0A09',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.70rem 0.75rem',
                    cursor: 'pointer',
                    borderRadius: '8px',
                  }}
                >
                  <span>About Us &amp; Company</span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: '#94A3B8',
                      transform: mobileAboutOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 180ms ease',
                    }}
                  />
                </button>
                {mobileAboutOpen && (
                  <div style={{ paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.25rem' }}>
                    {aboutDropdownLinks.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        style={({ isActive }) => ({
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.90rem',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? '#AA2E1F' : '#475569',
                          textDecoration: 'none',
                          padding: '0.50rem 0.65rem',
                          borderRadius: '6px',
                          backgroundColor: isActive ? 'var(--color-red-light)' : 'transparent',
                        })}
                      >
                        {item.label}
                        <ChevronRight size={14} style={{ color: '#94A3B8' }} />
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Actions */}
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', marginTop: '1rem' }}>
              <Link
                to="/quote"
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '0.65rem' }}
              >
                <FileText size={17} />
                Request a Quote
              </Link>
              <a
                href="tel:+19196707979"
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <PhoneCall size={15} />
                Call 919-670-7979
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Header Specific Styles */}
      <style>{`
        /* Eyebrow Menu Top Bar */
        .eyebrow-top-bar {
          background-color: #0A0A09;
          color: #94A3B8;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.78rem;
          padding: 0.45rem 0;
          font-family: var(--font-body);
        }
        .eyebrow-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .eyebrow-left, .eyebrow-right {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .eyebrow-contact-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #CBD5E1;
          text-decoration: none;
          transition: color 150ms ease;
          white-space: nowrap;
        }
        .eyebrow-contact-link:hover {
          color: #FFFFFF;
        }
        .eyebrow-contact-link strong {
          color: #FFFFFF;
          font-weight: 600;
        }
        .eyebrow-icon {
          color: #AA2E1F;
          flex-shrink: 0;
        }
        .eyebrow-divider {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.72rem;
        }
        .eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #CBD5E1;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .eyebrow-quick-link {
          color: #94A3B8;
          text-decoration: none;
          transition: color 150ms ease;
        }
        .eyebrow-quick-link:hover {
          color: #FFFFFF;
        }

        /* Sticky Navigation Phone Button */
        .sticky-nav-phone {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.42rem 0.75rem;
          background-color: #FAF8F5;
          border: 1px solid #EADBCC;
          border-radius: 8px;
          text-decoration: none;
          color: #0A0A09;
          transition: all 180ms ease;
        }
        .sticky-nav-phone:hover {
          background-color: #FDF2F0;
          border-color: #FCDAD7;
          transform: translateY(-1px);
        }
        .sticky-nav-phone-icon {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background-color: #FDF2F0;
          color: #AA2E1F;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background-color 180ms ease, color 180ms ease;
        }
        .sticky-nav-phone:hover .sticky-nav-phone-icon {
          background-color: #AA2E1F;
          color: #FFFFFF;
        }
        .sticky-nav-phone-content {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .sticky-nav-phone-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748B;
          font-weight: 600;
        }
        .sticky-nav-phone-num {
          font-size: 0.86rem;
          font-weight: 700;
          color: #0A0A09;
          letter-spacing: -0.01em;
        }

        /* Mobile Phone Button in Header */
        .mobile-quick-call-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background-color: #FDF2F0;
          border: 1px solid #FCDAD7;
          color: #AA2E1F;
          text-decoration: none;
          transition: background-color 150ms ease;
        }
        .mobile-quick-call-btn:active {
          background-color: #AA2E1F;
          color: #FFFFFF;
        }

        .nav-item {
          position: relative;
        }
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 2px;
          background-color: #AA2E1F;
          transition: width 200ms cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 2px;
        }
        .nav-item:hover {
          color: #AA2E1F !important;
        }
        .nav-item:hover::after {
          width: 100%;
        }
        .nav-item-active {
          position: relative;
        }
        .nav-item-active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #AA2E1F;
          border-radius: 2px;
        }

        /* About Us Hover Dropdown Menu Styles */
        .nav-dropdown-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          height: 100%;
        }
        .nav-dropdown-trigger {
          outline: none;
        }
        .nav-dropdown-wrapper:hover .nav-dropdown-menu,
        .nav-dropdown-wrapper:focus-within .nav-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }
        /* Invisible hover bridge */
        .nav-dropdown-wrapper::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          height: 18px;
        }
        .nav-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          width: 290px;
          background-color: #FFFFFF;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 16px 36px -6px rgba(15, 23, 42, 0.16), 0 4px 12px -2px rgba(15, 23, 42, 0.06);
          padding: 0.5rem;
          opacity: 0;
          visibility: hidden;
          transition: opacity 160ms ease, transform 160ms ease, visibility 160ms ease;
          z-index: 1000;
          pointer-events: none;
        }
        .nav-dropdown-header {
          padding: 0.35rem 0.65rem 0.45rem;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 0.35rem;
        }
        .nav-dropdown-header span {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 700;
          color: #AA2E1F;
        }
        .nav-dropdown-item {
          display: block;
          padding: 0.60rem 0.75rem;
          border-radius: 6px;
          text-decoration: none;
          transition: background-color 140ms ease;
        }
        .nav-dropdown-item:hover {
          background-color: #F8FAFC;
        }
        .nav-dropdown-item:hover .nav-dropdown-item-title {
          color: #AA2E1F;
        }
        .nav-dropdown-item-active {
          background-color: rgba(170, 46, 31, 0.05);
        }
        .nav-dropdown-item-active .nav-dropdown-item-title {
          color: #AA2E1F;
          font-weight: 700;
        }
        .nav-dropdown-item-title {
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 600;
          color: #0F172A;
          line-height: 1.25;
          transition: color 140ms ease;
        }
        .nav-dropdown-item-desc {
          font-size: 0.74rem;
          color: #64748B;
          margin-top: 2px;
          line-height: 1.35;
        }

        @keyframes drawerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawerSlideIn {
          from { transform: translate3d(-100%, 0, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
        .mobile-drawer-backdrop {
          animation: drawerFadeIn 200ms ease forwards;
        }
        .mobile-drawer-panel {
          animation: drawerSlideIn 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform;
        }

        @media (max-width: 900px) {
          .eyebrow-right {
            display: none !important;
          }
          .eyebrow-container {
            justify-content: center !important;
            flex-wrap: nowrap !important;
          }
          .eyebrow-left {
            justify-content: center !important;
            flex-wrap: nowrap !important;
          }
        }

        @media (max-width: 640px) {
          .eyebrow-top-bar {
            padding: 0.35rem 0 !important;
            font-size: 0.72rem !important;
          }
          .eyebrow-container {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            gap: 0.45rem !important;
            flex-wrap: nowrap !important;
          }
          .eyebrow-left {
            gap: 0.45rem !important;
            flex-wrap: nowrap !important;
          }
          .eyebrow-phone-label {
            display: none !important;
          }
          .eyebrow-contact-link {
            font-size: 0.72rem !important;
            gap: 0.3rem !important;
            white-space: nowrap !important;
          }
          .eyebrow-icon {
            width: 11px !important;
            height: 11px !important;
          }
          .eyebrow-divider {
            font-size: 0.68rem !important;
            margin: 0 0.1rem !important;
          }
        }

        @media (max-width: 370px) {
          .eyebrow-top-bar {
            font-size: 0.64rem !important;
            padding: 0.3rem 0 !important;
          }
          .eyebrow-container,
          .eyebrow-left {
            gap: 0.3rem !important;
            padding-left: 0.25rem !important;
            padding-right: 0.25rem !important;
          }
          .eyebrow-contact-link {
            font-size: 0.64rem !important;
            gap: 0.25rem !important;
          }
          .eyebrow-icon {
            width: 10px !important;
            height: 10px !important;
          }
        }

        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-header-actions {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Header;

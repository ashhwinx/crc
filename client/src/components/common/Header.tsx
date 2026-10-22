import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall, ChevronRight, FileText } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll effect: update scrolled style without unnecessary re-renders or hide/show jitter
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update dynamic CSS variable for sticky sub-bars (e.g. RailcarLeasing catalog filter)
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

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/railcar-leasing', label: 'Railcar Leasing' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Main Navigation Header: Rock-solid, flicker-free sticky navigation */}
      <header
        className="site-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.96)' : '#FFFFFF',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.08)' : '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transition: 'background-color 220ms ease, box-shadow 220ms ease',
        }}
      >
        <div
          className="container"
          style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
              src="/images/crc-logo-color.png"
              alt="Coast Road Capital"
              style={{
                height: '64px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2.25rem',
            }}
            className="desktop-nav"
          >
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.96rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#AA2E1F' : '#334155',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  position: 'relative',
                  transition: 'color 180ms ease',
                })}
                className={({ isActive }) => (isActive ? 'nav-item-active' : 'nav-item')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Action */}
          <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
            <Link
              to="/quote"
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.92rem',
                borderRadius: '8px',
              }}
            >
              <FileText size={16} />
              Request a Quote
            </Link>
          </div>

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
      </header>

      {/* Mobile Navigation Drawer */}
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
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 28px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <img
                src="/images/crc-logo-color.png"
                alt="Coast Road Capital"
                style={{ height: '40px', width: 'auto' }}
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem',
                  cursor: 'pointer',
                  color: '#334155',
                }}
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#AA2E1F' : '#0A0A09',
                    textDecoration: 'none',
                    padding: '0.85rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'var(--color-red-light)' : 'transparent',
                    transition: 'all 150ms ease',
                  })}
                >
                  {item.label}
                  <ChevronRight size={17} style={{ color: '#94A3B8' }} />
                </NavLink>
              ))}
            </nav>

            {/* Mobile Actions */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
              <Link
                to="/quote"
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '0.75rem' }}
              >
                <FileText size={18} />
                Request a Quote
              </Link>
              <Link
                to="/contact"
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <PhoneCall size={16} />
                Contact &amp; Sourcing
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .nav-item {
          position: relative;
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
          transform: translateZ(0);
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
          transform: translateZ(0);
        }
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

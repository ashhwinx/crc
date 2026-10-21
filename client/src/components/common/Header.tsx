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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    { path: '/about', label: 'About Us' },
    { path: '/railcar-leasing', label: 'Railcar Leasing' },
    { path: '/book-a-call', label: 'Book a Call' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div
        style={{
          backgroundColor: '#0A0A09',
          color: '#EDE6D4',
          fontSize: '0.8rem',
          borderBottom: '1px solid #1C1C1A',
          padding: '0.45rem 0',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                backgroundColor: '#10B981',
                borderRadius: '50%',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
              }}
            />
            <span style={{ fontWeight: 500, letterSpacing: '0.01em', color: '#94A3B8' }}>
              Coast Road Capital <span style={{ color: '#475569' }}>|</span> North American Railcar Leasing &amp; Equipment Solutions
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link
              to="/book-a-call"
              style={{
                color: '#F8FAFC',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 500,
                transition: 'color 150ms ease',
              }}
              className="top-utility-link"
            >
              <PhoneCall size={13} style={{ color: '#F87171' }} />
              Schedule Sourcing Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.96)' : '#FFFFFF',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.08)' : 'none',
          transition: 'all 240ms ease',
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
                height: '48px',
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
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
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
                to="/book-a-call"
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <PhoneCall size={16} />
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
          transition: width 200ms ease;
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

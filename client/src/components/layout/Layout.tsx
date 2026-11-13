import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname, hash } = useLocation();

  // Restore standard browser scrolling without artificial inertia
  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          const headerOffset = 110;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 60);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  // Synchronize canonical URL to prevent duplicate URL indexing
  useEffect(() => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const cleanPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
    canonical.setAttribute('href', `https://coastroadcapital.com${cleanPath || '/'}`);
  }, [pathname]);

  // Isolate Admin Portal: Do NOT render public header (with announcement bar) or footer
  const isAdminRoute =
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/portal' ||
    pathname.startsWith('/portal/') ||
    pathname === '/cms' ||
    pathname.startsWith('/cms/');

  if (isAdminRoute) {
    return <main style={{ minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>{children}</main>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
};

import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PageLoadingFallback } from './components/common/LoadingFallback';

// Primary homepage direct import for instant First Contentful Paint without route suspension
import { Home } from './pages/Home';

// Lazy-loaded routes for code-splitting and isolating heavy dependencies (e.g. Three.js)
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const CompanyValues = lazy(() => import('./pages/CompanyValues').then((m) => ({ default: m.CompanyValues })));
const FAQ = lazy(() => import('./pages/FAQ').then((m) => ({ default: m.FAQ })));
const RailcarLeasing = lazy(() => import('./pages/RailcarLeasing').then((m) => ({ default: m.RailcarLeasing })));
const CostEstimator = lazy(() => import('./pages/CostEstimator').then((m) => ({ default: m.CostEstimator })));
const TrackLayout = lazy(() => import('./pages/TrackLayout').then((m) => ({ default: m.TrackLayout })));
const RailcarViewer = lazy(() => import('./pages/RailcarViewer').then((m) => ({ default: m.RailcarViewer })));
const Quote = lazy(() => import('./pages/Quote').then((m) => ({ default: m.Quote })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const RailroadPartnerships = lazy(() => import('./pages/RailroadPartnerships').then((m) => ({ default: m.RailroadPartnerships })));
const BookCall = lazy(() => import('./pages/BookCall').then((m) => ({ default: m.BookCall })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

export const App: React.FC = () => {
  // Idle prefetching for critical equipment & fleet images so all tab/page transitions are instant
  useEffect(() => {
    const criticalImages = [
      '/images/hero/DSC_0004.webp',
      '/images/hero/DSC_0004.jpg',
      '/images/equipment/category-covered-hoppers.jpg',
      '/images/equipment/category-boxcars.jpg',
      '/images/equipment/category-open-top-hoppers.jpg',
      '/images/equipment/category-tank-cars.jpg',
      '/images/equipment/category-gondolas.jpg',
      '/images/equipment/category-centerbeam.jpg',
      '/images/equipment/category-bulkhead.jpg',
      '/images/Trains serving industries-additional railcar images/DSC06309 (1).jpg',
      '/images/Trains serving industries-additional railcar images/DSC09750(1).jpg',
    ];

    const prefetch = () => {
      criticalImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };

    if ('requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(prefetch);
    } else {
      setTimeout(prefetch, 1000);
    }
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/company-values" element={<CompanyValues />} />
            <Route path="/values" element={<Navigate to="/company-values" replace />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/faqs" element={<Navigate to="/faq" replace />} />
            <Route path="/railcar-leasing" element={<RailcarLeasing />} />
            <Route path="/catalog" element={<Navigate to="/railcar-leasing" replace />} />
            <Route path="/cost-estimator" element={<CostEstimator />} />
            <Route path="/estimator" element={<Navigate to="/cost-estimator" replace />} />
            <Route path="/railcar-viewer" element={<RailcarViewer />} />
            <Route path="/3d-viewer" element={<Navigate to="/railcar-viewer" replace />} />
            <Route path="/viewer" element={<Navigate to="/railcar-viewer" replace />} />
            <Route path="/railroad-partnerships" element={<RailroadPartnerships />} />
            <Route path="/partnerships" element={<Navigate to="/railroad-partnerships" replace />} />
            <Route path="/track-layout" element={<TrackLayout />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-a-call" element={<BookCall />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

export default App;

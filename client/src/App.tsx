import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { RailcarLeasing } from './pages/RailcarLeasing';
import { Quote } from './pages/Quote';
import { Contact } from './pages/Contact';
import { BookCall } from './pages/BookCall';
import { CostEstimator } from './pages/CostEstimator';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/railcar-leasing" element={<RailcarLeasing />} />
          <Route path="/catalog" element={<Navigate to="/railcar-leasing" replace />} />
          <Route path="/cost-estimator" element={<CostEstimator />} />
          <Route path="/estimator" element={<Navigate to="/cost-estimator" replace />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-a-call" element={<BookCall />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;

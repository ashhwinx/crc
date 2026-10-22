import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { TrackMotif } from '../components/common/TrackMotif';

export const NotFound: React.FC = () => {
  return (
    <div style={{
      backgroundColor: '#0A0A09',
      color: '#EDE6D4',
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '600px' }}>
        <span className="eyebrow eyebrow-dark" style={{ justifyContent: 'center' }}>
          End of Track
        </span>
        <h1 style={{
          fontSize: 'clamp(3.5rem, 8vw, 6rem)',
          color: '#AA2E1F',
          lineHeight: 1,
          marginBottom: '1rem',
        }}>
          404
        </h1>
        <h2 style={{ fontSize: '2rem', color: '#EDE6D4', marginBottom: '1rem' }}>
          Page or Route Not Found
        </h2>
        <p style={{ color: '#A09D94', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          The railroad siding or URL you requested does not exist on the Coast Road Capital corporate network.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            Return to Homepage
          </Link>
          <Link to="/railcar-leasing" className="btn btn-outline-white">
            <Search size={18} />
            Explore Railcar Catalog
          </Link>
        </div>
        <div style={{ marginTop: '2.5rem', maxWidth: '320px', marginInline: 'auto' }}>
          <TrackMotif dark />
        </div>
      </div>
    </div>
  );
};

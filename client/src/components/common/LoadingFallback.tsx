import React from 'react';

export const PageLoadingFallback: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        padding: '3rem 1rem',
      }}
      aria-label="Loading page content"
      role="status"
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(170, 46, 31, 0.15)',
          borderTopColor: '#AA2E1F',
          borderRadius: '50%',
          animation: 'crcSpin 0.7s linear infinite',
        }}
      />
      <span
        style={{
          fontSize: '0.82rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: '#64748B',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Loading Coast Road Capital...
      </span>
      <style>{`
        @keyframes crcSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

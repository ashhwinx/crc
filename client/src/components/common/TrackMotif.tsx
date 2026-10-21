import React from 'react';

interface TrackMotifProps {
  dark?: boolean;
  className?: string;
}

export const TrackMotif: React.FC<TrackMotifProps> = ({ dark = false, className = '' }) => {
  return (
    <div
      className={`track-divider ${dark ? 'track-divider-dark' : ''} ${className}`}
      aria-hidden="true"
    >
      <div className="track-line" />
      <div className="track-ties">
        <span className="track-tie" />
        <span className="track-tie" />
        <span className="track-tie" />
        <span className="track-tie" />
        <span className="track-tie" />
      </div>
      <div className="track-line" />
    </div>
  );
};

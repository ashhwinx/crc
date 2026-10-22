import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const BookCall: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/contact?tab=booking', { replace: true });
  }, [navigate]);

  return null;
};

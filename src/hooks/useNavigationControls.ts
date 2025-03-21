import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigationControls = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        // Only return to hub if we're in explore mode
        if (location.pathname === '/explore') {
          navigate('/');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location]);
};

export default useNavigationControls;
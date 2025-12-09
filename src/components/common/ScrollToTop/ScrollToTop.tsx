import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AOS from 'aos';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Refresh AOS animations when route changes
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, [pathname]);

  return null;
};

export default ScrollToTop;


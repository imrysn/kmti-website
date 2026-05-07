import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from './components/common/Layout';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import Home from './pages/Home';
import { initTextSelectionPrevention } from './utils/preventTextSelection';

// Lazy load pages for better performance
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Careers = lazy(() => import('./pages/Careers'));
const LegalAndCompliance = lazy(() => import('./pages/LegalAndCompliance/LegalAndCompliance'));
const Events = lazy(() => import('./pages/Events/Events'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    color: 'white'
  }}>
    <div>Loading...</div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<Services />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/events" element={<Events />} />
      <Route path="/legal-and-compliance" element={<LegalAndCompliance />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Initialize text selection prevention
    const cleanup = initTextSelectionPrevention();
    return cleanup;
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <ScrollToTopButton />
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;

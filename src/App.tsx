import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from './components/common/Layout';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home';
import { initTextSelectionPrevention } from './utils/preventTextSelection';

// Lazy load pages for better performance
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Careers = lazy(() => import('./pages/Careers'));

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

  // Loading fallback component
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

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;

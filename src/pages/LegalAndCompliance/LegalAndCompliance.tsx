import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/common/SEO';
import './LegalAndCompliance.css';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

// --- Icons (Inline SVGs for reliability) ---
const PrivacyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const TermsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ComplianceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const BackgroundShapes: React.FC = () => (
  <> {/* Bottom Shapes */}
    <ul className="shapes-container" aria-hidden="true">
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
    </ul>
    {/* Top Shapes */}
    <ul className="shapes-container-top" aria-hidden="true">
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
    </ul>
  </>
);

// --- 3D Gear Component ---
const FloatingGear: React.FC<{ position: [number, number, number], scale?: number, speed?: number }> = ({ position, scale = 1, speed = 0.2 }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const gearShape = React.useMemo(() => {
    const shape = new THREE.Shape();
    const teeth = 12;
    const rOuter = 3.2;
    const rInner = 2.3;
    const holeRadius = 1;

    // Start at inner radius (angle 0)
    shape.moveTo(rInner, 0);

    for (let i = 0; i < teeth; i++) {
      const theta = (Math.PI * 2 * i) / teeth;
      const step = (Math.PI * 2) / teeth;

      // Create a trapezoidal tooth profile (Cog shape)
      const aRise = theta + step * 0.15; // Start of rise
      const aTop = theta + step * 0.35;  // End of flat top
      const aFall = theta + step * 0.50; // End of fall
      const aNext = theta + step;        // End of valley

      shape.lineTo(Math.cos(aRise) * rOuter, Math.sin(aRise) * rOuter); // Rise to outer
      shape.lineTo(Math.cos(aTop) * rOuter, Math.sin(aTop) * rOuter);   // Move along outer
      shape.lineTo(Math.cos(aFall) * rInner, Math.sin(aFall) * rInner); // Fall to inner
      shape.lineTo(Math.cos(aNext) * rInner, Math.sin(aNext) * rInner); // Move along inner
    }
    shape.closePath();

    const hole = new THREE.Path();
    hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
    shape.holes.push(hole);

    return shape;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * speed; // Custom rotation speed
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2; // Slight tilt
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <extrudeGeometry args={[gearShape, { depth: 0.8, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 }]} />
      <meshStandardMaterial color="#51A2FF" metalness={0.7} roughness={0.3} opacity={0.15} transparent={true} />
    </mesh>
  );
};

const LegalAndCompliance: React.FC = () => {
  const { t, i18n } = useTranslation();
  const tEn = i18n.getFixedT('en');

  // ScrollSpy state to highlight sidebar link
  const [activeId, setActiveId] = useState<string>('privacy');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['privacy', 'terms', 'compliance'];
      const scrollPosition = window.scrollY + 200; // Offset for header

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler for the sidebar
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className='legal-compliance-bg-wrapper'>
      <div className="legal-shapes-overlay">
        <BackgroundShapes />
      </div>
      <div className="legal-compliance-3d-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <FloatingGear position={[8, 4, 0]} scale={0.8} speed={0.15} />
          <FloatingGear position={[-10, -5, -2]} scale={1.2} speed={-0.1} />
          <FloatingGear position={[5, -8, -5]} scale={0.6} speed={0.2} />
        </Canvas>
      </div>

      <div className="legal-page">
        <SEO
          title={tEn('legal.page_title')}
          description={tEn('legal.privacy.intro')}
        />
        
        <div className="legal-header" data-aos="fade-down">
           <h1 className="legal-title">{t('legal.page_title')}</h1>
           <p className="legal-subtitle">{t('legal.compliance.intro')}</p>
        </div>

        <div className="legal-layout-grid">
          {/* Sidebar Navigation */}
          <aside className="legal-sidebar" data-aos="fade-right">
            <nav className="legal-nav">
              <span className="legal-nav-title">Quick Navigation</span>
              <a 
                href="#privacy" 
                onClick={(e) => scrollToSection(e, 'privacy')} 
                className={`legal-nav-link ${activeId === 'privacy' ? 'active' : ''}`}
              >
                <PrivacyIcon /> {t('legal.privacy.title')}
              </a>
              <a 
                href="#terms" 
                onClick={(e) => scrollToSection(e, 'terms')} 
                className={`legal-nav-link ${activeId === 'terms' ? 'active' : ''}`}
              >
                <TermsIcon /> {t('legal.terms.title')}
              </a>
              <a 
                href="#compliance" 
                onClick={(e) => scrollToSection(e, 'compliance')} 
                className={`legal-nav-link ${activeId === 'compliance' ? 'active' : ''}`}
              >
                <ComplianceIcon /> {t('legal.compliance.title')}
              </a>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="legal-content-area">
            
            <section className="legal-card" id="privacy" data-aos="fade-up">
              <div className="legal-card-header">
                <div className="legal-icon-wrapper"><PrivacyIcon /></div>
                <h2 className="legal-section-title">{t('legal.privacy.title')}</h2>
              </div>
              <div className="legal-content">
                <p>{t('legal.privacy.intro')}</p>
                <p>{t('legal.privacy.collection')}</p>
                <p>{t('legal.privacy.usage')}</p>
              </div>
            </section>

            <section className="legal-card" id="terms" data-aos="fade-up" data-aos-delay="100">
               <div className="legal-card-header">
                <div className="legal-icon-wrapper"><TermsIcon /></div>
                <h2 className="legal-section-title">{t('legal.terms.title')}</h2>
              </div>
              <div className="legal-content">
                <p>{t('legal.terms.intro')}</p>
                <p>{t('legal.terms.use_license')}</p>
                <p>{t('legal.terms.disclaimer')}</p>
              </div>
            </section>

            <section className="legal-card" id="compliance" data-aos="fade-up" data-aos-delay="200">
               <div className="legal-card-header">
                <div className="legal-icon-wrapper"><ComplianceIcon /></div>
                <h2 className="legal-section-title">{t('legal.compliance.title')}</h2>
              </div>
              <div className="legal-content">
                <p>{t('legal.compliance.intro')}</p>
                <p>{t('legal.compliance.certifications')}</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAndCompliance;

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import SEO from '../../components/common/SEO';
import './Sitemap.css';
import type { SitemapPageProps, SitemapSection } from './Sitemap.types';

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

const Sitemap: React.FC<SitemapPageProps> = () => {
  const { t, i18n } = useTranslation();
  const tEn = i18n.getFixedT('en');

  const sitemapSections: SitemapSection[] = [
    {
      title: t('sitemap.sections.main_pages'),
      links: [
        {
          path: '/',
          label: t('nav.home'),
          description: t('sitemap.descriptions.home')
        },
        {
          path: '/about',
          label: t('nav.about'),
          description: t('sitemap.descriptions.about')
        },
        {
          path: '/contact',
          label: t('nav.contact'),
          description: t('sitemap.descriptions.contact')
        }
      ]
    },
    {
      title: t('sitemap.sections.services'),
      links: [
        {
          path: '/services',
          label: t('nav.services'),
          description: t('sitemap.descriptions.services')
        },
        {
          path: '/services/3d-modeling',
          label: t('home.services.items.3d.title'),
          description: t('home.services.items.3d.desc')
        },
        {
          path: '/services/2d-detailing',
          label: t('home.services.items.2d.title'),
          description: t('home.services.items.2d.desc')
        },
        {
          path: '/services/parts-inspection',
          label: t('home.services.items.inspection.title'),
          description: t('home.services.items.inspection.desc')
        },
        {
          path: '/services/machine-assembly',
          label: t('home.services.items.assembly.title'),
          description: t('home.services.items.assembly.desc')
        }
      ]
    },
    {
      title: t('sitemap.sections.projects'),
      links: [
        {
          path: '/projects',
          label: t('nav.projects'),
          description: t('sitemap.descriptions.projects')
        }
      ]
    },
    {
      title: t('sitemap.sections.company'),
      links: [
        {
          path: '/careers',
          label: t('nav.careers'),
          description: t('sitemap.descriptions.careers')
        },
        {
          path: '/legal-and-compliance',
          label: t('sitemap.legal_compliance'),
          description: t('sitemap.descriptions.legal')
        }
      ]
    }
  ];

  return (
    <div className="sitemap-page">
      <SEO 
        title={tEn('sitemap.title')} 
        description={tEn('sitemap.subtitle')} 
      />
      <BackgroundShapes />

      <div className="sitemap-3d-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <FloatingGear position={[8, 4, 0]} scale={0.8} speed={0.15} />
          <FloatingGear position={[-10, -5, -2]} scale={1.2} speed={-0.1} />
          <FloatingGear position={[5, -8, -5]} scale={0.6} speed={0.2} />
        </Canvas>
      </div>

      <section className="hero-section">
        <div className="sitemap-hero-container">
          <h1 className="sitemap-title">{t('sitemap.title')}</h1>
          <p className="sitemap-subtitle">{t('sitemap.subtitle')}</p>
        </div>
      </section>

      <div className="sitemap-content">
        {sitemapSections.map((section, index) => (
          <div key={index} className="sitemap-section" data-aos="fade-up">
            <h2 className="sitemap-section-title">{section.title}</h2>
            <div className="sitemap-links-grid">
              {section.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  to={link.path}
                  className="sitemap-link-card"
                >
                  <div className="sitemap-link-title">
                    {link.label}
                    <span className="sitemap-link-arrow">→</span>
                  </div>
                  {link.description && (
                    <p className="sitemap-link-description">{link.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sitemap;

import React, { useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import './Services.css';
import '../../styles/BackgroundShapes.css'; // Global CSS for Background Animated Shape
import type { ServicesPageProps } from './Services.types';
import { smoothScrollToElement } from '../../utils/smoothScroll';
import { ServicePageCard } from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button';
import { getAssetUrl } from '../../utils/assets';
import ServiceDetail from './ServiceDetail';
import SEO from '../../components/common/SEO';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  CubeIcon,
  CubesIcon,
  InspectionIcon,
  AssemblyIcon
} from '../../components/ui/Icons/ProjectIcons';

const servicesBg = getAssetUrl('hero_background/servicesbg.webp');
const icon3D = getAssetUrl('icons/cube.webp');
const icon2D = getAssetUrl('icons/cubes.webp');
const inspectionIcon = getAssetUrl('icons/parts-inspection-icon.webp');
const assemblyIcon = getAssetUrl('icons/machine-assembly-icon.webp');

const video3D = getAssetUrl('service_detail_image/service_3d.mp4');
const videoInspection = getAssetUrl('service_detail_image/service_parts_inspection.mp4');
const videoAssembly = getAssetUrl('service_detail_image/service_machine.mp4');
const video2D = getAssetUrl('service_detail_image/service_2d.mp4');



interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
  video?: string;
}


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

const Services: React.FC<ServicesPageProps> = () => {
  const { t, i18n } = useTranslation();
  const tEn = i18n.getFixedT('en');
  const navigate = useNavigate();
  const { id } = useParams();
  const servicesNavRef = useRef<HTMLDivElement>(null);
  const servicesGridRef = useRef<HTMLDivElement>(null);

  const previousId = useRef(id);

  // Scroll to nav tabs when id changes (navigation between grid and detail)
  useEffect(() => {
    // Scroll if id has changed (navigating to detail OR back to grid)
    if (previousId.current !== id) {
      smoothScrollToElement(servicesNavRef.current, 1200);
    }
    previousId.current = id;
  }, [id]);

  const services: Service[] = [
    { id: 1, title: '3D Modeling', description: t('services.items.3d.short_desc'), icon: icon3D, image: '', video: video3D },
    { id: 2, title: '2D Detailing', description: t('services.items.2d.short_desc'), icon: icon2D, image: '', video: video2D },
    { id: 3, title: 'Parts Inspection', description: t('services.items.inspection.short_desc'), icon: inspectionIcon, image: '', video: videoInspection },
    { id: 4, title: 'Machine Assembly', description: t('services.items.assembly.short_desc'), icon: assemblyIcon, image: '', video: videoAssembly },
  ];

  const serviceTabs = [
    t('services.items.3d.title'),
    t('services.items.2d.title'),
    t('services.items.inspection.title'),
    t('services.items.assembly.title')
  ];

  const handleTabClick = (_: string, index: number) => {
    const slugs = ['3d-modeling', '2d-detailing', 'parts-inspection', 'machine-assembly'];
    const slug = slugs[index % slugs.length];
    navigate(`/services/${slug}`);
  };

  useEffect(() => {
    document.documentElement.classList.add('services-page-active');
    document.body.classList.add('services-page-active');
    return () => {
      document.documentElement.classList.remove('services-page-active');
      document.body.classList.remove('services-page-active');
    };
  }, []);

  // If on a detail page, render only the ServiceDetail component
  if (id) {
    return <ServiceDetail />;
  }

  return (
    <div className='services-bg-wrapper'>
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
    <div className="services-page">
      <SEO 
        title={tEn('nav.services')} 
        description={tEn('home.services.subtitle')} 
      />
      <section className="services-hero">
        <div className="services-hero-bg-custom" style={{ backgroundImage: `url(${servicesBg})` }}></div>
        <div className="services-hero-overlay"></div>
        <div className="services-hero-container container">
          <div className="services-hero-content">
            <h1 className="services-title">{t('services.hero.title')}</h1>
            <p className="services-subtitle">{t('services.hero.subtitle')}</p>
            <div className="services-hero-button">
              <Button variant="style2" onClick={() => smoothScrollToElement(servicesNavRef.current, 1200)}>{t('services.hero.cta')}</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="services-nav-section" ref={servicesNavRef}>
        <div className="services-nav-container">
          <div className="services-nav-tabs">
            <div className="services-nav-tabs-scroll">
              <div className="services-nav-tabs-content">
                {serviceTabs.concat(serviceTabs).map((tab, index) => (
                  <button key={index} className="services-nav-tab-text" onClick={() => handleTabClick(tab, index)}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-grid-section" ref={servicesGridRef}>
        <div className="services-grid-container container">
          <AnimatePresence initial={false}>
            <motion.div
              className="services-grid"
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {services.map((s) => {
                const getSlug = (id: number) => {
                  switch (id) {
                    case 1: return '3d-modeling';
                    case 2: return '2d-detailing';
                    case 3: return 'parts-inspection';
                    case 4: return 'machine-assembly';
                    default: return '';
                  }
                };

                let spanClass = 'service-span-1';
                if (s.id === 1 || s.id === 4) {
                  spanClass = 'service-span-2';
                }

                const getFallback = (id: number) => {
                  switch (id) {
                    case 1: return <CubeIcon />;
                    case 2: return <CubesIcon />;
                    case 3: return <InspectionIcon />;
                    case 4: return <AssemblyIcon />;
                    default: return undefined;
                  }
                };

                return (
                  <div key={s.id} className={`service-card-wrapper ${spanClass}`}>
                    <ServicePageCard
                      image={s.image}
                      video={s.video}
                      icon={s.icon}
                      fallbackNode={getFallback(s.id)}
                      title={t(`services.items.${s.id === 1 ? '3d' : s.id === 2 ? '2d' : s.id === 3 ? 'inspection' : 'assembly'}.title`)}
                      subtitle={s.description}
                      onClick={() => navigate(`/services/${getSlug(s.id)}`)}
                      className="service-page-card-item"
                      layoutId={`service-card-${s.id}`}
                    />
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>



      <section className="services-cta-section">
        <div className="services-cta-container container">
          <h2 className="services-cta-title">{t('services.footer_cta.title')}</h2>
          <Button variant="style2" onClick={() => navigate('/contact')}>{t('common.contact_us')}</Button>
        </div>
      </section>


    </div>
    </div>
  );
};

export default Services;
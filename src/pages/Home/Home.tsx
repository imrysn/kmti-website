import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import './Home.css';
import './Home-iPhoneSE.css';
import './iPhone12_13_14.css';
import './IphonePlus_Promax.css';
import './AndroidStandard.css';
import '../../styles/BackgroundShapes.css'; // Global CSS for Background Animated Shape
import type { HomePageProps } from './Home.types';
import { getAssetUrl } from '../../utils/assets';
import SEO from '../../components/common/SEO';
import Button from '../../components/ui/Button/Button';
import Card, { ServiceCard } from '../../components/ui/Card/Card';
import ProjectCarousel from '../../components/ui/ProjectCarousel/ProjectCarousel';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  PrecisionIcon,
  InnovationIcon,
  ExperienceIcon,
  CubeIcon,
  CubesIcon,
  InspectionIcon,
  AssemblyIcon
} from '../../components/ui/Icons/ProjectIcons';

const homeBg = getAssetUrl('hero_background/homebg.webp');

const precisionIcon = getAssetUrl('icons/precision-icon.webp');
const innovationIcon = getAssetUrl('icons/innovation-icon.webp');
const experienceIcon = getAssetUrl('icons/experience-icon.webp');
const icon3D = getAssetUrl('icons/cube.webp');
const icon2D = getAssetUrl('icons/cubes.webp');
const inspectionIcon = getAssetUrl('icons/parts-inspection-icon.webp');
const assemblyIcon = getAssetUrl('icons/machine-assembly-icon.webp');

const dedemplerImage = getAssetUrl('image3D/dedempler.webp');
const looperImage = getAssetUrl('image3D/looper.webp');
const formingImage = getAssetUrl('image3D/forming.webp');
const shearImage = getAssetUrl('image3D/shear.webp');
const finishingImage = getAssetUrl('image3D/finishing.webp');
const finishingLineImage = getAssetUrl('image3D/finishingLine.webp');
const millingImage = getAssetUrl('image3D/milling.webp');
const furnaceImage = getAssetUrl('image3D/furnace.webp');
const air_pipingImages = getAssetUrl('image3D/airpiping_1.webp');
const hydraulic_pipingImage = getAssetUrl('image3D/hydraulic_piping.webp');


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

const Home: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, []);

  const navigateToProjects = () => navigate('/projects');
  const navigateToContact = () => navigate('/contact');

  const whyChooseUs = [
    { id: 1, title: t('home.why_choose.precision.title'), description: t('home.why_choose.precision.desc'), icon: precisionIcon, fallback: <PrecisionIcon /> },
    { id: 2, title: t('home.why_choose.innovation.title'), description: t('home.why_choose.innovation.desc'), icon: innovationIcon, fallback: <InnovationIcon /> },
    {
      id: 3,
      title: t('home.why_choose.experience.title'),
      description: <Trans i18nKey="home.why_choose.experience.desc" components={{ br: <br /> }} />,
      icon: experienceIcon,
      fallback: <ExperienceIcon />
    },
  ];

  const services = [
    { id: 1, title: t('home.services.items.3d.title'), description: t('home.services.items.3d.desc'), icon: icon3D, fallback: <CubeIcon /> },
    { id: 2, title: t('home.services.items.2d.title'), description: <Trans i18nKey="home.services.items.2d.desc" components={{ br: <br /> }} />, icon: icon2D, fallback: <CubesIcon /> },
    { id: 3, title: t('home.services.items.inspection.title'), description: <Trans i18nKey="home.services.items.inspection.desc" components={{ br: <br /> }} />, icon: inspectionIcon, fallback: <InspectionIcon /> },
    { id: 4, title: t('home.services.items.assembly.title'), description: <Trans i18nKey="home.services.items.assembly.desc" components={{ br: <br /> }} />, icon: assemblyIcon, fallback: <AssemblyIcon /> },
  ];

  const projects = [
    { id: 1, title: t('home.projects.items.looper.title'), description: t('home.projects.items.looper.desc'), category: t('home.projects.items.looper.cat'), image: looperImage, link: '/projects?project=looper-machine' },
    { id: 2, title: t('home.projects.items.forming.title'), description: t('home.projects.items.forming.desc'), category: t('home.projects.items.forming.cat'), image: formingImage, link: '/projects?project=forming-and-sizing' },
    { id: 3, title: t('home.projects.items.shear.title'), description: t('home.projects.items.shear.desc'), category: t('home.projects.items.shear.cat'), image: shearImage, link: '/projects?project=shear-welder-machine' },
    { id: 4, title: t('home.projects.items.table.title'), description: t('home.projects.items.table.desc'), category: t('home.projects.items.table.cat'), image: finishingImage, link: '/projects?project=finishing-table' },
    { id: 5, title: t('home.projects.items.furnace.title'), description: t('home.projects.items.furnace.desc'), category: t('home.projects.items.furnace.cat'), image: furnaceImage, link: '/projects?project=furnace' },
    { id: 6, title: t('home.projects.items.line.title'), description: t('home.projects.items.line.desc'), category: t('home.projects.items.line.cat'), image: finishingLineImage, link: '/projects?project=finishing-line' },
    { id: 7, title: t('home.projects.items.milling.title'), description: t('home.projects.items.milling.desc'), category: t('home.projects.items.milling.cat'), image: millingImage, link: '/projects?project=milling-cutoff-machine' },
    { id: 8, title: t('home.projects.items.air_piping_1.title'), description: t('home.projects.items.air_piping_1.desc'), category: t('home.projects.items.air_piping_1.cat'), image: air_pipingImages, link: '/projects?project=air_piping_1'},
    { id: 9, title: t('home.projects.items.hydraulic_piping.title'), description: t('home.projects.items.hydraulic_piping.desc'), category: t('home.projects.items.hydraulic_piping.cat'), image: hydraulic_pipingImage, link: '/projects?project=hydraulic-piping'},
    { id: 10, title: t('home.projects.items.dedimpler.title'), description: t('home.projects.items.dedimpler.desc'), category: t('home.projects.items.dedimpler.cat'), image: dedemplerImage, link: '/projects?project=dedimpler-and-facer' }
  ];

  const tEn = i18n.getFixedT('en');

  return (
    <div className='home-bg-wrapper'>
        <div className="sitemap-3d-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <FloatingGear position={[8, 4, 0]} scale={0.8} speed={0.15} />
            <FloatingGear position={[-10, -5, -2]} scale={1.2} speed={-0.1} />
            <FloatingGear position={[5, -8, -5]} scale={0.6} speed={0.2} />
          </Canvas>
        </div>
    <div className="home-page">
      <BackgroundShapes />
      <SEO 
        description={tEn('about.hero.subtitle')} 
      />
        <section key={animationKey} className="hero-section">
          <div className="hero-bg-custom" style={{ backgroundImage: `url(${homeBg})` }}></div>
          <div className="hero-overlay"></div>
          <div className="hero-container container">
            <div className={`hero-content ${i18n.language === 'jp' ? 'lang-jp' : ''}`}>
              <h1 className={`hero-title ${i18n.language === 'jp' ? 'lang-jp' : ''}`}>
                {t('home.hero.title').split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </h1>
              <div className="hero-buttons">
                <Button variant="style1" onClick={navigateToContact}>{t('common.contact_us')}</Button>
                <Button variant="style2" onClick={navigateToProjects}>{t('common.view_projects')}</Button>
              </div>
            </div>
          </div>
        </section>
      <section className="services-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className="section-title">{t('home.services.title')}</h2>
          <p className="section-subtitle">{t('home.services.subtitle')}</p>
          <div className="services-grid">
            {services.map((service) => {
              let linkHref = '/services';
              if (service.id === 1) linkHref = '/services/3d-modeling';
              if (service.id === 2) linkHref = '/services/2d-detailing';
              if (service.id === 3) linkHref = '/services/parts-inspection';
              if (service.id === 4) linkHref = '/services/machine-assembly';

              return (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  fallbackNode={service.fallback}
                  title={service.title}
                  subtitle={service.description}
                  linkText={t('common.learn_more')}
                  linkHref={linkHref}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="vision-reality-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className="section-title">{t('home.projects.title')}</h2>
          <p className="section-subtitle">{t('home.projects.subtitle')}</p>
        </div>
        <ProjectCarousel projects={projects} />
      </section>

      <section className="why-choose-us-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className="section-title">{t('home.why_choose.title')}</h2>
          <div className="cards-grid">
            {whyChooseUs.map((item) => (
              <Card
                key={item.id}
                icon={item.icon}
                fallbackNode={item.fallback}
                title={item.title}
                subtitle={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className="section-title">{t('home.about.title')}</h2>
          <p className="about-description"><Trans i18nKey="home.about.desc" components={{ br: <br /> }} /></p>
          <Link to="/about" className="about-link">{t('home.about.link')} →</Link>
        </div>
      </section>

      <section className="cta-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className={`cta-title ${i18n.language === 'jp' ? 'lang-jp' : ''}`}>{t('home.cta.title')}</h2>
          <div className="cta-buttons">
            <Button variant="style2" onClick={navigateToContact}>{t('common.contact_us')}</Button>
          </div>
        </div>
      </section> 
    </div>
    </div> 
  );
};

export default Home;
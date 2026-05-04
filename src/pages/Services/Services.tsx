import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Services.css';
import '../../styles/BackgroundShapes.css';
import type { ServicesPageProps } from './Services.types';
import { smoothScrollToElement } from '../../utils/smoothScroll';
import Button from '../../components/ui/Button';
import { getAssetUrl } from '../../utils/assets';
import ServiceDetail from './ServiceDetail';
import SEO from '../../components/common/SEO';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Preload the model for better performance
useGLTF.preload('/compressed_glb/Hydraulic_piping.glb');

const servicesBg = getAssetUrl('hero_background/servicesbg.webp');
const icon3D = getAssetUrl('icons/cube.webp');
const icon2D = getAssetUrl('icons/cubes.webp');
const inspectionIcon = getAssetUrl('icons/parts-inspection-icon.webp');
const assemblyIcon = getAssetUrl('icons/machine-assembly-icon.webp');

const video3D = getAssetUrl('service_detail_image/service_3d.mp4');
const videoInspection = getAssetUrl('service_detail_image/service_parts_inspection.mp4');
const videoAssembly = getAssetUrl('service_detail_image/service_machine.mp4');
const video2D = getAssetUrl('service_detail_image/service_2d.mp4');

const motion1 = getAssetUrl('motion_analysis/motion1.mp4');
const motion2 = getAssetUrl('motion_analysis/motion2.mp4');
const motion3 = getAssetUrl('motion_analysis/motion3.mp4');
const motion4 = getAssetUrl('motion_analysis/motion4.mp4');
const motion5 = getAssetUrl('motion_analysis/motion5.mp4');
const motion6 = getAssetUrl('motion_analysis/motion6.mp4');
const motion7 = getAssetUrl('motion_analysis/motion7.mp4');
const motion8 = getAssetUrl('motion_analysis/motion8.mp4');

const motionsData = [
  { label: "MOTION 1", video: motion1 },
  { label: "MOTION 2", video: motion2 },
  { label: "MOTION 3", video: motion3 },
  { label: "MOTION 4", video: motion4 },
  { label: "MOTION 5", video: motion5 },
  { label: "MOTION 6", video: motion6 },
  { label: "MOTION 7", video: motion7 },
  { label: "MOTION 8", video: motion8 },
];

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
  video?: string;
}

const BackgroundShapes: React.FC = () => (
  <>
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

    shape.moveTo(rInner, 0);

    for (let i = 0; i < teeth; i++) {
      const theta = (Math.PI * 2 * i) / teeth;
      const step = (Math.PI * 2) / teeth;

      const aRise = theta + step * 0.15;
      const aTop = theta + step * 0.35;
      const aFall = theta + step * 0.50;
      const aNext = theta + step;

      shape.lineTo(Math.cos(aRise) * rOuter, Math.sin(aRise) * rOuter);
      shape.lineTo(Math.cos(aTop) * rOuter, Math.sin(aTop) * rOuter);
      shape.lineTo(Math.cos(aFall) * rInner, Math.sin(aFall) * rInner);
      shape.lineTo(Math.cos(aNext) * rInner, Math.sin(aNext) * rInner);
    }
    shape.closePath();

    const hole = new THREE.Path();
    hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
    shape.holes.push(hole);

    return shape;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * speed;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <extrudeGeometry args={[gearShape, { depth: 0.8, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 }]} />
      <meshStandardMaterial color="#51A2FF" metalness={0.7} roughness={0.3} opacity={0.15} transparent={true} />
    </mesh>
  );
};

// 3D Figure Component - Showcase Section
const HydraulicPipingModel: React.FC<{
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}> = ({
  scale = 0.12,
  rotation = [0, -0.2, 0],
  position = [0, 5, 0]
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/compressed_glb/Hydraulic_piping.glb');
  
  const [isInView, setIsInView] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const animationProgress = useRef(0);
  const animationSpeed = 0.007;
  
  const centeredModel = useMemo(() => {
    const clonedScene = scene.clone();
    const boundingBox = new THREE.Box3().setFromObject(clonedScene);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    const group = new THREE.Group();
    clonedScene.position.set(-center.x, -center.y, -center.z);
    group.add(clonedScene);
    return group;
  }, [scene]);
  
  useEffect(() => {
    const showcaseSection = document.querySelector('.svc-showcase');
    if (!showcaseSection) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    observer.observe(showcaseSection);
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (isInView && !animationStarted) {
      setAnimationStarted(true);
      animationProgress.current = 0;
    }
  }, [isInView, animationStarted]);
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    if (!animationStarted) {
      groupRef.current.position.set(position[0] - 0.5, position[1] - 1.5, -10);
      groupRef.current.rotation.y = Math.PI + 0.5;
      groupRef.current.scale.setScalar(scale * 0.5);
      return;
    }
    
    if (animationProgress.current < 1) {
      animationProgress.current = Math.min(animationProgress.current + animationSpeed, 1);
    }
    
    const progress = animationProgress.current;
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    const startZ = -10;
    const startY = position[1] - 1.5;
    const startX = position[0] - 0.5;
    const startRotation = Math.PI + 0.5;
    const startScale = 0.5;
    
    groupRef.current.position.x = startX + (position[0] - startX) * easeOut;
    groupRef.current.position.y = startY + (position[1] - startY) * easeOut;
    groupRef.current.position.z = startZ + (0 - startZ) * easeOut;
    groupRef.current.rotation.y = startRotation + (rotation[1] - startRotation) * easeOut;
    groupRef.current.scale.setScalar(scale * (startScale + (1 - startScale) * easeOut));
  });
  
  return (
    <group ref={groupRef}>
      <primitive object={centeredModel} />
    </group>
  );
};

const Services: React.FC<ServicesPageProps> = () => {
  const { t, i18n } = useTranslation();
  const tEn = i18n.getFixedT('en');
  const navigate = useNavigate();
  const { id } = useParams();
  const servicesNavRef = useRef<HTMLDivElement>(null);
  const previousId = useRef(id);

  // Refs for scroll-triggered animations
  const heroRef = useRef(null);
  const expertiseRef = useRef(null);
  const motionRef = useRef(null);

  // State for scroll animations
  const [isExpertiseInView, setIsExpertiseInView] = useState(false);
  const [isMotionInView, setIsMotionInView] = useState(false);

  // Set up Intersection Observers for simultaneous fade-up
  useEffect(() => {
    const options = { threshold: 0.15, triggerOnce: true };
    
    const expertiseObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsExpertiseInView(true);
    }, options);
    const motionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsMotionInView(true);
    }, options);
    
    if (expertiseRef.current) expertiseObserver.observe(expertiseRef.current);
    if (motionRef.current) motionObserver.observe(motionRef.current);
    
    return () => {
      expertiseObserver.disconnect();
      motionObserver.disconnect();
    };
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeMotion = motionsData[activeIndex];
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMotionChange = (index: number) => {
    if (index === activeIndex || isChanging) return;
    
    setIsChanging(true);
    
    setTimeout(() => {
      setActiveIndex(index);
      setIsPlaying(true);
      setCurrentTime(0);
      setProgress(0);
      
      setTimeout(() => setIsChanging(false), 50);
    }, 300);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && duration) {
      const seekTime = (parseFloat(e.target.value) / 100) * duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [activeMotion.video]);

  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
    setProgress(0);
  }, [activeMotion.video]);

  const useScrollReveal = () => {
    useEffect(() => {
      const elements = document.querySelectorAll('.reveal');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        },
        { threshold: 0.15 }
      );

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, []);
  };

  useScrollReveal();

  useEffect(() => {
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
        
        {/* Hero Section */}
        <section ref={heroRef} className="services-hero">
          <div className="services-hero-bg-custom" style={{ backgroundImage: `url(${servicesBg})` }}></div>
          <div className="services-hero-overlay"></div>
          <div className="services-hero-container container">
            <div className="services-hero-content">
              <h1 className="services-title">
                {t('services.hero.title')}
              </h1>
              <p className="services-subtitle">
                {t('services.hero.subtitle')}
              </p>
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

        {/* ----- Showcase Section ----- */}
        <section className="svc-showcase reveal">
          <div className="svc-showcase__inner">
            {/* BACK TEXT */}
            <div className="svc-showcase__bgtext-back">
              <span className="svc-showcase__back-text-fill">{t('services.showcase.back_text')}</span>
              <span className="svc-showcase__back-text-stroke">{t('services.showcase.back_text')}</span>
            </div>

            {/* CENTER 3D MODEL */}
            <div className="svc-showcase__center svc-showcase__center--3d">
              <Canvas 
                camera={{ position: [15, 40, 55], fov: 60 }}
                onCreated={({ camera }) => {
                  camera.lookAt(0, 0, 0);
                }}
              >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} />
                <directionalLight position={[-5, 5, -5]} intensity={1.5} />
                <pointLight position={[2, 5, 4]} intensity={1} />
                <pointLight position={[-2, 3, -3]} intensity={0.5} color="#51A2FF" />
                
                <Suspense fallback={null}>
                  <HydraulicPipingModel 
                    scale={0.12}
                    rotation={[0, -0.2, 0]}
                    position={[0, 0, 0]}
                  />
                </Suspense>
                
                <OrbitControls 
                  enableZoom={false}
                  enablePan={false} 
                  minPolarAngle={Math.PI / 2}
                  maxPolarAngle={Math.PI / 2}
                  enableRotate={true}
                  rotateSpeed={0.8}
                  zoomSpeed={1.5}
                />
              </Canvas>
            </div>

            {/* FRONT TEXT */}
            <div className="svc-showcase__bgtext-front">
              <span className="svc-showcase__text-fill">{t('services.showcase.front_text_fill')}</span>
              <span className="svc-showcase__text-stroke">{t('services.showcase.front_text_stroke')}</span>
            </div>

            {/* LEFT CONTENT */}
            <div className="svc-showcase__left">
              <p className="svc-showcase__desc">
                {t('services.showcase.description')}
              </p>

              <div className="svc-showcase__tags">
                <div className="svc-showcase__tags-row">
                  <span>"{t('services.showcase.tags.row1.0')}" /</span>
                  <span>"{t('services.showcase.tags.row1.1')}"</span>
                </div>
                <div className="svc-showcase__tags-row">
                  <span>"{t('services.showcase.tags.row2.0')}" /</span>
                  <span>"{t('services.showcase.tags.row2.1')}"</span>
                </div>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="svc-showcase__right">
              <div className="svc-showcase__card">
                <div>
                  <h3>{t('services.showcase.right_card.title_3d')}</h3>
                  <p>{t('services.showcase.right_card.subtitle_3d')}</p>
                </div>
                <div className="svc-showcase__divider" />
                <div>
                  <h3>{t('services.showcase.right_card.title_2d')}</h3>
                  <p>{t('services.showcase.right_card.subtitle_2d')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----- Expertise Section ----- */}
        <section ref={expertiseRef} className="svc-expertise reveal">
          <div className="svc-expertise__container">
            <div className="svc-expertise__title-wrap">
              <h2 className="svc-expertise__title">
                {t('services.expertise.title')}
              </h2>
            </div>

            <div className="svc-expertise__grid">
              {services.map((s, index) => {
                const videoRefLocal = React.useRef<HTMLVideoElement | null>(null);
                const keyMap =
                  s.id === 1 ? '3d' :
                  s.id === 2 ? '2d' :
                  s.id === 3 ? 'inspection' :
                  'assembly';

                const getSlug = (id: number) => {
                  switch (id) {
                    case 1: return '3d-modeling';
                    case 2: return '2d-detailing';
                    case 3: return 'parts-inspection';
                    case 4: return 'machine-assembly';
                    default: return '';
                  }
                };

                const handleMouseEnter = () => {
                  videoRefLocal.current?.play();
                };

                const handleMouseLeave = () => {
                  if (videoRefLocal.current) {
                    videoRefLocal.current.pause();
                    videoRefLocal.current.currentTime = 0;
                  }
                };

                return (
                  <div
                    key={s.id}
                    className="svc-expertise__card"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate(`/services/${getSlug(s.id)}`)}
                    style={{
                      opacity: isExpertiseInView ? 1 : 0,
                      transform: isExpertiseInView ? 'translateY(0)' : 'translateY(60px)',
                      transition: `opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)`,
                      transitionDelay: isExpertiseInView ? `${index * 0.1}s` : '0s'
                    }}
                  >
                    <video
                      ref={videoRefLocal}
                      src={s.video}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="svc-expertise__video"
                    />
                    
                    <div className="svc-expertise__overlay" />

                    <div className="svc-expertise__content">
                      <h3>{t(`services.items.${keyMap}.title`)}</h3>
                      <p>{s.description}</p>
                    </div>

                    <img src={s.icon} alt="icon" className="svc-expertise__logo" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ----- Motion Analysis Section ----- */}
        <section ref={motionRef} className="svc-motion reveal">
          <div className="svc-motion__container">
            <div className="svc-motion__title-wrap">
              <h2 className="svc-motion__title">{t('services.motion_analysis.title')}</h2>
            </div>
            
            <div 
              className="svc-motion__layout"
              style={{
                opacity: isMotionInView ? 1 : 0,
                transform: isMotionInView ? 'translateY(0)' : 'translateY(60px)',
                transition: `opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)`,
                transitionDelay: isMotionInView ? '0.2s' : '0s'
              }}
            >
              {/* LEFT SIDE */}
              <div className="svc-motion__left">
                <div 
                  className="svc-motion__main-card"
                  style={{
                    transition: `opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)`,
                    transitionDelay: isMotionInView ? '0s' : '0s'
                  }}
                >
                  <span className="svc-motion__badge">
                    {t(`services.motion_analysis.badge_labels.motion${activeIndex + 1}`)}
                  </span>
                  <video 
                    ref={videoRef}
                    src={activeMotion.video} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className={`svc-motion__video ${isChanging ? 'changing' : ''}`}
                  />
                  <div className="svc-motion__controls-overlay">
                    <button 
                      className="svc-motion__play-pause-btn"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? '⏸' : '▶'}
                    </button>
                    <div className="svc-motion__duration">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <input
                      type="range"
                      className="svc-motion__seek-bar"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                    />
                  </div>
                </div>
                
                <ul className="svc-motion__list">
                  {(t('services.motion_analysis.benefits', { returnObjects: true }) as string[]).map((benefit, idx) => (
                    <li 
                      key={idx}
                      style={{
                        opacity: isMotionInView ? 1 : 0,
                        transform: isMotionInView ? 'translateX(0)' : 'translateX(-30px)',
                        transition: `opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)`,
                        transitionDelay: isMotionInView ? `${0.3 + idx * 0.05}s` : '0s'
                      }}
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* RIGHT SIDE - Playlist */}
              <div className="svc-motion__right-grid">
                {motionsData.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={idx}
                      className={`svc-motion__mini-card ${isActive ? 'active' : ''}`}
                      onClick={() => handleMotionChange(idx)}
                      style={{
                        opacity: isMotionInView ? 1 : 0,
                        transform: isMotionInView ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                        transition: `opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)`,
                        transitionDelay: isMotionInView ? `${0.1 + idx * 0.06}s` : '0s'
                      }}
                    >
                      <video src={item.video} muted playsInline preload="metadata" />
                      <div className="svc-motion__mini-overlay" />
                      <span className="svc-motion__badge">
                        {t(`services.motion_analysis.badge_labels.motion${idx + 1}`)}
                      </span>
                      {isActive && (
                        <div className="svc-motion__playing-indicator">
                          <span className="svc-motion__playing-dot"></span>
                          <span className="svc-motion__playing-text">{t('services.motion_analysis.playing')}</span>
                        </div>
                      )}
                      {!isActive && (
                        <div className="svc-motion__play">▶</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-cta-section reveal">
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
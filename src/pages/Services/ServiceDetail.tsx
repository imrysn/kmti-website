import React, { useEffect, useRef } from 'react';
import LazyImage from '../../components/ui/LazyImage/LazyImage';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ServiceDetail.css';
import '../../styles/BackgroundShapes.css';
import Button from '../../components/ui/Button';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { getAssetUrl } from '../../utils/assets';
import SEO from '../../components/common/SEO';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';

import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

// Import images (only for 3D and 2D)
const modalImage1 = getAssetUrl('service_detail_image/3Dmodal1.webp');
const modalImage2 = getAssetUrl('service_detail_image/3Dmodal2.webp');
const modalImage2D = getAssetUrl('service_detail_image/2Dmodal.webp');

const inspectionGalleryImages = [
  getAssetUrl('service_detail_image/inspection1modal.webp'),
  getAssetUrl('service_detail_image/inspection2modal.webp'),
  getAssetUrl('service_detail_image/inspection3modal.webp'),
  getAssetUrl('service_detail_image/inspection4modal.webp'),
  getAssetUrl('service_detail_image/inspection5modal.webp'),
];

const assemblyGalleryImages = [
  getAssetUrl('service_detail_image/assembly1modal.webp'),
  getAssetUrl('service_detail_image/assembly2modal.webp'),
  getAssetUrl('service_detail_image/assmebly3modal.webp'),
  getAssetUrl('service_detail_image/assembly4modal.webp'),
  getAssetUrl('service_detail_image/assembly5modal.webp'),
  getAssetUrl('service_detail_image/assembly6modal.webp'),
  getAssetUrl('service_detail_image/assembly7modal.webp'),
  getAssetUrl('service_detail_image/assembly8modal.webp'),
  getAssetUrl('service_detail_image/assembly9modal.webp'),
  getAssetUrl('service_detail_image/assembly10modal.webp'),
  getAssetUrl('service_detail_image/assembly11modal.webp'),
  getAssetUrl('service_detail_image/assembly12modal.webp'),
  getAssetUrl('service_detail_image/assembly13modal.webp'),
  getAssetUrl('service_detail_image/assembly14modal.webp'),
  getAssetUrl('service_detail_image/assembly15modal.webp'),
];

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

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const tEn = i18n.getFixedT('en');
  const navigate = useNavigate();

  // Refs for scroll-triggered animations
  const backButtonRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const sectionTitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const mediaRef = useRef(null);
  const carouselRef = useRef(null);
  const checklistRightRef = useRef(null);
  const workflowTitleRef = useRef(null);
  const workflowStepsRef = useRef(null);
  const subsectionsRef = useRef(null);

  const isBackButtonInView = useInView(backButtonRef, { once: true, amount: 0.1 });
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.1 });
  const isSubtitleInView = useInView(subtitleRef, { once: true, amount: 0.1 });
  const isSectionTitleInView = useInView(sectionTitleRef, { once: true, amount: 0.1 });
  const isDescriptionInView = useInView(descriptionRef, { once: true, amount: 0.2 });
  const isMediaInView = useInView(mediaRef, { once: true, amount: 0.2 });
  const isCarouselInView = useInView(carouselRef, { once: true, amount: 0.2 });
  const isChecklistRightInView = useInView(checklistRightRef, { once: true, amount: 0.2 });
  const isWorkflowTitleInView = useInView(workflowTitleRef, { once: true, amount: 0.1 });
  const isWorkflowStepsInView = useInView(workflowStepsRef, { once: true, amount: 0.2 });
  const isSubsectionsInView = useInView(subsectionsRef, { once: true, amount: 0.2 });

  const getServiceKey = (urlId: string | undefined): string | null => {
    switch (urlId) {
      case '3d-modeling': return '3d';
      case '2d-detailing': return '2d';
      case 'parts-inspection': return 'inspection';
      case 'machine-assembly': return 'assembly';
      default: return null;
    }
  };

  const serviceKey = getServiceKey(id);

  const getImages = (key: string) => {
    switch (key) {
      case '3d': return [modalImage1, modalImage2];
      case '2d': return [modalImage2D];
      default: return [];
    }
  };

  const images = serviceKey ? getImages(serviceKey) : [];

  const getGalleryImages = () => {
    if (serviceKey === 'inspection') return inspectionGalleryImages;
    if (serviceKey === 'assembly') return assemblyGalleryImages;
    return [];
  };

  const galleryImages = getGalleryImages();

  useEffect(() => {
    if (!serviceKey) {
      navigate('/services', { replace: true });
    }
  }, [serviceKey, navigate]);

  if (!serviceKey) return null;

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const fadeUpStaggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const fadeUpItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  const getChecklistItems = () => {
    if (serviceKey === 'inspection') {
      return t('services.items.inspection.checklist', { returnObjects: true }) as string[];
    } else if (serviceKey === 'assembly') {
      return t('services.items.assembly.checklist', { returnObjects: true }) as string[];
    }
    return [];
  };

  const checklistItems = getChecklistItems();

  return (
    <div className='all-services-bg-wrapper'>
      <BackgroundShapes />
      <div className="sitemap-3d-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', isolation: 'isolate'}}>
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <FloatingGear position={[8, 4, 0]} scale={0.8} speed={0.15} />
          <FloatingGear position={[-10, -5, -2]} scale={1.2} speed={-0.1} />
          <FloatingGear position={[5, -8, -5]} scale={0.6} speed={0.2} />
        </Canvas>
      </div>
      <motion.div
        className="service-detail-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SEO 
          title={tEn(`services.items.${serviceKey}.title`)} 
          description={tEn(`services.items.${serviceKey}.short_desc`)} 
        />
        <div className="container">
          {/* Back Button - Individual fade-up */}
          <motion.div 
            ref={backButtonRef}
            className="service-detail-back-wrapper"
            variants={fadeUpVariants}
            initial="hidden"
            animate={isBackButtonInView ? "visible" : "hidden"}
          >
            <Button variant="style2" onClick={() => navigate('/services')}>
              {t('services.back_to_services')}
            </Button>
          </motion.div>

          {/* Header Section */}
          <div className="service-detail-header">
            <motion.h1 
              ref={titleRef}
              className="service-detail-title"
              variants={fadeUpVariants}
              initial="hidden"
              animate={isTitleInView ? "visible" : "hidden"}
            >
              {t(`services.items.${serviceKey}.title`)}
            </motion.h1>
            <motion.p 
              ref={subtitleRef}
              className="service-detail-subtitle"
              variants={fadeUpVariants}
              initial="hidden"
              animate={isSubtitleInView ? "visible" : "hidden"}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t(`services.items.${serviceKey}.short_desc`)}
            </motion.p>
          </div>

          <section className="service-detail-content-section">
            <div className="service-detail-grid">
              <div className="service-detail-text">
                <motion.h2 
                  ref={sectionTitleRef}
                  className="service-detail-section-title"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={isSectionTitleInView ? "visible" : "hidden"}
                >
                  {t(`services.items.${serviceKey}.section_title`, { defaultValue: t(`services.items.${serviceKey}.title`) })}
                </motion.h2>
                
                <motion.p 
                  ref={descriptionRef}
                  className="service-detail-description"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={isDescriptionInView ? "visible" : "hidden"}
                >
                  {t(`services.items.${serviceKey}.detailed_desc`)}
                </motion.p>

                {(serviceKey === 'inspection' || serviceKey === 'assembly') && checklistItems.length > 0 && (
                  <motion.div
                    className="service-checklist-mobile"
                    variants={fadeUpStaggerVariants}
                    initial="hidden"
                    animate={isDescriptionInView ? "visible" : "hidden"}
                  >
                    <ul className="checklist-simple">
                      {checklistItems.map((item, index) => (
                        <motion.li key={index} variants={fadeUpItemVariants}>
                          <span className="check-icon">🗹</span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {(serviceKey === '3d' || serviceKey === '2d') && (
                  <div className="service-detail-workflow">
                    <motion.h3 
                      ref={workflowTitleRef}
                      className="service-detail-workflow-title"
                      variants={fadeUpVariants}
                      initial="hidden"
                      animate={isWorkflowTitleInView ? "visible" : "hidden"}
                    >
                      {t('services.workflow.title')}
                    </motion.h3>
                    
                    <motion.div 
                      ref={workflowStepsRef}
                      className="workflow-steps"
                      variants={fadeUpStaggerVariants}
                      initial="hidden"
                      animate={isWorkflowStepsInView ? "visible" : "hidden"}
                    >
                      {['inquiry', 'reference', 'modeling', 'detailing', 'design', 'fabrication', 'delivery'].map((step, index) => (
                        <motion.div key={step} className={`workflow-step ${index < 7 ? 'active' : ''}`} variants={fadeUpItemVariants}>
                          <div className="step-number">{index + 1}</div>
                          <div className="step-content">
                            <span className="step-name">{t(`services.workflow.steps.${step}`)}</span>
                          </div>
                          {index < 6 && <div className="step-connector">↓</div>}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                )}

                {serviceKey === '2d' && (
                  <motion.div
                    ref={subsectionsRef}
                    className="service-detail-subsections"
                    variants={fadeUpStaggerVariants}
                    initial="hidden"
                    animate={isSubsectionsInView ? "visible" : "hidden"}
                  >
                    <motion.div className="service-detail-subsection" variants={fadeUpItemVariants}>
                      <h3 className="service-detail-subsection-title">{t('services.items.2d.section_titles.checking')}</h3>
                      <p className="service-detail-subsection-text">{t('services.items.2d.section_desc.checking')}</p>
                    </motion.div>
                    <motion.div className="service-detail-subsection" variants={fadeUpItemVariants}>
                      <h3 className="service-detail-subsection-title">{t('services.items.2d.section_titles.qualifications')}</h3>
                      <p className="service-detail-subsection-text">{t('services.items.2d.section_desc.qualifications')}</p>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {(serviceKey === 'inspection' || serviceKey === 'assembly') && checklistItems.length > 0 && (
                <motion.div
                  ref={checklistRightRef}
                  className="service-checklist-right desktop-checklist"
                  variants={fadeUpStaggerVariants}
                  initial="hidden"
                  animate={isChecklistRightInView ? "visible" : "hidden"}
                >
                  <ul className="checklist-simple">
                    {checklistItems.map((item, index) => (
                      <motion.li key={index} variants={fadeUpItemVariants}>
                        <span className="check-icon">🗹</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {(serviceKey === '3d' || serviceKey === '2d') && (
                <motion.div
                  ref={mediaRef}
                  className="service-detail-media"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={isMediaInView ? "visible" : "hidden"}
                >
                  <div className="service-detail-gallery">
                    {images.map((img, i) => (
                      <div key={i} className="service-detail-zoom-wrapper">
                        <TransformWrapper initialScale={1} minScale={1} maxScale={4}>
                          <TransformComponent wrapperClass="zoom-wrapper" contentClass="zoom-content">
                            <LazyImage src={img} alt={`${serviceKey} ${i}`} className="service-detail-static-image" loading="eager" />
                          </TransformComponent>
                        </TransformWrapper>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {(serviceKey === 'inspection' || serviceKey === 'assembly') && galleryImages.length > 0 && (
              <motion.div
                ref={carouselRef}
                className="carousel-3d-gallery-wrapper"
                variants={fadeUpVariants}
                initial="hidden"
                animate={isCarouselInView ? "visible" : "hidden"}
              >
                <div className="carousel-3d-container-wrapper">
                  <ImageCarousel 
                    images={galleryImages}
                    duplicateForVisibility={serviceKey === 'inspection'}
                  />
                </div>
              </motion.div>
            )}
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceDetail;
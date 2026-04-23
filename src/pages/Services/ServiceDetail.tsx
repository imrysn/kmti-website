import React, { useEffect} from 'react';
import LazyImage from '../../components/ui/LazyImage/LazyImage';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ServiceDetail.css';
import '../../styles/BackgroundShapes.css';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Checklist items based on service
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
      <div className="sitemap-3d-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
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
        transition={{ duration: 0.3 }}
      >
        <SEO 
          title={tEn(`services.items.${serviceKey}.title`)} 
          description={tEn(`services.items.${serviceKey}.short_desc`)} 
        />
        <div className="container">
          <div className="service-detail-back-wrapper">
            <Button variant="style2" onClick={() => navigate('/services')}>
              {t('services.back_to_services')}
            </Button>
          </div>

          <div className="service-detail-header">
            <h1 className="service-detail-title">{t(`services.items.${serviceKey}.title`)}</h1>
            <p className="service-detail-subtitle">{t(`services.items.${serviceKey}.short_desc`)}</p>
          </div>

          <section className="service-detail-content-section">
            <div className="service-detail-grid">
              <motion.div
                className="service-detail-text"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h2 className="service-detail-section-title">
                  {t(`services.items.${serviceKey}.section_title`, { defaultValue: t(`services.items.${serviceKey}.title`) })}
                </h2>
                <p className="service-detail-description">{t(`services.items.${serviceKey}.detailed_desc`)}</p>

                {(serviceKey === 'inspection' || serviceKey === 'assembly') && checklistItems.length > 0 && (
                  <motion.div
                    className="service-checklist-mobile"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <ul className="checklist-simple">
                      {checklistItems.map((item, index) => (
                        <motion.li key={index} variants={itemVariants}>
                          <span className="check-icon">✓</span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {(serviceKey === '3d' || serviceKey === '2d') && (
                  <motion.div
                    className="service-detail-workflow"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <h3 className="service-detail-workflow-title">{t('services.workflow.title')}</h3>
                    <div className="workflow-steps">
                      {['inquiry', 'reference', 'modeling', 'detailing', 'design', 'fabrication', 'delivery'].map((step, index) => (
                        <motion.div key={step} className={`workflow-step ${index < 7 ? 'active' : ''}`} variants={itemVariants}>
                          <div className="step-number">{index + 1}</div>
                          <div className="step-content">
                            <span className="step-name">{t(`services.workflow.steps.${step}`)}</span>
                          </div>
                          {index < 6 && <div className="step-connector">↓</div>}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {serviceKey === '2d' && (
                  <motion.div
                    className="service-detail-subsections"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <motion.div className="service-detail-subsection" variants={itemVariants}>
                      <h3 className="service-detail-subsection-title">{t('services.items.2d.section_titles.checking')}</h3>
                      <p className="service-detail-subsection-text">{t('services.items.2d.section_desc.checking')}</p>
                    </motion.div>
                    <motion.div className="service-detail-subsection" variants={itemVariants}>
                      <h3 className="service-detail-subsection-title">{t('services.items.2d.section_titles.qualifications')}</h3>
                      <p className="service-detail-subsection-text">{t('services.items.2d.section_desc.qualifications')}</p>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              {(serviceKey === 'inspection' || serviceKey === 'assembly') && checklistItems.length > 0 && (
                <motion.div
                  className="service-checklist-right desktop-checklist"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <ul className="checklist-simple">
                    {checklistItems.map((item, index) => (
                      <motion.li key={index} variants={itemVariants}>
                        <span className="check-icon">✓</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* For 3D and 2D - show images on the right */}
              {(serviceKey === '3d' || serviceKey === '2d') && (
                <motion.div
                  className="service-detail-media"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
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

            {/* 3D Carousel Gallery for Inspection and Assembly */}
            {(serviceKey === 'inspection' || serviceKey === 'assembly') && galleryImages.length > 0 && (
              <motion.div
                className="carousel-3d-gallery-wrapper"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="carousel-3d-container-wrapper">
                  <ImageCarousel images={galleryImages}/>
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
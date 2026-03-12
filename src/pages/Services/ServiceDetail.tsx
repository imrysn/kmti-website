import React, { useEffect, useState } from 'react';
import LazyImage from '../../components/ui/LazyImage/LazyImage';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ServiceDetail.css';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { getAssetUrl } from '../../utils/assets';

// Import images (using R2)
const modalImage1 = getAssetUrl('service_detail_image/3Dmodal1.webp');
const modalImage2 = getAssetUrl('service_detail_image/3Dmodal2.webp');
const modalImage2D = getAssetUrl('service_detail_image/2Dmodal.webp');
const inspectionImage1 = getAssetUrl('service_detail_image/inspection1modal.webp');
const inspectionImage2 = getAssetUrl('service_detail_image/inspection2modal.webp');
const inspectionImage3 = getAssetUrl('service_detail_image/inspection3modal.webp');
const inspectionImage4 = getAssetUrl('service_detail_image/inspection4modal.webp');
const inspectionImage5 = getAssetUrl('service_detail_image/inspection5modal.webp');
const assemblyImage1 = getAssetUrl('service_detail_image/assembly1modal.webp');
const assemblyImage2 = getAssetUrl('service_detail_image/assembly2modal.webp');
const assemblyImage3 = getAssetUrl('service_detail_image/assmebly3mpdal.webp'); // Note: retained original typo in filename from source
const assemblyImage4 = getAssetUrl('service_detail_image/assembly4modal.webp');
const assemblyImage5 = getAssetUrl('service_detail_image/assembly5modal.webp');

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      case 'inspection': return [inspectionImage1, inspectionImage2, inspectionImage3, inspectionImage4, inspectionImage5];
      case 'assembly': return [assemblyImage1, assemblyImage2, assemblyImage3, assemblyImage4, assemblyImage5];
      default: return [];
    }
  };

  const images = serviceKey ? getImages(serviceKey) : [];
  const isCarousel = serviceKey === 'inspection' || serviceKey === 'assembly';

  useEffect(() => {
    if (!serviceKey) {
      navigate('/services', { replace: true });
    }
  }, [serviceKey, navigate]);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isCarousel && images.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isCarousel, images.length, isPaused]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!serviceKey) return null;

  return (
    <motion.div
      className="service-detail-page"


      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
          <motion.div className="service-detail-grid">
            <div className="service-detail-text">
              <h2 className="service-detail-section-title">
                {t(`services.items.${serviceKey}.section_title`, { defaultValue: t(`services.items.${serviceKey}.title`) })}
              </h2>
              <p className="service-detail-description">{t(`services.items.${serviceKey}.detailed_desc`)}</p>

              {(serviceKey === '3d' || serviceKey === '2d') && (
                <div className="service-detail-workflow">
                  <h3 className="service-detail-workflow-title">{t('services.workflow.title')}</h3>
                  <div className="workflow-steps">
                    {['inquiry', 'reference', 'modeling', 'detailing', 'design', 'fabrication', 'delivery'].map((step, index) => (
                      <div key={step} className={`workflow-step ${index < 7 ? 'active' : ''}`}>
                        <div className="step-number">{index + 1}</div>
                        <div className="step-content">
                          <span className="step-name">{t(`services.workflow.steps.${step}`)}</span>
                        </div>
                        {index < 6 && <div className="step-connector">↓</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {serviceKey === '2d' && (
                <div className="service-detail-subsections">
                  <div className="service-detail-subsection">
                    <h3 className="service-detail-subsection-title">{t('services.items.2d.section_titles.checking')}</h3>
                    <p className="service-detail-subsection-text">{t('services.items.2d.section_desc.checking')}</p>
                  </div>
                  <div className="service-detail-subsection">
                    <h3 className="service-detail-subsection-title">{t('services.items.2d.section_titles.qualifications')}</h3>
                    <p className="service-detail-subsection-text">{t('services.items.2d.section_desc.qualifications')}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="service-detail-media">
              {isCarousel ? (
                <div
                  className="service-detail-carousel"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {images.map((img, i) => (
                    <LazyImage
                      key={i}
                      src={img}
                      alt={`${serviceKey} ${i}`}
                      wrapperClassName={`service-detail-image ${i === currentImageIndex ? 'active' : ''}`}
                    />
                  ))}

                  {images.length > 1 && (
                    <>
                      <button className="carousel-arrow prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                        &#10094;
                      </button>
                      <button className="carousel-arrow next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                        &#10095;
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="service-detail-gallery">
                  <div className="zoom-instruction-overlay">
                    <svg className="zoom-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M11 8V14M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="zoom-instruction-text">{t('services.zoom_instruction', { defaultValue: 'Scroll to zoom • Drag to pan' })}</span>
                  </div>
                  {images.map((img, i) => (
                    <div key={i} className="service-detail-zoom-wrapper">
                      <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={4}
                      >
                        <TransformComponent wrapperClass="zoom-wrapper" contentClass="zoom-content">
                          <LazyImage
                            src={img}
                            alt={`${serviceKey} ${i}`}
                            className="service-detail-static-image"
                            loading="eager"
                          />
                        </TransformComponent>
                      </TransformWrapper>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};

export default ServiceDetail;

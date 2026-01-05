import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Services.css';
import { ServicesPageProps } from './Services.types';
import { ServicePageCard } from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button';
import ServiceModal from '../../components/ui/Modal';
import servicesBg from '../../assets/servicesbg.png';
import icon3D from '../../assets/icons/cube.png';
import icon2D from '../../assets/icons/cubes.png';
import inspectionIcon from '../../assets/icons/parts-inspection-icon.png';
import assemblyIcon from '../../assets/icons/machine-assembly-icon.png';
import image3D from '../../assets/servicePage/3DImage.png';
import image2D from '../../assets/servicePage/2DImage.png';
import inspectionImage from '../../assets/servicePage/inspectionImage.png';
import assemblyImage from '../../assets/servicePage/assemblyImage.png';

// Service section images
import modalImage1 from '../../assets/modalImage/3Dmodal1.png';
import modalImage2 from '../../assets/modalImage/3Dmodal2.png';
import modalImage2D from '../../assets/modalImage/2Dmodal.png';
import inspectionImage1 from '../../assets/modalImage/inspection1modal.png';
import inspectionImage2 from '../../assets/modalImage/inspection2modal.png';
import inspectionImage3 from '../../assets/modalImage/inspection3modal.png';
import inspectionImage4 from '../../assets/modalImage/inspection4modal.png';
import inspectionImage5 from '../../assets/modalImage/inspection5modal.png';
import assemblyImage1 from '../../assets/modalImage/assembly1modal.png';
import assemblyImage2 from '../../assets/modalImage/assembly2modal.png';
import assemblyImage3 from '../../assets/modalImage/assmebly3mpdal.png';
import assemblyImage4 from '../../assets/modalImage/assembly4modal.png';
import assemblyImage5 from '../../assets/modalImage/assembly5modal.png';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
}

interface ServiceSectionProps {
  service: Service;
  onServiceChange: (serviceTitle: string) => void;
}

const ServiceSection = React.forwardRef<HTMLDivElement, ServiceSectionProps>(({ service, onServiceChange }, ref) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const inspectionImages = [inspectionImage1, inspectionImage2, inspectionImage3, inspectionImage4, inspectionImage5];
  const assemblyImages = [assemblyImage1, assemblyImage2, assemblyImage3, assemblyImage4, assemblyImage5];

  const getCurrentCarouselImages = () => {
    if (service.title === 'Parts Inspection') return inspectionImages;
    if (service.title === 'Machine Assembly') return assemblyImages;
    return [];
  };

  const currentCarouselImages = getCurrentCarouselImages();

  useEffect(() => {
    if (service.title !== 'Parts Inspection' && service.title !== 'Machine Assembly') return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentCarouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [service.title, currentCarouselImages.length]);

  const productionFlowSteps = [
    t('services.workflow.steps.inquiry'),
    t('services.workflow.steps.reference'),
    t('services.workflow.steps.modeling'),
    t('services.workflow.steps.detailing'),
    t('services.workflow.steps.design'),
    t('services.workflow.steps.fabrication'),
    t('services.workflow.steps.delivery'),
  ];

  const getCurrentStepIndex = () => {
    switch (service.title) {
      case '3D Modeling': return 2;
      case '2D Detailing': return 3;
      case 'Parts Inspection': return 5;
      case 'Machine Assembly': return 5;
      default: return 2;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  const handleFlowStepClick = (stepIndex: number) => {
    if (!onServiceChange) return;
    if (service.title === '3D Modeling' && stepIndex === 3) onServiceChange('2D Detailing');
    else if (service.title === '2D Detailing' && stepIndex === 2) onServiceChange('3D Modeling');
  };

  const isStepClickable = (stepIndex: number) => {
    if (service.title === '3D Modeling' && stepIndex === 3) return true;
    if (service.title === '2D Detailing' && stepIndex === 2) return true;
    return false;
  };

  const getDetailedDescription = () => {
    if (service.title === '3D Modeling') return t('services.items.3d.detailed_desc');
    if (service.title === '2D Detailing') return t('services.items.2d.detailed_desc');
    if (service.title === 'Parts Inspection') return t('services.items.inspection.detailed_desc');
    if (service.title === 'Machine Assembly') return t('services.items.assembly.detailed_desc');
    return service.description;
  };

  const get2DDetailingSections = () => {
    return [
      { number: 2, title: t('services.items.2d.section_titles.detail'), description: '', hasImages: true },
      { number: 3, title: t('services.items.2d.section_titles.checking'), description: t('services.items.2d.section_desc.checking') },
      { number: 4, title: t('services.items.2d.section_titles.qualifications'), description: t('services.items.2d.section_desc.qualifications') },
    ];
  };

  return (
    <section ref={ref} className={`service-section ${service.title.toLowerCase().replace(' ', '-')}-section`} id={`service-${service.title.toLowerCase().replace(' ', '-')}`} data-aos="fade-up">
      <div className="service-section-container container">
        <div className="service-section-body">
          <div className="service-section-left">
            <h2 className="service-section-title">{t(`services.items.${service.id === 1 ? '3d' : service.id === 2 ? '2d' : service.id === 3 ? 'inspection' : 'assembly'}.title`)}</h2>
            <p className="service-section-description">{getDetailedDescription()}</p>

            {service.title === '2D Detailing' ? (
              <div className="service-section-sections">
                {get2DDetailingSections().map((section) => (
                  <div key={section.number} className="service-section-section">
                    <div className="service-section-step-indicator">
                      <div className="service-section-step-number">{section.number}</div>
                      <span className="service-section-step-text">{section.title}</span>
                    </div>
                    {section.hasImages && (
                      <div className="service-section-images">
                        <div className="service-section-image-container" onWheel={(e) => e.preventDefault()}>
                          <img
                            src={modalImage2D}
                            alt="2D Detail"
                            className="service-section-image service-section-image-2d"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            onWheel={(e) => {
                              e.preventDefault();
                              setImageScale(prev => Math.max(0.5, Math.min(3, prev + (e.deltaY > 0 ? -0.1 : 0.1))));
                            }}
                            onMouseDown={(e) => {
                              if (e.button === 0 && imageScale > 1) {
                                e.preventDefault();
                                setIsPanning(true);
                                setLastMouseX(e.clientX);
                                setLastMouseY(e.clientY);
                              }
                            }}
                            onMouseMove={(e) => {
                              if (isPanning) {
                                e.preventDefault();
                                const deltaX = e.clientX - lastMouseX;
                                const deltaY = e.clientY - lastMouseY;
                                setPanX(prev => prev + deltaX);
                                setPanY(prev => prev + deltaY);
                                setLastMouseX(e.clientX);
                                setLastMouseY(e.clientY);
                              }
                            }}
                            onMouseUp={() => setIsPanning(false)}
                            style={{
                              transform: `translate(${panX}px, ${panY}px) scale(${imageScale})`,
                              cursor: imageScale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in',
                              transition: isPanning ? 'none' : 'transform 0.1s ease',
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {section.description && <p className="service-section-section-description">{section.description}</p>}
                  </div>
                ))}
              </div>
            ) : service.title !== 'Parts Inspection' && service.title !== 'Machine Assembly' ? (
              <>
                <div className="service-section-step-indicator">
                  <div className="service-section-step-number">1</div>
                  <span className="service-section-step-text">{service.title.toUpperCase()}</span>
                </div>
                <div className="service-section-images">
                  <div className="service-section-image-container"><img src={modalImage1} alt="View 1" className="service-section-image" /></div>
                  <div className="service-section-image-container"><img src={modalImage2} alt="View 2" className="service-section-image" /></div>
                </div>
              </>
            ) : null}
          </div>

          <div className="service-section-right">
            {service.title === 'Parts Inspection' || service.title === 'Machine Assembly' ? (
              <div className="service-section-carousel">
                <div className="service-section-carousel-container">
                  {currentCarouselImages.map((img, idx) => (
                    <div key={idx} className={`service-section-carousel-slide ${idx === currentImageIndex ? 'active' : ''}`}>
                      <img src={img} alt={`${service.title} ${idx + 1}`} className="service-section-image" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h3 className="service-section-flow-title">{t('services.workflow.title')}</h3>
                <div className="service-section-flow">
                  {productionFlowSteps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <button
                        className={`service-section-flow-step ${idx === currentStepIndex ? 'active' : ''} ${isStepClickable(idx) ? 'clickable' : 'not-clickable'}`}
                        onClick={() => handleFlowStepClick(idx)}
                        disabled={!isStepClickable(idx)}
                      >
                        {step}
                      </button>
                      {idx < productionFlowSteps.length - 1 && <div className="service-section-flow-arrow">↓</div>}
                    </React.Fragment>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

const Services: React.FC<ServicesPageProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const servicesGridRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasCheckedUrlParams = useRef(false);
  const serviceRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('services-page-active');
    document.body.classList.add('services-page-active');
    return () => {
      document.documentElement.classList.remove('services-page-active');
      document.body.classList.remove('services-page-active');
    };
  }, []);

  const services: Service[] = [
    { id: 1, title: '3D Modeling', description: t('services.items.3d.short_desc'), icon: icon3D, image: image3D },
    { id: 2, title: '2D Detailing', description: t('services.items.2d.short_desc'), icon: icon2D, image: image2D },
    { id: 3, title: 'Parts Inspection', description: t('services.items.inspection.short_desc'), icon: inspectionIcon, image: inspectionImage },
    { id: 4, title: 'Machine Assembly', description: t('services.items.assembly.short_desc'), icon: assemblyIcon, image: assemblyImage },
  ];

  const serviceTabs = [
    t('services.items.3d.title'),
    t('services.items.2d.title'),
    t('services.items.inspection.title'),
    t('services.items.assembly.title')
  ];

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && !hasCheckedUrlParams.current) {
      const serviceMap: { [key: string]: string } = {
        '3d-modeling': '3D Modeling',
        '2d-detailing': '2D Detailing',
        'parts-inspection': 'Parts Inspection',
        'machine-assembly': 'Machine Assembly',
      };
      const serviceTitle = serviceMap[serviceParam];
      if (serviceTitle) {
        const targetService = services.find(s => s.title === serviceTitle);
        if (targetService) {
          setSelectedService(targetService);
          setIsModalOpen(true);
          hasCheckedUrlParams.current = true;
          setSearchParams({}, { replace: true });
        }
      }
    }
  }, [searchParams, setSearchParams, services]);

  const handleServiceClick = (serviceTitle: string) => {
    const sectionKey = serviceTitle.toLowerCase().replace(' ', '-');
    serviceRefs.current[sectionKey]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabClick = (tab: string, index: number) => {
    const internalTitles = ['3D Modeling', '2D Detailing', 'Parts Inspection', 'Machine Assembly'];
    const targetTitle = internalTitles[index % internalTitles.length];
    setActiveTab(tab);
    handleServiceClick(targetTitle);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    hasCheckedUrlParams.current = false;
    setSearchParams({}, { replace: true });
  };

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0.1 };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const tabMap: { [key: string]: number } = {
            'service-3d-modeling': 0,
            'service-2d-detailing': 1,
            'service-parts-inspection': 2,
            'service-machine-assembly': 3,
          };
          const index = tabMap[sectionId];
          if (index !== undefined) setActiveTab(serviceTabs[index]);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(serviceRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
    return () => { Object.values(serviceRefs.current).forEach((ref) => { if (ref) observer.unobserve(ref); }); };
  }, [serviceTabs]);

  return (
    <div className="services-page" style={{ '--services-bg-image': `url(${servicesBg})` } as React.CSSProperties}>
      <section className="services-hero">
        <div className="services-hero-container container">
          <div className="services-hero-content">
            <h1 className="services-title">{t('services.hero.title')}</h1>
            <p className="services-subtitle">{t('services.hero.subtitle')}</p>
            <div className="services-hero-button">
              <Button variant="style2" onClick={() => servicesGridRef.current?.scrollIntoView({ behavior: 'smooth' })}>{t('services.hero.cta')}</Button>
            </div>
          </div>
        </div>
        <div className="services-hero-overlay"></div>
      </section>

      <section className="services-nav-section">
        <div className="services-nav-container">
          <div className="services-nav-tabs">
            <div className="services-nav-tabs-scroll">
              <div className="services-nav-tabs-content">
                {serviceTabs.concat(serviceTabs).map((tab, index) => (
                  <button key={index} className={`services-nav-tab-text ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabClick(tab, index)}>
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
          <div className="services-grid">
            {services.map((s) => (
              <ServicePageCard key={s.id} image={s.image} icon={s.icon} title={t(`services.items.${s.id === 1 ? '3d' : s.id === 2 ? '2d' : s.id === 3 ? 'inspection' : 'assembly'}.title`)} subtitle={s.description} onClick={() => handleServiceClick(s.title)} />
            ))}
          </div>
        </div>
      </section>

      {services.map((s) => (
        <ServiceSection
          key={s.id}
          service={s}
          onServiceChange={handleServiceClick}
          ref={(el) => { if (el) serviceRefs.current[s.title.toLowerCase().replace(' ', '-')] = el; }}
        />
      ))}

      <section className="services-cta-section">
        <div className="services-cta-container container">
          <h2 className="services-cta-title">{t('services.footer_cta.title')}</h2>
          <Button variant="style2" onClick={() => navigate('/contact')}>{t('common.contact_us')}</Button>
        </div>
      </section>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
        onServiceChange={handleServiceClick}
      />
    </div>
  );
};

export default Services;
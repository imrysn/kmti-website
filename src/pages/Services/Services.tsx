import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const inspectionImages = [
    inspectionImage1,
    inspectionImage2,
    inspectionImage3,
    inspectionImage4,
    inspectionImage5,
  ];
  const assemblyImages = [
    assemblyImage1,
    assemblyImage2,
    assemblyImage3,
    assemblyImage4,
    assemblyImage5,
  ];

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

  useEffect(() => {
    if (service.title === 'Parts Inspection' || service.title === 'Machine Assembly') {
      setCurrentImageIndex(0);
    }
  }, [service.title]);

  useEffect(() => {
    if (service.title === '2D Detailing') {
      setImageScale(1);
      setPanX(0);
      setPanY(0);
    }
  }, [service.title]);

  useEffect(() => {
    if (service.title !== '2D Detailing' || !isHovering) return;

    const handler = (e: Event) => e.preventDefault();
    window.addEventListener('wheel', handler, { passive: false });

    return () => window.removeEventListener('wheel', handler);
  }, [service.title, isHovering]);

  const productionFlowSteps = [
    'INQUIRY WITH ORDER SHEET',
    'REFERENCE DATA',
    '3D MODELING WITH MODIFICATION',
    '2D MODELING',
    'MANUFACTURING DESIGN',
    'FABRICATION / ASSEMBLY',
    'DELIVERY OR PRODUCTS',
  ];

  const getCurrentStepIndex = () => {
    switch (service.title) {
      case '3D Modeling':
        return 2;
      case '2D Detailing':
        return 3;
      case 'Parts inspection':
        return 5;
      case 'Machine Assembly':
        return 5;
      default:
        return 2;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  const handleFlowStepClick = (stepIndex: number) => {
    if (!onServiceChange) return;

    if (service.title === '3D Modeling') {
      if (stepIndex === 3) {
        onServiceChange('2D Detailing');
      }
    } else if (service.title === '2D Detailing') {
      if (stepIndex === 2) {
        onServiceChange('3D Modeling');
      }
    }
  };

  const isStepClickable = (stepIndex: number) => {
    if (!onServiceChange) return false;
    if (service.title === '3D Modeling' && stepIndex === 3) return true;
    if (service.title === '2D Detailing' && stepIndex === 2) return true;
    return false;
  };

  const getDetailedDescription = () => {
    if (service.title === '3D Modeling') {
      return "By converting clients 3D model, we can easily check any possible errors or interference that may occur. During this process, we often consult to our clients for any corrections in the design. After the 3D model is done, we'll then send it to our client for them to confirm. Once confirmed, we will proceed with the 2D Detailing. If there's still suggestions we'll modify the design until it is final for 2D detailing.";
    }
    if (service.title === '2D Detailing') {
      return "Detailing is a critical part of the design process since almost all the information on how the project is going to be built, the materials to use, dimensions, and a lot of important instructions are in this part. We give a keen eye on every detail of the design, together with an efficient workflow to make our design quality wise and time wise. Consultation is the key in every stage of the project to make sure our clients are involve in the process and everything is according to their plan to avoid any further iterations due to miscommunication.";
    }
    if (service.title === 'Parts Inspection') {
      return "We support inspection of parts fabricated from our design to ensure quality of parts before they send it for assembly. Fabricated parts undergoes series of test and inspection, using high-tech devices to ensure all aspect of the part is accurate and high quality. We also send members from our team to inspection site to do quality checking making sure there is no discrepancies from the design and the actual parts.";
    }
    if (service.title === 'Machine Assembly') {
      return "In collaboration with our business partners Kusakabe Electric & Machinery Co., Ltd and Maeno Giken Inc., two of the most known pioneers and leaders in the industry. We give our clients the confidence to have high quality and top notch performance products ready for a productive business.";
    }
    return service.description;
  };

  const get2DDetailingSections = () => {
    return [
      {
        number: 2,
        title: '2D DETAIL',
        description: '',
        hasImages: true,
      },
      {
        number: 3,
        title: 'QUALITY CHECKING',
        description: 'After detailing, the design will run through series of checking and correction making sure that the design is precise and the chance of error is close to zero. When the design is already checked and final, we will send it to the client for confirmation.',
      },
      {
        number: 4,
        title: 'DESIGN QUALIFICATIONS',
        description: 'If there\'s still suggestions or if ever the client change their mind in some aspect of the design, further modifications will be applied to the design to meet their desired outcome.',
      },
    ];
  };

  return (
    <section ref={ref} className={`service-section ${service.title.toLowerCase().replace(' ', '-')}-section`} id={`service-${service.title.toLowerCase().replace(' ', '-')}`} data-aos="fade-up">
      <div className="service-section-container container">
        <div className="service-section-body">
          <div className="service-section-left">
            <h2 className="service-section-title">
              {service.title}
            </h2>
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
                    {section.description && (
                      <p className="service-section-section-description">{section.description}</p>
                    )}
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
                  <div className="service-section-image-container">
                    <img src={modalImage1} alt={`${service.title} - View 1`} className="service-section-image service-section-image-3d" />
                  </div>
                  <div className="service-section-image-container">
                    <img src={modalImage2} alt={`${service.title} - View 2`} className="service-section-image service-section-image-3d" />
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="service-section-right">
            {service.title === 'Parts Inspection' || service.title === 'Machine Assembly' ? (
              <div className="service-section-carousel">
                <div className="service-section-carousel-container">
                  {currentCarouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`service-section-carousel-slide ${index === currentImageIndex ? 'active' : ''
                        }`}
                    >
                      <div className="service-section-image-container">
                        <img
                          src={image}
                          alt={`${service.title} ${index + 1}`}
                          className="service-section-image"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="service-section-carousel-indicators">
                    {currentCarouselImages.map((_, index) => (
                      <button
                        key={index}
                        className={`service-section-carousel-dot ${index === currentImageIndex ? 'active' : ''
                          }`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="service-section-flow-title">ACTUAL PRODUCTION FLOW</h3>
                <div className="service-section-flow">
                  {productionFlowSteps.map((step, index) => {
                    const isClickable = isStepClickable(index);
                    return (
                      <React.Fragment key={index}>
                        <button
                          className={`service-section-flow-step ${index === currentStepIndex ? 'active' : ''} ${isClickable ? 'clickable' : 'not-clickable'}`}
                          onClick={() => handleFlowStepClick(index)}
                          disabled={!isClickable}
                        >
                          {step}
                        </button>
                        {index < productionFlowSteps.length - 1 && (
                          <div className="service-section-flow-arrow">↓</div>
                        )}
                      </React.Fragment>
                    );
                  })}
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const servicesGridRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasCheckedUrlParams = useRef(false);

  // Refs for each service section
  const serviceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    document.documentElement.classList.add('services-page-active');
    document.body.classList.add('services-page-active');

    return () => {
      document.documentElement.classList.remove('services-page-active');
      document.body.classList.remove('services-page-active');
    };
  }, []);

  const services: Service[] = [
    {
      id: 1,
      title: '3D Modeling',
      description: 'We create detailed 3D models for high-precision engineering and visualization, ensuring accurate fabrication and assembly.',
      icon: icon3D,
      image: image3D,
    },
    {
      id: 2,
      title: '2D Detailing',
      description: 'Our 2D detailing services convert 3D models into precise drawings ready for manufacturing and quality checks.',
      icon: icon2D,
      image: image2D,
    },
    {
      id: 3,
      title: 'Parts Inspection',
      description: 'We perform Parts Inspection using precise measuring tools and 3D scanners to guarantee dimensional accuracy.',
      icon: inspectionIcon,
      image: inspectionImage,
    },
    {
      id: 4,
      title: 'Machine Assembly',
      description: 'From component integration to full machine assembly, we ensure mechanical, electrical, and pneumatic systems meet industrial standards.',
      icon: assemblyIcon,
      image: assemblyImage,
    },
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

  const scrollToServicesGrid = () => {
    servicesGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToContact = () => {
    navigate('/contact');
  };

  const handleServiceClick = (service: Service) => {
    const sectionKey = service.title.toLowerCase().replace(' ', '-');
    const sectionRef = serviceRefs.current[sectionKey];
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    hasCheckedUrlParams.current = false;
    setSearchParams({}, { replace: true });
  };

  const handleServiceChange = (serviceTitle: string) => {
    const sectionKey = serviceTitle.toLowerCase().replace(' ', '-');
    const sectionRef = serviceRefs.current[sectionKey];
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const serviceTabs = ['3D MODELING', '2D DETAILING', 'Parts Inspection', 'MACHINE ASSEMBLY'];
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const tabMap: { [key: string]: string } = {
      '3D MODELING': '3d-modeling',
      '2D DETAILING': '2d-detailing',
      'Parts Inspection': 'parts-inspection',
      'MACHINE ASSEMBLY': 'machine-assembly',
    };
    const sectionKey = tabMap[tab];
    if (sectionKey) {
      const sectionRef = serviceRefs.current[sectionKey];
      if (sectionRef) {
        sectionRef.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const tabMap: { [key: string]: string } = {
            'service-3d-modeling': '3D MODELING',
            'service-2d-detailing': '2D DETAILING',
            'service-parts-inspection': 'Parts Inspection',
            'service-machine-assembly': 'MACHINE ASSEMBLY',
          };
          const tab = tabMap[sectionId];
          if (tab) {
            setActiveTab(tab);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(serviceRefs.current).forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      Object.values(serviceRefs.current).forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [services]);

  return (
    <div className="services-page" style={{ '--services-bg-image': `url(${servicesBg})` } as React.CSSProperties}>
      <section className="services-hero">
        <div className="services-hero-container container">
          <div className="services-hero-content">
            <h1 className="services-title">Our Services</h1>
            <p className="services-subtitle">
              Comprehensive Engineering & Design Solutions from Concept to Assembly
            </p>
            <div className="services-hero-button">
              <Button variant="style2" onClick={scrollToServicesGrid}>EXPLORE OUR EXPERTISE</Button>
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
                {serviceTabs.map((tab, index) => (
                  <button
                    key={`${tab}-${index}`}
                    className={`services-nav-tab-text ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab)}
                    aria-label={`Navigate to ${tab}`}
                  >
                    {tab}
                  </button>
                ))}
                {serviceTabs.map((tab, index) => (
                  <button
                    key={`${tab}-duplicate-${index}`}
                    className={`services-nav-tab-text ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab)}
                    aria-label={`Navigate to ${tab}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-grid-section" ref={servicesGridRef} data-aos="fade-up">
        <div className="services-grid-container container">
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card-wrapper">
                <ServicePageCard
                  image={service.image}
                  icon={service.icon}
                  title={service.title}
                  subtitle={service.description}
                  className="service-page-card-item"
                  onClick={() => handleServiceClick(service)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {services.map((service) => (
        <ServiceSection
          key={service.id}
          service={service}
          onServiceChange={handleServiceChange}
          ref={(ref) => {
            if (ref) {
              serviceRefs.current[service.title.toLowerCase().replace(' ', '-')] = ref;
            }
          }}
        />
      ))}

      <section className="services-cta-section" data-aos="fade-up">
        <div className="services-cta-container container">
          <h2 className="services-cta-title">Have a project in mind? Let's discuss how we can bring it to life</h2>
          <div className="services-cta-button">
            <Button variant="style2" onClick={navigateToContact}>CONTACT US</Button>
          </div>
        </div>
      </section>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
        onServiceChange={(title) => {
          const targetService = services.find(s => s.title === title);
          if (targetService) {
            handleServiceChange(title);
          }
        }}
      />
    </div>
  );
};

export default Services;

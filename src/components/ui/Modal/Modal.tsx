import React, { useState, useEffect } from 'react';
import './Modal.css';
import modalImage1 from '../../../assets/modalImage/3Dmodal1.png';
import modalImage2 from '../../../assets/modalImage/3Dmodal2.png';
import modalImage2D from '../../../assets/modalImage/2Dmodal.png';
import inspectionImage1 from '../../../assets/modalImage/inspection1modal.png';
import inspectionImage2 from '../../../assets/modalImage/inspection2modal.png';
import inspectionImage3 from '../../../assets/modalImage/inspection3modal.png';
import inspectionImage4 from '../../../assets/modalImage/inspection4modal.png';
import inspectionImage5 from '../../../assets/modalImage/inspection5modal.png';
import assemblyImage1 from '../../../assets/modalImage/assembly1modal.png';
import assemblyImage2 from '../../../assets/modalImage/assembly2modal.png';
import assemblyImage3 from '../../../assets/modalImage/assmebly3mpdal.png';
import assemblyImage4 from '../../../assets/modalImage/assembly4modal.png';
import assemblyImage5 from '../../../assets/modalImage/assembly5modal.png';
import ourStoryPhoto from '../../../assets/aboutPage/ourstoryImage.png';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: number;
    title: string;
    description: string;
    icon?: string;
    image?: string;
  } | null;
  onServiceChange?: (serviceTitle: string) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service, onServiceChange }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
    if (service?.title === 'Parts inspection') return inspectionImages;
    if (service?.title === 'Machine Assembly') return assemblyImages;
    return [];
  };

  const currentCarouselImages = getCurrentCarouselImages();

  useEffect(() => {
    if (!isOpen || !service || (service.title !== 'Parts inspection' && service.title !== 'Machine Assembly')) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentCarouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, service, currentCarouselImages.length]);

  useEffect(() => {
    if (service?.title === 'Parts inspection' || service?.title === 'Machine Assembly') {
      setCurrentImageIndex(0);
    }
  }, [service, isOpen]);

  if (!isOpen || !service) return null;

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
      return "Detailing is a crucial part of the design process. It involves creating comprehensive technical drawings that specify materials, dimensions, tolerances, and manufacturing requirements. Throughout this phase, we work closely with clients to ensure all design elements are clearly documented and meet their specifications. Our detailed drawings serve as the foundation for accurate fabrication and assembly.";
    }
    if (service.title === 'Parts inspection') {
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
        description: 'We perform thorough quality checks on all 2D drawings to ensure accuracy and precision. Our team reviews dimensions, tolerances, and material specifications, checking for any inconsistencies or potential issues. If corrections are needed, we modify the designs to ensure they meet the highest standards before proceeding to manufacturing.',
      },
      {
        number: 4,
        title: 'DESIGN QUALIFICATIONS',
        description: 'Based on client feedback and quality checks, we apply necessary modifications to the designs. We ensure all design qualifications and requirements are met, making adjustments as needed. Once the designs are finalized and approved, they are ready for manufacturing, ensuring that the final product will meet all specifications and quality standards.',
      },
    ];
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className={`service-modal-body ${service.title === 'Parts inspection' || service.title === 'Machine Assembly' ? 'service-modal-body-single' : ''}`}>
          <div className="service-modal-left">
            <h2 className="service-modal-title">
              {service.title}
            </h2>
            <p className="service-modal-description">{getDetailedDescription()}</p>

            {service.title === '2D Detailing' ? (
              <div className="service-modal-sections">
                {get2DDetailingSections().map((section) => (
                  <div key={section.number} className="service-modal-section">
                    <div className="service-modal-step-indicator">
                      <div className="service-modal-step-number">{section.number}</div>
                      <span className="service-modal-step-text">{section.title}</span>
                    </div>
                    {section.hasImages && (
                      <div className="service-modal-images">
                        <div className="service-modal-image-container">
                          <img src={modalImage2D} alt="2D Detail" className="service-modal-image" />
                        </div>
                      </div>
                    )}
                    {section.description && (
                      <p className="service-modal-section-description">{section.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : service.title === 'Parts inspection' || service.title === 'Machine Assembly' ? (
              <div className="service-modal-carousel">
                <div className="service-modal-carousel-container">
                  {currentCarouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`service-modal-carousel-slide ${index === currentImageIndex ? 'active' : ''
                        }`}
                    >
                      <div className="service-modal-image-container">
                        <img
                          src={image}
                          alt={`${service.title} ${index + 1}`}
                          className="service-modal-image"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="service-modal-carousel-indicators">
                    {currentCarouselImages.map((_, index) => (
                      <button
                        key={index}
                        className={`service-modal-carousel-dot ${index === currentImageIndex ? 'active' : ''
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
                <div className="service-modal-step-indicator">
                  <div className="service-modal-step-number">1</div>
                  <span className="service-modal-step-text">{service.title.toUpperCase()}</span>
                </div>

                <div className="service-modal-images">
                  <div className="service-modal-image-container">
                    <img src={modalImage1} alt={`${service.title} - View 1`} className="service-modal-image" />
                  </div>
                  <div className="service-modal-image-container">
                    <img src={modalImage2} alt={`${service.title} - View 2`} className="service-modal-image" />
                  </div>
                </div>
              </>
            )}
          </div>

          {service.title !== 'Parts inspection' && service.title !== 'Machine Assembly' && (
            <div className="service-modal-right">
              <h3 className="service-modal-flow-title">ACTUAL PRODUCTION FLOW</h3>
              <div className="service-modal-flow">
                {productionFlowSteps.map((step, index) => {
                  const isClickable = isStepClickable(index);
                  return (
                    <React.Fragment key={index}>
                      <button
                        className={`service-modal-flow-step ${index === currentStepIndex ? 'active' : ''} ${isClickable ? 'clickable' : 'not-clickable'}`}
                        onClick={() => handleFlowStepClick(index)}
                        disabled={!isClickable}
                      >
                        {step}
                      </button>
                      {index < productionFlowSteps.length - 1 && (
                        <div className="service-modal-flow-arrow">↓</div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;

interface OurStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OurStoryModal: React.FC<OurStoryModalProps> = ({ isOpen, onClose }) => {
  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content our-story-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="our-story-modal-body">
          <h2 className="our-story-modal-title">Our Story</h2>

          <div className="our-story-photo-section">
            <img
              src={ourStoryPhoto}
              alt="Company leadership"
              className="our-story-photo"
            />
            <p className="our-story-caption">
              (From left in the photo, President Maeno, Director General of the Philippines Special Economic Zone Agency Delima, Director Masahiko Hasegawa)
            </p>
          </div>

          <div className="our-story-content">
            <div className="our-story-section">
              <p className="our-story-text">
                Kusakabe Electric Co., Ltd. was founded in Kobe in 1916 and has entered the pipe industry since 1959, and has been stepping up its business development with the history of the pipe industry since then. Currently we have a wide range of products related to pipe mills and related equipment, and as one of the few manufacturers in the world that can consistently design and manufacture pipe mills, we have earned higher trust and appraisal than pipe manufacturers around the world. We manufacture and assemble in our own factory, constantly making high-quality pipe mills under thorough quality control, and actively conducting R & D, the overwhelming market share in Japan It also leads to delivery results in 26 countries abroad.
              </p>
            </div>

            <div className="our-story-section">
              <p className="our-story-text">
                Maeno Giken was founded in the Philippines in 2001 and has technologies and facilities that consistently contracts up to hot dip galvanizing (JIS accredited factory) accompanying it, can making, welding and machining, surface treatment such as painting, utilizing the abundant experience of the founder's long-time gear reducer, steelmaking machine, transportation machine, construction machine and their installation work, mold manufacturing etc., while cultivating young excellent talent in this country, I am running. Not only cost reduction of manufacturing but also design aid and prototype support are done at the same time, we realize a total solution satisfying customers.
              </p>
            </div>

            <div className="our-story-section">
              <p className="our-story-text">
                Next Engineering Co., LTD. was established in 2007 as a partner of Mitsubishi Heavy Industries. It handles energy-related projects such as thermal power plants and fuel cell systems, along with metal processing and manufacturing at its own facilities. In recent years, it has expanded into IT and semiconductor fields. In April 2025, the company will merge with Nishinippon Sekkei Co., Ltd., enhancing its capabilities in ship, plant, and machinery design, and enabling integrated services from design to manufacturing.

              </p>
            </div>

            <div className="our-story-section">
              <p className="our-story-text">
                KMTI combines the experiences of machining that matches the Japanese market that Kusakabe Electric possesses, with Maeno Giken's production experience of various high-quality equipments in Filin, as well as the skills of both parties, ensuring peace of mind through outstanding drawing management capabilities We aim to become an engineering group that can provide. In the future, we will also take into consideration the OEM manufacturing of machinery, and we will make it possible to consistently handle from software to hardware with secure confidentiality agreement and execution. By converting two-dimensional drawings to three-dimensional drawings and making them three-dimensional, it is possible to discover defects at the time of production in advance, to reduce the manufacturing cost at the same time as approaching mistakes to zero, and to strongly support customers' manufacturing Although it is our primary strength, we will continue to expand the business domain with continued trusting relationships while responding to the needs of each customer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

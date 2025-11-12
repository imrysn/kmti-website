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
  // Carousel state for Parts inspection and Machine Assembly
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

  // Get current carousel images based on service
  const getCurrentCarouselImages = () => {
    if (service?.title === 'Parts inspection') return inspectionImages;
    if (service?.title === 'Machine Assembly') return assemblyImages;
    return [];
  };

  const currentCarouselImages = getCurrentCarouselImages();

  // Auto-advance carousel for Parts inspection and Machine Assembly
  useEffect(() => {
    if (!isOpen || !service || (service.title !== 'Parts inspection' && service.title !== 'Machine Assembly')) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentCarouselImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isOpen, service, currentCarouselImages.length]);

  // Reset carousel when modal opens/closes or service changes
  useEffect(() => {
    if (service?.title === 'Parts inspection' || service?.title === 'Machine Assembly') {
      setCurrentImageIndex(0);
    }
  }, [service, isOpen]);

  if (!isOpen || !service) return null;

  // Production flow steps
  const productionFlowSteps = [
    'INQUIRY WITH ORDER SHEET',
    'REFERENCE DATA',
    '3D MODELING WITH MODIFICATION',
    '2D MODELING',
    'MANUFACTURING DESIGN',
    'FABRICATION / ASSEMBLY',
    'DELIVERY OR PRODUCTS',
  ];

  // Get the current step index based on service
  const getCurrentStepIndex = () => {
    switch (service.title) {
      case '3D Modeling':
        return 2; // 3D MODELING WITH MODIFICATION
      case '2D Detailing':
        return 3; // 2D MODELING
      case 'Parts inspection':
        return 5; // FABRICATION / ASSEMBLY
      case 'Machine Assembly':
        return 5; // FABRICATION / ASSEMBLY
      default:
        return 2;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  // Handle flow step click - only for 3D and 2D modals
  const handleFlowStepClick = (stepIndex: number) => {
    if (!onServiceChange) return;

    // Only allow clicks on specific steps in 3D and 2D modals
    if (service.title === '3D Modeling') {
      // In 3D modal, only "2D MODELING" (index 3) is clickable
      if (stepIndex === 3) {
        onServiceChange('2D Detailing');
      }
    } else if (service.title === '2D Detailing') {
      // In 2D modal, only "3D MODELING WITH MODIFICATION" (index 2) is clickable
      if (stepIndex === 2) {
        onServiceChange('3D Modeling');
      }
    }
  };

  // Check if a step is clickable
  const isStepClickable = (stepIndex: number) => {
    if (!onServiceChange) return false;
    if (service.title === '3D Modeling' && stepIndex === 3) return true;
    if (service.title === '2D Detailing' && stepIndex === 2) return true;
    return false;
  };

  // Get detailed description for services
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

  // Get 2D Detailing sections data
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

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>
          ×
        </button>

        <div className={`service-modal-body ${service.title === 'Parts inspection' || service.title === 'Machine Assembly' ? 'service-modal-body-single' : ''}`}>
          {/* Left Side - Service Details */}
          <div className="service-modal-left">
            <h2 className="service-modal-title">
              {service.title === 'Machine Assembly' ? 'Assembly' : service.title}
            </h2>
            <p className="service-modal-description">{getDetailedDescription()}</p>

            {/* Render different layouts based on service type */}
            {service.title === '2D Detailing' ? (
              /* 2D Detailing - Multiple Numbered Sections */
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
              /* Parts Inspection / Machine Assembly - Carousel with Indicators (No Step Indicator) */
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

                  {/* Carousel Indicators - Inside background box */}
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
              /* Default Layout - Single Step Indicator and Images */
              <>
                <div className="service-modal-step-indicator">
                  <div className="service-modal-step-number">1</div>
                  <span className="service-modal-step-text">{service.title.toUpperCase()}</span>
                </div>

                {/* CAD Images */}
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

          {/* Right Side - Production Flow */}
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


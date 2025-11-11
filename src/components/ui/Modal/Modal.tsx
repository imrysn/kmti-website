import React from 'react';
import './Modal.css';

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
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service }) => {
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

  // Get detailed description for 3D Modeling
  const getDetailedDescription = () => {
    if (service.title === '3D Modeling') {
      return "By converting clients 3D model, we can easily check any possible errors or interference that may occur. During this process, we often consult to our clients for any corrections in the design. After the 3D model is done, we'll then send it to our client for them to confirm. Once confirmed, we will proceed with the 2D Detailing. If there's still suggestions we'll modify the design until it is final for 2D detailing.";
    }
    return service.description;
  };

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="service-modal-body">
          {/* Left Side - Service Details */}
          <div className="service-modal-left">
            <h2 className="service-modal-title">{service.title}</h2>
            <p className="service-modal-description">{getDetailedDescription()}</p>
            
            {/* Numbered Step Indicator */}
            <div className="service-modal-step-indicator">
              <div className="service-modal-step-number">1</div>
              <span className="service-modal-step-text">{service.title.toUpperCase()}</span>
            </div>

            {/* CAD Images */}
            {service.image && (
              <div className="service-modal-images">
                <div className="service-modal-image-container">
                  <img src={service.image} alt={`${service.title} - View 1`} className="service-modal-image" />
                </div>
                <div className="service-modal-image-container">
                  <img src={service.image} alt={`${service.title} - View 2`} className="service-modal-image" />
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Production Flow */}
          <div className="service-modal-right">
            <h3 className="service-modal-flow-title">ACTUAL PRODUCTION FLOW</h3>
            <div className="service-modal-flow">
              {productionFlowSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <button
                    className={`service-modal-flow-step ${
                      index === currentStepIndex ? 'active' : ''
                    }`}
                  >
                    {step}
                  </button>
                  {index < productionFlowSteps.length - 1 && (
                    <div className="service-modal-flow-arrow">↓</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;


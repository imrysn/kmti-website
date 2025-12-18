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
import pauImage from '../../../assets/management/pau.png';
import michaelImage from '../../../assets/management/michael.png';
import siryuImage from '../../../assets/management/siryu.png';
import mennjoImage from '../../../assets/management/mennjo.png';
import teodyImage from '../../../assets/management/teody.png';
import shelaImage from '../../../assets/management/shela.png';
import erikImage from '../../../assets/management/erik.png';
import louieImage from '../../../assets/management/louie.png'
import kerbyImage from '../../../assets/management/kerby.png';
import kissImage from '../../../assets/management/kiss.png';
import lorieImage from '../../../assets/management/lorie.png';
import jethroImage from '../../../assets/management/jethro.png';
import joyceImage from '../../../assets/management/joyce.png';
import jcImage from '../../../assets/management/jc.png';
import jennyImage from '../../../assets/management/jenny.png';
import nylImage from '../../../assets/management/nyl.png';
import jonathanImage from '../../../assets/management/jonathan.png';
import noelImage from '../../../assets/management/noel.png';
import royImage from '../../../assets/management/roy.png';
import jojoImage from '../../../assets/management/jojo.png';

import { ManagementTeamCard } from '../Card/Card';
import Button from '../Button/Button';
import Model3DViewerModal from './Model3DViewerModal';
import dedemplerImage from '../../../assets/image3D/dedempler.png';
import bundlingImage from '../../../assets/image3D/bundling.png';
import bindingImage from '../../../assets/image3D/binding.png';
import horizontalLooperImage from '../../../assets/image3D/horizontal-looper.png';
import formingImage from '../../../assets/image3D/forming.png';
import shearImage from '../../../assets/image3D/shear.png';
import uncoilerImage from '../../../assets/image3D/uncoiler.png';
import levelerImage from '../../../assets/image3D/leveler.png';
import finishingImage from '../../../assets/image3D/finishing.png';
import bundleSeparatorImage from '../../../assets/image3D/bundle-separator.png';
import pipeDryingImage from '../../../assets/image3D/pipe-drying.png';
import pipeBundlingImage from '../../../assets/image3D/pipe-bundling.png';
import productStorageFSImage from '../../../assets/image3D/product-storage-FS.png';
import transferTableImage from '../../../assets/image3D/transfer-table.png';
import finishingLineImage from '../../../assets/image3D/finishingLine.png';
import airBlowImage from '../../../assets/image3D/air-blow.png';
import transferTableLifterImage from '../../../assets/image3D/transfer-table-lifter.png';
import dedimplerFacerImage from '../../../assets/image3D/dedimpler&facer.png';
import bundlingMachineImage from '../../../assets/image3D/bundling-machine.png';
import millingCutoffImage from '../../../assets/image3D/milling.png';
import furnaceImage from '../../../assets/image3D/furnace.png';
import looperImage from '../../../assets/image3D/looper.png'



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
    if (service?.title === 'Parts Inspection') return inspectionImages;
    if (service?.title === 'Machine Assembly') return assemblyImages;
    return [];
  };

  const currentCarouselImages = getCurrentCarouselImages();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the original overflow value
      const originalOverflow = document.body.style.overflow;
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      // Restore original overflow when modal closes or component unmounts
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !service || (service.title !== 'Parts Inspection' && service.title !== 'Machine Assembly')) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentCarouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, service, currentCarouselImages.length]);

  useEffect(() => {
    if (service?.title === 'Parts Inspection' || service?.title === 'Machine Assembly') {
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
      case 'Parts Inspection':
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

        <div className={`service-modal-body ${service.title === 'Parts Inspection' || service.title === 'Machine Assembly' ? 'service-modal-body-single' : ''}`}>
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
            ) : service.title === 'Parts Inspection' || service.title === 'Machine Assembly' ? (
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

          {service.title !== 'Parts Inspection' && service.title !== 'Machine Assembly' && (
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
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the original overflow value
      const originalOverflow = document.body.style.overflow;
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      // Restore original overflow when modal closes or component unmounts
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

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

interface ManagementTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagementTeamModal: React.FC<ManagementTeamModalProps> = ({ isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the original overflow value
      const originalOverflow = document.body.style.overflow;
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      // Restore original overflow when modal closes or component unmounts
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  if (!isOpen) return null;

  const managementTeam = [
    { image: pauImage, role: 'ACCOUNTING / ADMIN MANAGER' },
    { image: michaelImage, role: 'ENGINEERING MANAGER' },
    { image: siryuImage, role: 'PRESIDENT / CEO', isLarge: true },
    { image: mennjoImage, role: 'ENGINEERING MANAGER' },
    { image: teodyImage, role: 'ENGINEERING SUPERVISOR' },
    { image: shelaImage, role: 'ENGINEERING SUPERVISOR' },
    { image: erikImage, role: 'ENGINEERING TEAM LEADER' },
    { image: louieImage, role: 'ENGINEERING ASSISTANT TL' },
    { image: kerbyImage, role: 'ENGINEERING IT/STAFF' },
    { image: kissImage, role: 'ENGINEERING STAFF/SO' },
    { image: lorieImage, role: 'ENGINEERING STAFF' },
    { image: jethroImage, role: 'ENGINEERING STAFF' },
    { image: joyceImage, role: 'ENGINEERING STAFF' },
    { image: jcImage, role: 'ENGINEERING STAFF' },
    { image: jennyImage, role: 'ENGINEERING STAFF' },
    { image: nylImage, role: 'ENGINEERING STAFF' },
    { image: jonathanImage, role: 'ENGINEERING STAFF' },
    { image: noelImage, role: 'COMPANY DRIVER' },
    { image: royImage, role: 'COMPANY DRIVER' },
    { image: jojoImage, role: 'MAINTENANCE/UTILITY PERSONNEL' },
  ];

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content management-team-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="management-team-modal-body">
          <h2 className="management-team-modal-title">Meet Our Management Team</h2>
          <p className="management-team-modal-description">
            At the heart of our company is a team of dedicated professionals who bring experience, leadership, and passion to every project. Together, they ensure that our operations run efficiently and that our goals are achieved with excellence.
          </p>

          <div className="management-team-modal-grid">
            {managementTeam.map((member, index) => {
              const isFirstRow = index < 5;
              const isLargeCard = member.isLarge && isFirstRow;

              return (
                <React.Fragment key={index}>
                  {isFirstRow && index === 2 && (
                    <div className="management-team-card-placeholder"></div>
                  )}
                  <ManagementTeamCard
                    image={member.image}
                    role={member.role}
                    isLarge={isLargeCard}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [selected3DModelTitle, setSelected3DModelTitle] = useState('');

  const projectImages = [
    {
      image: dedemplerImage,
      title: 'Dedimpler and Facer',
      category: 'Mechanical > Tube',
      description: 'Tube and pipes that require facing and or internal and external chamfering can be processed in line with the tube mill or off line.',
      application: 'Required to rectify the end of the tube after single cut shear and where facing and or chamfering is a customer requirement.',
      advantages: 'Dedimpling inline with the mill reduces stock holding and optimises the use of floor space, labour and capital.',
      // modelFile: 'dedimpler-facer.glb',
    },
    {
      image: bundlingImage,
      title: 'Bundling Machine',
      category: 'Mechanical > Tube',
      description: 'High speed tube and pipe bundling and strapping machines take the tube direclty from the mill and pack the tube ready for transport and safe. No need to store tube in bulk prior to packing.',
      advantages: 'Bundling is carried out in line with the mill, no need to stock tube in bulk waiting for packing. Minimise stock holding. Professional looking bundles. Quiet method of bundling',
      // modelFile: 'bundling-machine.glb',
    },
    {
      image: bindingImage,
      title: 'Binding Machine',
      category: 'Mechanical > Tube',
      description: 'Binding Machine used to bind finished products ready for delivery.',
      // modelFile: 'binding-machine.glb',
    },
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  // Reset to first image when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (!isOpen) return null;

  const currentProject = projectImages[selectedImageIndex];

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="project-modal-body">
          <div className="project-modal-left">
            <div className="project-modal-media">
              <div className="project-modal-main-image-container">
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="project-modal-main-image"
                  key={selectedImageIndex}
                />
              </div>
            </div>
          </div>

          <div className="project-modal-right">
            <div className="project-modal-details">
              <h2 className="project-modal-title">{currentProject.title}</h2>
              <p className="project-modal-category">{currentProject.category}</p>

              <div className="project-modal-section">
                <h3 className="project-modal-section-title">Description:</h3>
                <p className="project-modal-section-text">{currentProject.description}</p>
              </div>

              {currentProject.application && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Application:</h3>
                  <p className="project-modal-section-text">{currentProject.application}</p>
                </div>
              )}

              {currentProject.advantages && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Advantages:</h3>
                  <p className="project-modal-section-text">{currentProject.advantages}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails-wrapper">
            {projectImages.length > 1 && (
              <div className="project-modal-thumbnails">
                {projectImages.map((project, index) => (
                  <button
                    key={index}
                    className={`project-modal-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                    type="button"
                    aria-label={`View ${project.title}`}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-modal-thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            )}
            <Button variant="style1" onClick={() => {
              setSelected3DModelTitle(currentProject.title);
              setIs3DViewerOpen(true);
            }}>
              View 3D Model
            </Button>
          </div>
        </div>
      </div>

      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={() => setIs3DViewerOpen(false)}
        modelTitle={selected3DModelTitle}
      />
    </div>
  );
};

interface LooperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LooperModal: React.FC<LooperModalProps> = ({ isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [selected3DModelTitle, setSelected3DModelTitle] = useState('');

  const looperImages = [
    {
      image: looperImage,
      title: 'Looper Machine',
      category: 'Mechanical > Tube',
      description: 'Horizontal loopers store strip on a horizontal rotary table. Where the space is available this is the most efficient and cheapest method of storing strip withouth causing any surface damage.',
      application: 'Suitable for all tube sizes and materials.',
      advantages: 'Improved productivity, Reduced Downtime, Reduced Scrap, Reduced Strip Damage',
      // modelFile: 'looper-machine.glb',
    },
    {
      image: horizontalLooperImage,
      title: 'Horizontal Looper Machine',
      category: 'Mechanical > Tube',
      description: 'Horizontal loopers store strip on a horizontal rotary table. Where the space is available this is most efficient and cheapest method of storing strip without causing any surface damage. There are two main types; the Spiral Accumulator and the Free Loop Accumulator.',
      application: 'Suitable for all tube sizes and materials',
      advantages: 'Improved productivity, Reduced Downtime, Reduced Scrap, Reduced Strip Damage.',
      // modelFile: 'horizontal-looper-machine.glb',
    },
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  // Reset to first image when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (!isOpen) return null;

  const currentLooper = looperImages[selectedImageIndex];

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="project-modal-body">
          <div className="project-modal-left">
            <div className="project-modal-media">
              <div className="project-modal-main-image-container">
                <img
                  src={currentLooper.image}
                  alt={currentLooper.title}
                  className="project-modal-main-image"
                  key={selectedImageIndex}
                />
              </div>
            </div>
          </div>

          <div className="project-modal-right">
            <div className="project-modal-details">
              <h2 className="project-modal-title">{currentLooper.title}</h2>
              <p className="project-modal-category">{currentLooper.category}</p>

              <div className="project-modal-section">
                <h3 className="project-modal-section-title">Description:</h3>
                <p className="project-modal-section-text">{currentLooper.description}</p>
              </div>

              {currentLooper.application && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Application:</h3>
                  <p className="project-modal-section-text">{currentLooper.application}</p>
                </div>
              )}

              {currentLooper.advantages && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Advantages:</h3>
                  <p className="project-modal-section-text">{currentLooper.advantages}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails-wrapper">
            {looperImages.length > 1 && (
              <div className="project-modal-thumbnails">
                {looperImages.map((looper, index) => (
                  <button
                    key={index}
                    className={`project-modal-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                    type="button"
                    aria-label={`View ${looper.title}`}
                  >
                    <img
                      src={looper.image}
                      alt={looper.title}
                      className="project-modal-thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            )}
            <Button variant="style1" onClick={() => {
              setSelected3DModelTitle(currentLooper.title);
              setIs3DViewerOpen(true);
            }}>
              View 3D Model
            </Button>
          </div>
        </div>
      </div>

      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={() => setIs3DViewerOpen(false)}
        modelTitle={selected3DModelTitle}
      />
    </div>
  );
};

interface FormingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormingModal: React.FC<FormingModalProps> = ({ isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [selected3DModelTitle, setSelected3DModelTitle] = useState('');

  const formingImages: Array<{
    image: string;
    title: string;
    category: string;
    description: string;
    application?: string;
    advantages?: string;
  }> = [
      {
        image: formingImage,
        title: 'Forming and Sizing Machine',
        category: 'Mechanical > Tube',
        description: 'After metal strips has been welded and combined it will undergo forming to produce the needed shape of steel.',
        // modelFile: 'forming-sizing-machine.glb',
      },
    ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  // Reset to first image when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (!isOpen) return null;

  const currentForming = formingImages[selectedImageIndex];

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="project-modal-body">
          <div className="project-modal-left">
            <div className="project-modal-media">
              <div className="project-modal-main-image-container">
                <img
                  src={currentForming.image}
                  alt={currentForming.title}
                  className="project-modal-main-image"
                  key={selectedImageIndex}
                />
              </div>
            </div>
          </div>

          <div className="project-modal-right">
            <div className="project-modal-details">
              <h2 className="project-modal-title">{currentForming.title}</h2>
              <p className="project-modal-category">{currentForming.category}</p>

              <div className="project-modal-section">
                <h3 className="project-modal-section-title">Description:</h3>
                <p className="project-modal-section-text">{currentForming.description}</p>
              </div>

              {currentForming.application && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Application:</h3>
                  <p className="project-modal-section-text">{currentForming.application}</p>
                </div>
              )}

              {currentForming.advantages && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Advantages:</h3>
                  <p className="project-modal-section-text">{currentForming.advantages}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails-wrapper">
            {formingImages.length > 1 && (
              <div className="project-modal-thumbnails">
                {formingImages.map((forming, index) => (
                  <button
                    key={index}
                    className={`project-modal-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                    type="button"
                    aria-label={`View ${forming.title}`}
                  >
                    <img
                      src={forming.image}
                      alt={forming.title}
                      className="project-modal-thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            )}
            <Button variant="style1" onClick={() => {
              setSelected3DModelTitle(currentForming.title);
              setIs3DViewerOpen(true);
            }}>
              View 3D Model
            </Button>
          </div>
        </div>
      </div>

      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={() => setIs3DViewerOpen(false)}
        modelTitle={selected3DModelTitle}
      />
    </div>
  );
};

interface StripEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StripEntryModal: React.FC<StripEntryModalProps> = ({ isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [selected3DModelTitle, setSelected3DModelTitle] = useState('');

  const stripEntryImages: Array<{
    image: string;
    title: string;
    category: string;
    description: string;
    application?: string;
    advantages?: string;
    specification?: string;
  }> = [
      {
        image: shearImage,
        title: 'Shear Welder Machine',
        category: 'Mechanical > Tube',
        description: 'Shear and end welders crop the tail and nose of each coil. The two coil ends are then aligned and the joint welded using TIG, MIG or MAG depending on the materials and thickness being welded. Single and twin torch vesions are available.',
        application: 'Shear and end welders are available for all tube and pipe mills. From small Aluminum mills to large API Mills.',
        advantages: 'High weld quality, very consistent cycle times resulting in improved productivity and reduced scrap.',
        specification: 'A range of Shear end welders can be supplied, from small semi conductor systems to large fully automatic systems.',
        // modelFile: 'shear-welder-machine.glb',
      },
      {
        image: uncoilerImage,
        title: 'Uncoiler Machine',
        category: 'Mechanical > Tube',
        description: 'The uncoiler safely holds the coil of strip and enables the strip to be unstrapped and presented to the strap peeling and  leveling equipment. For high productivity double sided uncoilers are used. However, where there is available storage and time sigle sided uncoilers can be used.',
        application: 'Vertical and horizontal uncoilers are avaiable for most applications i.e ERW, TIG and Lase using steel, steel alloy, stainless steel. copper, copper alloy, and Aluminum. Uncoilers for other applications and materials available on request.',
        advantages: 'Al the heavy material handling is safely carried out by machine. Less material damage - faster with consistent and reliable cycle times.',
        // modelFile: 'uncoiler-machine.glb',
      },
      {
        image: levelerImage,
        title: 'Leveler Machine',
        category: 'Mechanical > Tube',
        description: 'Leveling machines are used to level metal strips in throughtput, e.g. in a cut-to-length line or to level single metal sheets of parts',
        // modelFile: 'leveler-machine.glb',
      },
    ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  // Reset to first image when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (!isOpen) return null;

  const currentStripEntry = stripEntryImages[selectedImageIndex];

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="project-modal-body">
          <div className="project-modal-left">
            <div className="project-modal-media">
              <div className="project-modal-main-image-container">
                <img
                  src={currentStripEntry.image}
                  alt={currentStripEntry.title}
                  className="project-modal-main-image"
                  key={selectedImageIndex}
                />
              </div>
            </div>
          </div>

          <div className="project-modal-right">
            <div className="project-modal-details">
              <h2 className="project-modal-title">{currentStripEntry.title}</h2>
              <p className="project-modal-category">{currentStripEntry.category}</p>

              <div className="project-modal-section">
                <h3 className="project-modal-section-title">Description:</h3>
                <p className="project-modal-section-text">{currentStripEntry.description}</p>
              </div>

              {currentStripEntry.application && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Application:</h3>
                  <p className="project-modal-section-text">{currentStripEntry.application}</p>
                </div>
              )}

              {currentStripEntry.advantages && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Advantages:</h3>
                  <p className="project-modal-section-text">{currentStripEntry.advantages}</p>
                </div>
              )}

              {currentStripEntry.specification && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Specification:</h3>
                  <p className="project-modal-section-text">{currentStripEntry.specification}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails-wrapper">
            {stripEntryImages.length > 1 && (
              <div className="project-modal-thumbnails">
                {stripEntryImages.map((stripEntry, index) => (
                  <button
                    key={index}
                    className={`project-modal-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                    type="button"
                    aria-label={`View ${stripEntry.title}`}
                  >
                    <img
                      src={stripEntry.image}
                      alt={stripEntry.title}
                      className="project-modal-thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            )}
            <Button variant="style1" onClick={() => {
              setSelected3DModelTitle(currentStripEntry.title);
              setIs3DViewerOpen(true);
            }}>
              View 3D Model
            </Button>
          </div>
        </div>
      </div>

      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={() => setIs3DViewerOpen(false)}
        modelTitle={selected3DModelTitle}
      />
    </div>
  );
};

interface TransferTableLineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferTableLineModal: React.FC<TransferTableLineModalProps> = ({ isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [selected3DModelTitle, setSelected3DModelTitle] = useState('');

  const transferTableLineImages: Array<{
    image: string;
    title: string;
    category: string;
    description?: string;
  }> = [
      {
        image: finishingImage,
        title: 'Transfer Table',
        category: 'FINISHING TABLE  ',
        description: 'Extension of transfer table in the finishing line.',
        // modelFile: 'transfer-table.glb',
      },
      {
        image: bundleSeparatorImage,
        title: 'Bundle Separator',
        category: 'MECHANICAL > TUBE (Sub Machine)',
        // modelFile: 'bundle-separator.glb',
      },
      {
        image: pipeDryingImage,
        title: 'Pipe Drying Section',
        category: 'MECHANICAL > TUBE (Sub Machine)',
        // modelFile: 'pipe-drying-section.glb',
      },
      {
        image: pipeBundlingImage,
        title: 'Transfer Table',
        category: 'MECHANICAL > TUBE (Sub Machine)',
        // modelFile: 'transfer-table-2.glb',
      },
      {
        image: productStorageFSImage,
        title: 'Pipe Bundling',
        category: 'MECHANICAL > TUBE (Sub Machine)',
        // modelFile: 'pipe-bundling.glb',
      },
      {
        image: transferTableImage,
        title: 'Product Storage',
        category: 'MECHANICAL > TUBE (Sub Machine)',
        // modelFile: 'product-storage.glb',
      },
    ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  // Reset to first image when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (!isOpen) return null;

  const currentImage = transferTableLineImages[selectedImageIndex];

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="project-modal-body">
          <div className="project-modal-left">
            <div className="project-modal-media">
              <div className="project-modal-main-image-container">
                <img
                  src={currentImage.image}
                  alt={currentImage.title}
                  className="project-modal-main-image"
                  key={selectedImageIndex}
                />
              </div>
            </div>
          </div>

          <div className="project-modal-right">
            <div className="project-modal-details">
              <h2 className="project-modal-title">{currentImage.title}</h2>
              <p className="project-modal-category">{currentImage.category}</p>

              {currentImage.description && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Description:</h3>
                  <p className="project-modal-section-text">{currentImage.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails-wrapper">
            {transferTableLineImages.length > 1 && (
              <div className="project-modal-thumbnails">
                {transferTableLineImages.map((image, index) => (
                  <button
                    key={index}
                    className={`project-modal-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                    type="button"
                    aria-label={`View ${image.title}`}
                  >
                    <img
                      src={image.image}
                      alt={image.title}
                      className="project-modal-thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            )}
            <Button variant="style1" onClick={() => {
              setSelected3DModelTitle(currentImage.title);
              setIs3DViewerOpen(true);
            }}>
              View 3D Model
            </Button>
          </div>
        </div>
      </div>

      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={() => setIs3DViewerOpen(false)}
        modelTitle={selected3DModelTitle}
      />
    </div>
  );
};

interface FinishingLineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinishingLineModal: React.FC<FinishingLineModalProps> = ({ isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [selected3DModelTitle, setSelected3DModelTitle] = useState('');

  const finishingLineImages: Array<{
    image: string;
    title: string;
    category: string;
    description?: string;
  }> = [
      {
        image: finishingLineImage,
        title: 'Finishing Line',
        category: 'RUN OUT, TRANSPORT TABLE, DEDIMPLER AND FACER, AND BUNDLING MACHINE',
        description: 'After pipes were cut into standard lengths it will be passed to the finishing line to be arranged and bundled ready for distribution.',
        // modelFile: 'finishing-line.glb',
      },
      {
        image: airBlowImage,
        title: 'Air Blow',
        category: 'MECHANICAL > TUBE (SUB MACHINE)',
        // modelFile: 'air-blow.glb',
      },
      {
        image: transferTableLifterImage,
        title: 'Transfer Table (Lifter)',
        category: 'MECHANICAL > TUBE (SUB MACHINE)',
        // modelFile: 'transfer-table-lifter.glb',
      },
      {
        image: dedimplerFacerImage,
        title: 'Dedimpler & Facer',
        category: 'MECHANICAL > TUBE (SUB MACHINE)',
        // modelFile: 'dedimpler-facer.glb',
      },
      {
        image: bundlingMachineImage,
        title: 'Bundling Machine',
        category: 'MECHANICAL > TUBE (SUB MACHINE)',
        // modelFile: 'bundling-machine-fs.glb',
      },
      {
        image: productStorageFSImage,
        title: 'Product Storage',
        category: 'MECHANICAL > TUBE (SUB MACHINE)',
        // modelFile: 'product-storage-fs.glb',
      },
    ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  // Reset to first image when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (!isOpen) return null;

  const currentImage = finishingLineImages[selectedImageIndex];

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="project-modal-body">
          <div className="project-modal-left">
            <div className="project-modal-media">
              <div className="project-modal-main-image-container">
                <img
                  src={currentImage.image}
                  alt={currentImage.title}
                  className="project-modal-main-image"
                  key={selectedImageIndex}
                />
              </div>
            </div>
          </div>

          <div className="project-modal-right">
            <div className="project-modal-details">
              <h2 className="project-modal-title">{currentImage.title}</h2>
              <p className="project-modal-category">{currentImage.category}</p>

              {currentImage.description && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Description:</h3>
                  <p className="project-modal-section-text">{currentImage.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails-wrapper">
            {finishingLineImages.length > 1 && (
              <div className="project-modal-thumbnails">
                {finishingLineImages.map((image, index) => (
                  <button
                    key={index}
                    className={`project-modal-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                    type="button"
                    aria-label={`View ${image.title}`}
                  >
                    <img
                      src={image.image}
                      alt={image.title}
                      className="project-modal-thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            )}
            <Button variant="style1" onClick={() => {
              setSelected3DModelTitle(currentImage.title);
              setIs3DViewerOpen(true);
            }}>
              View 3D Model
            </Button>
          </div>
        </div>
      </div>

      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={() => setIs3DViewerOpen(false)}
        modelTitle={selected3DModelTitle}
      />
    </div>
  );
};

interface CutOffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CutOffModal: React.FC<CutOffModalProps> = ({ isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [selected3DModelTitle, setSelected3DModelTitle] = useState('');

  const cutOffImages = [
    {
      image: millingCutoffImage,
      title: 'Milling Cutoff Machine',
      category: 'CUT OFF',
      description: 'Milling Cutoff Machine uses two milling saws to cut to length pipe and structural section tubes. The cut finishes eliminates the need for facing.',
      application: 'Ideal for achieving clean, square cuts on tubes without secondary finishing.',
      // modelFile: 'milling-cutoff-machine.glb',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  if (!isOpen) return null;

  const currentImage = cutOffImages[selectedImageIndex];

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="project-modal-body">
          <div className="project-modal-left">
            <div className="project-modal-media">
              <div className="project-modal-main-image-container">
                <img
                  src={currentImage.image}
                  alt={currentImage.title}
                  className="project-modal-main-image"
                  key={selectedImageIndex}
                />
              </div>
            </div>
          </div>

          <div className="project-modal-right">
            <div className="project-modal-details">
              <h2 className="project-modal-title">{currentImage.title}</h2>
              <p className="project-modal-category">{currentImage.category}</p>

              <div className="project-modal-section">
                <h3 className="project-modal-section-title">Description:</h3>
                <p className="project-modal-section-text">{currentImage.description}</p>
              </div>

              {currentImage.application && (
                <div className="project-modal-section">
                  <h3 className="project-modal-section-title">Application:</h3>
                  <p className="project-modal-section-text">{currentImage.application}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails-wrapper">
            <Button variant="style1" onClick={() => {
              setSelected3DModelTitle(currentImage.title);
              setIs3DViewerOpen(true);
            }}>
              View 3D Model
            </Button>
          </div>
        </div>
      </div>

      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={() => setIs3DViewerOpen(false)}
        modelTitle={selected3DModelTitle}
      />
    </div>
  );
};

interface FurnaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FurnaceModal: React.FC<FurnaceModalProps> = ({ isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [selected3DModelTitle, setSelected3DModelTitle] = useState('');

  const furnaceImages = [
    {
      image: furnaceImage,
      title: 'Furnace',
      category: 'FURNACE',
      description: 'Furnace is used for melting large batches of glass, in which heat is supplied by a flame playing over the glass surface, and regenerative heating of combustion air.',
      // modelFile: 'furnace.glb',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  if (!isOpen) return null;

  const currentImage = furnaceImages[selectedImageIndex];

  return (
    <div className="service-modal-overlay" onClick={handleClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="service-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="project-modal-body">
          <div className="project-modal-left">
            <div className="project-modal-media">
              <div className="project-modal-main-image-container">
                <img
                  src={currentImage.image}
                  alt={currentImage.title}
                  className="project-modal-main-image"
                  key={selectedImageIndex}
                />
              </div>
            </div>
          </div>

          <div className="project-modal-right">
            <div className="project-modal-details">
              <h2 className="project-modal-title">{currentImage.title}</h2>
              <p className="project-modal-category">{currentImage.category}</p>

              <div className="project-modal-section">
                <h3 className="project-modal-section-title">Description:</h3>
                <p className="project-modal-section-text">{currentImage.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails-wrapper">
            <Button variant="style1" onClick={() => {
              setSelected3DModelTitle(currentImage.title);
              setIs3DViewerOpen(true);
            }}>
              View 3D Model
            </Button>
          </div>
        </div>
      </div>

      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={() => setIs3DViewerOpen(false)}
        modelTitle={selected3DModelTitle}
      />
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useTranslation, Trans } from 'react-i18next';
import './Modal.css';
import { getAssetUrl } from '../../../utils/assets';
import LazyImage from '../LazyImage/LazyImage';
const modalImage1 = getAssetUrl('service_detail_image/3Dmodal1.png');
const modalImage2 = getAssetUrl('service_detail_image/3Dmodal2.png');
const modalImage2D = getAssetUrl('service_detail_image/2Dmodal.png');
const inspectionImage1 = getAssetUrl('service_detail_image/inspection1modal.png');
const inspectionImage2 = getAssetUrl('service_detail_image/inspection2modal.png');
const inspectionImage3 = getAssetUrl('service_detail_image/inspection3modal.png');
const inspectionImage4 = getAssetUrl('service_detail_image/inspection4modal.png');
const inspectionImage5 = getAssetUrl('service_detail_image/inspection5modal.png');
const assemblyImage1 = getAssetUrl('service_detail_image/assembly1modal.png');
const assemblyImage2 = getAssetUrl('service_detail_image/assembly2modal.png');
const assemblyImage3 = getAssetUrl('service_detail_image/assmebly3mpdal.png'); // Keeping typo in filename from original
const assemblyImage4 = getAssetUrl('service_detail_image/assembly4modal.png');
const assemblyImage5 = getAssetUrl('service_detail_image/assembly5modal.png');
const ourStoryPhoto = getAssetUrl('about_page/ourstoryImage.png');
const pauImage = getAssetUrl('management/pau.png');
const michaelImage = getAssetUrl('management/michael.png');
const siryuImage = getAssetUrl('management/siryu.png');
const mennjoImage = getAssetUrl('management/mennjo.png');
const teodyImage = getAssetUrl('management/teody.png');
const shelaImage = getAssetUrl('management/shela.png');
const erikImage = getAssetUrl('management/erik.png');
const louieImage = getAssetUrl('management/louie.png');
const kerbyImage = getAssetUrl('management/kerby.png');
const kissImage = getAssetUrl('management/kiss.png');
const lorieImage = getAssetUrl('management/lorie.png');
const jethroImage = getAssetUrl('management/jethro.png');
const joyceImage = getAssetUrl('management/joyce.png');
const jcImage = getAssetUrl('management/jc.png');
const jennyImage = getAssetUrl('management/jenny.png');
const nylImage = getAssetUrl('management/nyl.png');
const jonathanImage = getAssetUrl('management/jonathan.png');
const noelImage = getAssetUrl('management/noel.png');
const royImage = getAssetUrl('management/roy.png');
const jojoImage = getAssetUrl('management/jojo.png');
import { ManagementTeamCard } from '../Card/Card';
import Button from '../Button/Button';
import Model3DViewerModal from './Model3DViewerModal';
const dedemplerImage = getAssetUrl('image3D/dedempler.png');
const bundlingImage = getAssetUrl('image3D/bundling.png');
const bindingImage = getAssetUrl('image3D/binding.png');
const looperImage = getAssetUrl('image3D/looper.png');
const verticalLooperImage = getAssetUrl('image3D/vertical-looper.png');
const horizontalLooperImage = getAssetUrl('image3D/horizontal-looper.png');
const formingImage = getAssetUrl('image3D/forming.png');
const shearImage = getAssetUrl('image3D/shear.png');
const uncoilerImage = getAssetUrl('image3D/uncoiler.png');
const levelerImage = getAssetUrl('image3D/leveler.png');
const transferTableImage = getAssetUrl('image3D/transfer-table.png');
const bundleSeparatorImage = getAssetUrl('image3D/bundle-separator.png');
const pipeDryingImage = getAssetUrl('image3D/pipe-drying.png');
const pipeBundlingImage = getAssetUrl('image3D/pipe-bundling.png');
const productImage = getAssetUrl('image3D/product-storage.png');
const productStorageImage = getAssetUrl('image3D/product-storage-FS.png');
const finishingImage = getAssetUrl('image3D/finishing.png');
const finishingLineImage = getAssetUrl('image3D/finishingLine.png');
const airBlowImage = getAssetUrl('image3D/air-blow.png');
const transferLifterImage = getAssetUrl('image3D/transfer-table-lifter.png');
const bundlingMachineImage = getAssetUrl('image3D/bundling-machine.png');
const millingImage = getAssetUrl('image3D/milling.png');
const furnaceImage = getAssetUrl('image3D/furnace.png');

const useLockBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }
  }, [isOpen]);
};

// --- SERVICE MODAL ---
interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: number;
    title: string;
    description: string;
  } | null;
  onServiceChange?: (serviceTitle: string) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Map incoming service title to the JSON keys we defined
  const getServiceKey = (title: string) => {
    if (title.includes('3D')) return '3d';
    if (title.includes('2D')) return '2d';
    if (title.includes('Inspection')) return 'inspection';
    if (title.includes('Assembly')) return 'assembly';
    return '3d';
  };

  const serviceKey = service ? getServiceKey(service.title) : '3d';
  const inspectionImages = [inspectionImage1, inspectionImage2, inspectionImage3, inspectionImage4, inspectionImage5];
  const assemblyImages = [assemblyImage1, assemblyImage2, assemblyImage3, assemblyImage4, assemblyImage5];

  const currentCarouselImages = service?.title === 'Parts Inspection' ? inspectionImages : service?.title === 'Machine Assembly' ? assemblyImages : [];

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen || !service || !currentCarouselImages.length) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentCarouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, service, currentCarouselImages.length]);

  if (!isOpen || !service) return null;

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className={`service-modal-body ${serviceKey === 'inspection' || serviceKey === 'assembly' ? 'service-modal-body-single' : ''}`}>
          <div className="service-modal-left">
            <h2 className="service-modal-title">{t(`services.items.${serviceKey}.title`)}</h2>
            <p className="service-modal-description">
              <Trans
                i18nKey={`services.modal.detailed_desc.${serviceKey}`}
                components={{ br: <br /> }}
              />
            </p>

            {serviceKey === '2d' ? (
              <div className="service-modal-sections">
                {[2, 3, 4].map((num) => (
                  <div key={num} className="service-modal-section">
                    <div className="service-modal-step-indicator">
                      <div className="service-modal-step-number">{num}</div>
                      <span className="service-modal-step-text">{t(`services.modal.2d_section.s${num}.title`)}</span>
                    </div>
                    {num === 2 && <div className="service-modal-images"><LazyImage src={modalImage2D} wrapperClassName="service-modal-image" alt="2D" /></div>}
                    <p className="service-modal-section-description">{t(`services.modal.2d_section.s${num}.desc`)}</p>
                  </div>
                ))}
              </div>
            ) : (serviceKey === 'inspection' || serviceKey === 'assembly') ? (
              <div className="service-modal-carousel">
                <div className="service-modal-carousel-container">
                  {currentCarouselImages.map((img, i) => (
                    <div key={i} className={`service-modal-carousel-slide ${i === currentImageIndex ? 'active' : ''}`}>
                      <LazyImage src={img} wrapperClassName="service-modal-image" alt="service" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="service-modal-images">
                <LazyImage src={modalImage1} wrapperClassName="service-modal-image" alt="3D 1" />
                <LazyImage src={modalImage2} wrapperClassName="service-modal-image" alt="3D 2" />
              </div>
            )}
          </div>

          {!(serviceKey === 'inspection' || serviceKey === 'assembly') && (
            <div className="service-modal-right">
              <h3 className="service-modal-flow-title">{t('services.workflow.title')}</h3>
              <div className="service-modal-flow">
                {Object.values(t('services.workflow.steps', { returnObjects: true }) as Record<string, string>).map((step, i) => (
                  <React.Fragment key={i}>
                    <div className={`service-modal-flow-step ${i === (serviceKey === '3d' ? 2 : 3) ? 'active' : ''}`}>{step}</div>
                    {i < 6 && <div className="service-modal-flow-arrow">↓</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- OUR STORY MODAL ---
export const OurStoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  useLockBodyScroll(isOpen);
  if (!isOpen) return null;
  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content our-story-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className="our-story-modal-body">
          <h2 className="our-story-modal-title">{t('about.story.modal_title')}</h2>
          <div className="our-story-photo-section">
            <LazyImage src={ourStoryPhoto} wrapperClassName="our-story-photo" alt="Leadership" />
            <p className="our-story-caption">{t('about.story.caption')}</p>
          </div>
          <div className="our-story-content">
            {(t('about.story.paragraphs', { returnObjects: true }) as string[]).map((p, i) => (
              <p key={i} className="our-story-text">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MANAGEMENT TEAM MODAL ---
export const ManagementTeamModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  useLockBodyScroll(isOpen);
  if (!isOpen) return null;

  const team = [
    { image: pauImage, key: 'accounting' },
    { image: michaelImage, key: 'eng_mgr' },
    { image: siryuImage, key: 'ceo', isLarge: true },
    { image: mennjoImage, key: 'eng_mgr' },
    { image: teodyImage, key: 'eng_sup' },
    { image: shelaImage, key: 'eng_sup' },
    { image: erikImage, key: 'eng_tl' },
    { image: louieImage, key: 'eng_atl' },
    { image: kerbyImage, key: 'it_staff' },
    { image: kissImage, key: 'staff_so' },
    { image: lorieImage, key: 'staff' },
    { image: jethroImage, key: 'staff' },
    { image: joyceImage, key: 'staff' },
    { image: jcImage, key: 'staff' },
    { image: jennyImage, key: 'staff' },
    { image: nylImage, key: 'staff' },
    { image: jonathanImage, key: 'staff' },
    { image: noelImage, key: 'driver' },
    { image: royImage, key: 'driver' },
    { image: jojoImage, key: 'utility' },
  ];

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content management-team-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className="management-team-modal-body">
          <h2 className="management-team-modal-title">{t('about.management.title')}</h2>
          <p className="management-team-modal-description">{t('about.management.description')}</p>
          <div className="management-team-modal-grid">
            {team.map((m, i) => (
              <React.Fragment key={i}>
                {i === 2 && <div className="management-team-card-placeholder"></div>}
                <ManagementTeamCard image={m.image} role={t(`about.management.roles.${m.key}`)} isLarge={m.isLarge} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PROJECT MODAL ---
export const ProjectModal: React.FC<{ isOpen: boolean; onClose: () => void; initialProjectKey?: string }> = ({ isOpen, onClose, initialProjectKey }) => {
  const { t } = useTranslation();

  const allProjects = [
    { image: dedemplerImage, key: 'dedimpler', modelKey: 'Dedimpler and Facer' },
    { image: bundlingImage, key: 'bundling', modelKey: 'Bundling Machine' },
    { image: bindingImage, key: 'binding', modelKey: 'Binding Machine' }
  ];

  const [idx, setIdx] = useState(0);
  const [is3D, setIs3D] = useState(false);

  useLockBodyScroll(isOpen);

  // Filter projects if a key is provided
  const displayProjects = initialProjectKey
    ? allProjects.filter(p => p.key.toUpperCase() === initialProjectKey.toUpperCase() || p.modelKey.toUpperCase() === initialProjectKey.toUpperCase())
    : allProjects;

  useEffect(() => {
    // Reset index when opening or key changes
    if (isOpen) {
      setIdx(0);
    }
  }, [isOpen, initialProjectKey]);

  if (!isOpen) return null;

  // Use the filtered list, fallback to first if filtering weirdly failed involved
  const curr = displayProjects[idx] || displayProjects[0];
  if (!curr) return null; // Should not happen given existing data

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className="project-modal-body">
          <div className="project-modal-left">
            <TransformWrapper>
              <TransformComponent>
                <LazyImage
                  src={curr.image}
                  className="project-modal-main-image project-modal-zoomable-image"
                  alt="project"
                  loading="eager"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="project-modal-right">
            <h2 className="project-modal-title">{t(`projects.modal_items.${curr.key}.title`)}</h2>
            <p className="project-modal-category">{t(`projects.modal_items.${curr.key}.category`)}</p>
            <div className="project-modal-section">
              <h3 className="project-modal-section-title">{t('projects.modal.labels.desc')}</h3>
              <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.description`)}</p>
            </div>
            {t(`projects.modal_items.${curr.key}.application`) && (
              <div className="project-modal-section">
                <h3 className="project-modal-section-title">{t('projects.modal.labels.app')}</h3>
                <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.application`)}</p>
              </div>
            )}
            {t(`projects.modal_items.${curr.key}.advantages`) && (
              <div className="project-modal-section">
                <h3 className="project-modal-section-title">{t('projects.modal.labels.adv')}</h3>
                <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.advantages`)}</p>
              </div>
            )}
          </div>
        </div>
        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails">
            {displayProjects.map((p, i) => (
              <button key={i} className={`project-modal-thumbnail ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
                <LazyImage src={p.image} className="project-modal-thumbnail-image" alt="thumb" />
              </button>
            ))}
          </div>
          <Button variant="style1" onClick={() => setIs3D(true)}>{t('projects.modal.view_3d')}</Button>
        </div>
      </div>
      <Model3DViewerModal
        isOpen={is3D}
        onClose={() => setIs3D(false)}
        modelTitle={t(`projects.modal_items.${curr.key}.title`)}
        modelKey={curr.modelKey}
      />
    </div>
  );
};
// --- LOOPER MODAL ---
export const LooperModal: React.FC<{ isOpen: boolean; onClose: () => void; initialProjectKey?: string }> = ({ isOpen, onClose, initialProjectKey }) => {
  const { t } = useTranslation();

  const allItems = [
    { image: looperImage, key: 'looper', modelKey: 'Looper Machine' },
    { image: verticalLooperImage, key: 'vertical', modelKey: 'Vertical Looper' },
    { image: horizontalLooperImage, key: 'horizontal', modelKey: 'Horizontal Looper Machine' }
  ];

  const [idx, setIdx] = useState(0);
  const [is3D, setIs3D] = useState(false);

  useLockBodyScroll(isOpen);

  // Filter items if a key is provided
  const displayItems = initialProjectKey
    ? allItems.filter(p => p.key.toUpperCase() === initialProjectKey.toUpperCase() || p.modelKey.toUpperCase() === initialProjectKey.toUpperCase())
    : allItems;

  useEffect(() => {
    if (isOpen) {
      setIdx(0);
    }
  }, [isOpen, initialProjectKey]);

  if (!isOpen) return null;

  const curr = displayItems[idx] || displayItems[0];
  if (!curr) return null;

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className="project-modal-body">
          <div className="project-modal-left">
            <TransformWrapper>
              <TransformComponent>
                <LazyImage
                  src={curr.image}
                  className="project-modal-main-image project-modal-zoomable-image"
                  alt="project"
                  loading="eager"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="project-modal-right">
            <h2 className="project-modal-title">{t(`projects.modal_items.${curr.key}.title`)}</h2>
            <p className="project-modal-category">{t(`projects.modal_items.${curr.key}.category`)}</p>
            <div className="project-modal-section">
              <h3 className="project-modal-section-title">{t('projects.modal.labels.desc')}</h3>
              <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.description`)}</p>
            </div>
            {t(`projects.modal_items.${curr.key}.application`) && (
              <div className="project-modal-section">
                <h3 className="project-modal-section-title">{t('projects.modal.labels.app')}</h3>
                <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.application`)}</p>
              </div>
            )}
            {t(`projects.modal_items.${curr.key}.advantages`) && (
              <div className="project-modal-section">
                <h3 className="project-modal-section-title">{t('projects.modal.labels.adv')}</h3>
                <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.advantages`)}</p>
              </div>
            )}
          </div>
        </div>
        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails">
            {displayItems.map((p, i) => (
              <button key={i} className={`project-modal-thumbnail ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
                <LazyImage src={p.image} className="project-modal-thumbnail-image" alt="thumb" />
              </button>
            ))}
          </div>
          <Button variant="style1" onClick={() => setIs3D(true)}>{t('projects.modal.view_3d')}</Button>
        </div>
      </div>
      <Model3DViewerModal
        isOpen={is3D}
        onClose={() => setIs3D(false)}
        modelTitle={t(`projects.modal_items.${curr.key}.title`)}
        modelKey={curr.modelKey}
      />
    </div>
  );
};

// --- FORMING MODAL ---
export const FormingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [is3D, setIs3D] = useState(false);
  const curr = { image: formingImage, key: 'forming', modelKey: 'Forming and Sizing Machine' };

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className="project-modal-body">
          <div className="project-modal-left">
            <TransformWrapper>
              <TransformComponent>
                <LazyImage
                  src={curr.image}
                  className="project-modal-main-image project-modal-zoomable-image"
                  alt="project"
                  loading="eager"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="project-modal-right">
            <h2 className="project-modal-title">{t(`projects.modal_items.${curr.key}.title`)}</h2>
            <p className="project-modal-category">{t(`projects.modal_items.${curr.key}.category`)}</p>
            <div className="project-modal-section">
              <h3 className="project-modal-section-title">{t('projects.modal.labels.desc')}</h3>
              <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.description`)}</p>
            </div>
          </div>
        </div>
        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails">
            {/* Single item, just show one thumbnail or maybe none correctly, but keeping consistency */}
            <button className="project-modal-thumbnail active">
              <LazyImage src={curr.image} className="project-modal-thumbnail-image" alt="thumb" />
            </button>
          </div>
          <Button variant="style1" onClick={() => setIs3D(true)}>{t('projects.modal.view_3d')}</Button>
        </div>
      </div>
      <Model3DViewerModal
        isOpen={is3D}
        onClose={() => setIs3D(false)}
        modelTitle={t(`projects.modal_items.${curr.key}.title`)}
        modelKey={curr.modelKey}
      />
    </div>
  );
};

// --- STRIP ENTRY MODAL ---
export const StripEntryModal: React.FC<{ isOpen: boolean; onClose: () => void; initialProjectKey?: string }> = ({ isOpen, onClose, initialProjectKey }) => {
  const { t } = useTranslation();

  const allItems = [
    { image: shearImage, key: 'shear', modelKey: 'Shear Welder Machine' },
    { image: uncoilerImage, key: 'uncoiler', modelKey: 'Uncoiler Machine' },
    { image: levelerImage, key: 'leveler', modelKey: 'Leveler Machine' }
  ];

  const [idx, setIdx] = useState(0);
  const [is3D, setIs3D] = useState(false);

  useLockBodyScroll(isOpen);

  // Filter items if a key is provided
  const displayItems = initialProjectKey
    ? allItems.filter(p => p.key.toUpperCase() === initialProjectKey.toUpperCase() || p.modelKey.toUpperCase() === initialProjectKey.toUpperCase())
    : allItems;

  useEffect(() => {
    if (isOpen) {
      setIdx(0);
    }
  }, [isOpen, initialProjectKey]);

  if (!isOpen) return null;

  const curr = displayItems[idx] || displayItems[0];
  if (!curr) return null;

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className="project-modal-body">
          <div className="project-modal-left">
            <TransformWrapper>
              <TransformComponent>
                <LazyImage
                  src={curr.image}
                  className="project-modal-main-image project-modal-zoomable-image"
                  alt="project"
                  loading="eager"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="project-modal-right">
            <h2 className="project-modal-title">{t(`projects.modal_items.${curr.key}.title`)}</h2>
            <p className="project-modal-category">{t(`projects.modal_items.${curr.key}.category`)}</p>
            <div className="project-modal-section">
              <h3 className="project-modal-section-title">{t('projects.modal.labels.desc')}</h3>
              <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.description`)}</p>
            </div>
            {t(`projects.modal_items.${curr.key}.application`) && (
              <div className="project-modal-section">
                <h3 className="project-modal-section-title">{t('projects.modal.labels.app')}</h3>
                <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.application`)}</p>
              </div>
            )}
            {t(`projects.modal_items.${curr.key}.advantages`) && (
              <div className="project-modal-section">
                <h3 className="project-modal-section-title">{t('projects.modal.labels.adv')}</h3>
                <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.advantages`)}</p>
              </div>
            )}
          </div>
        </div>
        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails">
            {displayItems.map((p, i) => (
              <button key={i} className={`project-modal-thumbnail ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
                <LazyImage src={p.image} className="project-modal-thumbnail-image" alt="thumb" />
              </button>
            ))}
          </div>
          <Button variant="style1" onClick={() => setIs3D(true)}>{t('projects.modal.view_3d')}</Button>
        </div>
      </div>
      <Model3DViewerModal
        isOpen={is3D}
        onClose={() => setIs3D(false)}
        modelTitle={t(`projects.modal_items.${curr.key}.title`)}
        modelKey={curr.modelKey}
      />
    </div>
  );
};

// --- TRANSFER TABLE MODAL ---
export const TransferTableLineModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [is3D, setIs3D] = useState(false);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIdx(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const items = [
    { image: finishingImage, key: 'transfer_table', modelKey: 'Transfer Table (Lifter)' },
    { image: bundleSeparatorImage, key: 'bundle', modelKey: 'Bundle Separator' },
    { image: pipeDryingImage, key: 'pipe_drying', modelKey: 'Pipe Drying Section' },
    { image: pipeBundlingImage, key: 'pipe_bundling', modelKey: 'Pipe Bundling' },
    { image: productImage, key: 'product', modelKey: 'Product Storage' },
    { image: transferTableImage, key: 'transfer', modelKey: 'Transfer Table (Lifter)' },
  ];
  const curr = items[idx];

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className="project-modal-body">
          <div className="project-modal-left">
            <TransformWrapper>
              <TransformComponent>
                <LazyImage
                  src={curr.image}
                  className="project-modal-main-image project-modal-zoomable-image"
                  alt="project"
                  loading="eager"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="project-modal-right">
            <h2 className="project-modal-title">{t(`projects.modal_items.${curr.key}.title`)}</h2>
            <p className="project-modal-category">{t(`projects.modal_items.${curr.key}.category`)}</p>
            {t(`projects.modal_items.${curr.key}.description`) && (
              <div className="project-modal-section">
                <h3 className="project-modal-section-title">{t('projects.modal.labels.desc')}</h3>
                <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.description`)}</p>
              </div>
            )}
          </div>
        </div>
        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails">
            {items.map((p, i) => (
              <button key={i} className={`project-modal-thumbnail ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
                <LazyImage src={p.image} className="project-modal-thumbnail-image" alt="thumb" />
              </button>
            ))}
          </div>
          <Button variant="style1" onClick={() => setIs3D(true)}>{t('projects.modal.view_3d')}</Button>
        </div>
      </div>
      <Model3DViewerModal
        isOpen={is3D}
        onClose={() => setIs3D(false)}
        modelTitle={t(`projects.modal_items.${curr.key}.title`)}
        modelKey={curr.modelKey}
      />
    </div>
  );
};

// --- FINISHING LINE MODAL ---
export const FinishingLineModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [is3D, setIs3D] = useState(false);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIdx(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const items = [
    { image: finishingLineImage, key: 'finishing', modelKey: 'Finishing Line' },
    { image: airBlowImage, key: 'air_blow', modelKey: 'Air Blow' },
    { image: transferLifterImage, key: 'transfertable_lifter', modelKey: 'Transfer Table (Lifter)' },

    { image: bundlingMachineImage, key: 'bunding_machine', modelKey: 'Bundling Machine' },
    { image: productStorageImage, key: 'product_storage', modelKey: 'Product Storage' },
  ];
  const curr = items[idx];

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className="project-modal-body">
          <div className="project-modal-left">
            <TransformWrapper>
              <TransformComponent>
                <LazyImage
                  src={curr.image}
                  className="project-modal-main-image project-modal-zoomable-image"
                  alt="project"
                  loading="eager"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="project-modal-right">
            <h2 className="project-modal-title">{t(`projects.modal_items.${curr.key}.title`)}</h2>
            <p className="project-modal-category">{t(`projects.modal_items.${curr.key}.category`)}</p>
            {t(`projects.modal_items.${curr.key}.description`) && (
              <div className="project-modal-section">
                <h3 className="project-modal-section-title">{t('projects.modal.labels.desc')}</h3>
                <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.description`)}</p>
              </div>
            )}
          </div>
        </div>
        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails">
            {items.map((p, i) => (
              <button key={i} className={`project-modal-thumbnail ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
                <LazyImage src={p.image} className="project-modal-thumbnail-image" alt="thumb" />
              </button>
            ))}
          </div>
          <Button variant="style1" onClick={() => setIs3D(true)}>{t('projects.modal.view_3d')}</Button>
        </div>
      </div>
      <Model3DViewerModal
        isOpen={is3D}
        onClose={() => setIs3D(false)}
        modelTitle={t(`projects.modal_items.${curr.key}.title`)}
        modelKey={curr.modelKey}
      />
    </div>
  );
};

// --- CUTOFF MODAL ---
export const CutOffModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [is3D, setIs3D] = useState(false);
  const curr = { image: millingImage, key: 'cutoff', modelKey: 'Milling Cutoff Machine' };

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className="project-modal-body">
          <div className="project-modal-left">
            <TransformWrapper>
              <TransformComponent>
                <LazyImage
                  src={curr.image}
                  className="project-modal-main-image project-modal-zoomable-image"
                  alt="project"
                  loading="eager"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="project-modal-right">
            <h2 className="project-modal-title">{t(`projects.modal_items.${curr.key}.title`)}</h2>
            <p className="project-modal-category">{t(`projects.modal_items.${curr.key}.category`)}</p>
            <div className="project-modal-section">
              <h3 className="project-modal-section-title">{t('projects.modal.labels.desc')}</h3>
              <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.description`)}</p>
            </div>
            {t(`projects.modal_items.${curr.key}.application`) && (
              <div className="project-modal-section">
                <h3 className="project-modal-section-title">{t('projects.modal.labels.app')}</h3>
                <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.application`)}</p>
              </div>
            )}
          </div>
        </div>
        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails">
            <button className="project-modal-thumbnail active">
              <LazyImage src={curr.image} className="project-modal-thumbnail-image" alt="thumb" />
            </button>
          </div>
          <Button variant="style1" onClick={() => setIs3D(true)}>{t('projects.modal.view_3d')}</Button>
        </div>
      </div>
      <Model3DViewerModal
        isOpen={is3D}
        onClose={() => setIs3D(false)}
        modelTitle={t(`projects.modal_items.${curr.key}.title`)}
        modelKey={curr.modelKey}
      />
    </div>
  );
};

// --- FURNACE MODAL ---
export const FurnaceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [is3D, setIs3D] = useState(false);
  const curr = { image: furnaceImage, key: 'furnace', modelKey: 'Furnace' };

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>×</button>
        <div className="project-modal-body">
          <div className="project-modal-left">
            <TransformWrapper>
              <TransformComponent>
                <LazyImage
                  src={curr.image}
                  className="project-modal-main-image"
                  alt="project"
                  style={{ cursor: 'grab' }}
                  loading="eager"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="project-modal-right">
            <h2 className="project-modal-title">{t(`projects.modal_items.${curr.key}.title`)}</h2>
            <p className="project-modal-category">{t(`projects.modal_items.${curr.key}.category`)}</p>
            <div className="project-modal-section">
              <h3 className="project-modal-section-title">{t('projects.modal.labels.desc')}</h3>
              <p className="project-modal-section-text">{t(`projects.modal_items.${curr.key}.description`)}</p>
            </div>
          </div>
        </div>
        <div className="project-modal-thumbnails-section">
          <div className="project-modal-thumbnails">
            <button className="project-modal-thumbnail active">
              <LazyImage src={curr.image} className="project-modal-thumbnail-image" alt="thumb" />
            </button>
          </div>
          <Button variant="style1" onClick={() => setIs3D(true)}>{t('projects.modal.view_3d')}</Button>
        </div>
      </div>
      <Model3DViewerModal
        isOpen={is3D}
        onClose={() => setIs3D(false)}
        modelTitle={t(`projects.modal_items.${curr.key}.title`)}
        modelKey={curr.modelKey}
      />
    </div>
  );
};

export default ServiceModal;
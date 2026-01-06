import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Added for translation
import './Projects.css';
import { ProjectsPageProps } from './Projects.types';
import Button from '../../components/ui/Button/Button';
import projectBg from '../../assets/projectbg.jpg';
import { ProjectsCard } from '../../components/ui/Card/Card';
import { ProjectModal, LooperModal, FormingModal, StripEntryModal, TransferTableLineModal, FinishingLineModal, CutOffModal, FurnaceModal } from '../../components/ui/Modal/Modal';

// Images
import dedemplerImage from '../../assets/image3D/dedempler.png';
import looperImage from '../../assets/image3D/looper.png';
import formingImage from '../../assets/image3D/forming.png';
import shearImage from '../../assets/image3D/shear.png';
import finishingImage from '../../assets/image3D/finishing.png';
import finishingLineImage from '../../assets/image3D/finishingLine.png';
import millingImage from '../../assets/image3D/milling.png';
import furnaceImage from '../../assets/image3D/furnace.png';

const Projects: React.FC<ProjectsPageProps> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation hook
  const [searchParams, setSearchParams] = useSearchParams();

  // Modal states 
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isLooperModalOpen, setIsLooperModalOpen] = useState(false);
  const [isFormingModalOpen, setIsFormingModalOpen] = useState(false);
  const [isStripEntryModalOpen, setIsStripEntryModalOpen] = useState(false);
  const [isTransferTableLineModalOpen, setIsTransferTableLineModalOpen] = useState(false);
  const [isFinishingLineModalOpen, setIsFinishingLineModalOpen] = useState(false);
  const [isCutOffModalOpen, setIsCutOffModalOpen] = useState(false);
  const [isFurnaceModalOpen, setIsFurnaceModalOpen] = useState(false);
  const hasCheckedUrlParams = useRef(false);

  // Handle query parameters to open modals 
  useEffect(() => {
    const projectParam = searchParams.get('project');
    if (projectParam && !hasCheckedUrlParams.current) {
      const projectMap: { [key: string]: () => void } = {
        'dedimpler-and-facer': () => setIsProjectModalOpen(true),
        'looper-machine': () => setIsLooperModalOpen(true),
        'forming-and-sizing': () => setIsFormingModalOpen(true),
        'shear-welder-machine': () => setIsStripEntryModalOpen(true),
        'finishing-table': () => setIsTransferTableLineModalOpen(true),
        'finishing-line': () => setIsFinishingLineModalOpen(true),
        'milling-cutoff-machine': () => setIsCutOffModalOpen(true),
        'furnace': () => setIsFurnaceModalOpen(true),
      };

      const openModal = projectMap[projectParam];
      if (openModal) {
        openModal();
        hasCheckedUrlParams.current = true;
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, setSearchParams]);

  // Project data mapped to translation keys
  const projects = [
    {
      id: 1,
      internalTitle: 'DEDIMPLER & FACER',
      title: t('home.projects.items.dedimpler.title'),
      description: t('home.projects.items.dedimpler.desc'),
      category: t('home.projects.items.dedimpler.cat'),
      image: dedemplerImage,
      link: '#',
    },
    {
      id: 2,
      internalTitle: 'LOOPER MACHINE',
      title: t('home.projects.items.looper.title'),
      description: t('home.projects.items.looper.desc'),
      category: t('home.projects.items.looper.cat'),
      image: looperImage,
      link: '#',
    },
    {
      id: 3,
      internalTitle: 'FORMING AND SIZING MACHINE',
      title: t('home.projects.items.forming.title'),
      description: t('home.projects.items.forming.desc'),
      category: t('home.projects.items.forming.cat'),
      image: formingImage,
      link: '#',
    },
    {
      id: 4,
      internalTitle: 'SHEAR WELDER MACHINE',
      title: t('home.projects.items.shear.title'),
      description: t('home.projects.items.shear.desc'),
      category: t('home.projects.items.shear.cat'),
      image: shearImage,
      link: '#',
    },
    {
      id: 5,
      internalTitle: 'FINISHING TABLE',
      title: t('home.projects.items.table.title'),
      description: t('home.projects.items.table.desc'),
      category: t('home.projects.items.table.cat'),
      image: finishingImage,
      link: '#',
    },
    {
      id: 6,
      internalTitle: 'FINISHING LINE',
      title: t('home.projects.items.line.title'),
      description: t('home.projects.items.line.desc'),
      category: t('home.projects.items.line.cat'),
      image: finishingLineImage,
      link: '#',
    },
    {
      id: 7,
      internalTitle: 'MILLING CUTOFF MACHINE',
      title: t('home.projects.items.milling.title'),
      description: t('home.projects.items.milling.desc'),
      category: t('home.projects.items.milling.cat'),
      image: millingImage,
      link: '#',
    },
    {
      id: 8,
      internalTitle: 'FURNACE',
      title: t('home.projects.items.furnace.title'),
      description: t('home.projects.items.furnace.desc'),
      category: t('home.projects.items.furnace.cat'),
      image: furnaceImage,
      link: '#',
    },
  ];

  return (
    <div className="projects-page">
      <section className="projects-hero" style={{ '--project-bg-image': `url(${projectBg})` } as React.CSSProperties}>
        <div className="projects-hero-overlay"></div>
        <div className="projects-hero-container container">
          <h1 className="projects-title">{t('projects.hero.title')}</h1>
          <p className="projects-subtitle">{t('projects.hero.subtitle')}</p>
        </div>
      </section>

      <div className="projects-grid-section" data-aos="fade-up">
        <div className="projects-grid-container container">
          <p className="projects-grid-description">{t('projects.grid.description')}</p>
          <div className="projects-card-grid">
            {projects.map((project) => (
              <ProjectsCard
                key={project.id}
                image={project.image}
                title={project.title}
                subtitle={project.description}
                category={project.category}
                linkText={t('common.view_more')}
                linkHref={project.link}
                onClick={
                  project.internalTitle === 'DEDIMPLER & FACER'
                    ? () => setIsProjectModalOpen(true)
                    : project.internalTitle === 'LOOPER MACHINE'
                      ? () => setIsLooperModalOpen(true)
                      : project.internalTitle === 'FORMING AND SIZING MACHINE'
                        ? () => setIsFormingModalOpen(true)
                        : project.internalTitle === 'SHEAR WELDER MACHINE'
                          ? () => setIsStripEntryModalOpen(true)
                          : project.internalTitle === 'FINISHING TABLE'
                            ? () => setIsTransferTableLineModalOpen(true)
                            : project.internalTitle === 'FINISHING LINE'
                              ? () => setIsFinishingLineModalOpen(true)
                              : project.internalTitle === 'MILLING CUTOFF MACHINE'
                                ? () => setIsCutOffModalOpen(true)
                                : project.internalTitle === 'FURNACE'
                                  ? () => setIsFurnaceModalOpen(true)
                                  : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="projects-cta-section" data-aos="fade-up">
        <div className="projects-cta-container container">
          <h2 className="projects-cta-title">{t('projects.cta.title')}</h2>
          <div className="projects-cta-buttons">
            <Button variant="style2" onClick={() => navigate('/contact')}>{t('common.contact_us')}</Button>
          </div>
        </div>
      </div>

      {/* Modal logic preserved - ensure Modal components themselves handle internal translation if needed */}
      <ProjectModal isOpen={isProjectModalOpen} onClose={() => { setIsProjectModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <LooperModal isOpen={isLooperModalOpen} onClose={() => { setIsLooperModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <FormingModal isOpen={isFormingModalOpen} onClose={() => { setIsFormingModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <StripEntryModal isOpen={isStripEntryModalOpen} onClose={() => { setIsStripEntryModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <TransferTableLineModal isOpen={isTransferTableLineModalOpen} onClose={() => { setIsTransferTableLineModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <FinishingLineModal isOpen={isFinishingLineModalOpen} onClose={() => { setIsFinishingLineModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <CutOffModal isOpen={isCutOffModalOpen} onClose={() => { setIsCutOffModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <FurnaceModal isOpen={isFurnaceModalOpen} onClose={() => { setIsFurnaceModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
    </div>
  );
};

export default Projects;
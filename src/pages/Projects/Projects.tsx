import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Projects.css';
import { ProjectsPageProps } from './Projects.types';
import Button from '../../components/ui/Button/Button';

import { ProjectsCard } from '../../components/ui/Card/Card';
import { ProjectModal, LooperModal, FormingModal, StripEntryModal, TransferTableLineModal, FinishingLineModal, CutOffModal, FurnaceModal } from '../../components/ui/Modal/Modal';
import Model3DViewerModal from '../../components/ui/Modal/Model3DViewerModal';

import { getAssetUrl } from '../../utils/assets';

// Images
const projectBg = getAssetUrl('hero_background/projectbg.jpg');

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
const finishingImage = getAssetUrl('image3D/finishing.png');
const finishingLineImage = getAssetUrl('image3D/finishingLine.png');
const millingImage = getAssetUrl('image3D/milling.png');
const furnaceImage = getAssetUrl('image3D/furnace.png');

const Projects: React.FC<ProjectsPageProps> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter State
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Modal states 
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isLooperModalOpen, setIsLooperModalOpen] = useState(false);
  const [isFormingModalOpen, setIsFormingModalOpen] = useState(false);
  const [isStripEntryModalOpen, setIsStripEntryModalOpen] = useState(false);
  const [isTransferTableLineModalOpen, setIsTransferTableLineModalOpen] = useState(false);
  const [isFinishingLineModalOpen, setIsFinishingLineModalOpen] = useState(false);
  const [isCutOffModalOpen, setIsCutOffModalOpen] = useState(false);
  const [isFurnaceModalOpen, setIsFurnaceModalOpen] = useState(false);
  const [selectedProjectKey, setSelectedProjectKey] = useState<string | undefined>(undefined);
  const hasCheckedUrlParams = useRef(false);

  // 3D Model Viewer Modal state
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [selected3DModel, setSelected3DModel] = useState<{ title: string; key: string } | null>(null);

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
  const projects = useMemo(() => [
    {
      id: 1,
      internalTitle: 'DEDIMPLER & FACER',
      key: 'dedimpler',
      title: t('home.projects.items.dedimpler.title'),
      description: t('home.projects.items.dedimpler.desc'),
      category: t('home.projects.items.dedimpler.cat'),
      image: dedemplerImage,
      link: '#',
    },
    {
      id: 9,
      internalTitle: 'BUNDLING MACHINE',
      key: 'bundling',
      title: t('home.projects.items.bundling.title'),
      description: t('home.projects.items.bundling.desc'),
      category: t('home.projects.items.bundling.cat'),
      image: bundlingImage,
      link: '#',
    },
    {
      id: 10,
      internalTitle: 'BINDING MACHINE',
      key: 'binding',
      title: t('home.projects.items.binding.title'),
      description: t('home.projects.items.binding.desc'),
      category: t('home.projects.items.binding.cat'),
      image: bindingImage,
      link: '#',
    },
    {
      id: 2,
      internalTitle: 'LOOPER MACHINE',
      key: 'looper',
      title: t('home.projects.items.looper.title'),
      description: t('home.projects.items.looper.desc'),
      category: t('home.projects.items.looper.cat'),
      image: looperImage,
      link: '#',
    },
    {
      id: 14,
      internalTitle: 'VERTICAL LOOPER',
      key: 'vertical',
      title: t('home.projects.items.vertical.title'),
      description: t('home.projects.items.vertical.desc'),
      category: t('home.projects.items.vertical.cat'),
      image: verticalLooperImage,
      link: '#',
    },
    {
      id: 11,
      internalTitle: 'HORIZONTAL LOOPER MACHINE',
      key: 'horizontal',
      title: t('home.projects.items.horizontal.title'),
      description: t('home.projects.items.horizontal.desc'),
      category: t('home.projects.items.horizontal.cat'),
      image: horizontalLooperImage,
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
      key: 'shear',
      title: t('home.projects.items.shear.title'),
      description: t('home.projects.items.shear.desc'),
      category: t('home.projects.items.shear.cat'),
      image: shearImage,
      link: '#',
    },
    {
      id: 12,
      internalTitle: 'UNCOILER MACHINE',
      key: 'uncoiler',
      title: t('home.projects.items.uncoiler.title'),
      description: t('home.projects.items.uncoiler.desc'),
      category: t('home.projects.items.uncoiler.cat'),
      image: uncoilerImage,
      link: '#',
    },
    {
      id: 13,
      internalTitle: 'LEVELER MACHINE',
      key: 'leveler',
      title: t('home.projects.items.leveler.title'),
      description: t('home.projects.items.leveler.desc'),
      category: t('home.projects.items.leveler.cat'),
      image: levelerImage,
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
  ], [t]);

  // Randomized projects list (memoized to prevent reshuffling on every render)
  const shuffledProjects = useMemo(() => {
    return [...projects].sort(() => Math.random() - 0.5);
  }, [projects]);

  // Logic for filtering
  const categories = ['ALL', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = activeFilter === 'ALL'
    ? shuffledProjects
    : shuffledProjects.filter(p => p.category === activeFilter);

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div className="hero-bg-custom" style={{ backgroundImage: `url(${projectBg})` }}></div>
        <div className="projects-hero-overlay"></div>
        <div className="projects-hero-container container">
          <h1 className="projects-title">{t('projects.hero.title')}</h1>
          <p className="projects-subtitle">{t('projects.hero.subtitle')}</p>
        </div>
      </section>

      <div className="projects-grid-section" data-aos="fade-up">
        <div className="projects-grid-container container">
          <p className="projects-grid-description">{t('projects.grid.description')}</p>

          {/* Filter Tabs */}
          <div className="projects-filter-tabs">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`projects-filter-tab ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="projects-card-grid">
            {filteredProjects.map((project) => (
              <ProjectsCard
                key={project.id}
                image={project.image}
                title={project.title}
                subtitle={project.description}
                category={project.category}
                linkText={t('common.view_more')}
                linkHref={project.link}
                onImageClick={() => {
                  setSelected3DModel({
                    title: project.title,
                    key: project.internalTitle
                  });
                  setIs3DViewerOpen(true);
                }}
                onClick={
                  ['DEDIMPLER & FACER', 'BUNDLING MACHINE', 'BINDING MACHINE'].includes(project.internalTitle)
                    ? () => { setSelectedProjectKey('key' in project ? project.key : undefined); setIsProjectModalOpen(true); }
                    : ['LOOPER MACHINE', 'HORIZONTAL LOOPER MACHINE', 'VERTICAL LOOPER'].includes(project.internalTitle)
                      ? () => { setSelectedProjectKey('key' in project ? project.key : undefined); setIsLooperModalOpen(true); }
                      : project.internalTitle === 'FORMING AND SIZING MACHINE'
                        ? () => setIsFormingModalOpen(true)
                        : ['SHEAR WELDER MACHINE', 'UNCOILER MACHINE', 'LEVELER MACHINE'].includes(project.internalTitle)
                          ? () => { setSelectedProjectKey('key' in project ? project.key : undefined); setIsStripEntryModalOpen(true); }
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

      <ProjectModal isOpen={isProjectModalOpen} initialProjectKey={selectedProjectKey} onClose={() => { setIsProjectModalOpen(false); setSelectedProjectKey(undefined); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <LooperModal isOpen={isLooperModalOpen} initialProjectKey={selectedProjectKey} onClose={() => { setIsLooperModalOpen(false); setSelectedProjectKey(undefined); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <FormingModal isOpen={isFormingModalOpen} onClose={() => { setIsFormingModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <StripEntryModal isOpen={isStripEntryModalOpen} initialProjectKey={selectedProjectKey} onClose={() => { setIsStripEntryModalOpen(false); setSelectedProjectKey(undefined); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <TransferTableLineModal isOpen={isTransferTableLineModalOpen} onClose={() => { setIsTransferTableLineModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <FinishingLineModal isOpen={isFinishingLineModalOpen} onClose={() => { setIsFinishingLineModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <CutOffModal isOpen={isCutOffModalOpen} onClose={() => { setIsCutOffModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />
      <FurnaceModal isOpen={isFurnaceModalOpen} onClose={() => { setIsFurnaceModalOpen(false); hasCheckedUrlParams.current = false; setSearchParams({}, { replace: true }); }} />

      {/* 3D Model Viewer Modal */}
      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={() => {
          setIs3DViewerOpen(false);
          setSelected3DModel(null);
        }}
        modelTitle={selected3DModel?.title || ''}
        modelKey={selected3DModel?.key || ''}
      />
    </div>
  );
};

export default Projects;
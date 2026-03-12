import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import './Projects.css';
import type { ProjectsPageProps } from './Projects.types';
import Button from '../../components/ui/Button/Button';
import { useProjectModals } from '../../hooks/useProjectModals';

import { ProjectsCard } from '../../components/ui/Card/Card';
import { ProjectModal, LooperModal, FormingModal, StripEntryModal, TransferTableLineModal, FinishingLineModal, CutOffModal, FurnaceModal } from '../../components/ui/Modal/Modal';
import Model3DViewerModal from '../../components/ui/Modal/Model3DViewerModal';
import SEO from '../../components/common/SEO';

import { getAssetUrl } from '../../utils/assets';

// Images
const projectBg = getAssetUrl('hero_background/projectbg.webp');

const dedemplerImage = getAssetUrl('image3D/dedempler.webp');
const bundlingImage = getAssetUrl('image3D/bundling.webp');
const bindingImage = getAssetUrl('image3D/binding.webp');
const looperImage = getAssetUrl('image3D/looper.webp');
const verticalLooperImage = getAssetUrl('image3D/vertical-looper.webp');
const horizontalLooperImage = getAssetUrl('image3D/horizontal-looper.webp');
const formingImage = getAssetUrl('image3D/forming.webp');
const shearImage = getAssetUrl('image3D/shear.webp');
const uncoilerImage = getAssetUrl('image3D/uncoiler.webp');
const levelerImage = getAssetUrl('image3D/leveler.webp');
const finishingImage = getAssetUrl('image3D/finishing.webp');
const finishingLineImage = getAssetUrl('image3D/finishingLine.webp');
const millingImage = getAssetUrl('image3D/milling.webp');
const furnaceImage = getAssetUrl('image3D/furnace.webp');

interface ProjectItem {
  id: number;
  internalTitle: string;
  key?: string;
  title: string;
  description: string;
  category: string;
  categoryKey: string;
  image: string;
  link: string;
}

const Projects: React.FC<ProjectsPageProps> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Filter State
  const [activeCategoryKey, setActiveCategoryKey] = useState('ALL');

  // Custom hook for modal management
  const {
    isProjectModalOpen, setIsProjectModalOpen,
    isLooperModalOpen, setIsLooperModalOpen,
    isFormingModalOpen, setIsFormingModalOpen,
    isStripEntryModalOpen, setIsStripEntryModalOpen,
    isTransferTableLineModalOpen, setIsTransferTableLineModalOpen,
    isFinishingLineModalOpen, setIsFinishingLineModalOpen,
    isCutOffModalOpen, setIsCutOffModalOpen,
    isFurnaceModalOpen, setIsFurnaceModalOpen,
    selectedProjectKey, setSelectedProjectKey,
    is3DViewerOpen, setIs3DViewerOpen,
    selected3DModel, setSelected3DModel,
    closeModals,
    close3DViewer
  } = useProjectModals();


  // Project data mapped to translation keys
  const projects = useMemo<ProjectItem[]>(() => [
    {
      id: 1,
      internalTitle: 'DEDIMPLER & FACER',
      key: 'dedimpler',
      title: t('home.projects.items.dedimpler.title'),
      description: t('home.projects.items.dedimpler.desc'),
      category: t('home.projects.items.dedimpler.cat'),
      categoryKey: 'finishing_equipment',
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
      categoryKey: 'finishing_equipment',
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
      categoryKey: 'finishing_equipment',
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
      categoryKey: 'looper',
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
      categoryKey: 'looper',
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
      categoryKey: 'looper',
      image: horizontalLooperImage,
      link: '#',
    },
    {
      id: 3,
      internalTitle: 'FORMING AND SIZING MACHINE',
      title: t('home.projects.items.forming.title'),
      description: t('home.projects.items.forming.desc'),
      category: t('home.projects.items.forming.cat'),
      categoryKey: 'forming',
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
      categoryKey: 'strip_entry',
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
      categoryKey: 'strip_entry',
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
      categoryKey: 'strip_entry',
      image: levelerImage,
      link: '#',
    },
    {
      id: 5,
      internalTitle: 'FINISHING TABLE',
      title: t('home.projects.items.table.title'),
      description: t('home.projects.items.table.desc'),
      category: t('home.projects.items.table.cat'),
      categoryKey: 'transfer_table_line',
      image: finishingImage,
      link: '#',
    },
    {
      id: 6,
      internalTitle: 'FINISHING LINE',
      title: t('home.projects.items.line.title'),
      description: t('home.projects.items.line.desc'),
      category: t('home.projects.items.line.cat'),
      categoryKey: 'finishing_line',
      image: finishingLineImage,
      link: '#',
    },
    {
      id: 7,
      internalTitle: 'MILLING CUTOFF MACHINE',
      title: t('home.projects.items.milling.title'),
      description: t('home.projects.items.milling.desc'),
      category: t('home.projects.items.milling.cat'),
      categoryKey: 'cut_off',
      image: millingImage,
      link: '#',
    },
    {
      id: 8,
      internalTitle: 'FURNACE',
      title: t('home.projects.items.furnace.title'),
      description: t('home.projects.items.furnace.desc'),
      category: t('home.projects.items.furnace.cat'),
      categoryKey: 'furnace',
      image: furnaceImage,
      link: '#',
    },
  ], [t]);

  // Randomized projects list (memoized to prevent reshuffling on every render)
  const shuffledProjects = useMemo(() => {
    return [...projects].sort(() => Math.random() - 0.5);
  }, [projects]);

  // Logic for filtering
  // Create mapping of categoryKey -> unique category label
  const categories = useMemo(() => {
    const uniqueKeys = new Set<string>();
    const options = [{ key: 'ALL', label: 'ALL' }];

    projects.forEach(p => {
      if (!uniqueKeys.has(p.categoryKey)) {
        uniqueKeys.add(p.categoryKey);
        options.push({ key: p.categoryKey, label: p.category });
      }
    });
    return options;
  }, [projects]);

  const filteredProjects = activeCategoryKey === 'ALL'
    ? shuffledProjects
    : shuffledProjects.filter(p => p.categoryKey === activeCategoryKey);


  // Handler helper
  const handleProjectClick = (project: ProjectItem) => {
    const { internalTitle, key } = project;
    // Set selected key if available
    if (key) {
      setSelectedProjectKey(key);
    }

    // Modal Opening Logic
    if (['DEDIMPLER & FACER', 'BUNDLING MACHINE', 'BINDING MACHINE'].includes(internalTitle)) {
      setIsProjectModalOpen(true);
    } else if (['LOOPER MACHINE', 'HORIZONTAL LOOPER MACHINE', 'VERTICAL LOOPER'].includes(internalTitle)) {
      setIsLooperModalOpen(true);
    } else if (internalTitle === 'FORMING AND SIZING MACHINE') {
      setIsFormingModalOpen(true);
    } else if (['SHEAR WELDER MACHINE', 'UNCOILER MACHINE', 'LEVELER MACHINE'].includes(internalTitle)) {
      setIsStripEntryModalOpen(true);
    } else if (internalTitle === 'FINISHING TABLE') {
      setIsTransferTableLineModalOpen(true);
    } else if (internalTitle === 'FINISHING LINE') {
      setIsFinishingLineModalOpen(true);
    } else if (internalTitle === 'MILLING CUTOFF MACHINE') {
      setIsCutOffModalOpen(true);
    } else if (internalTitle === 'FURNACE') {
      setIsFurnaceModalOpen(true);
    }
  };

  return (
    <div className="projects-page">
      <SEO 
        title={t('nav.projects')} 
        description={t('projects.hero.subtitle')} 
      />
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
          <p className="projects-grid-description">
            <Trans
              i18nKey="projects.grid.description"
              components={{ br: <br /> }}
            />
          </p>

          {/* Filter Dropdown */}
          <div className="projects-filter-wrapper">
            <select
              className="projects-filter-dropdown"
              value={activeCategoryKey}
              onChange={(e) => setActiveCategoryKey(e.target.value)}
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
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
                onClick={() => handleProjectClick(project)}
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

      <ProjectModal isOpen={isProjectModalOpen} initialProjectKey={selectedProjectKey} onClose={closeModals} />
      <LooperModal isOpen={isLooperModalOpen} initialProjectKey={selectedProjectKey} onClose={closeModals} />
      <FormingModal isOpen={isFormingModalOpen} onClose={closeModals} />
      <StripEntryModal isOpen={isStripEntryModalOpen} initialProjectKey={selectedProjectKey} onClose={closeModals} />
      <TransferTableLineModal isOpen={isTransferTableLineModalOpen} onClose={closeModals} />
      <FinishingLineModal isOpen={isFinishingLineModalOpen} onClose={closeModals} />
      <CutOffModal isOpen={isCutOffModalOpen} onClose={closeModals} />
      <FurnaceModal isOpen={isFurnaceModalOpen} onClose={closeModals} />

      {/* 3D Model Viewer Modal */}
      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={close3DViewer}
        modelTitle={selected3DModel?.title || ''}
        modelKey={selected3DModel?.key || ''}
      />
    </div>
  );
};

export default Projects;

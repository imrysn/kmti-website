import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import './Projects.css';
import '../../styles/BackgroundShapes.css'; // Global CSS for Background Animated Shape
import type { ProjectsPageProps } from './Projects.types';
import Button from '../../components/ui/Button/Button';
import { useProjectModals } from '../../hooks/useProjectModals';

import { ProjectsCard } from '../../components/ui/Card/Card';
import { ProjectModal, LooperModal, FormingModal, StripEntryModal, TransferTableLineModal, FinishingLineModal, CutOffModal, FurnaceModal, PipingModal} from '../../components/ui/Modal/Modal';
import Model3DViewerModal from '../../components/ui/Modal/Model3DViewerModal';
import SEO from '../../components/common/SEO';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { getAssetUrl } from '../../utils/assets';

import Pagination from '../../components/ui/Pagination/Pagination'; // Pagination Component


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
const airpipingImage = getAssetUrl('image3D/airpiping.webp');
const airpiping1Image = getAssetUrl('image3D/airpiping_1.webp');
const hydraulic_pipingImage = getAssetUrl('image3D/hydraulic_piping.webp');
const hydraulic_piping1Image = getAssetUrl('image3D/hydraulic_piping_1.webp');

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

const BackgroundShapes: React.FC = () => (
  <> {/* Bottom Shapes */}
    <ul className="shapes-container" aria-hidden="true">
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
    </ul>
    {/* Top Shapes */}
    <ul className="shapes-container-top" aria-hidden="true">
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
    </ul>
  </>
);

// --- 3D Gear Component ---
const FloatingGear: React.FC<{ position: [number, number, number], scale?: number, speed?: number }> = ({ position, scale = 1, speed = 0.2 }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const gearShape = React.useMemo(() => {
    const shape = new THREE.Shape();
    const teeth = 12;
    const rOuter = 3.2;
    const rInner = 2.3;
    const holeRadius = 1;

    // Start at inner radius (angle 0)
    shape.moveTo(rInner, 0);

    for (let i = 0; i < teeth; i++) {
      const theta = (Math.PI * 2 * i) / teeth;
      const step = (Math.PI * 2) / teeth;

      // Create a trapezoidal tooth profile (Cog shape)
      const aRise = theta + step * 0.15; // Start of rise
      const aTop = theta + step * 0.35;  // End of flat top
      const aFall = theta + step * 0.50; // End of fall
      const aNext = theta + step;        // End of valley

      shape.lineTo(Math.cos(aRise) * rOuter, Math.sin(aRise) * rOuter); // Rise to outer
      shape.lineTo(Math.cos(aTop) * rOuter, Math.sin(aTop) * rOuter);   // Move along outer
      shape.lineTo(Math.cos(aFall) * rInner, Math.sin(aFall) * rInner); // Fall to inner
      shape.lineTo(Math.cos(aNext) * rInner, Math.sin(aNext) * rInner); // Move along inner
    }
    shape.closePath();

    const hole = new THREE.Path();
    hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
    shape.holes.push(hole);

    return shape;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * speed; // Custom rotation speed
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2; // Slight tilt
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <extrudeGeometry args={[gearShape, { depth: 0.8, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 }]} />
      <meshStandardMaterial color="#51A2FF" metalness={0.7} roughness={0.3} opacity={0.15} transparent={true} />
    </mesh>
  );
};

const Projects: React.FC<ProjectsPageProps> = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const tEn = i18n.getFixedT('en');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isPipingModalOpen, setIsPipingModalOpen] = useState(false);

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

   useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when category changes
  }, [activeCategoryKey]);

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
    {
      id: 15,
      internalTitle: 'AIR PIPING',
      key: 'air_piping',
      title: t('home.projects.items.air_piping.title'),
      description: t('home.projects.items.air_piping.desc'),
      category: t('home.projects.items.air_piping.cat'),
      categoryKey: 'piping',
      image: airpipingImage,
      link: '#',
    },
    {
      id: 16,
      internalTitle: 'AIR PIPING 1',
      key: 'air_piping_1',
      title: t('home.projects.items.air_piping_1.title'),
      description: t('home.projects.items.air_piping_1.desc'),
      category: t('home.projects.items.air_piping_1.cat'),
      categoryKey: 'piping',
      image: airpiping1Image,
      link: '#',
    },
    {
      id: 17,
      internalTitle: 'HYDRAULIC PIPING',
      key: 'hydraulic_piping',
      title: t('home.projects.items.hydraulic_piping.title'),
      description: t('home.projects.items.hydraulic_piping.desc'),
      category: t('home.projects.items.hydraulic_piping.cat'),
      categoryKey: 'piping',
      image: hydraulic_pipingImage,
      link: '#',
    },
    {
      id: 18,
      internalTitle: 'HYDRAULIC PIPING 1',
      key: 'hydraulic_piping_1',
      title: t('home.projects.items.hydraulic_piping_1.title'),
      description: t('home.projects.items.hydraulic_piping_1.desc'), category: t('home.projects.items.hydraulic_piping_1.cat'), categoryKey: 'piping', image: hydraulic_piping1Image, link: '#',
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

  
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

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
  } else if (['AIR PIPING', 'AIR PIPING 1', 'HYDRAULIC PIPING', 'HYDRAULIC PIPING 1'].includes(internalTitle)) {
    setIsPipingModalOpen(true);
  }
};

  return (
    <div className='projects-bg-wrapper'>
      <BackgroundShapes />
        <div className="sitemap-3d-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <FloatingGear position={[8, 4, 0]} scale={0.8} speed={0.15} />
            <FloatingGear position={[-10, -5, -2]} scale={1.2} speed={-0.1} />
            <FloatingGear position={[5, -8, -5]} scale={0.6} speed={0.2} />
          </Canvas>
        </div>
    <div className="projects-page">
      <SEO 
        title={tEn('nav.projects')} 
        description={tEn('home.projects.subtitle')} 
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
            {currentProjects.map((project) => (
              <ProjectsCard
                key={project.id}
                image={project.image}
                title={project.title}
                subtitle={project.description || '\u00A0'} // logical OR and non-breaking space to prevent layout issue about empty UI elements(To keep consistent spacing).
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
      
          <Pagination // Pagination Controls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

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
      <PipingModal isOpen={isPipingModalOpen} initialProjectKey={selectedProjectKey} onClose={() => { setIsPipingModalOpen(false); closeModals(); }}  />

      {/* 3D Model Viewer Modal */}
      <Model3DViewerModal
        isOpen={is3DViewerOpen}
        onClose={close3DViewer}
        modelTitle={selected3DModel?.title || ''}
        modelKey={selected3DModel?.key || ''}
      />
    </div>
    </div>
  );
};

export default Projects;

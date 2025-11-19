import React, { useState } from 'react';
import './Projects.css';
import { ProjectsPageProps } from './Projects.types';
import projectBg from '../../assets/projectbg.jpg';
import { ProjectsCard } from '../../components/ui/Card/Card';
import { ProjectModal, LooperModal, FormingModal, StripEntryModal, TransferTableLineModal, FinishingLineModal, CutOffModal, FurnaceModal } from '../../components/ui/Modal/Modal';
import dedemplerImage from '../../assets/image3D/dedempler.png';
import looperImage from '../../assets/image3D/looper.png';
import formingImage from '../../assets/image3D/forming.png';
import shearImage from '../../assets/image3D/shear.png';
import finishingImage from '../../assets/image3D/finishing.png';
import finishingLineImage from '../../assets/image3D/finishingLine.png';
import millingImage from '../../assets/image3D/milling.png';
import furnaceImage from '../../assets/image3D/furnace.png';

const Projects: React.FC<ProjectsPageProps> = () => {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isLooperModalOpen, setIsLooperModalOpen] = useState(false);
  const [isFormingModalOpen, setIsFormingModalOpen] = useState(false);
  const [isStripEntryModalOpen, setIsStripEntryModalOpen] = useState(false);
  const [isTransferTableLineModalOpen, setIsTransferTableLineModalOpen] = useState(false);
  const [isFinishingLineModalOpen, setIsFinishingLineModalOpen] = useState(false);
  const [isCutOffModalOpen, setIsCutOffModalOpen] = useState(false);
  const [isFurnaceModalOpen, setIsFurnaceModalOpen] = useState(false);
  const projects = [
    {
      id: 1,
      title: 'DEDIMPLER AND FACER',
      description: 'Tube and pipes that require facing and or internal and external chamfering can be processed in line with the tube mill or off line.',
      category: 'FINISHING EQUIPMENT',
      image: dedemplerImage,
      link: '#',
    },
    {
      id: 2,
      title: 'LOOPER MACHINE',
      description: 'Horizontal loopers store strip on a horizontal rotary table. Where the space is available this is the most efficient and cheapest method of storing strip without causing any surface damage.',
      category: 'LOOPER',
      image: looperImage,
      link: '#',
    },
    {
      id: 3,
      title: 'FORMING AND SIZING MACHINE',
      description: 'After metal strips has been welded and combined it will undergo forming to produce the needed shape of steel.',
      category: 'FORMING',
      image: formingImage,
      link: '#',
    },
    {
      id: 4,
      title: 'SHEAR WELDER MACHINE',
      description: 'Shear and end welders crop the tail and nose of each coil. The two coil ends are then aligned and the joint welded using TIG, MIG or MAG depending on the material and thickness being welded.',
      category: 'STRIP ENTRY',
      image: shearImage,
      link: '#',
    },
    {
      id: 5,
      title: 'FINISHING TABLE',
      description: 'Extension of transfer table in the finishing line.',
      category: 'TRANSFER TABLE LINE',
      image: finishingImage,
      link: '#',
    },
    {
      id: 6,
      title: 'FINISHING LINE',
      description: 'After pipes were cut into standard lengths it will be passed to the finishing line to be arranged and bundled ready for distribution.',
      category: 'FINISHING LINE',
      image: finishingLineImage,
      link: '#',
    },
    {
      id: 7,
      title: 'MILLING CUTOFF MACHINE',
      description: 'Milling Cutoff Machine uses two milling saws to cut to length pipe and structural section tubes. The cut finishes eliminates the need for facing.',
      category: 'CUT OFF',
      image: millingImage,
      link: '#',
    },
    {
      id: 8,
      title: 'FURNACE',
      description: 'Furnace is used for melting large batches of glass, in which heat is supplied by a flame playing over the glass surface, and regenerative heating of combustion air.',
      category: 'FURNACE',
      image: furnaceImage,
      link: '#',
    },
  ];

  return (
    <div className="projects-page">
      <section className="projects-hero" style={{ '--project-bg-image': `url(${projectBg})` } as React.CSSProperties}>
        <div className="projects-hero-overlay"></div>
        <div className="projects-hero-container container">
          <h1 className="projects-title">Our Projects</h1>
          <p className="projects-subtitle">
            Explore our latest 3D models — designed with precision, innovation, and functionality.
          </p>
        </div>
      </section>

      <section className="projects-grid-section">
        <div className="projects-grid-container container">
          <div className="projects-card-grid">
            {projects.map((project) => (
              <ProjectsCard
                key={project.id}
                image={project.image}
                title={project.title}
                subtitle={project.description}
                category={project.category}
                linkText="VIEW MORE"
                linkHref={project.link}
                onClick={
                  project.title === 'DEDIMPLER AND FACER'
                    ? () => setIsProjectModalOpen(true)
                    : project.title === 'LOOPER MACHINE'
                      ? () => setIsLooperModalOpen(true)
                      : project.title === 'FORMING AND SIZING MACHINE'
                        ? () => setIsFormingModalOpen(true)
                        : project.title === 'SHEAR WELDER MACHINE'
                          ? () => setIsStripEntryModalOpen(true)
                          : project.title === 'FINISHING TABLE'
                            ? () => setIsTransferTableLineModalOpen(true)
                            : project.title === 'FINISHING LINE'
                              ? () => setIsFinishingLineModalOpen(true)
                              : project.title === 'MILLING CUTOFF MACHINE'
                                ? () => setIsCutOffModalOpen(true)
                                : project.title === 'FURNACE'
                                  ? () => setIsFurnaceModalOpen(true)
                                  : undefined
                }
              />
            ))}
          </div>
        </div>
      </section>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <LooperModal
        isOpen={isLooperModalOpen}
        onClose={() => setIsLooperModalOpen(false)}
      />

      <FormingModal
        isOpen={isFormingModalOpen}
        onClose={() => setIsFormingModalOpen(false)}
      />

      <StripEntryModal
        isOpen={isStripEntryModalOpen}
        onClose={() => setIsStripEntryModalOpen(false)}
      />

      <TransferTableLineModal
        isOpen={isTransferTableLineModalOpen}
        onClose={() => setIsTransferTableLineModalOpen(false)}
      />

      <FinishingLineModal
        isOpen={isFinishingLineModalOpen}
        onClose={() => setIsFinishingLineModalOpen(false)}
      />

      <CutOffModal
        isOpen={isCutOffModalOpen}
        onClose={() => setIsCutOffModalOpen(false)}
      />

      <FurnaceModal
        isOpen={isFurnaceModalOpen}
        onClose={() => setIsFurnaceModalOpen(false)}
      />
    </div>
  );
};

export default Projects;
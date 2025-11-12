import React from 'react';
import './Projects.css';
import { ProjectsPageProps } from './Projects.types';
import projectBg from '../../assets/projectbg.jpg';
import { ProjectsCard } from '../../components/ui/Card/ProjectsCard';
import dedemplerImage from '../../assets/image3D/dedempler.png';
import looperImage from '../../assets/image3D/looper.png';
import formingImage from '../../assets/image3D/forming.png';
import shearImage from '../../assets/image3D/shear.png';
import finishingImage from '../../assets/image3D/finishing.png';
import finishingLineImage from '../../assets/image3D/finishingLine.png';
import millingImage from '../../assets/image3D/milling.png';
import furnaceImage from '../../assets/image3D/furnace.png';

const Projects: React.FC<ProjectsPageProps> = () => {
  const projects = [
    {
      id: 1,
      title: 'DEDEMPLER AND FACER',
      description: 'Tube and pipes that require facing and or internal and external chamfering can be processed in line with the tube mill or off line.',
      category: 'MECHANICAL TUBE',
      image: dedemplerImage,
      link: '#',
    },
    {
      id: 2,
      title: 'LOOPER MACHINE',
      description: 'Horizontal loopers store strip on a horizontal rotary table. Where the space is available this is the most efficient and cheapest method of storing strip without causing any surface damage.',
      category: 'MECHANICAL TUBE',
      image: looperImage,
      link: '#',
    },
    {
      id: 3,
      title: 'FORMING AND SIZING MACHINE',
      description: 'After metal strips has been welded and combined it will undergo forming to produce the needed shape of steel.',
      category: 'MECHANICAL TUBE',
      image: formingImage,
      link: '#',
    },
    {
      id: 4,
      title: 'SHEAR WELDER MACHINE',
      description: 'Shear and end welders crop the tail and nose of each coil. The two coil ends are then aligned and the joint welded using TIG, MIG or MAG depending on the material and thickness being welded.',
      category: 'MECHANICAL TUBE',
      image: shearImage,
      link: '#',
    },
    {
      id: 5,
      title: 'FINISHING TABLE',
      description: 'Extension of transfer table in the finishing line.',
      category: 'FINISHING TABLE',
      image: finishingImage,
      link: '#',
    },
    {
      id: 6,
      title: 'FINISHING LINE',
      description: 'After pipes were cut into standard lengths it will be passed to the finishing line to be arranged and bundled ready for distribution.',
      category: 'Run out',
      image: finishingLineImage,
      link: '#',
    },
    {
      id: 7,
      title: 'MILLING CUTOFF MACHINE',
      description: 'Milling Cutoff Machine uses two milling saws to cut to length pipe and structural section tubes. The cut finishes eliminates the need for facing.',
      category: 'MECHANICAL TUBE',
      image: millingImage,
      link: '#',
    },
    {
      id: 8,
      title: 'FURNACE',
      description: 'Furnace is used for melting large batches of glass, in which heat is supplied by a flame playing over the glass surface, and regenerative heating of combustion air.',
      category: 'STRUCTURAL',
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
                linkText="VIEW IN 3D"
                linkHref={project.link}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
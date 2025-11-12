import React from 'react';
import './Card.css';

interface ProjectsCardProps {
  image: string;
  title: string;
  subtitle: string;
  category?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
  onClick?: () => void;
}

export const ProjectsCard: React.FC<ProjectsCardProps> = ({
  image,
  title,
  subtitle,
  category,
  linkText = 'VIEW IN 3D',
  linkHref = '#',
  className = '',
  onClick,
}) => {
  return (
    <div className={`projects-card ${className}`} onClick={onClick}>
      {category && <div className="projects-card-label">{category}</div>}
      <div className="projects-card-image-container">
        <img
          src={image}
          alt={title}
          className="projects-card-image"
        />
      </div>
      <h3 className="projects-card-title">{title}</h3>
      <p className="projects-card-subtitle">{subtitle}</p>
      <a href={linkHref} className="projects-card-link">
        {linkText}
      </a>
    </div>
  );
};

export default ProjectsCard;


import React from 'react';
import './Card.css';

const isImageIcon = (icon: string | React.ReactNode): icon is string => {
  return typeof icon === 'string' &&
    (icon.includes('.png') || icon.includes('.jpg') || icon.includes('.jpeg') ||
      icon.includes('.svg') || icon.includes('.gif') || icon.includes('.webp') ||
      icon.startsWith('/') || icon.startsWith('http') || icon.startsWith('data:'));
};

interface CardProps {
  icon?: string | React.ReactNode;
  title: string;
  subtitle: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  icon,
  title,
  subtitle,
  linkText,
  linkHref,
  className = '',
  onClick,
}) => {
  return (
    <div className={`why-choose-card ${className}`} onClick={onClick}>
      {icon && (
        <div className="why-choose-card-icon-container">
          {isImageIcon(icon) ? (
            <img src={icon} alt={title} className="why-choose-card-icon-image" />
          ) : (
            <div className="why-choose-card-icon">{icon}</div>
          )}
        </div>
      )}
      <h3 className="why-choose-card-title">{title}</h3>
      <p className="why-choose-card-subtitle">{subtitle}</p>
      {linkText && linkHref && (
        <a href={linkHref} className="why-choose-card-link">
          {linkText}
        </a>
      )}
    </div>
  );
};

interface ServiceCardProps {
  icon?: string | React.ReactNode;
  title: string;
  subtitle: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  subtitle,
  linkText,
  linkHref,
  className = '',
  onClick,
}) => {
  return (
    <div className={`service-card ${className}`} onClick={onClick}>
      {icon && (
        <div className="service-card-icon-container">
          {isImageIcon(icon) ? (
            <img src={icon} alt={title} className="service-card-icon-image" />
          ) : (
            <div className="service-card-icon">{icon}</div>
          )}
        </div>
      )}
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-subtitle">{subtitle}</p>
      {linkText && linkHref && (
        <a href={linkHref} className="service-card-link">
          {linkText}
        </a>
      )}
    </div>
  );
};

interface ProjectCardProps {
  image: string;
  title: string;
  subtitle: string;
  category?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  title,
  subtitle,
  category,
  linkText = 'VIEW THIS PROJECT',
  linkHref = '/projects',
  className = '',
  onClick,
  isActive = false,
}) => {
  return (
    <div className={`project-card-new ${className}`} onClick={onClick}>
      {category && <div className="project-card-label">{category}</div>}
      <div className="project-card-image-container">
        <img
          src={image}
          alt={title}
          className={`project-card-image ${isActive ? 'active' : ''}`}
        />
      </div>
      <h3 className="project-card-title">{title}</h3>
      <p className="project-card-subtitle">{subtitle}</p>
      <a href={linkHref} className="project-card-link">
        {linkText}
      </a>
    </div>
  );
};

interface ServicePageCardProps {
  image?: string;
  icon?: string;
  title: string;
  subtitle: string;
  className?: string;
  onClick?: () => void;
}

export const ServicePageCard: React.FC<ServicePageCardProps> = ({
  image,
  icon,
  title,
  subtitle,
  className = '',
  onClick,
}) => {
  return (
    <div className={`service-page-card ${className}`} onClick={onClick}>
      {icon && (
        <div className="service-page-card-icon-container">
          <img src={icon} alt={title} className="service-page-card-icon-image" />
        </div>
      )}
      {image && (
        <div className="service-page-card-image-container">
          <img src={image} alt={title} className="service-page-card-image" />
          <div className="service-page-card-image-overlay"></div>
          <div className="service-page-card-text-overlay">
            <h3 className="service-page-card-title">{title}</h3>
            <p className="service-page-card-subtitle">{subtitle}</p>
          </div>
        </div>
      )}
      <div className="service-pagination">
        <span className="service-pagination-dot"></span>
        <span className="service-pagination-dot active"></span>
        <span className="service-pagination-dot"></span>
      </div>
    </div>
  );
};

interface ManagementTeamCardProps {
  image: string;
  role: string;
  className?: string;
  isLarge?: boolean;
}

export const ManagementTeamCard: React.FC<ManagementTeamCardProps> = ({
  image,
  role,
  className = '',
  isLarge = false,
}) => {
  return (
    <div className={`management-team-card ${isLarge ? 'management-team-card-large' : ''} ${className}`}>
      <h3 className="management-team-card-role">{role}</h3>
      <img src={image} alt={role} className="management-team-card-image" />
    </div>
  );
};

interface RelatedCompanyCardProps {
  logo: string;
  companyName: string;
  description: string;
  className?: string;
  href?: string;
}

export const RelatedCompanyCard: React.FC<RelatedCompanyCardProps> = ({
  logo,
  companyName,
  description,
  className = '',
  href,
}) => {
  const cardContent = (
    <>
      <div className="related-company-logo-container">
        <img src={logo} alt={companyName} className="related-company-logo" />
      </div>
      <h3 className="related-company-name">{companyName}</h3>
      <p className="related-company-description">{description}</p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`related-company-card ${className}`}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div className={`related-company-card ${className}`}>
      {cardContent}
    </div>
  );
};

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

export default Card;

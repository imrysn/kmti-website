import React from 'react';
import './Card.css';

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
  // Check if icon is an image (string with image extensions or starts with / or http)
  const isImageIcon = typeof icon === 'string' &&
    (icon.includes('.png') || icon.includes('.jpg') || icon.includes('.jpeg') ||
      icon.includes('.svg') || icon.includes('.gif') || icon.includes('.webp') ||
      icon.startsWith('/') || icon.startsWith('http') || icon.startsWith('data:'));

  return (
    <div className={`why-choose-card ${className}`} onClick={onClick}>
      {icon && (
        <div className="why-choose-card-icon-container">
          {isImageIcon ? (
            <img src={icon as string} alt={title} className="why-choose-card-icon-image" />
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
  // Check if icon is an image (string with image extensions or starts with / or http)
  const isImageIcon = typeof icon === 'string' &&
    (icon.includes('.png') || icon.includes('.jpg') || icon.includes('.jpeg') ||
      icon.includes('.svg') || icon.includes('.gif') || icon.includes('.webp') ||
      icon.startsWith('/') || icon.startsWith('http') || icon.startsWith('data:'));

  return (
    <div className={`service-card ${className}`} onClick={onClick}>
      {icon && (
        <div className="service-card-icon-container">
          {isImageIcon ? (
            <img src={icon as string} alt={title} className="service-card-icon-image" />
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

export default Card;

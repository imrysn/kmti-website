import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';
import { ServicesPageProps } from './Services.types';
import { ServicePageCard } from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button';
import servicesBg from '../../assets/servicesbg.png';
import icon3D from '../../assets/icons/cube.png';
import icon2D from '../../assets/icons/cubes.png';
import inspectionIcon from '../../assets/icons/parts-inspection-icon.png';
import assemblyIcon from '../../assets/icons/machine-assembly-icon.png';
import image3D from '../../assets/servicePage/3DImage.png';
import image2D from '../../assets/servicePage/2DImage.png';
import inspectionImage from '../../assets/servicePage/inspectionImage.png';
import assemblyImage from '../../assets/servicePage/assemblyImage.png';

const Services: React.FC<ServicesPageProps> = () => {
  const navigate = useNavigate();
  const servicesGridRef = useRef<HTMLDivElement>(null);

  const scrollToServicesGrid = () => {
    servicesGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToContact = () => {
    navigate('/contact');
  };

  const services = [
    {
      id: 1,
      title: '3D Modeling',
      description: 'We create detailed 3D models for high-precision engineering and visualization, ensuring accurate fabrication and assembly.',
      icon: icon3D,
      image: image3D,
    },
    {
      id: 2,
      title: '2D Detailing',
      description: 'Our 2D detailing services convert 3D models into precise drawings ready for manufacturing and quality checks.',
      icon: icon2D,
      image: image2D,
    },
    {
      id: 3,
      title: 'Parts inspection',
      description: 'We perform parts inspection using precise measuring tools and 3D scanners to guarantee dimensional accuracy.',
      icon: inspectionIcon,
      image: inspectionImage,
    },
    {
      id: 4,
      title: 'Machine Assembly',
      description: 'From component integration to full machine assembly, we ensure mechanical, electrical, and pneumatic systems meet industrial standards.',
      icon: assemblyIcon,
      image: assemblyImage,
    },
  ];

  const serviceTabs = ['3D MODELING', '2D DETAILING', 'PARTS INSPECTION', 'MACHINE ASSEMBLY'];

  return (
    <div className="services-page" style={{ '--services-bg-image': `url(${servicesBg})` } as React.CSSProperties}>
      <section className="services-hero">
        <div className="services-hero-overlay"></div>
        <div className="services-hero-container container">
          <div className="services-hero-content">
            <h1 className="services-title">Our Services</h1>
            <p className="services-subtitle">
              Comprehensive Engineering & Design Solutions from Concept to Assembly
            </p>
            <div className="services-hero-button">
              <Button variant="style2" onClick={scrollToServicesGrid}>EXPLORE OUR EXPERTIES</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="services-nav-section">
        <div className="services-nav-container">
          <div className="services-nav-tabs">
            <div className="services-nav-tabs-scroll">
              <div className="services-nav-tabs-content">
                {serviceTabs.map((tab, index) => (
                  <span key={`${tab}-${index}`} className="services-nav-tab-text">
                    {tab}
                  </span>
                ))}
                {serviceTabs.map((tab, index) => (
                  <span key={`${tab}-duplicate-${index}`} className="services-nav-tab-text">
                    {tab}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-grid-section" ref={servicesGridRef}>
        <div className="services-grid-container container">
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card-wrapper">
                <ServicePageCard
                  image={service.image}
                  icon={service.icon}
                  title={service.title}
                  subtitle={service.description}
                  className="service-page-card-item"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-cta-section">
        <div className="services-cta-container container">
          <h2 className="services-cta-title">Have a project in mind? Let's discuss how we can bring it to life</h2>
          <div className="services-cta-button">
            <Button variant="style2" onClick={navigateToContact}>CONTACT US</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
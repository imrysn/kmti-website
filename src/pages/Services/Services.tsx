import React from 'react';
import './Services.css';
import { ServicesPageProps } from './Services.types';
import { ServicePageCard } from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button';
import servicesBg from '../../assets/servicesbg.png';
import icon3D from '../../assets/icons/cube.png';
import icon2D from '../../assets/icons/cubes.png';
import inspectionIcon from '../../assets/icons/parts-inspection-icon.png';
import assemblyIcon from '../../assets/icons/machine-assembly-icon.png';
import dedemplerImage from '../../assets/image3D/dedempler.png';
import formingImage from '../../assets/image3D/forming.png';
import looperImage from '../../assets/image3D/looper.png';
import shearImage from '../../assets/image3D/shear.png';

const Services: React.FC<ServicesPageProps> = () => {

  const services = [
    {
      id: 1,
      title: '3D Modeling',
      description: 'We create detailed 3D models for high-precision engineering and visualization, ensuring accurate fabrication and assembly.',
      icon: icon3D,
      image: dedemplerImage,
      tab: '3D MODELING',
    },
    {
      id: 2,
      title: '2D Detailing',
      description: 'Our 2D detailing services convert 3D models into precise drawings ready for manufacturing and quality checks.',
      icon: icon2D,
      image: formingImage,
      tab: '2D DETAILING',
    },
    {
      id: 3,
      title: 'Parts inspection',
      description: 'We perform parts inspection using precise measuring tools and 3D scanners to guarantee dimensional accuracy.',
      icon: inspectionIcon,
      image: looperImage,
      tab: 'PARTS INSPECTIONS',
    },
    {
      id: 4,
      title: 'Machine Assembly',
      description: 'From component integration to full machine assembly, we ensure mechanical, electrical, and pneumatic systems meet industrial standards.',
      icon: assemblyIcon,
      image: shearImage,
      tab: 'MACHINE ASSEMBLY',
    },
  ];

  const serviceTabs = ['3D MODELING', 'PARTS INSPECTIONS', '2D DETAILING', 'MACHINE ASSEMBLY'];

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
              <Button variant="style2">EXPLORE OUR EXPERTIES</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="services-nav-section">
        <div className="services-nav-container container">
          <div className="services-nav-tabs">
            {serviceTabs.map((tab) => (
              <div key={tab} className="services-nav-tab">
                <span>{tab}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-grid-section">
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
                <div className="service-pagination">
                  <span className="service-pagination-dot"></span>
                  <span className="service-pagination-dot active"></span>
                  <span className="service-pagination-dot"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-cta-section">
        <div className="services-cta-container container">
          <h2 className="services-cta-title">Have a project in mind? Let's discuss how we can bring it to life</h2>
          <div className="services-cta-button">
            <Button variant="style2">CONTACT US</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
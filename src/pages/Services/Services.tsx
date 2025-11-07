import React from 'react';
import './Services.css';
import { ServicesPageProps } from './Services.types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Services: React.FC<ServicesPageProps> = () => {
  const services = [
    {
      id: 1,
      title: 'Web Development',
      description: 'Custom web applications and websites built with modern technologies like React, Node.js, and more.',
      features: [
        'Responsive design',
        'SEO optimization',
        'Performance optimization',
        'Cross-browser compatibility'
      ],
      icon: '💻',
    },
    {
      id: 2,
      title: 'Mobile Development',
      description: 'Cross-platform mobile applications for iOS and Android using React Native and Flutter.',
      features: [
        'Native performance',
        'App store optimization',
        'Push notifications',
        'Offline functionality'
      ],
      icon: '📱',
    },
    {
      id: 3,
      title: 'UI/UX Design',
      description: 'User-centered design solutions that create engaging and intuitive experiences.',
      features: [
        'User research',
        'Wireframing',
        'Prototyping',
        'Usability testing'
      ],
      icon: '🎨',
    },
    {
      id: 4,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and services to power your digital transformation.',
      features: [
        'AWS/Azure integration',
        'Serverless architecture',
        'DevOps automation',
        'Security compliance'
      ],
      icon: '☁️',
    },
    {
      id: 5,
      title: 'E-commerce Solutions',
      description: 'Complete e-commerce platforms with payment processing and inventory management.',
      features: [
        'Shopping cart',
        'Payment gateway',
        'Inventory management',
        'Order tracking'
      ],
      icon: '🛒',
    },
    {
      id: 6,
      title: 'Consulting Services',
      description: 'Expert consulting to help you navigate technology challenges and business growth.',
      features: [
        'Technology strategy',
        'Digital transformation',
        'Process optimization',
        'Team training'
      ],
      icon: '咨询服务',
    },
  ];

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-hero-container container">
          <h1 className="services-title">Our Services</h1>
          <p className="services-subtitle">
            Comprehensive solutions tailored to your business needs
          </p>
        </div>
      </section>

      <section className="services-grid-section">
        <div className="services-grid-container container">
          <div className="services-grid">
            {services.map((service) => (
              <Card key={service.id} className="service-item">
                <div className="service-icon">{service.icon}</div>
                <h2 className="service-name">{service.title}</h2>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index} className="service-feature">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="service-cta">
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="services-cta">
        <div className="services-cta-container container">
          <Card className="services-cta-card">
            <h2 className="services-cta-title">Ready to Transform Your Business?</h2>
            <p className="services-cta-description">
              Let's discuss how our services can help achieve your goals.
            </p>
            <div className="services-cta-buttons">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Services;
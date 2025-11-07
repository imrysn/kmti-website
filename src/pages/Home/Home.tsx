import React from 'react';
import './Home.css';
import { HomePageProps } from './Home.types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Home: React.FC<HomePageProps> = () => {
  const services = [
    {
      id: 1,
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies.',
      icon: '💻',
    },
    {
      id: 2,
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces for your products.',
      icon: '🎨',
    },
    {
      id: 3,
      title: 'Consulting',
      description: 'Expert advice to help grow your business and technology.',
      icon: '咨询服务',
    },
  ];

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Full-featured online shopping experience.',
      category: 'Web',
    },
    {
      id: 2,
      title: 'Mobile App',
      description: 'Cross-platform mobile application.',
      category: 'Mobile',
    },
    {
      id: 3,
      title: 'Dashboard',
      description: 'Analytics and reporting dashboard.',
      category: 'Web',
    },
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Our Company</h1>
            <p className="hero-description">
              We build innovative digital solutions that help businesses thrive in the modern world.
            </p>
            <div className="hero-buttons">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="services-container container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            {services.map((service) => (
              <Card key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-section">
        <div className="projects-container container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((project) => (
              <Card key={project.id} className="project-card">
                <div className="project-category">{project.category}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <Button variant="outline" size="sm">
                  View Project
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container container">
          <Card className="cta-card">
            <h2 className="cta-title">Ready to Start Your Project?</h2>
            <p className="cta-description">
              Contact us today to discuss how we can help bring your ideas to life.
            </p>
            <Button variant="primary" size="lg">
              Contact Us
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
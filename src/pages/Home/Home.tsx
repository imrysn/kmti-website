import React from 'react';
import './Home.css';
import { HomePageProps } from './Home.types';
import Button from '../../components/ui/Button';
import homeBg from '../../assets/homebg.jpeg';

const Home: React.FC<HomePageProps> = () => {
  const whyChooseUs = [
    {
      id: 1,
      title: 'PRECISION',
      description: 'Every detail matters. We ensure accuracy and quality in every project we undertake.',
      icon: '⚙️',
    },
    {
      id: 2,
      title: 'INNOVATION',
      description: 'Cutting-edge solutions and modern technologies to bring your vision to life.',
      icon: '💡',
    },
    {
      id: 3,
      title: 'EXPERIENCE',
      description: 'Years of expertise in engineering and design, delivering exceptional results.',
      icon: '⭐',
    },
  ];

  const services = [
    {
      id: 1,
      title: '3D MODELING',
      description: 'Comprehensive 3D modeling services for industrial machinery and components.',
      icon: '📦',
    },
    {
      id: 2,
      title: '2D DETAILING',
      description: 'Precise 2D technical drawings and detailed documentation for manufacturing.',
      icon: '📐',
    },
    {
      id: 3,
      title: 'PARTS INSPECTIONS',
      description: 'Thorough inspection services to ensure quality and compliance with specifications.',
      icon: '🔍',
    },
    {
      id: 4,
      title: 'MACHINE ASSEMBLY',
      description: 'Expert assembly and integration of complex machinery systems.',
      icon: '🧩',
    },
  ];

  const projects = [
    {
      id: 1,
      title: 'DEDEMPLER AND FACER',
      description: 'Advanced machinery design for precision manufacturing processes.',
      category: 'MECHANICAL TUBE',
    },
    {
      id: 2,
      title: 'LOOPER MACHINE',
      description: 'Innovative loop forming technology for industrial applications.',
      category: 'MECHANICAL TUBE',
    },
    {
      id: 3,
      title: 'FORMING AND SIZING MACHINE',
      description: 'State-of-the-art forming and sizing solutions for production lines.',
      category: 'MECHANICAL TUBE',
    },
  ];

  return (
    <div className="home-page">
      <section className="hero-section" style={{ backgroundImage: `url(${homeBg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">BRINGING YOUR VISION <br /> INTO CREATION, WITH <br /> PRECISION</h1>
            <div className="hero-buttons">
              <Button variant="contact" size="lg">
                CONTACT US
              </Button>
              <Button variant="view-project" size="lg">
                VIEW PROJECTS
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose-us-section">
        <div className="section-container container">
          <h2 className="section-title">WHY CHOOSE US</h2>
          <div className="cards-grid">
            {whyChooseUs.map((item) => (
              <div key={item.id} className="glass-card">
                <div className="card-icon">{item.icon}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="section-container container">
          <h2 className="section-title">OUR SERVICES</h2>
          <p className="section-subtitle">
            Comprehensive engineering solutions tailored to your needs
          </p>
          <div className="cards-grid">
            {services.map((service) => (
              <div key={service.id} className="glass-card">
                <div className="card-icon">{service.icon}</div>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-description">{service.description}</p>
                <a href="/services" className="card-link">LEARN MORE</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vision-reality-section">
        <div className="section-container container">
          <h2 className="section-title">BRINGING VISION TO REALITY</h2>
          <p className="section-subtitle">
            Precision-driven designs that transform concepts into tangible solutions
          </p>
          <div className="cards-grid">
            {projects.map((project) => (
              <div key={project.id} className="glass-card project-card">
                <div className="project-image-placeholder">
                  <div className="project-category">{project.category}</div>
                </div>
                <h3 className="card-title">{project.title}</h3>
                <p className="card-description">{project.description}</p>
                <a href="/projects" className="card-link">VIEW PROJECT</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-container container">
          <h2 className="section-title">ABOUT US</h2>
          <p className="about-description">
            With years of expertise in 3D and 2D machine design, we specialize in bringing precision and innovation to every project. Our team works closely with clients to deliver exceptional engineering solutions that meet the highest standards of quality and performance.
            <br /><br />
            We design, develop, and build exceptional engineering products that drive success for our partners.
          </p>
          <a href="/about" className="about-link">Learn more about us →</a>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container container">
          <h2 className="cta-title">Ready to build your next project?</h2>
          <Button variant="view-project" size="lg">
            CONTACT US
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
import React, { useState } from 'react';
import './Projects.css';
import { ProjectsPageProps } from './Projects.types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Projects: React.FC<ProjectsPageProps> = () => {
  const [filter, setFilter] = useState<string>('all');
  
  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Full-featured online shopping platform with inventory management and payment processing.',
      category: 'web',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: '#',
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with real-time transactions and account management.',
      category: 'mobile',
      technologies: ['React Native', 'Node.js', 'PostgreSQL', 'Firebase'],
      link: '#',
    },
    {
      id: 3,
      title: 'Analytics Dashboard',
      description: 'Real-time analytics dashboard for business intelligence and data visualization.',
      category: 'web',
      technologies: ['React', 'D3.js', 'Python', 'PostgreSQL'],
      link: '#',
    },
    {
      id: 4,
      title: 'IoT Monitoring System',
      description: 'Comprehensive IoT device monitoring and management platform.',
      category: 'web',
      technologies: ['Vue.js', 'Node.js', 'MongoDB', 'AWS IoT'],
      link: '#',
    },
    {
      id: 5,
      title: 'Fitness Tracking App',
      description: 'Mobile application for tracking workouts, nutrition, and health metrics.',
      category: 'mobile',
      technologies: ['Flutter', 'Firebase', 'Node.js', 'React Native'],
      link: '#',
    },
    {
      id: 6,
      title: 'Content Management System',
      description: 'Custom CMS for managing digital content and publishing workflows.',
      category: 'web',
      technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
      link: '#',
    },
  ];

  const categories = ['all', 'web', 'mobile', 'design', 'data'];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div className="projects-hero-container container">
          <h1 className="projects-title">Our Projects</h1>
          <p className="projects-subtitle">
            Showcasing our innovative solutions and successful implementations
          </p>
        </div>
      </section>

      <section className="projects-filter">
        <div className="projects-filter-container container">
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${
                  filter === category ? 'filter-btn--active' : ''
                }`}
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-grid-section">
        <div className="projects-grid-container container">
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="project-card">
                <div className="project-category">
                  {project.category.toUpperCase()}
                </div>
                <h2 className="project-title">{project.title}</h2>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  <strong>Technologies:</strong>
                  <div className="tech-tags">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="project-cta">
                  View Project
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-cta">
        <div className="projects-cta-container container">
          <Card className="projects-cta-card">
            <h2 className="projects-cta-title">Start Your Next Project</h2>
            <p className="projects-cta-description">
              Ready to bring your ideas to life? Let's discuss your next project.
            </p>
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Projects;
import React from 'react';
import './Careers.css';
import { CareersPageProps } from './Careers.types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Careers: React.FC<CareersPageProps> = () => {
  const jobPositions = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Join our frontend team to build amazing user experiences.',
      requirements: [
        '5+ years of React experience',
        'Strong JavaScript/TypeScript skills',
        'Experience with modern CSS frameworks',
        'Knowledge of state management libraries'
      ],
      responsibilities: [
        'Develop and maintain frontend applications',
        'Collaborate with design and backend teams',
        'Implement responsive and accessible UI components',
        'Optimize application performance'
      ],
      salary: '$90,000 - $120,000'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create beautiful and intuitive user experiences for our products.',
      requirements: [
        '3+ years of UX/UI design experience',
        'Proficiency in Figma, Sketch, or Adobe XD',
        'Understanding of design systems',
        'Experience with user research methods'
      ],
      responsibilities: [
        'Design user interfaces and experiences',
        'Create wireframes and prototypes',
        'Conduct user research and testing',
        'Collaborate with product and engineering teams'
      ],
      salary: '$80,000 - $100,000'
    },
    {
      id: 3,
      title: 'Backend Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Build scalable backend services and APIs.',
      requirements: [
        '4+ years of backend development experience',
        'Proficiency in Node.js, Python, or Java',
        'Database design and optimization',
        'Experience with cloud platforms'
      ],
      responsibilities: [
        'Design and implement backend services',
        'Optimize database queries and performance',
        'Ensure API security and scalability',
        'Collaborate with frontend and product teams'
      ],
      salary: '$95,000 - $125,000'
    },
    {
      id: 4,
      title: 'Product Manager',
      department: 'Product',
      location: 'Austin, TX',
      type: 'Full-time',
      description: 'Lead product development and strategy initiatives.',
      requirements: [
        '3+ years of product management experience',
        'Strong analytical and communication skills',
        'Experience with agile methodologies',
        'Understanding of technical concepts'
      ],
      responsibilities: [
        'Define product strategy and roadmap',
        'Collaborate with cross-functional teams',
        'Analyze market and user feedback',
        'Drive product development processes'
      ],
      salary: '$100,000 - $130,000'
    }
  ];

  const benefits = [
    {
      id: 1,
      title: 'Competitive Salary',
      description: 'We offer competitive compensation packages with annual reviews.',
      icon: '💰'
    },
    {
      id: 2,
      title: 'Health Insurance',
      description: 'Comprehensive health, dental, and vision insurance for you and your family.',
      icon: '🏥'
    },
    {
      id: 3,
      title: 'Flexible Work',
      description: 'Flexible working hours and remote work options available.',
      icon: '🏠'
    },
    {
      id: 4,
      title: 'Professional Development',
      description: 'Budget for conferences, courses, and professional growth.',
      icon: '📚'
    },
    {
      id: 5,
      title: 'Time Off',
      description: 'Generous PTO policy and company holidays.',
      icon: '🏖️'
    },
    {
      id: 6,
      title: 'Team Events',
      description: 'Regular team building events and company retreats.',
      icon: '🎉'
    }
  ];

  return (
    <div className="careers-page">
      <section className="careers-hero">
        <div className="careers-hero-container container">
          <h1 className="careers-title">Join Our Team</h1>
          <p className="careers-subtitle">
            Be part of our innovative team and help shape the future of technology
          </p>
        </div>
      </section>

      <section className="careers-benefits">
        <div className="careers-benefits-container container">
          <h2 className="benefits-title">Why Work With Us</h2>
          <div className="benefits-grid">
            {benefits.map((benefit) => (
              <Card key={benefit.id} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="careers-opportunities">
        <div className="careers-opportunities-container container">
          <h2 className="opportunities-title">Current Openings</h2>
          <div className="jobs-list">
            {jobPositions.map((position) => (
              <Card key={position.id} className="job-card">
                <div className="job-header">
                  <div className="job-info">
                    <h3 className="job-title">{position.title}</h3>
                    <div className="job-meta">
                      <span className="job-department">{position.department}</span>
                      <span className="job-location">{position.location}</span>
                      <span className="job-type">{position.type}</span>
                      {position.salary && (
                        <span className="job-salary">{position.salary}</span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" className="job-apply-btn">
                    Apply Now
                  </Button>
                </div>
                <p className="job-description">{position.description}</p>
                <div className="job-details">
                  <div className="job-section">
                    <h4 className="job-section-title">Requirements</h4>
                    <ul className="job-list">
                      {position.requirements.map((req, index) => (
                        <li key={index} className="job-list-item">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="job-section">
                    <h4 className="job-section-title">Responsibilities</h4>
                    <ul className="job-list">
                      {position.responsibilities.map((resp, index) => (
                        <li key={index} className="job-list-item">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="careers-cta">
        <div className="careers-cta-container container">
          <Card className="careers-cta-card">
            <h2 className="careers-cta-title">Don't See Your Perfect Role?</h2>
            <p className="careers-cta-description">
              We're always looking for talented individuals to join our team. 
              Send us your resume and tell us how you'd like to contribute.
            </p>
            <Button variant="primary" size="lg">
              Send Resume
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Careers;
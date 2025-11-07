import React from 'react';
import './About.css';
import { AboutPageProps } from './About.types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const About: React.FC<AboutPageProps> = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'John Smith',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years of experience in technology and business development.',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'CTO',
      bio: 'Technical expert specializing in cloud architecture and software engineering.',
    },
    {
      id: 3,
      name: 'Mike Davis',
      role: 'Lead Designer',
      bio: 'Creative designer with a passion for creating beautiful and functional user experiences.',
    },
    {
      id: 4,
      name: 'Emily Chen',
      role: 'Product Manager',
      bio: 'Product strategist focused on delivering value-driven solutions to customers.',
    },
  ];

  const milestones = [
    {
      year: '2015',
      title: 'Company Founded',
      description: 'Started with a vision to transform how businesses use technology.',
    },
    {
      year: '2017',
      title: 'First Major Client',
      description: 'Landed our first enterprise client and expanded our team.',
    },
    {
      year: '2019',
      title: 'Series A Funding',
      description: 'Raised $5M in Series A funding to accelerate growth.',
    },
    {
      year: '2021',
      title: 'International Expansion',
      description: 'Opened offices in Europe and Asia to serve global clients.',
    },
    {
      year: '2023',
      title: '100+ Projects Completed',
      description: 'Reached a milestone of 100+ successful project deliveries.',
    },
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-container container">
          <h1 className="about-title">About Us</h1>
          <p className="about-subtitle">
            Creating innovative solutions for businesses worldwide
          </p>
        </div>
      </section>

      <section className="about-mission">
        <div className="about-mission-container container">
          <div className="about-mission-content">
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-description">
              To empower businesses with cutting-edge technology solutions that drive growth, 
              efficiency, and innovation. We believe in creating lasting partnerships and 
              delivering exceptional value to our clients.
            </p>
          </div>
          <div className="about-mission-content">
            <h2 className="mission-title">Our Vision</h2>
            <p className="mission-description">
              To be the leading technology partner for businesses seeking digital transformation. 
              We strive to create solutions that not only meet current needs but also anticipate 
              future challenges and opportunities.
            </p>
          </div>
        </div>
      </section>

      <section className="about-milestones">
        <div className="about-milestones-container container">
          <h2 className="milestones-title">Our Journey</h2>
          <div className="milestones-timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="milestone-item">
                <div className="milestone-year">{milestone.year}</div>
                <div className="milestone-content">
                  <h3 className="milestone-title">{milestone.title}</h3>
                  <p className="milestone-description">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="about-team-container container">
          <h2 className="team-title">Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <Card key={member.id} className="team-member">
                <div className="team-member-image">
                  <div className="avatar-placeholder">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-bio">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta-container container">
          <Card className="about-cta-card">
            <h2 className="about-cta-title">Ready to Work Together?</h2>
            <p className="about-cta-description">
              Join us in creating innovative solutions for your business.
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

export default About;
import React, { useState } from 'react';
import './About.css';
import { AboutPageProps } from './About.types';
import aboutBg from '../../assets/aboutPage/aboutbg.jpg';
import aboutCompany1 from '../../assets/aboutPage/aboutcompany1.png';
import aboutCompany2 from '../../assets/aboutPage/aboutcomapny2.png';
import Button from '../../components/ui/Button';
import { OurStoryModal } from '../../components/ui/Modal/Modal';
import Card from '../../components/ui/Card/Card';
import visionIcon from '../../assets/icons/vision-icon.png';
import missionIcon from '../../assets/icons/mission-icon.png';

const About: React.FC<AboutPageProps> = () => {
  const [isOurStoryModalOpen, setIsOurStoryModalOpen] = useState(false);

  const handleOpenOurStory = () => {
    setIsOurStoryModalOpen(true);
  };

  const handleCloseOurStory = () => {
    setIsOurStoryModalOpen(false);
  };

  return (
    <div className="about-page" style={{ '--about-bg-image': `url(${aboutBg})` } as React.CSSProperties}>
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-container container">
          <div className="about-hero-content">
            <h1 className="about-title">Who We Are</h1>
            <p className="about-subtitle">
              Driven by Precision, Built with Passion
            </p>
            <p className="about-description">
              At Kusakabe & Maeno Technologies inc., we combine Japanese engineering excellence and Filipino craftmanship to deliver reliable and innovative industrial solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="about-company-section">
        <div className="about-company-container container">
          <div className="about-company-grid">
            <div className="about-company-images">
              <div className="about-company-image-wrapper">
                <img src={aboutCompany1} alt="Company office" className="about-company-image" />
              </div>
              <div className="about-company-image-wrapper">
                <img src={aboutCompany2} alt="Engineering work" className="about-company-image" />
              </div>
            </div>
            <div className="about-company-content">
              <h2 className="about-company-title">ABOUT OUR COMPANY</h2>
              <p className="about-company-description">
                Established through the collaboration of Kusakabe Electric & Machinery Co., Ltd, Next Engineering Co., Ltd. and Maeno Giken Inc., we bring together decades of experience in engineering, fabrication, and machine design.
              </p>
              <p className="about-company-description">
                Our mission is to deliver total engineering solutions, from design and prototyping to manufacturing, ensuring precision and excellence in every project we take on.
              </p>
              <div className="about-company-button">
                <Button variant="style2" onClick={handleOpenOurStory}>EXPLORE OUR STORY</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-vision-mission-section">
        <div className="about-vision-mission-container container">
          <div className="about-vision-mission-grid">
            <Card
              icon={visionIcon}
              title="Our Vision"
              subtitle="Be the world's leading machine design engineering company by achieving extraordinary results for our clients, building gratifying careers for our people, and earning a fair return on the value we distribute."
            />
            <Card
              icon={missionIcon}
              title="Our Mission"
              subtitle="To utilize our knowledge and upgrade them by incorporating expertise from two of the most known industry leaders Kusakabe & Machinery (KEMCO), Next Engineering Co., Ltd and Maeno Giken (MGK), together with the Filipino wisdom and effort in all the machines designed and created, to cove other industries."
            />
          </div>
        </div>
      </section>

      <OurStoryModal isOpen={isOurStoryModalOpen} onClose={handleCloseOurStory} />
    </div>
  );
};

export default About;
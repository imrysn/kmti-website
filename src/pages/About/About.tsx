import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import { AboutPageProps } from './About.types';
import aboutBg from '../../assets/aboutPage/aboutbg.jpg';
import aboutCompany1 from '../../assets/aboutPage/aboutcompany1.png';
import aboutCompany2 from '../../assets/aboutPage/aboutcomapny2.png';
import Button from '../../components/ui/Button';
import { OurStoryModal } from '../../components/ui/Modal/Modal';
import Card from '../../components/ui/Card/Card';
import { ManagementTeamCard, RelatedCompanyCard } from '../../components/ui/Card/Card';
import visionIcon from '../../assets/icons/vision-icon.png';
import missionIcon from '../../assets/icons/mission-icon.png';
import pauImage from '../../assets/management/pau.png';
import michaelImage from '../../assets/management/michael.png';
import siryuImage from '../../assets/management/siryu.png';
import mennjoImage from '../../assets/management/mennjo.png';
import teodyImage from '../../assets/management/teody.png';
import shelaImage from '../../assets/management/shela.png';
import erikImage from '../../assets/management/erik.png';
import louieImage from '../../assets/management/louie.png';
import kerbyImage from '../../assets/management/kerby.png';
import kissImage from '../../assets/management/kiss.png';
import lorieImage from '../../assets/management/lorie.png';
import jethroImage from '../../assets/management/jethro.png';
import joyceImage from '../../assets/management/joyce.png';
import jcImage from '../../assets/management/jc.png';
import jennyImage from '../../assets/management/jenny.png';
import nylImage from '../../assets/management/nyl.png';
import jonathanImage from '../../assets/management/jonathan.png';
import noelImage from '../../assets/management/noel.png';
import royImage from '../../assets/management/roy.png';
import jojoImage from '../../assets/management/jojo.png';
import ourPeople1 from '../../assets/aboutPage/ourpeople1.jpg';
import ourPeople3 from '../../assets/aboutPage/ourpeople3.jpg';
import ourPeople2 from '../../assets/aboutPage/ourpeople2.jpg';
import ourPeople4 from '../../assets/aboutPage/ourpeople4.jpg';
import ourPeople5 from '../../assets/aboutPage/ourpeople5.jpg';
import kemcoLogo from '../../assets/aboutPage/kemcoLogo.png';
import nextengLogo from '../../assets/aboutPage/nextengLogo.png';
import mgkLogo from '../../assets/aboutPage/mgkLogo.png';

const About: React.FC<AboutPageProps> = () => {
  const navigate = useNavigate();
  const [isOurStoryModalOpen, setIsOurStoryModalOpen] = useState(false);
  const [isManagementTeamExpanded, setIsManagementTeamExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const ourPeopleImages = [ourPeople1, ourPeople2, ourPeople3, ourPeople4, ourPeople5];

  const navigateToContact = () => {
    navigate('/contact');
  };

  const navigateToProjects = () => {
    navigate('/projects');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % ourPeopleImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [ourPeopleImages.length]);

  const handleOpenOurStory = () => {
    setIsOurStoryModalOpen(true);
  };

  const handleCloseOurStory = () => {
    setIsOurStoryModalOpen(false);
  };

  const toggleManagementTeam = () => {
    setIsManagementTeamExpanded(!isManagementTeamExpanded);
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
              At Kusakabe & Maeno Technologies Inc., we combine Japanese engineering excellence and Filipino craftmanship to deliver reliable and innovative industrial solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="about-company-section" data-aos="fade-up">
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
              subtitle="To utilize our knowledge and upgrade them by incorporating expertise from three of the most known industry leaders Kusakabe & Machinery (KEMCO), Next Engineering Co., Ltd and Maeno Giken (MGK), together with the Filipino wisdom and effort in all the machines designed and created, to cove other industries."
            />
          </div>
        </div>
      </section>

      <section className="about-management-team-section">
        <div className="about-management-team-container container">
          {!isManagementTeamExpanded ? (
            <>
              <h2 className="about-management-team-title">OUR MANAGEMENT TEAM</h2>
              <div className="about-management-team-grid">
                <ManagementTeamCard
                  image={pauImage}
                  role="ACCOUNTING / ADMIN MANAGER"
                />
                <ManagementTeamCard
                  image={michaelImage}
                  role="ENGINEERING MANAGER"
                />
                <div className="management-team-card-placeholder"></div>
                <ManagementTeamCard
                  image={siryuImage}
                  role="PRESIDENT / CEO"
                  isLarge={true}
                />
                <ManagementTeamCard
                  image={mennjoImage}
                  role="ENGINEERING MANAGER"
                />
                <ManagementTeamCard
                  image={teodyImage}
                  role="ENGINEERING SUPERVISOR"
                />
              </div>
              <a href="#" className="about-see-more-link" onClick={(e) => { e.preventDefault(); toggleManagementTeam(); }}>See more...</a>
            </>
          ) : (
            <div className="management-team-modal-body">
              <h2 className="management-team-modal-title">Meet Our Management Team</h2>
              <p className="management-team-modal-description">
                At the heart of our company is a team of dedicated professionals who bring experience, leadership, and passion to every project. Together, they ensure that our operations run efficiently and that our goals are achieved with excellence.
              </p>
              <div className="management-team-modal-grid">
                {[
                  { image: pauImage, role: 'ACCOUNTING / ADMIN MANAGER' },
                  { image: michaelImage, role: 'ENGINEERING MANAGER' },
                  { image: siryuImage, role: 'PRESIDENT / CEO', isLarge: true },
                  { image: mennjoImage, role: 'ENGINEERING MANAGER' },
                  { image: teodyImage, role: 'ENGINEERING SUPERVISOR' },
                  { image: shelaImage, role: 'ENGINEERING SUPERVISOR' },
                  { image: erikImage, role: 'ENGINEERING TEAM LEADER' },
                  { image: louieImage, role: 'ENGINEERING ASSISTANT TL' },
                  { image: kerbyImage, role: 'ENGINEERING IT/STAFF' },
                  { image: kissImage, role: 'ENGINEERING STAFF/SO' },
                  { image: lorieImage, role: 'ENGINEERING STAFF' },
                  { image: jethroImage, role: 'ENGINEERING STAFF' },
                  { image: joyceImage, role: 'ENGINEERING STAFF' },
                  { image: jcImage, role: 'ENGINEERING STAFF' },
                  { image: jennyImage, role: 'ENGINEERING STAFF' },
                  { image: nylImage, role: 'ENGINEERING STAFF' },
                  { image: jonathanImage, role: 'ENGINEERING STAFF' },
                  { image: noelImage, role: 'COMPANY DRIVER' },
                  { image: royImage, role: 'COMPANY DRIVER' },
                  { image: jojoImage, role: 'MAINTENANCE/UTILITY PERSONNEL' },
                ].map((member, index) => {
                  const isFirstRow = index < 5;
                  const isLargeCard = member.isLarge && isFirstRow;

                  return (
                    <React.Fragment key={index}>
                      {isFirstRow && index === 2 && (
                        <div className="management-team-card-placeholder"></div>
                      )}
                      <ManagementTeamCard
                        image={member.image}
                        role={member.role}
                        isLarge={isLargeCard}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
              <a href="#" className="about-see-more-link" onClick={(e) => { e.preventDefault(); toggleManagementTeam(); }}>See Less</a>
            </div>
          )}
        </div>
      </section>

      <section className="our-people-section">
        <div className="our-people-container container">
          <h2 className="our-people-title">OUR PEOPLE</h2>
          <p className="our-people-subtitle">Our People, Our Strength - behind every innovation is a team dedicated to quality and collaboration.</p>
          <div className="our-people-carousel-container">
            {ourPeopleImages.map((image, index) => (
              <div
                key={index}
                className="our-people-carousel-slide"
                style={{ opacity: index === currentImageIndex ? 1 : 0, zIndex: index === currentImageIndex ? 1 : 0 }}
              >
                <div className="our-people-image-container">
                  <img
                    src={image}
                    alt={`Our People ${index + 1}`}
                    className="our-people-image"
                  />
                </div>
              </div>
            ))}
            <div className="our-people-carousel-indicators">
              {ourPeopleImages.map((_, index) => (
                <button
                  key={index}
                  className={`our-people-carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="related-companies-section">
        <div className="related-companies-container container">
          <h2 className="related-companies-title">RELATED COMPANIES</h2>
          <div className="related-companies-grid">
            <RelatedCompanyCard
              logo={kemcoLogo}
              companyName="KUSAKABE ELECTRIC & MACHINERY CO., LTD"
              description="Founded in 1916 and began it's involvement with the tube and pipe industry in 1959. A full range of Tube and Pipe mills and associated equipment is available for all sectors of the tube and pipe industry. The many years of tube and pipe experience and know-how coupled with an innovative design team and the high quality workmanship of the manufacturing and installation teams has made Kusakabe a leading and inventive tube and pipe mill and associated equipment supplier."
              href="https://www.kusakabe.com/jpn/index.htm"
            />
            <RelatedCompanyCard
              logo={nextengLogo}
              companyName="NEXT ENGINEERING CO., LTD."
              description="Next Engineering Co., LTD. was established in 2007 as a partner of Mitsubishi Heavy Industries. It handles energy-related projects such as thermal power plants and fuel cell systems, along with metal processing and manufacturing at it's own facilities. In recent years, it has expanded into IT and semiconductor fields. In April 2025, the company will merge with Nishinippon Sekkei Co., Ltd., enhancing its capabilities in ship, plant, and machinery design, and enabling integrated services from design to manufacturing."
              href="https://www.nexteng.co.jp/"
            />
            <RelatedCompanyCard
              logo={mgkLogo}
              companyName="MAENO GIKEN INC."
              description="MGK specializes in fabrication, utilizing expertise of Filipino skill. They produce their products by using welding technology and machinery. Their fabricated structures are galvanized, giving it the advantage for a longer life. And every product undergoes strict quality compliance to meet their client's satisfaction, and serve as their assurance. As part of their company mission, they are honing every Filipino generation to be globally competetive by means of transferring every technological knowledge in this kind of busiess."
              href="http://www.maenogiken.com/"
            />
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="section-container container">
          <h2 className="about-cta-title">Building Innovation, Together.</h2>
          <div className="about-cta-buttons">
            <Button variant="style2" onClick={navigateToContact}>CONTACT US</Button>
            <Button variant="style2" onClick={navigateToProjects}>VIEW PROJECTS</Button>
          </div>
        </div>
      </section>

      <OurStoryModal isOpen={isOurStoryModalOpen} onClose={handleCloseOurStory} />
    </div>
  );
};

export default About;

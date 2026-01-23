import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './About.css';
import { AboutPageProps } from './About.types';
import aboutBg from '../../assets/hero_background/about.png';
import aboutCompany1 from '../../assets/about_page/aboutcompany1.png';
import aboutCompany2 from '../../assets/about_page/aboutcomapny2.png';
import aboutCompany3 from '../../assets/about_page/aboutcomapny3.png';
import aboutCompany4 from '../../assets/about_page/aboutcomapny4.png';
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
import zorenImage from '../../assets/management/ZOREN.png';
import raineImage from '../../assets/management/RAINE.png';
import sharmaineImage from '../../assets/management/SHARMAINE.png';
import mgImage from '../../assets/management/MG.png';
import matthewImage from '../../assets/management/MATTHEW.png'

import ourPeople1 from '../../assets/about_page/ourpeople1.jpg';
import ourPeople2 from '../../assets/about_page/ourpeople2.jpg';
import ourPeople5 from '../../assets/about_page/ourpeople5.jpg';
import ourPeople3 from '../../assets/about_page/k.png';
import ourPeople4 from '../../assets/about_page/ourpeople4.png';


import kemcoLogo from '../../assets/about_page/kemcoLogo.png';
import nextengLogo from '../../assets/about_page/nextengLogo.png'; import mgkLogo from '../../assets/about_page/mgkLogo.png';

const About: React.FC<AboutPageProps> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOurStoryModalOpen, setIsOurStoryModalOpen] = useState(false);
  const [isManagementTeamExpanded, setIsManagementTeamExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const ourPeopleImages = [ourPeople1, ourPeople2, ourPeople3, ourPeople4, ourPeople5];

  const navigateToContact = () => navigate('/contact');
  const navigateToProjects = () => navigate('/projects');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % ourPeopleImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [ourPeopleImages.length]);

  const handleOpenOurStory = () => setIsOurStoryModalOpen(true);
  const handleCloseOurStory = () => setIsOurStoryModalOpen(false);

  const toggleManagementTeam = () => {
    const newState = !isManagementTeamExpanded;
    setIsManagementTeamExpanded(newState);
    if (!newState) {
      setTimeout(() => {
        const section = document.querySelector('.about-management-team-section');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="about-page" style={{ '--about-bg-image': `url(${aboutBg})` } as React.CSSProperties}>
      <section className="about-hero">
        <div className="about-hero-bg"></div>
        <div className="about-hero-overlay"></div>
        <div className="about-hero-container container">
          <div className="about-hero-content">
            <h1 className="about-title">{t('about.hero.title')}</h1>
            <p className="about-subtitle">{t('about.hero.subtitle')}</p>
            <p className="about-description">{t('about.hero.description')}</p>
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
              <div className="about-company-image-wrapper">
                <img src={aboutCompany3} alt="Company facility" className="about-company-image" />
              </div>
              <div className="about-company-image-wrapper">
                <img src={aboutCompany4} alt="Company facility" className="about-company-image" />
              </div>
            </div>
            <div className="about-company-content">
              <h2 className="about-company-title">{t('about.company.title')}</h2>
              <p className="about-company-description">{t('about.company.para1')}</p>
              <p className="about-company-description">{t('about.company.para2')}</p>
              <div className="about-company-button">
                <Button variant="style2" onClick={handleOpenOurStory}>{t('about.company.cta')}</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-history-section" data-aos="fade-up">
        <div className="about-history-container container">
          <h2 className="about-history-title">{t('about.history.title')}</h2>
          <div className="about-history-timeline">
            {['item1', 'item2', 'item3', 'item_2017', 'item4', 'item5'].map((key, index) => (
              <div key={key} className={`about-history-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="about-history-content">
                  <div className="about-history-year">{t(`about.history.milestones.${key}.year`)}</div>
                  <h3 className="about-history-item-title">{t(`about.history.milestones.${key}.title`)}</h3>
                  <p className="about-history-description">{t(`about.history.milestones.${key}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-vision-mission-section" data-aos="fade-up">
        <div className="about-vision-mission-container container">
          <div className="about-vision-mission-grid">
            <Card
              icon={visionIcon}
              title={t('about.vision.title')}
              subtitle={t('about.vision.text')}
            />
            <Card
              icon={missionIcon}
              title={t('about.mission.title')}
              subtitle={t('about.mission.text')}
            />
          </div>
        </div>
      </section>

      <section className="about-management-team-section" data-aos="fade-up">
        <div className={`about-management-team-container container ${isManagementTeamExpanded ? 'expanded' : ''}`}>
          <h2 className="about-management-team-title">{t('about.management.title')}</h2>
          {isManagementTeamExpanded && (
            <p className="about-management-team-description">{t('about.management.description')}</p>
          )}
          <div className="about-management-team-grid">
            <ManagementTeamCard image={pauImage} role={t('about.management.roles.accounting')} />
            <ManagementTeamCard image={michaelImage} role={t('about.management.roles.eng_mgr')} />
            <div className="management-team-card-placeholder"></div>
            <ManagementTeamCard image={siryuImage} role={t('about.management.roles.ceo')} isLarge={true} />
            <ManagementTeamCard image={mennjoImage} role={t('about.management.roles.eng_mgr')} />
            <ManagementTeamCard image={teodyImage} role={t('about.management.roles.eng_sup')} />
          </div>

          {isManagementTeamExpanded && (
            <div className="about-management-team-expanded-rows">
              <div className="about-management-team-grid">
                <ManagementTeamCard image={raineImage} role={t('about.management.roles.admin_staff')} />
                <ManagementTeamCard image={erikImage} role={t('about.management.roles.eng_tl')} />
                <ManagementTeamCard image={louieImage} role={t('about.management.roles.eng_atl')} />
                <ManagementTeamCard image={shelaImage} role={t('about.management.roles.eng_sup')} />
                <ManagementTeamCard image={kerbyImage} role={t('about.management.roles.it_staff')} />
              </div>
              <div className="about-management-team-grid">
                <ManagementTeamCard image={royImage} role={t('about.management.roles.driver')} />
                <ManagementTeamCard image={kissImage} role={t('about.management.roles.staff_so')} />
                <ManagementTeamCard image={joyceImage} role={t('about.management.roles.staff')} />
                <ManagementTeamCard image={lorieImage} role={t('about.management.roles.staff')} />
                <ManagementTeamCard image={jonathanImage} role={t('about.management.roles.staff')} />
              </div>
              <div className="about-management-team-grid">
                <ManagementTeamCard image={noelImage} role={t('about.management.roles.driver')} />
                <ManagementTeamCard image={nylImage} role={t('about.management.roles.staff')} />
                <ManagementTeamCard image={jcImage} role={t('about.management.roles.staff')} />
                <ManagementTeamCard image={jennyImage} role={t('about.management.roles.staff')} />
                <ManagementTeamCard image={jethroImage} role={t('about.management.roles.staff')} />
              </div>
              <div className="about-management-team-grid">
                <ManagementTeamCard image={jojoImage} role={t('about.management.roles.utility')} />
                <ManagementTeamCard image={mgImage} role={t('about.management.roles.staff')} />
                <ManagementTeamCard image={zorenImage} role={t('about.management.roles.staff')} />
                <ManagementTeamCard image={sharmaineImage} role={t('about.management.roles.staff')} />
                <ManagementTeamCard image={matthewImage} role={t('about.management.roles.staff')} />
              </div>
            </div>
          )}

          <a
            href="#"
            className="about-see-more-link"
            onClick={(e) => {
              e.preventDefault();
              toggleManagementTeam();
            }}
          >
            {isManagementTeamExpanded ? t('about.management.see_less') : t('about.management.see_more')}
          </a>
        </div>
      </section>

      <section className="our-people-section" data-aos="fade-up">
        <div className="our-people-container container">
          <h2 className="our-people-title">{t('about.people.title')}</h2>
          <p className="our-people-subtitle">{t('about.people.subtitle')}</p>
          <div className="our-people-carousel-container">
            {ourPeopleImages.map((image, index) => (
              <div
                key={index}
                className="our-people-carousel-slide"
                style={{ opacity: index === currentImageIndex ? 1 : 0, zIndex: index === currentImageIndex ? 1 : 0 }}
              >
                <div className="our-people-image-container">
                  <img src={image} alt={`Our People ${index + 1}`} className="our-people-image" />
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

      <section className="related-companies-section" data-aos="fade-up">
        <div className="related-companies-container container">
          <h2 className="related-companies-title">{t('about.related.title')}</h2>
          <div className="related-companies-grid">
            <RelatedCompanyCard
              logo={kemcoLogo}
              companyName="KUSAKABE ELECTRIC & MACHINERY CO., LTD"
              description={t('about.related.kemco')}
              href="https://www.kusakabe.com/jpn/index.htm"
            />
            <RelatedCompanyCard
              logo={nextengLogo}
              companyName="NEXT ENGINEERING CO., LTD."
              description={t('about.related.nexteng')}
              href="https://www.nexteng.co.jp/"
            />
            <RelatedCompanyCard
              logo={mgkLogo}
              companyName="MAENO GIKEN INC."
              description={t('about.related.mgk')}
              href="http://www.maenogiken.com/"
            />
          </div>
        </div>
      </section>

      <section className="about-cta-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className="about-cta-title">{t('about.cta.title')}</h2>
          <div className="about-cta-buttons">
            <Button variant="style2" onClick={navigateToContact}>{t('common.contact_us')}</Button>
            <Button variant="style2" onClick={navigateToProjects}>{t('common.view_projects')}</Button>
          </div>
        </div>
      </section>

      <OurStoryModal isOpen={isOurStoryModalOpen} onClose={handleCloseOurStory} />
    </div>
  );
};

export default About;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.css';
import '../Home/Home-iPhoneSE.css';
import '../Home/iPhone12_13_14.css';
import '../Home/AndroidStandard.css';
import '../Home/IphonePlus_Promax.css';
import type { AboutPageProps } from './About.types';
import { getAssetUrl } from '../../utils/assets';
import LazyImage from '../../components/ui/LazyImage/LazyImage';
import SEO from '../../components/common/SEO';

const aboutBg = getAssetUrl('hero_background/about.webp');
const aboutCompany1 = getAssetUrl('about_page/aboutcompany1.webp');
const aboutCompany2 = getAssetUrl('about_page/aboutcomapny2.webp');
const aboutCompany3 = getAssetUrl('about_page/aboutcomapny3.webp');
const aboutCompany4 = getAssetUrl('about_page/aboutcomapny4.webp');
const meeting1 = getAssetUrl('about_page/meeting1.webp');
const meeting2 = getAssetUrl('about_page/meeting2.webp');
import Button from '../../components/ui/Button';
import { OurStoryModal } from '../../components/ui/Modal/Modal';
import Card from '../../components/ui/Card/Card';
import { ManagementTeamCard, RelatedCompanyCard } from '../../components/ui/Card/Card';
import { VisionIcon, MissionIcon, UserIcon } from '../../components/ui/Icons/ProjectIcons';

const visionIcon = getAssetUrl('icons/vision-icon.webp');
const missionIcon = getAssetUrl('icons/mission-icon.webp');
const pauImage = getAssetUrl('management/pau.webp');
const michaelImage = getAssetUrl('management/michael.webp');
const siryuImage = getAssetUrl('management/siryu.webp');
const mennjoImage = getAssetUrl('management/mennjo.webp');
const teodyImage = getAssetUrl('management/teody.webp');
const shelaImage = getAssetUrl('management/shela.webp');
const erikImage = getAssetUrl('management/erik.webp');
const lorieImage = getAssetUrl('management/louie.webp');
const kerbyImage = getAssetUrl('management/kerby.webp');
const kissImage = getAssetUrl('management/kiss.webp');
const louieImage = getAssetUrl('management/lorie.webp');
const jethroImage = getAssetUrl('management/jethro.webp');
const joyceImage = getAssetUrl('management/joyce.webp');
const jcImage = getAssetUrl('management/jc.webp');
const jennyImage = getAssetUrl('management/jenny.webp');
const nylImage = getAssetUrl('management/nyl.webp');
const jonathanImage = getAssetUrl('management/jonathan.webp');
const noelImage = getAssetUrl('management/noel.webp');
const royImage = getAssetUrl('management/roy.webp');
const jojoImage = getAssetUrl('management/jojo.webp');
const zorenImage = getAssetUrl('management/ZOREN.webp');
const raineImage = getAssetUrl('management/RAINE.webp');
const sharmaineImage = getAssetUrl('management/SHARMAINE.webp');
const mgImage = getAssetUrl('management/MG.webp');
const matthewImage = getAssetUrl('management/MATTHEW.webp');

const ourPeople1 = getAssetUrl('about_page/ourpeople1.webp');
const ourPeople2 = getAssetUrl('about_page/ourpeople2.webp');
const ourPeople5 = getAssetUrl('about_page/ourpeople5.webp');
const ourPeople3 = getAssetUrl('about_page/k.webp');
const ourPeople4 = getAssetUrl('about_page/ourpeople4.webp');


const kemcoLogo = getAssetUrl('about_page/kemcoLogo.webp');
const nextengLogo = getAssetUrl('about_page/nextengLogo.webp');
const mgkLogo = getAssetUrl('about_page/mgkLogo.webp');

const About: React.FC<AboutPageProps> = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isOurStoryModalOpen, setIsOurStoryModalOpen] = useState(false);
  const [isManagementTeamExpanded, setIsManagementTeamExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCompanyImageIndex, setCurrentCompanyImageIndex] = useState(0);

  const ourPeopleImages = [ourPeople1, ourPeople2, ourPeople3, ourPeople4, ourPeople5];
  const aboutCompanyImages = [aboutCompany1, aboutCompany2, aboutCompany3, aboutCompany4, meeting1, meeting2];

  const navigateToContact = () => navigate('/contact');
  const navigateToProjects = () => navigate('/projects');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % ourPeopleImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [ourPeopleImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCompanyImageIndex((prev) => (prev + 1) % aboutCompanyImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [aboutCompanyImages.length]);

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

  const tEn = i18n.getFixedT('en');

  // Scroll animation for timeline
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="about-page" style={{ '--about-bg-image': `url(${aboutBg})` } as React.CSSProperties}>
      <SEO 
        title={tEn('nav.about')} 
        description={tEn('about.hero.subtitle')} 
      />
      <section className="about-hero">
        <div className="about-hero-bg"></div>
        <div className="about-hero-overlay"></div>
        <div className="about-hero-container container">
          <div className="about-hero-content">
            <h1 className="about-title">{t('about.hero.title')}</h1>
            <p className="about-subtitle">{t('about.hero.subtitle')}</p>
            <p className="about-page-description">
              <Trans i18nKey="about.hero.description" components={{ br: <br /> }} />
            </p>
          </div>
        </div>
      </section>

      <section className="about-company-section" data-aos="fade-up">
        <div className="about-company-container container">
          <div className="about-company-grid">
            <div className="about-company-images">
              {aboutCompanyImages.map((image, index) => (
                <div
                  key={index}
                  className={`about-company-image-wrapper ${index === currentCompanyImageIndex ? 'active' : ''}`}
                >
                  <LazyImage src={image} alt={`Company image ${index + 1}`} className="about-company-image" />
                </div>
              ))}
            </div>
            <div className="about-company-content">
              <h2 className="about-company-title">{t('about.company.title')}</h2>
              <p className="about-company-description">
                <Trans
                  i18nKey="about.company.para1"
                  components={{
                    br: <br />,
                    nowrap: <span style={{ whiteSpace: 'nowrap' }} />
                  }}
                />
              </p>
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
          <div className="about-history-timeline" ref={timelineRef}>
            {/* The animated center line */}
            <motion.div 
              className="about-history-timeline-line" 
              style={{ scaleY, transformOrigin: "top" }} 
            />
            {['item1', 'item2', 'item3', 'item_2017', 'item4', 'item5'].map((key, index) => (
              <div key={key} className={`about-history-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="about-history-content">
                  <div className="about-history-year">{t(`about.history.milestones.${key}.year`)}</div>
                  <h3 className="about-history-item-title">{t(`about.history.milestones.${key}.title`)}</h3>
                  <p className="about-history-description">
                    <Trans
                      i18nKey={`about.history.milestones.${key}.description`}
                      components={{ br: <br /> }}
                    />
                  </p>
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
              fallbackNode={<VisionIcon />}
              title={t('about.vision.title')}
              subtitle={t('about.vision.text')}
            />
            <Card
              icon={missionIcon}
              fallbackNode={<MissionIcon />}
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
            <ManagementTeamCard image={pauImage} role={t('about.management.roles.accounting')} fallbackNode={<UserIcon />} />
            <ManagementTeamCard image={michaelImage} role={t('about.management.roles.eng_mgr')} fallbackNode={<UserIcon />} />
            <div className="management-team-card-placeholder"></div>
            <ManagementTeamCard image={siryuImage} role={t('about.management.roles.ceo')} isLarge={true} fallbackNode={<UserIcon />} />
            <ManagementTeamCard image={mennjoImage} role={t('about.management.roles.eng_mgr')} fallbackNode={<UserIcon />} />
            <ManagementTeamCard image={teodyImage} role={t('about.management.roles.eng_sup')} fallbackNode={<UserIcon />} />
          </div>

          {isManagementTeamExpanded && (
            <div className="about-management-team-expanded-rows">
              <div className="about-management-team-grid">
                <ManagementTeamCard image={raineImage} role={t('about.management.roles.admin_staff')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={erikImage} role={t('about.management.roles.eng_tl')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={louieImage} role={t('about.management.roles.eng_atl')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={shelaImage} role={t('about.management.roles.eng_sup')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={kerbyImage} role={t('about.management.roles.it_staff')} fallbackNode={<UserIcon />} />
              </div>
              <div className="about-management-team-grid">
                <ManagementTeamCard image={royImage} role={t('about.management.roles.driver')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={kissImage} role={t('about.management.roles.staff_so')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={joyceImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={lorieImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={jonathanImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
              </div>
              <div className="about-management-team-grid">
                <ManagementTeamCard image={noelImage} role={t('about.management.roles.driver')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={nylImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={jcImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={jennyImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={jethroImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
              </div>
              <div className="about-management-team-grid">
                <ManagementTeamCard image={jojoImage} role={t('about.management.roles.utility')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={mgImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={zorenImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={sharmaineImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
                <ManagementTeamCard image={matthewImage} role={t('about.management.roles.staff')} fallbackNode={<UserIcon />} />
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
                  <LazyImage src={image} alt={`Our People ${index + 1}`} className="our-people-image" />
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
              companyName={t('about.related.company_names.kemco')}
              description={t('about.related.kemco')}
              href="https://www.kusakabe.com/jpn/index.htm"
            />
            <RelatedCompanyCard
              logo={nextengLogo}
              companyName={t('about.related.company_names.nexteng')}
              description={t('about.related.nexteng')}
              href="https://www.nexteng.co.jp/"
            />
            <RelatedCompanyCard
              logo={mgkLogo}
              companyName={t('about.related.company_names.mgk')}
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
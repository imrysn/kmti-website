import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import './Home.css';
import { HomePageProps } from './Home.types';
import { getAssetUrl } from '../../utils/assets';
import Button from '../../components/ui/Button/Button';
import Card, { ServiceCard } from '../../components/ui/Card/Card';
import ProjectCarousel from '../../components/ui/ProjectCarousel/ProjectCarousel';

const homeBg = getAssetUrl('hero_background/homebg.jpeg');

const precisionIcon = getAssetUrl('icons/precision-icon.png');
const innovationIcon = getAssetUrl('icons/innovation-icon.png');
const experienceIcon = getAssetUrl('icons/experience-icon.png');
const icon3D = getAssetUrl('icons/cube.png');
const icon2D = getAssetUrl('icons/cubes.png');
const inspectionIcon = getAssetUrl('icons/parts-inspection-icon.png');
const assemblyIcon = getAssetUrl('icons/machine-assembly-icon.png');

const dedemplerImage = getAssetUrl('image3D/dedempler.png');
const looperImage = getAssetUrl('image3D/looper.png');
const formingImage = getAssetUrl('image3D/forming.png');
const shearImage = getAssetUrl('image3D/shear.png');
const finishingImage = getAssetUrl('image3D/finishing.png');
const finishingLineImage = getAssetUrl('image3D/finishingLine.png');
const millingImage = getAssetUrl('image3D/milling.png');
const furnaceImage = getAssetUrl('image3D/furnace.png');

const Home: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, []);

  const navigateToProjects = () => navigate('/projects');
  const navigateToContact = () => navigate('/contact');

  const whyChooseUs = [
    { id: 1, title: t('home.why_choose.precision.title'), description: t('home.why_choose.precision.desc'), icon: precisionIcon },
    { id: 2, title: t('home.why_choose.innovation.title'), description: t('home.why_choose.innovation.desc'), icon: innovationIcon },
    {
      id: 3,
      title: t('home.why_choose.experience.title'),
      description: <Trans i18nKey="home.why_choose.experience.desc" components={{ br: <br /> }} />,
      icon: experienceIcon
    },
  ];

  const services = [
    { id: 1, title: t('home.services.items.3d.title'), description: t('home.services.items.3d.desc'), icon: icon3D },
    { id: 2, title: t('home.services.items.2d.title'), description: <Trans i18nKey="home.services.items.2d.desc" components={{ br: <br /> }} />, icon: icon2D },
    { id: 3, title: t('home.services.items.inspection.title'), description: <Trans i18nKey="home.services.items.inspection.desc" components={{ br: <br /> }} />, icon: inspectionIcon },
    { id: 4, title: t('home.services.items.assembly.title'), description: <Trans i18nKey="home.services.items.assembly.desc" components={{ br: <br /> }} />, icon: assemblyIcon },
  ];

  const projects = [
    { id: 1, title: t('home.projects.items.looper.title'), description: t('home.projects.items.looper.desc'), category: t('home.projects.items.looper.cat'), image: looperImage, link: '/projects?project=looper-machine' },
    { id: 2, title: t('home.projects.items.forming.title'), description: t('home.projects.items.forming.desc'), category: t('home.projects.items.forming.cat'), image: formingImage, link: '/projects?project=forming-and-sizing' },
    { id: 3, title: t('home.projects.items.shear.title'), description: t('home.projects.items.shear.desc'), category: t('home.projects.items.shear.cat'), image: shearImage, link: '/projects?project=shear-welder-machine' },
    { id: 4, title: t('home.projects.items.table.title'), description: t('home.projects.items.table.desc'), category: t('home.projects.items.table.cat'), image: finishingImage, link: '/projects?project=finishing-table' },
    { id: 5, title: t('home.projects.items.furnace.title'), description: t('home.projects.items.furnace.desc'), category: t('home.projects.items.furnace.cat'), image: furnaceImage, link: '/projects?project=furnace' },
    { id: 6, title: t('home.projects.items.line.title'), description: t('home.projects.items.line.desc'), category: t('home.projects.items.line.cat'), image: finishingLineImage, link: '/projects?project=finishing-line' },
    { id: 7, title: t('home.projects.items.milling.title'), description: t('home.projects.items.milling.desc'), category: t('home.projects.items.milling.cat'), image: millingImage, link: '/projects?project=milling-cutoff-machine' },
    { id: 8, title: t('home.projects.items.dedimpler.title'), description: t('home.projects.items.dedimpler.desc'), category: t('home.projects.items.dedimpler.cat'), image: dedemplerImage, link: '/projects?project=dedimpler-and-facer' },
  ];

  return (
    <div className="home-page">
      <section key={animationKey} className="hero-section">
        <div className="hero-bg-custom" style={{ backgroundImage: `url(${homeBg})` }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-container container">
          <div className={`hero-content ${i18n.language === 'jp' ? 'lang-jp' : ''}`}>
            <h1 className={`hero-title ${i18n.language === 'jp' ? 'lang-jp' : ''}`}>
              {t('home.hero.title').split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </h1>
            <div className="hero-buttons">
              <Button variant="style1" onClick={navigateToContact}>{t('common.contact_us')}</Button>
              <Button variant="style2" onClick={navigateToProjects}>{t('common.view_projects')}</Button>
            </div>
          </div>
        </div>
      </section>



      <section className="services-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className="section-title">{t('home.services.title')}</h2>
          <p className="section-subtitle">{t('home.services.subtitle')}</p>
          <div className="services-grid">
            {services.map((service) => {
              let linkHref = '/services';
              if (service.id === 1) linkHref = '/services/3d-modeling';
              if (service.id === 2) linkHref = '/services/2d-detailing';
              if (service.id === 3) linkHref = '/services/parts-inspection';
              if (service.id === 4) linkHref = '/services/machine-assembly';

              return (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  title={service.title}
                  subtitle={service.description}
                  linkText={t('common.learn_more')}
                  linkHref={linkHref}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="vision-reality-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className="section-title">{t('home.projects.title')}</h2>
          <p className="section-subtitle">{t('home.projects.subtitle')}</p>
        </div>
        <ProjectCarousel projects={projects} />
      </section>

      <section className="why-choose-us-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className="section-title">{t('home.why_choose.title')}</h2>
          <div className="cards-grid">
            {whyChooseUs.map((item) => (
              <Card
                key={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className="section-title">{t('home.about.title')}</h2>
          <p className="about-description"><Trans i18nKey="home.about.desc" components={{ br: <br /> }} /></p>
          <Link to="/about" className="about-link">{t('home.about.link')} →</Link>
        </div>
      </section>

      <section className="cta-section" data-aos="fade-up">
        <div className="section-container container">
          <h2 className="cta-title">{t('home.cta.title')}</h2>
          <div className="cta-buttons">
            <Button variant="style2" onClick={navigateToContact}>{t('common.contact_us')}</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
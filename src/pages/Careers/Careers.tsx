import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import './Careers.css';
import { CareersPageProps } from './Careers.types';
import { getAssetUrl } from '../../utils/assets';

const careersBg = getAssetUrl('hero_background/careersbg.jpg');
const kmtiModel = getAssetUrl('hero_background/career_model.png');
const mapsIcon = getAssetUrl('icons/maps-icon.png');
const clockIcon = getAssetUrl('icons/clock-icon.png');
const insuranceIcon = getAssetUrl('icons/insurance-icon.png');
const benefitsIcon = getAssetUrl('icons/benefits-icon.png');
const thirteenthMonthIcon = getAssetUrl('icons/13thmonth-icon.png');
const allowanceIcon = getAssetUrl('icons/allowance-icon.png');
const careerIcon = getAssetUrl('icons/career-icon.png');
const checkIcon = getAssetUrl('icons/check-icon.png');
const teamPhoto = getAssetUrl('about_page/ourpeople4.png');
const contactIcon = getAssetUrl('icons/contact.png');
const emailIcon = getAssetUrl('icons/email-icon.png');
import Button from '../../components/ui/Button/Button';
import { ApplyCard, WhyWorkWithUsCard, HowToApplyCard } from '../../components/ui/Card/Card';

const Careers: React.FC<CareersPageProps> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateToAbout = () => {
    navigate('/about');
  };

  const navigateToPositions = () => {
    const positionsContainer = document.querySelector('.careers-positions-container');
    positionsContainer?.scrollIntoView({ behavior: 'smooth' });
  };

  const whyWorkWithUs = [
    {
      id: 1,
      title: t('careers.why_work.benefits.insurance.title'),
      description: t('careers.why_work.benefits.insurance.desc'),
      icon: insuranceIcon,
    },
    {
      id: 2,
      title: t('careers.why_work.benefits.gov.title'),
      description: t('careers.why_work.benefits.gov.desc'),
      icon: benefitsIcon,
    },
    {
      id: 3,
      title: t('careers.why_work.benefits.thirteenth.title'),
      description: t('careers.why_work.benefits.thirteenth.desc'),
      icon: thirteenthMonthIcon,
    },
    {
      id: 4,
      title: t('careers.why_work.benefits.allowance.title'),
      description: (
        <Trans
          i18nKey="careers.why_work.benefits.allowance.desc"
          components={{ br: <br /> }}
        />
      ),
      icon: allowanceIcon,
    },
    {
      id: 5,
      title: t('careers.why_work.benefits.training.title'),
      description: t('careers.why_work.benefits.training.desc'),
      icon: mapsIcon,
    },
    {
      id: 6,
      title: t('careers.why_work.benefits.career.title'),
      description: t('careers.why_work.benefits.career.desc'),
      icon: careerIcon,
    },
  ];

  return (
    <div className="careers-page">
      <section className="hero-section">
        <div className="hero-bg-custom" style={{ backgroundImage: `url(${careersBg})` }}></div>
        <div className="hero-overlay"></div>
        <img src={kmtiModel} alt="KMTI Team" className="careers-hero-model" />
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">{t('careers.hero.title')}</h1>
            <p className="careers-hero-description">
              {t('careers.hero.description1')} <br /> {t('careers.hero.description2')}
            </p>
            <div className="hero-buttons">
              <Button variant="style1" onClick={navigateToPositions} width="255px" height="55px">{t('careers.hero.cta_positions')}</Button>
              <Button variant="style2" onClick={navigateToAbout} width="255px" height="55px">{t('nav.about')}</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="why-work-withus-section" data-aos="fade-up">
        <div className="why-work-withus-container container">
          <h2 className="why-work-withus-title">{t('careers.why_work.title')}</h2>
          <p className="why-work-withus-subtitle">
            {t('careers.why_work.subtitle')}
          </p>
          <div className="why-work-withus-grid">
            {whyWorkWithUs.map((item) => (
              <WhyWorkWithUsCard
                key={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="meet-our-team-section" data-aos="fade-up">
        <div className="meet-our-team-container container">
          <div className="meet-our-team-content">
            <h2 className="meet-our-team-title">{t('careers.team.title')}</h2>
            <p className="meet-our-team-description">
              {t('careers.team.description')}
            </p>
            <ul className="meet-our-team-list">
              <li>
                <img src={checkIcon} alt="Check" className="meet-our-team-check-icon" />
                <span>{t('careers.team.list.item1')}</span>
              </li>
              <li>
                <img src={checkIcon} alt="Check" className="meet-our-team-check-icon" />
                <span>{t('careers.team.list.item2')}</span>
              </li>
              <li>
                <img src={checkIcon} alt="Check" className="meet-our-team-check-icon" />
                <span>{t('careers.team.list.item3')}</span>
              </li>
            </ul>
            <div className="meet-our-team-button">
              <Button variant="style2" onClick={navigateToAbout}>{t('careers.team.cta')}</Button>
            </div>
          </div>
          <div className="meet-our-team-image-wrapper">
            <img src={teamPhoto} alt="KMTI Team" className="meet-our-team-image" />
          </div>
        </div>
      </section>

      <section className="careers-positions-section" data-aos="fade-up">
        <div className="careers-positions-container container">
          <h2 className="careers-positions-title">{t('careers.positions.title')}</h2>
          <p className="careers-positions-subtitle">
            {t('careers.positions.subtitle')}
          </p>
          <div className="careers-positions-grid">
            <ApplyCard
              title={t('careers.positions.eng.title')}
              location={t('careers.positions.eng.location')}
              type={t('careers.positions.eng.type')}
              locationIcon={mapsIcon}
              typeIcon={clockIcon}
              description={t('careers.positions.eng.desc')}
              skills={t('careers.positions.eng.skills', { returnObjects: true }) as string[]}
              requirements={t('careers.positions.eng.requirements', { returnObjects: true }) as string[]}
              preferredCourses={t('careers.positions.eng.courses', { returnObjects: true }) as string[]}
              onApply={() => {
                window.open('https://www.linkedin.com/company/kusakabe-maeno-tech-inc/jobs/', '_blank');
              }}
              applyText={t('careers.positions.apply_btn')}
              fullTimeBadgeText={t('careers.card.fulltime_badge')}
              requirementsTitle={t('careers.card.requirements_title')}
              preferredCoursesTitle={t('careers.card.courses_title')}
            />
            <ApplyCard
              title={t('careers.positions.admin.title')}
              location={t('careers.positions.admin.location')}
              type={t('careers.positions.admin.type')}
              locationIcon={mapsIcon}
              typeIcon={clockIcon}
              description={t('careers.positions.admin.desc')}
              requirements={t('careers.positions.admin.requirements', { returnObjects: true }) as string[]}
              preferredCourses={t('careers.positions.admin.courses', { returnObjects: true }) as string[]}
              onApply={() => {
                window.open('https://www.linkedin.com/company/kusakabe-maeno-tech-inc/jobs/', '_blank');
              }}
              applyText={t('careers.positions.apply_btn')}
              fullTimeBadgeText={t('careers.card.fulltime_badge')}
              requirementsTitle={t('careers.card.requirements_title')}
              preferredCoursesTitle={t('careers.card.courses_title')}
            />
          </div>
        </div>
      </section>

      <section className="how-to-apply-section" data-aos="fade-up">
        <div className="how-to-apply-container container">
          <h2 className="how-to-apply-title">{t('careers.apply.title')}</h2>
          <p className="how-to-apply-subtitle">
            {t('careers.apply.subtitle')}
          </p>
          <div className="how-to-apply-grid">
            <HowToApplyCard
              icon={mapsIcon}
              title={t('careers.apply.visit.title')}
            >
              <p>{t('careers.apply.visit.text')}</p>
              <div className="address">
                {t('careers.apply.visit.address.line1')}<br />
                {t('careers.apply.visit.address.line2')}<br />
                {t('careers.apply.visit.address.line3')}
              </div>
              <p>{t('careers.apply.visit.person')}: Ms. Raine Royo</p>
            </HowToApplyCard>
            <HowToApplyCard
              title={t('careers.apply.contact.title')}
            >
              <div className="contact-item">
                <img src={contactIcon} alt="Phone" className="contact-item-icon" />
                <div className="contact-item-content">
                  <div className="contact-item-label">{t('careers.apply.contact.phone_label')}</div>
                  <div className="contact-item-value">(046) 413-4509</div>
                </div>
              </div>
              <div className="contact-item">
                <img src={emailIcon} alt="Email" className="contact-item-icon" />
                <div className="contact-item-content">
                  <div className="contact-item-label">{t('careers.apply.contact.email_label')}</div>
                  <div className="contact-item-value">info@kmti.com.ph</div>
                </div>
              </div>
            </HowToApplyCard>
          </div>
          <div className="ready-to-join-section">
            <h2 className="ready-to-join-title">{t('careers.ready.title')}</h2>
            <p className="ready-to-join-description">
              <Trans i18nKey="careers.ready.description" components={{ br: <br /> }} />
            </p>
            <div className="ready-to-join-buttons">
              <Button
                variant="style2"
                onClick={() => window.open('https://www.linkedin.com/company/kusakabe-maeno-tech-inc/', '_blank')}
              >
                {t('careers.ready.Linkedin')}
              </Button>
              <Button
                variant="style2"
                onClick={() => window.open('https://www.facebook.com', '_blank')}
              >
                {t('careers.ready.facebook')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
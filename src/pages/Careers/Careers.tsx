import React, { useState } from 'react';
import LazyImage from '../../components/ui/LazyImage/LazyImage';
import SEO from '../../components/common/SEO';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import './Careers.css';
import type { CareersPageProps } from './Careers.types';
import { getAssetUrl } from '../../utils/assets';

const careersBg = getAssetUrl('hero_background/careersbg.webp');
const kmtiModel = getAssetUrl('hero_background/career_model.webp');
import {
  LocationIcon,
  ClockIcon,
  InsuranceIcon,
  BenefitIcon,
  ThirteenthMonthIcon,
  AllowanceIcon,
  CareerIcon,
  CheckIcon,
  PhoneIcon,
  EmailIcon,
  UserIcon
} from '../../components/ui/Icons/ProjectIcons';
import Button from '../../components/ui/Button/Button';
import { ApplyCard, WhyWorkWithUsCard, HowToApplyCard } from '../../components/ui/Card/Card';

const Careers: React.FC<CareersPageProps> = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const tEn = i18n.getFixedT('en');

  const [activeOjtType, setActiveOjtType] = useState<'engineering' | 'it' | null>(null);

  const engineeringImages = ['ojt_10.webp', 'ojt_4.webp', 'ojt_6.webp', 'ojt_12.webp', 'ojt_13.webp', 'ojt_9.webp'];
  const itImages = ['ojt_7.webp', 'ojt_8.webp', 'ojt_2.webp'];

  const toggleOjt = (type: 'engineering' | 'it') => {
    setActiveOjtType(activeOjtType === type ? null : type);
  };

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
      icon: getAssetUrl('icons/insurance-icon.webp'),
      fallback: <InsuranceIcon />,
    },
    {
      id: 2,
      title: t('careers.why_work.benefits.gov.title'),
      description: t('careers.why_work.benefits.gov.desc'),
      icon: getAssetUrl('icons/benefits-icon.webp'),
      fallback: <BenefitIcon />,
    },
    {
      id: 3,
      title: t('careers.why_work.benefits.thirteenth.title'),
      description: t('careers.why_work.benefits.thirteenth.desc'),
      icon: getAssetUrl('icons/13thmonth-icon.webp'),
      fallback: <ThirteenthMonthIcon />,
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
      icon: getAssetUrl('icons/allowance-icon.webp'),
      fallback: <AllowanceIcon />,
    },
    {
      id: 5,
      title: t('careers.why_work.benefits.training.title'),
      description: t('careers.why_work.benefits.training.desc'),
      icon: getAssetUrl('icons/maps-icon.webp'),
      fallback: <LocationIcon />,
    },
    {
      id: 6,
      title: t('careers.why_work.benefits.career.title'),
      description: t('careers.why_work.benefits.career.desc'),
      icon: getAssetUrl('icons/career-icon.webp'),
      fallback: <CareerIcon />,
    },
  ];

  return (
    <div className="careers-page">
      <SEO 
        title={tEn('nav.careers')} 
        description={tEn('careers.hero.description1')} 
      />
      <section className="hero-section">
        <div className="hero-bg-custom" style={{ backgroundImage: `url(${careersBg})` }}></div>
        <div className="hero-overlay"></div>
        <LazyImage src={kmtiModel} alt={`${t('common.brand_abbr')} Team`} wrapperClassName="careers-hero-model" loading="eager" />
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
                fallbackNode={item.fallback}
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
                <div className="meet-our-team-check-icon"><CheckIcon /></div>
                <span>{t('careers.team.list.item1')}</span>
              </li>
              <li>
                <div className="meet-our-team-check-icon"><CheckIcon /></div>
                <span>{t('careers.team.list.item2')}</span>
              </li>
              <li>
                <div className="meet-our-team-check-icon"><CheckIcon /></div>
                <span>{t('careers.team.list.item3')}</span>
              </li>
            </ul>
            <div className="meet-our-team-button">
              <Button variant="style2" onClick={navigateToAbout}>{t('careers.team.cta')}</Button>
            </div>
          </div>
          <div className="meet-our-team-image-wrapper">
            <LazyImage
              src={getAssetUrl('about_page/ourpeople4.webp')}
              alt={`${t('common.brand_abbr')} Team`}
              className="meet-our-team-image"
              fallbackNode={<div className="team-photo-fallback"><UserIcon /></div>}
            />
          </div>
        </div>
      </section>

      <section className="meet-our-ojt-section" data-aos="fade-up">
        <div className="meet-our-ojt-container container">
          <h2 className="meet-our-ojt-title">{t('careers.ojt.title')}</h2>
          <p className="meet-our-ojt-description">
            {t('careers.ojt.description')}
          </p>

          <div className="ojt-cards-grid">
            <div
              className={`ojt-card ${activeOjtType === 'engineering' ? 'active' : ''}`}
              onClick={() => toggleOjt('engineering')}
            >
              <div className="ojt-card-image-box">
                <LazyImage src={getAssetUrl('ojt/ojt_5.webp')} alt="Engineering OJT" className="ojt-card-main-image" />
              </div>
              <h3 className="ojt-card-title">{t('careers.ojt.engineering.title')}</h3>
              <p className="ojt-card-description">{t('careers.ojt.engineering.description')}</p>
            </div>
            <div
              className={`ojt-card ${activeOjtType === 'it' ? 'active' : ''}`}
              onClick={() => toggleOjt('it')}
            >
              <div className="ojt-card-image-box">
                <LazyImage src={getAssetUrl('ojt/ojt_11.webp')} alt="IT OJT" className="ojt-card-main-image" />
              </div>
              <h3 className="ojt-card-title">{t('careers.ojt.it.title')}</h3>
              <p className="ojt-card-description">{t('careers.ojt.it.description')}</p>
            </div>
          </div>

          {activeOjtType && (
            <div className="ojt-grid-expanded" key={activeOjtType}>
              <div className="ojt-grid">
                {(activeOjtType === 'engineering' ? engineeringImages : itImages).map((img, idx) => (
                  <div className="ojt-image-wrapper" key={idx}>
                    <LazyImage
                      src={getAssetUrl(`ojt/${img}`)}
                      alt="OJT Program"
                      className="ojt-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
              locationIcon={getAssetUrl('icons/maps-icon.webp')}
              locationFallbackNode={<LocationIcon />}
              typeIcon={getAssetUrl('icons/clock-icon.webp')}
              typeFallbackNode={<ClockIcon />}
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
              locationIcon={getAssetUrl('icons/maps-icon.webp')}
              locationFallbackNode={<LocationIcon />}
              typeIcon={getAssetUrl('icons/clock-icon.webp')}
              typeFallbackNode={<ClockIcon />}
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
              icon={getAssetUrl('icons/maps-icon.webp')}
              fallbackNode={<LocationIcon />}
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
                <LazyImage src={getAssetUrl('icons/contact.webp')} alt="Phone" wrapperClassName="contact-item-icon" fallbackNode={<PhoneIcon />} />
                <div className="contact-item-content">
                  <div className="contact-item-label">{t('careers.apply.contact.phone_label')}</div>
                  <div className="contact-item-value">(046) 413-4509</div>
                </div>
              </div>
              <div className="contact-item">
                <LazyImage src={getAssetUrl('icons/email-icon.webp')} alt="Email" wrapperClassName="contact-item-icon" fallbackNode={<EmailIcon />} />
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
                onClick={() => window.open('https://www.facebook.com/kmti.com.ph/', '_blank')}
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
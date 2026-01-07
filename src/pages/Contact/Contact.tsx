import React from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';
import { ContactPageProps } from './Contact.types';
import contactBg from '../../assets/contactusbg.jpg';
import emailIcon from '../../assets/icons/email-icon.png';
import linkedinIcon from '../../assets/icons/linkedin-icon.png';
import mapsIcon from '../../assets/icons/maps-icon.png';
import chatIcon from '../../assets/icons/chat-icon.png';
import circleIcon from '../../assets/icons/circle-icon.png';
import innovationIcon from '../../assets/icons/innovation-icon.png';
import { ContactOptionCard } from '../../components/ui/Card/Card';
import { ChatWithUsRightCard } from '../../components/ui/Card/ChatWithUsRightCard';
import Button from '../../components/ui/Button/Button';

const Contact: React.FC<ContactPageProps> = () => {
  const { t } = useTranslation();

  const handleGeneralInquiries = () => {
    window.location.href = 'mailto:info@kmti.com.ph';
  };

  const handleCareerApplication = () => {
    window.open('https://www.linkedin.com/company/kusakabe-maeno-tech-inc/jobs/', '_blank');
  };

  const handleOfficeVisit = () => {
    window.open('https://maps.app.goo.gl/efZ1dkgQFWRrP1M17', '_blank');
  };

  const handleTryChatbot = () => {
    window.dispatchEvent(new CustomEvent('reset-chatbot'));
    const chatbotButton = document.querySelector('.chatbot-button') as HTMLButtonElement;

    if (chatbotButton && chatbotButton.disabled) {
      setTimeout(() => {
        const chatbotPanel = document.querySelector('.chatbot-panel');
        if (chatbotPanel) {
          chatbotPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } else if (chatbotButton && !chatbotButton.disabled) {
      chatbotButton.click();
    }
  };

  return (
    <div className="contact-page">
      <section className="hero-section" style={{ backgroundImage: `url(${contactBg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">{t('contact.hero.title')}</h1>
            <p className="contact-hero-description">{t('contact.hero.description')}</p>
          </div>
          <div className="contact-options-container" data-aos="fade-up">
            <div className="contact-options-grid">
              <ContactOptionCard
                icon={emailIcon}
                title={t('contact.options.email.title')}
                description="info@kmti.com.ph"
                buttonText={t('contact.options.email.btn')}
                onButtonClick={handleGeneralInquiries}
              />
              <ContactOptionCard
                icon={linkedinIcon}
                title={t('contact.options.career.title')}
                description={t('contact.options.career.desc')}
                buttonText={t('contact.options.career.btn')}
                onButtonClick={handleCareerApplication}
              />
              <ContactOptionCard
                icon={mapsIcon}
                title={t('contact.options.visit.title')}
                description={t('contact.options.visit.desc')}
                buttonText={t('contact.options.visit.btn')}
                onButtonClick={handleOfficeVisit}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="or-divider-container">
        <div className="or-divider-wrapper">
          <div className="or-divider-line"></div>
          <span className="or-divider-text">{t('contact.divider.text')}</span>
          <div className="or-divider-line"></div>
        </div>
        <p className="or-divider-description">{t('contact.divider.desc')}</p>
      </div>

      <section className="chat-with-us-section" data-aos="fade-up">
        <div className="chat-with-us-container container">
          <div className="chat-with-us-content">
            <div className="chat-with-us-left">
              <div className="chat-with-us-header">
                <div className="chat-with-us-icon-container">
                  <img src={chatIcon} alt="Chat" className="chat-with-us-icon" />
                </div>
                <h2 className="chat-with-us-title">
                  {t('contact.chat.title_main')} <span className="chat-with-us-title-highlight">{t('contact.chat.title_highlight')}</span>
                </h2>
              </div>
              <div className="chat-with-us-header-line"></div>
              <p className="chat-with-us-description">{t('contact.chat.description')}</p>

              <ul className="chat-with-us-features">
                <li className="chat-with-us-feature">
                  <img src={circleIcon} alt="Feature" className="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">{t('contact.chat.features.f1.title')}</strong>
                    <span className="chat-with-us-feature-text">{t('contact.chat.features.f1.text')}</span>
                  </div>
                </li>
                <li className="chat-with-us-feature">
                  <img src={circleIcon} alt="Feature" className="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">{t('contact.chat.features.f2.title')}</strong>
                    <span className="chat-with-us-feature-text">{t('contact.chat.features.f2.text')}</span>
                  </div>
                </li>
                <li className="chat-with-us-feature">
                  <img src={circleIcon} alt="Feature" className="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">{t('contact.chat.features.f3.title')}</strong>
                    <span className="chat-with-us-feature-text">{t('contact.chat.features.f3.text')}</span>
                  </div>
                </li>
                <li className="chat-with-us-feature">
                  <img src={innovationIcon} alt="Feature" className="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">{t('contact.chat.features.f4.title')}</strong>
                    <span className="chat-with-us-feature-text">{t('contact.chat.features.f4.text')}</span>
                  </div>
                </li>
              </ul>
              <div className="chat-with-us-button-wrapper">
                <Button variant="style1" onClick={handleTryChatbot}>
                  {t('contact.chat.btn')}
                </Button>
              </div>
            </div>
            <div className="chat-with-us-right">
              <ChatWithUsRightCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
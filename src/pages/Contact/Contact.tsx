import React, { useState } from 'react';
import LazyImage from '../../components/ui/LazyImage/LazyImage';
import { useTranslation, Trans } from 'react-i18next';
import './Contact.css';
import type { ContactPageProps } from './Contact.types';
import { getAssetUrl } from '../../utils/assets';
import { ContactOptionCard } from '../../components/ui/Card/Card';
import { ChatWithUsRightCard } from '../../components/ui/Card/ChatWithUsRightCard';
import Button from '../../components/ui/Button/Button';

const contactBg = getAssetUrl('hero_background/contactusbg.webp');
const emailIcon = getAssetUrl('icons/email-icon.webp');
const linkedinIcon = getAssetUrl('icons/linkedin-icon.webp');
const facebookIcon = getAssetUrl('icons/facebook.webp');
const contactIcon = getAssetUrl('icons/contact.webp');
const mapsIcon = getAssetUrl('icons/maps-icon.webp');
const chatIcon = getAssetUrl('icons/chat-icon.webp');
const circleIcon = getAssetUrl('icons/circle-icon.webp');
const innovationIcon = getAssetUrl('icons/innovation-icon.webp');

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

const Contact: React.FC<ContactPageProps> = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ContactFormData>(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mailto fallback for frontend-only
    const { name, email, subject, message } = formData;
    const mailtoLink = `mailto:info@kmti.com.ph?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;
  };

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
    const chatbotButton = document.querySelector('.chatbot-button') as HTMLButtonElement | null;

    if (chatbotButton) {
      if (chatbotButton.disabled) {
        setTimeout(() => {
          const chatbotPanel = document.querySelector('.chatbot-panel');
          chatbotPanel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      } else {
        chatbotButton.click();
      }
    }
  };

  return (
    <div className="contact-page">
      <section className="hero-section">
        <div className="hero-bg-custom" style={{ backgroundImage: `url(${contactBg})` }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">
              <Trans i18nKey="contact.hero.title" components={{ br: <br /> }} />
            </h1>
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
      <section className="get-in-touch-section">
        <div className="container">
          <div className="get-in-touch-grid">
            {/* Left: Form */}
            <div className="contact-form-container">
              <h2 className="section-title">{t('contact.form.title')}</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder={t('contact.form.name')}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder={t('contact.form.email')}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder={t('contact.form.subject')}
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder={t('contact.form.message')}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-field"
                    required
                  />
                </div>
                <Button variant="style1" type="submit">{t('contact.form.send')}</Button>
              </form>
            </div>

            {/* Right: Contact Information */}
            <div className="contact-info-container">
              <h2 className="section-title">{t('contact.info.title')}</h2>

              <div className="contact-info-item">
                <div className="contact-info-icon-wrapper">
                  <LazyImage src={mapsIcon} alt="Address" wrapperClassName="contact-info-icon" />
                </div>
                <div className="contact-info-details">
                  <h3>{t('contact.info.label_address')}</h3>
                  <p>{t('contact.info.address')}</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon-wrapper">
                  <LazyImage src={contactIcon} alt="Phone" wrapperClassName="contact-info-icon" />
                </div>
                <div className="contact-info-details">
                  <h3>{t('contact.info.label_phone')}</h3>
                  <p>{t('contact.info.phone')}</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon-wrapper">
                  <LazyImage src={emailIcon} alt="Email" wrapperClassName="contact-info-icon" />
                </div>
                <div className="contact-info-details">
                  <h3>{t('contact.info.label_email')}</h3>
                  <p>{t('contact.info.email')}</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon-wrapper">
                  <LazyImage src={linkedinIcon} alt="LinkedIn" wrapperClassName="contact-info-icon" />
                </div>
                <div className="contact-info-details">
                  <h3>LinkedIn</h3>
                  <p><a href="https://www.linkedin.com/company/kusakabe-maeno-tech-inc/" target="_blank" rel="noreferrer" className="contact-info-link">KMTI LinkedIn</a></p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon-wrapper">
                  <LazyImage src={facebookIcon} alt="Facebook" wrapperClassName="contact-info-icon" />
                </div>
                <div className="contact-info-details">
                  <h3>Facebook</h3>
                  <p><a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="contact-info-link">KMTI Facebook</a></p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="map-section">        <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3866.352676143054!2d120.92803157603589!3d14.2909297845814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d57cb66c03e7%3A0x560ff11b54224aeb!2sKusakabe%20%26%20Maeno%20Tech.%2C%20Inc.!5e0!3m2!1sen!2sph!4v1768366988662!5m2!1sen!2sph"
          className="map-frame"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="KMTI Office Location"
        ></iframe>
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
                  <LazyImage src={chatIcon} alt="Chat" className="chat-with-us-icon" />
                </div>
                <h2 className="chat-with-us-title">
                  {t('contact.chat.title_main')} <span className="chat-with-us-title-highlight">{t('contact.chat.title_highlight')}</span>
                </h2>
              </div>
              <div className="chat-with-us-header-line"></div>
              <p className="chat-with-us-description"><Trans i18nKey="contact.chat.description" components={{ br: <br /> }} /></p>

              <ul className="chat-with-us-features">
                <li className="chat-with-us-feature">
                  <LazyImage src={circleIcon} alt="Feature" wrapperClassName="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">{t('contact.chat.features.f1.title')}</strong>
                    <span className="chat-with-us-feature-text"><Trans i18nKey="contact.chat.features.f1.text" components={{ br: <br /> }} /></span>
                  </div>
                </li>
                <li className="chat-with-us-feature">
                  <LazyImage src={circleIcon} alt="Feature" wrapperClassName="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">{t('contact.chat.features.f2.title')}</strong>
                    <span className="chat-with-us-feature-text">{t('contact.chat.features.f2.text')}</span>
                  </div>
                </li>
                <li className="chat-with-us-feature">
                  <LazyImage src={circleIcon} alt="Feature" wrapperClassName="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">{t('contact.chat.features.f3.title')}</strong>
                    <span className="chat-with-us-feature-text">{t('contact.chat.features.f3.text')}</span>
                  </div>
                </li>
                <li className="chat-with-us-feature">
                  <LazyImage src={innovationIcon} alt="Feature" wrapperClassName="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">{t('contact.chat.features.f4.title')}</strong>
                    <span className="chat-with-us-feature-text"><Trans i18nKey="contact.chat.features.f4.text" components={{ br: <br /> }} /></span>
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

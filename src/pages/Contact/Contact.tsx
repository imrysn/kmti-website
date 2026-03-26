import React, { useState } from 'react';
import LazyImage from '../../components/ui/LazyImage/LazyImage';
import SEO from '../../components/common/SEO';
import { useTranslation, Trans } from 'react-i18next';
import './Contact.css';
import '../../styles/BackgroundShapes.css'; // Global CSS for Background Animated Shape
import type { ContactPageProps } from './Contact.types';
import { getAssetUrl } from '../../utils/assets';
import { ContactOptionCard } from '../../components/ui/Card/Card';
import { ChatWithUsRightCard } from '../../components/ui/Card/ChatWithUsRightCard';
import Button from '../../components/ui/Button/Button';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

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
  company: string; // Honeypot field
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  company: ''
};

const BackgroundShapes: React.FC = () => (
  <> {/* Bottom Shapes */}
    <ul className="shapes-container" aria-hidden="true">
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
      <li className="shape" />
    </ul>
    {/* Top Shapes */}
    <ul className="shapes-container-top" aria-hidden="true">
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
      <li className="shape-top" />
    </ul>
  </>
);

// --- 3D Gear Component ---
const FloatingGear: React.FC<{ position: [number, number, number], scale?: number, speed?: number }> = ({ position, scale = 1, speed = 0.2 }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const gearShape = React.useMemo(() => {
    const shape = new THREE.Shape();
    const teeth = 12;
    const rOuter = 3.2;
    const rInner = 2.3;
    const holeRadius = 1;

    // Start at inner radius (angle 0)
    shape.moveTo(rInner, 0);

    for (let i = 0; i < teeth; i++) {
      const theta = (Math.PI * 2 * i) / teeth;
      const step = (Math.PI * 2) / teeth;

      // Create a trapezoidal tooth profile (Cog shape)
      const aRise = theta + step * 0.15; // Start of rise
      const aTop = theta + step * 0.35;  // End of flat top
      const aFall = theta + step * 0.50; // End of fall
      const aNext = theta + step;        // End of valley

      shape.lineTo(Math.cos(aRise) * rOuter, Math.sin(aRise) * rOuter); // Rise to outer
      shape.lineTo(Math.cos(aTop) * rOuter, Math.sin(aTop) * rOuter);   // Move along outer
      shape.lineTo(Math.cos(aFall) * rInner, Math.sin(aFall) * rInner); // Fall to inner
      shape.lineTo(Math.cos(aNext) * rInner, Math.sin(aNext) * rInner); // Move along inner
    }
    shape.closePath();

    const hole = new THREE.Path();
    hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
    shape.holes.push(hole);

    return shape;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * speed; // Custom rotation speed
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2; // Slight tilt
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <extrudeGeometry args={[gearShape, { depth: 0.8, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 }]} />
      <meshStandardMaterial color="#51A2FF" metalness={0.7} roughness={0.3} opacity={0.15} transparent={true} />
    </mesh>
  );
};

const Contact: React.FC<ContactPageProps> = () => {
  const { t, i18n } = useTranslation();
  const tEn = i18n.getFixedT('en');

  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSending, setIsSending] = useState(false); // Used for Submit Button Loading Indicator
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Honeypot check
    if (formData.company) {
      console.warn('Bot detected via honeypot field');
      return;
    }

    setIsSending(true); // Start loading
    const recipient = 'info@kmti.com.ph'; // Company Email
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
    
    setTimeout(() => {
      setIsSending(false);
      setFormData(initialFormData); // Reset form
    }, 1000);
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
    <div className='contact-bg-wrapper'>
      <BackgroundShapes />
        <div className="sitemap-3d-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <FloatingGear position={[8, 4, 0]} scale={0.8} speed={0.15} />
            <FloatingGear position={[-10, -5, -2]} scale={1.2} speed={-0.1} />
            <FloatingGear position={[5, -8, -5]} scale={0.6} speed={0.2} />
          </Canvas>
        </div>
    <div className="contact-page">
      <SEO 
        title={tEn('nav.contact')} 
        description={tEn('contact.hero.description')} 
      />
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
      <section className="get-in-touch-section" data-aos="fade-up">
        <div className="container">
          <div className="get-in-touch-grid">
            {/* Left: Form */}
            <div className="contact-form-container" data-aos="fade-right">
              <h2 className="section-title">{t('contact.form.title')}</h2>
              {formError && <div className="contact-form-error" style={{ color: '#ff4d4f', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255, 77, 79, 0.1)', borderRadius: '4px', border: '1px solid rgba(255, 77, 79, 0.3)' }}>{formError}</div>}
              <form className="contact-form" onSubmit={handleSubmit}>
                {/* Honeypot Field - Hidden from Real Users via inline styles to avoid external CSS overrides making it visible */}
                <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: 'hidden' }} aria-hidden="true">
                  <label htmlFor="company">Company Name (Leave this blank)</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-field"
                    required
                  />
                  <label htmlFor="name" className="form-label">{t('contact.form.name')}</label>
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-field"
                    required
                  />
                  <label htmlFor="email" className="form-label">{t('contact.form.email')}</label>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder=" "
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-field"
                    required
                  />
                  <label htmlFor="subject" className="form-label">{t('contact.form.subject')}</label>
                </div>
                <div className="form-group">
                  <textarea
                    id="message"
                    name="message"
                    placeholder=" "
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-field"
                    required
                  />
                  <label htmlFor="message" className="form-label">{t('contact.form.message')}</label>
                </div>
                
                {/*Submit Button */}
                <Button variant="style1" type="submit" disabled={isSending}>{isSending ? (<>{t('contact.form.sending')}
                  <span className="button-loading-spinner"/></>) : (t('contact.form.send'))}
                </Button>

              </form>
            </div>

            {/* Right: Contact Information */}
            <div className="contact-info-container" data-aos="fade-left">
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
                  <p><a href="https://www.linkedin.com/company/kusakabe-maeno-tech-inc/" target="_blank" rel="noreferrer" className="contact-info-link">{t('common.brand_abbr')} LinkedIn</a></p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon-wrapper">
                  <LazyImage src={facebookIcon} alt="Facebook" wrapperClassName="contact-info-icon" />
                </div>
                <div className="contact-info-details">
                  <h3>Facebook</h3>
                  <p><a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="contact-info-link">{t('common.brand_abbr')} Facebook</a></p>
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
          title={`${t('common.brand_abbr')} Office Location`}
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
    </div>
  );
};

export default Contact;

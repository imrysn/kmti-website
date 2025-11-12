import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';
import { ContactPageProps } from './Contact.types';
import contactBg from '../../assets/contactusbg.jpg';
import emailIcon from '../../assets/icons/email-icon.png';
import lineIcon from '../../assets/icons/line-icon.png';
import linkedinIcon from '../../assets/icons/linkedin-icon.png';
import mapsIcon from '../../assets/icons/maps-icon.png';
import chatIcon from '../../assets/icons/chat-icon.png';
import circleIcon from '../../assets/icons/circle-icon.png';
import innovationIcon from '../../assets/icons/innovation-icon.png';
import { ContactOptionCard, ChatbotCard } from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';

const Contact: React.FC<ContactPageProps> = () => {
  const navigate = useNavigate();

  const handleGeneralInquiries = () => {
    window.location.href = 'mailto:info@kmti.com.ph';
  };

  const handleLineMessenger = () => {
    // LINE Messenger functionality will be added later
    window.open('https://line.me/R/ti/p/@kmti', '_blank');
  };

  const handleCareerApplication = () => {
    navigate('/careers');
  };

  const handleOfficeVisit = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=Team+Quest+Building+FCIE+Langkaan+Dasmarinas+City+Cavite', '_blank');
  };

  const handleTryChatbot = () => {
    // Chatbot functionality will be added later
    console.log('Try chatbot clicked');
  };

  const handleChatbotLine = () => {
    window.open('https://line.me/R/ti/p/@kmti', '_blank');
  };

  const handleChatbotFacebook = () => {
    window.open('https://www.facebook.com/kmti', '_blank');
  };

  return (
    <div className="contact-page">
      <section className="hero-section" style={{ backgroundImage: `url(${contactBg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">Need help or have a specific inquiry?</h1>
            <p className="contact-hero-description">
              You can reach our team directly through the options below - whether it's about our services, business inquiries, or career opportunities.
            </p>
          </div>
          <div className="contact-options-container">
            <div className="contact-options-grid">
              <ContactOptionCard
                icon={emailIcon}
                title="GENERAL INQUIRIES"
                description="info@kmti.com.ph"
                buttonText="SEND EMAIL"
                onButtonClick={handleGeneralInquiries}
              />
              <ContactOptionCard
                icon={lineIcon}
                title="SERVICE & PROJECT QUOTES"
                description="Chat via LINE Messenger"
                buttonText="MESSAGE US"
                onButtonClick={handleLineMessenger}
              />
              <ContactOptionCard
                icon={linkedinIcon}
                title="CAREER APPLICATION"
                description="Apply through LinkedIn"
                buttonText="VISIT CAREERS"
                onButtonClick={handleCareerApplication}
              />
              <ContactOptionCard
                icon={mapsIcon}
                title="OFFICE VISIT"
                description="View Map & Directions"
                buttonText="OPEN IN GOOGLE MAPS"
                onButtonClick={handleOfficeVisit}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chat With Us Section */}
      <section className="chat-with-us-section">
        <div className="chat-with-us-container container">
          <div className="chat-with-us-content">
            <div className="chat-with-us-left">
              <div className="chat-with-us-header">
                <div className="chat-with-us-icon-container">
                  <img src={chatIcon} alt="Chat" className="chat-with-us-icon" />
                </div>
                <h2 className="chat-with-us-title">
                  CHAT WITH US <span className="chat-with-us-title-highlight">ANYTIME</span>
                </h2>
              </div>
              <p className="chat-with-us-description">
                Our AI assistant can answer common questions about our services - Machine Design, Assembly, and Parts Inspection - and connect directly to our LINE support for real assistance.
              </p>
              <ul className="chat-with-us-features">
                <li className="chat-with-us-feature">
                  <img src={circleIcon} alt="Feature" className="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">24/7 Instant Answers:</strong>
                    <span className="chat-with-us-feature-text">Get quick responses to FAQs about our services, careers & application, and processes.</span>
                  </div>
                </li>
                <li className="chat-with-us-feature">
                  <img src={circleIcon} alt="Feature" className="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">Direct LINE Connection:</strong>
                    <span className="chat-with-us-feature-text">Need personalized help? Chat instantly with our team through LINE messenger.</span>
                  </div>
                </li>
                <li className="chat-with-us-feature">
                  <img src={circleIcon} alt="Feature" className="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">Smart & Helpful:</strong>
                    <span className="chat-with-us-feature-text">Our AI is trained on KMTI's expertise to provide accurate and relevant information.</span>
                  </div>
                </li>
                <li className="chat-with-us-feature">
                  <img src={innovationIcon} alt="Feature" className="chat-with-us-feature-icon" />
                  <div className="chat-with-us-feature-content">
                    <strong className="chat-with-us-feature-title">For Applicants:</strong>
                    <span className="chat-with-us-feature-text">For job inquiries or application updates, please reach us through our Facebook page or connect with us on LinkedIn via our Career Page.</span>
                  </div>
                </li>
              </ul>
              <div className="chat-with-us-button-wrapper">
                <Button variant="style1" onClick={handleTryChatbot}>
                  TRY CHATBOT NOW
                </Button>
              </div>
            </div>
            <div className="chat-with-us-right">
              <ChatbotCard
                onLineClick={handleChatbotLine}
                onFacebookClick={handleChatbotFacebook}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
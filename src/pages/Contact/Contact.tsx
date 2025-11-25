import React from 'react';
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
import { ContactOptionCard } from '../../components/ui/Card/Card';
import { ChatWithUsRightCard } from '../../components/ui/Card/ChatWithUsRightCard';
import Button from '../../components/ui/Button/Button';

const Contact: React.FC<ContactPageProps> = () => {

  const handleGeneralInquiries = () => {
    window.location.href = 'mailto:info@kmti.com.ph';
  };

  const handleLineMessenger = () => {
    window.open('https://line.me/R/ti/p/@kmti', '_blank');
  };

  const handleCareerApplication = () => {
    window.open('https://www.linkedin.com/company/kusakabe-maeno-tech-inc/jobs/', '_blank');
  };

  const handleOfficeVisit = () => {
    window.open('https://maps.app.goo.gl/efZ1dkgQFWRrP1M17', '_blank');
  };

  const handleTryChatbot = () => {
    // Dispatch reset event to reset chatbot to beginning
    window.dispatchEvent(new CustomEvent('reset-chatbot'));

    // Ensure chatbot is open
    const chatbotButton = document.querySelector('.chatbot-button') as HTMLButtonElement;
    if (chatbotButton && chatbotButton.disabled) {
      // Chatbot is already open, just scroll to it
      setTimeout(() => {
        const chatbotPanel = document.querySelector('.chatbot-panel');
        if (chatbotPanel) {
          chatbotPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } else if (chatbotButton && !chatbotButton.disabled) {
      // Chatbot is closed, open it (reset will happen via event)
      chatbotButton.click();
    }
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

      {/* OR Divider */}
      <div className="or-divider-container">
        <div className="or-divider-wrapper">
          <div className="or-divider-line"></div>
          <span className="or-divider-text">OR</span>
          <div className="or-divider-line"></div>
        </div>
        <p className="or-divider-description">Chat with our AI Assistant Anytime</p>
      </div>

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
              <div className="chat-with-us-header-line"></div>
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
              <ChatWithUsRightCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
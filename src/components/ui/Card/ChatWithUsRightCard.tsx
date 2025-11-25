import React from 'react';
import './chatbot.css';
import defaultProfileImage from '../../../assets/profile.png';
import lineIcon from '../../../assets/icons/line.png';
import facebookIcon from '../../../assets/icons/facebook.png';
import menuIcon from '../../../assets/icons/menu-icon.png';
import './ChatWithUsRightCard.css';

interface ChatWithUsRightCardProps {
  profileImage?: string;
  className?: string;
}

const ChatWithUsRightCard: React.FC<ChatWithUsRightCardProps> = ({
  profileImage,
  className = '',
}) => {
  return (
    <div className={`chatbot-card chat-with-us-right-card ${className}`}>
      {/* Header Section */}
      <div className="chatbot-card-top">
        <div className="chatbot-card-header-content">
          <div className="chatbot-card-header-avatar">
            <img
              src={profileImage || defaultProfileImage}
              alt="KMTI Bot"
              className="chatbot-card-header-avatar-img"
            />
          </div>
          <div className="chatbot-card-header-text">
            <div className="chatbot-card-header-title">KMTI Bot Assistant</div>
            <div className="chatbot-card-header-status">
              <span className="chatbot-card-status-dot"></span>
              <span className="chatbot-card-status-text">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body Section - Static Messages */}
      <div className="chatbot-card-body">
        {/* Greeting Message */}
        <div className="chatbot-card-message-bubble">
          <div className="chatbot-card-message-icon-left">
            <img
              src={profileImage || defaultProfileImage}
              alt="Bot"
              className="chatbot-card-message-bot-icon"
            />
          </div>
          <div className="chatbot-card-message-content">
            <div className="chatbot-card-message-text-content">
              <p style={{ margin: 0, marginBottom: '0.5rem' }}>
                Hi there! I'm KMTI Assistant 👋 How can I help you today?
              </p>
            </div>
            {/* Static Menu Buttons */}
            <div className="chatbot-card-menu-buttons">
              <div className="chatbot-card-menu-button">
                <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="6" width="16" height="14" rx="1" fill="#DC2626" />
                  <rect x="6" y="4" width="12" height="2" rx="1" fill="#DC2626" />
                  <rect x="8" y="9" width="2" height="2" rx="0.5" fill="white" />
                  <rect x="11" y="9" width="2" height="2" rx="0.5" fill="white" />
                  <rect x="14" y="9" width="2" height="2" rx="0.5" fill="white" />
                  <rect x="8" y="12" width="2" height="2" rx="0.5" fill="white" />
                  <rect x="11" y="12" width="2" height="2" rx="0.5" fill="white" />
                  <rect x="14" y="12" width="2" height="2" rx="0.5" fill="white" />
                  <path d="M10 16H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="chatbot-card-menu-button-text">Our Services</span>
              </div>
              <div className="chatbot-card-menu-button">
                <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="7" width="14" height="12" rx="1" fill="#92400E" />
                  <path d="M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7" stroke="#92400E" strokeWidth="1.5" fill="#92400E" />
                  <rect x="8" y="11" width="8" height="1" rx="0.5" fill="white" />
                  <rect x="8" y="13" width="6" height="1" rx="0.5" fill="white" />
                </svg>
                <span className="chatbot-card-menu-button-text">Careers & Application</span>
              </div>
              <div className="chatbot-card-menu-button">
                <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#DC2626" />
                  <circle cx="12" cy="9" r="3" fill="white" />
                </svg>
                <span className="chatbot-card-menu-button-text">Office Location</span>
              </div>
              <div className="chatbot-card-menu-button">
                <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" fill="#DC2626" />
                  <text x="12" y="15" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">SOS</text>
                </svg>
                <span className="chatbot-card-menu-button-text">Contact Support</span>
              </div>
              <div className="chatbot-card-menu-button">
                <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#3B82F6" />
                  <text x="12" y="16" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">i</text>
                </svg>
                <span className="chatbot-card-menu-button-text">About KMTI</span>
              </div>
            </div>
          </div>
        </div>

        {/* LINE Message */}
        <div className="chatbot-card-message-bubble">
          <div className="chatbot-card-message-icon-left">
            <img
              src={profileImage || defaultProfileImage}
              alt="Bot"
              className="chatbot-card-message-bot-icon"
            />
          </div>
          <div className="chatbot-card-message-content">
            <div className="chatbot-card-message-text-content">
              <p style={{ margin: 0, marginBottom: '0.5rem' }}>
                Got product or service inquiries? Message our support team on LINE.
              </p>
              <div className="chatbot-card-action-buttons">
                <div className="chatbot-card-action-button chatbot-card-line-button">
                  <img
                    src={lineIcon}
                    alt="LINE"
                    className="chatbot-card-action-button-icon"
                  />
                  <span className="chatbot-card-action-button-text">Message us on LINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facebook Message */}
        <div className="chatbot-card-message-bubble">
          <div className="chatbot-card-message-icon-left">
            <img
              src={profileImage || defaultProfileImage}
              alt="Bot"
              className="chatbot-card-message-bot-icon"
            />
          </div>
          <div className="chatbot-card-message-content">
            <div className="chatbot-card-message-text-content">
              <p style={{ margin: 0, marginBottom: '0.5rem' }}>
                Interested in joining us? Chat with our HR team on Facebook.
              </p>
              <div className="chatbot-card-action-buttons">
                <div className="chatbot-card-action-button chatbot-card-facebook-button">
                  <img
                    src={facebookIcon}
                    alt="Facebook"
                    className="chatbot-card-action-button-icon"
                  />
                  <span className="chatbot-card-action-button-text">Chat us on Facebook</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section - Static */}
      <div className="chatbot-card-footer">
        <div className="chatbot-card-input" style={{ cursor: 'default', color: 'rgba(255, 255, 255, 0.5)' }}>
          Type a message...
        </div>
        <div className="chatbot-card-menu-icon-wrapper">
          <img src={menuIcon} alt="Menu" className="chatbot-card-menu-icon" />
        </div>
      </div>
    </div>
  );
};

export { ChatWithUsRightCard };
export default ChatWithUsRightCard;


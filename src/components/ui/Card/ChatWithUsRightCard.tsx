import React from 'react';
import { useTranslation } from 'react-i18next'; // Added for translation
import './chatbot.css';
import { getAssetUrl } from '../../../utils/assets';
const defaultProfileImage = getAssetUrl('logo/profile.png');
const facebookIcon = getAssetUrl('icons/facebook.png');
const menuIcon = getAssetUrl('icons/menu-icon.png');
import './ChatWithUsRightCard.css';
import LazyImage from '../LazyImage/LazyImage';

interface ChatWithUsRightCardProps {
  profileImage?: string;
  className?: string;
}

const ChatWithUsRightCard: React.FC<ChatWithUsRightCardProps> = ({
  profileImage,
  className = '',
}) => {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <div className={`chatbot-card chat-with-us-right-card ${className}`}>
      {/* Header Section */}
      <div className="chatbot-card-top">
        <div className="chatbot-card-header-content">
          <div className="chatbot-card-header-avatar">
            <LazyImage
              src={profileImage || defaultProfileImage}
              alt="KMTI Bot"
              className="chatbot-card-header-avatar-img"
              loading="eager"
            />
          </div>
          <div className="chatbot-card-header-text">
            <div className="chatbot-card-header-title">{t('chatbot_card.header.name')}</div>
            <div className="chatbot-card-header-status">
              <span className="chatbot-card-status-dot"></span>
              <span className="chatbot-card-status-text">{t('chatbot_card.header.status')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body Section - Static Messages */}
      <div className="chatbot-card-body">
        {/* Greeting Message */}
        <div className="chatbot-card-message-bubble">
          <div className="chatbot-card-message-icon-left">
            <LazyImage
              src={profileImage || defaultProfileImage}
              alt="Bot"
              className="chatbot-card-message-bot-icon"
            />
          </div>
          <div className="chatbot-card-message-content">
            <div className="chatbot-card-message-text-content">
              <p style={{ margin: 0, marginBottom: '0.5rem' }}>
                {t('chatbot_card.body.greeting')}
              </p>
            </div>
            {/* Static Menu Buttons */}
            <div className="chatbot-card-menu-buttons">
              <div className="chatbot-card-menu-button">
                {/* SVG Icons remain unchanged */}
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
                <span className="chatbot-card-menu-button-text">{t('chatbot_card.menu.services')}</span>
              </div>
              <div className="chatbot-card-menu-button">
                <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="7" width="14" height="12" rx="1" fill="#92400E" />
                  <path d="M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7" stroke="#92400E" strokeWidth="1.5" fill="#92400E" />
                  <rect x="8" y="11" width="8" height="1" rx="0.5" fill="white" />
                  <rect x="8" y="13" width="6" height="1" rx="0.5" fill="white" />
                </svg>
                <span className="chatbot-card-menu-button-text">{t('chatbot_card.menu.careers')}</span>
              </div>
              <div className="chatbot-card-menu-button">
                <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#DC2626" />
                  <circle cx="12" cy="9" r="3" fill="white" />
                </svg>
                <span className="chatbot-card-menu-button-text">{t('chatbot_card.menu.location')}</span>
              </div>
              <div className="chatbot-card-menu-button">
                <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" fill="#DC2626" />
                  <text x="12" y="15" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">SOS</text>
                </svg>
                <span className="chatbot-card-menu-button-text">{t('chatbot_card.menu.support')}</span>
              </div>
              <div className="chatbot-card-menu-button">
                <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#3B82F6" />
                  <text x="12" y="16" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">i</text>
                </svg>
                <span className="chatbot-card-menu-button-text">{t('chatbot_card.menu.about')}</span>
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
                {t('chatbot_card.body.hr_message')}
              </p>
              <div className="chatbot-card-action-buttons">
                <div className="chatbot-card-action-button chatbot-card-facebook-button">
                  <LazyImage
                    src={facebookIcon}
                    alt="Facebook"
                    className="chatbot-card-action-button-icon"
                  />
                  <span className="chatbot-card-action-button-text">{t('chatbot_card.body.fb_btn')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section - Static */}
      <div className="chatbot-card-footer">
        <div className="chatbot-card-input" style={{ cursor: 'default', color: 'rgba(255, 255, 255, 0.5)' }}>
          {t('chatbot_card.footer.placeholder')}
        </div>
        <div className="chatbot-card-menu-icon-wrapper">
          <LazyImage src={menuIcon} alt="Menu" className="chatbot-card-menu-icon" />
        </div>
      </div>
    </div>
  );
};

export { ChatWithUsRightCard };
export default ChatWithUsRightCard;
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAssetUrl } from '../../../utils/assets';
import { ChatbotCard } from '../../ui/Card/chatbot';
import './ChatbotButton.css';
import LazyImage from '../../ui/LazyImage/LazyImage';

const botIcon = getAssetUrl('icons/bot-icon.webp');

const ChatbotButton: React.FC = () => {
  const { t } = useTranslation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showTeaser, setShowTeaser] = useState(false);

  // Trigger teaser after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTeaser(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  // Listen for reset event from other components
  useEffect(() => {
    const handleResetChatbot = () => {
      setResetTrigger((prev) => prev + 1);
      // Ensure chatbot is open when reset
      if (!isChatOpen) {
        setIsChatOpen(true);
        setShowTeaser(false); // Hide teaser when chat opens
      }
    };

    window.addEventListener('reset-chatbot', handleResetChatbot);
    return () => {
      window.removeEventListener('reset-chatbot', handleResetChatbot);
    };
  }, [isChatOpen]);

  // Reset chatbot when language changes
  useEffect(() => {
    setResetTrigger((prev) => prev + 1);
  }, [t]);

  const handleToggle = () => {
    if (!isChatOpen) {
      // Open chatbot without resetting - preserve previous state
      setIsChatOpen(true);
      setShowTeaser(false); // Hide teaser when chat opens
    }
  };

  const handleClose = useCallback(() => {
    setIsChatOpen(false);
    // Don't reset - maintain conversation state
  }, []);

  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/kmti.com.ph/', '_blank');
  };

  return (
    <>
      {!isChatOpen && showTeaser && (
        <div className="chatbot-teaser">
          {t('common.chatbot.teaser')}
          <span
            className="chatbot-teaser-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}
          >
            ×
          </span>
        </div>
      )}
      <button
        className={`chatbot-button ${isChatOpen ? 'chatbot-button-disabled' : ''}`}
        onClick={handleToggle}
        aria-label={isChatOpen ? "Close chatbot" : "Open chatbot"}
        aria-expanded={isChatOpen}
        disabled={isChatOpen}
        style={{ pointerEvents: isChatOpen ? 'none' : 'auto' }}
      >
        <LazyImage src={botIcon} alt="Chatbot" className="chatbot-button-icon" loading="eager" />
      </button>

      <div className={`chatbot-panel ${isChatOpen ? 'chatbot-panel-open' : 'chatbot-panel-closed'}`}>
        <ChatbotCard
          onFacebookClick={handleFacebookClick}
          onClose={handleClose}
          resetTrigger={resetTrigger}
          isOpen={isChatOpen}
        />
      </div>
    </>
  );
};

export default ChatbotButton;

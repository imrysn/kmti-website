import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAssetUrl } from '../../../utils/assets';
const botIcon = getAssetUrl('icons/bot-icon.png');
import { ChatbotCard } from '../../ui/Card/chatbot';
import './ChatbotButton.css';

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

  const handleToggle = () => {
    if (!isChatOpen) {
      // Open chatbot without resetting - preserve previous state
      // Only "TRY CHATBOT NOW" button triggers reset via reset-chatbot event
      setIsChatOpen(true);
      setShowTeaser(false); // Hide teaser when chat opens
    }
  };

  const handleClose = useCallback(() => {
    setIsChatOpen(false);
    // Don't reset - maintain conversation state
    // Note: We don't reshow the teaser after closing to avoid annoyance
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
        <img src={botIcon} alt="Chatbot" className="chatbot-button-icon" />
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

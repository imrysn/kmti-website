import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getAssetUrl } from '../../../utils/assets';
import { ChatbotCard } from '../../ui/Card/chatbot';
import './ChatbotButton.css';
import LazyImage from '../../ui/LazyImage/LazyImage';

const botIcon = getAssetUrl('icons/bot-icon.png');

const ChatbotButton: React.FC = () => {
  const { t } = useTranslation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isTeaserDismissed, setIsTeaserDismissed] = useState(false);
  const location = useLocation();

  // Reset the dismissed state when the user navigates to a new page
  useEffect(() => {
    setIsTeaserDismissed(false);
  }, [location.pathname]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Hide and Stop the Loop if the chat is opened or the teaser is dismissed
    if (isChatOpen || isTeaserDismissed) {
      setShowTeaser(false);
      return;
    }

    const teaserCycle = () => {
      setShowTeaser(true);
      const hideTimer = setTimeout(() => {
        setShowTeaser(false);

        // 15s hidden duration before showing the teaser again
        const loopTimer = setTimeout(teaserCycle, 15000); // 15s hidden duration
        timers.push(loopTimer);

      }, 5000); // 5s visible duration
      timers.push(hideTimer);
    };

    // Initial 3s delay before the first cycle starts.
    const initialDelayTimer = setTimeout(teaserCycle, 3000);
    timers.push(initialDelayTimer);

    // Timer Cleanup Function
    return () => timers.forEach(clearTimeout);
  }, [isChatOpen, isTeaserDismissed]);

  // Listen for reset event from other components
  useEffect(() => {
    const handleResetChatbot = () => {
      setResetTrigger((prev) => prev + 1);
      if (!isChatOpen) {
        setIsChatOpen(true);
        setShowTeaser(false);
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
      setShowTeaser(false)
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
          {(() => {
            const teaserText = t('common.chatbot.teaser');
            const parts = teaserText.split('👋');
            return (
              <>{parts[0]}<span className="waving-hand">👋</span>{parts[1]}</>
            );
          })()}
          <span
            className="chatbot-teaser-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
              setIsTeaserDismissed(true);
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

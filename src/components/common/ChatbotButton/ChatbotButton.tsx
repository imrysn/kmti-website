import React, { useState, useCallback } from 'react';
import botIcon from '../../../assets/icons/bot-icon.png';
import { ChatbotCard } from '../../ui/Card/chatbot';
import './ChatbotButton.css';

const ChatbotButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggle = () => {
    if (!isChatOpen) {
      setIsChatOpen(true);
    }
  };

  const handleClose = useCallback(() => {
    setIsChatOpen(false);
    // Don't reset - maintain conversation state
  }, []);

  const handleLineClick = () => {
    window.open('https://line.me/ti/p/~emji000', '_blank');
  };

  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/kmti.com.ph/', '_blank');
  };

  return (
    <>
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
          onLineClick={handleLineClick}
          onFacebookClick={handleFacebookClick}
          onClose={handleClose}
        />
      </div>
    </>
  );
};

export default ChatbotButton;

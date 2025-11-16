import React from 'react';
import botIcon from '../../../assets/icons/bot-icon.png';
import './ChatbotButton.css';

const ChatbotButton: React.FC = () => {
  const handleClick = () => {
    // Chatbot functionality will be added later
    console.log('Chatbot button clicked');
  };

  return (
    <button className="chatbot-button" onClick={handleClick} aria-label="Open chatbot">
      <img src={botIcon} alt="Chatbot" className="chatbot-button-icon" />
    </button>
  );
};

export default ChatbotButton;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './chatbot.css';
import defaultProfileImage from '../../../assets/profile.png';

import menuIcon from '../../../assets/icons/menu-icon.png';

interface ChatbotCardProps {
  profileImage?: string;
  onFacebookClick?: () => void;
  onClose?: () => void;
  className?: string;
  resetTrigger?: number;
  isOpen?: boolean;
}

type MessageType = 'bot' | 'user' | 'typing';

interface Message {
  id: string;
  type: MessageType;
  content?: {
    text?: string;
    buttons?: ButtonOption[];
    actionButtons?: ActionButton[];
  };
  timestamp: Date;
}

interface ButtonOption {
  id: string;
  text: string;
  icon?: React.ReactNode;
  action: string;
}

interface ActionButton {
  id: string;
  text: string;
  icon?: string;
  action: 'facebook' | 'maps' | 'apply' | 'call' | 'message' | 'back' | 'email' | 'start-over' | 'talk-to-human';
  url?: string;
  navigateAction?: string;
}

const ChatbotCard: React.FC<ChatbotCardProps> = ({
  profileImage,
  onFacebookClick,
  onClose,
  className = '',
  resetTrigger,
  isOpen = false,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const initializationRef = useRef(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const hasInitializedRef = useRef(false);

  // --- Reset Functionality ---
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current = [];
      initializationRef.current = false;
      hasInitializedRef.current = false;
      setMessages([]);
      setInputValue('');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsInitializing(true);
        });
      });
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (isOpen && !hasInitializedRef.current && messages.length === 0 && !initializationRef.current) {
      setIsInitializing(true);
      hasInitializedRef.current = true;
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Initialization Flow (Greeting & Facebook Teaser) ---
  useEffect(() => {
    const hasTypingIndicators = messages.some((msg) => msg.type === 'typing');
    if (!isInitializing || initializationRef.current || messages.length > 0 || hasTypingIndicators || !isOpen) return;
    initializationRef.current = true;

    const showTypingIndicator = (id: string): string => {
      const typingId = `typing-${id}-${Date.now()}`;
      setMessages((prev) => [...prev, { id: typingId, type: 'typing', timestamp: new Date() }]);
      return typingId;
    };

    const removeTypingIndicator = (typingId: string) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== typingId));
    };

    const t1 = showTypingIndicator('greeting');
    const timeout1 = setTimeout(() => {
      removeTypingIndicator(t1);
      setMessages(prev => [...prev, generateBotResponse('initial-greeting')]);

      const timeout2 = setTimeout(() => {
        const t2 = showTypingIndicator('facebook');
        const timeout3 = setTimeout(() => {
          removeTypingIndicator(t2);
          setMessages(prev => [...prev, generateBotResponse('facebook-teaser')]);
          setIsInitializing(false);
        }, 1000);
        timeoutRefs.current.push(timeout3);
      }, 800);
      timeoutRefs.current.push(timeout2);
    }, 1000);
    timeoutRefs.current.push(timeout1);

    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      initializationRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitializing, isOpen, i18n.language]);

  // --- Keyword Matching (Documentation Exhaustive List) ---
  const matchInputToAction = (input: string): string | null => {
    const normalized = input.toLowerCase().trim();
    const keywordMap: { [key: string]: string } = {
      // Services
      'services': 'services', 'service': 'services', 'our services': 'services', 'サービス': 'services',
      '3d modeling': '3d-modeling', '3d': '3d-modeling', 'modeling': '3d-modeling', '3dモデリング': '3d-modeling',
      '2d detailing': '2d-detailing', '2d': '2d-detailing', 'detailing': '2d-detailing', '2d詳細設計': '2d-detailing',
      'parts inspection': 'parts-inspection', 'inspection': 'parts-inspection', 'parts': 'parts-inspection', '部品検査': 'parts-inspection',
      'machine assembly': 'machine-assembly', 'assembly': 'machine-assembly', 'machine': 'machine-assembly', '機械組立': 'machine-assembly',

      // Careers
      'careers': 'careers', 'career': 'careers', 'application': 'careers', 'apply': 'careers', 'job': 'careers', 'jobs': 'careers', '採用': 'careers', '求人': 'careers',
      'how to apply': 'how-to-apply', 'apply now': 'how-to-apply', '応募方法': 'how-to-apply',
      'hiring process': 'hiring-process', 'process': 'hiring-process', '選考プロセス': 'hiring-process',
      'working schedule': 'working-schedule', 'schedule': 'working-schedule', 'hours': 'working-schedule', '勤務スケジュール': 'working-schedule',
      'contact hr': 'contact-hr', 'hr': 'contact-hr', '人事': 'contact-hr',
      'benefits': 'benefits', 'compensation': 'benefits', 'salary': 'benefits', 'pay': 'benefits', '福利厚生': 'benefits',
      'requirements': 'application-requirement', 'qualifications needed': 'application-requirement', '応募要件': 'application-requirement',
      'training': 'training', 'development': 'training', '研修': 'training',
      'application status': 'application-status', 'status': 'application-status', '進捗': 'application-status',

      // Client Questions
      'price': 'pricing', 'pricing': 'pricing', 'cost': 'pricing', 'quote': 'pricing', '見積': 'pricing',
      'timeline': 'timeline', 'duration': 'timeline', '納期': 'timeline',
      'projects': 'projects', 'portfolio': 'projects', '実績': 'projects',
      'workflow': 'process', 'how it works': 'process', '流れ': 'process',
      'consultation': 'consultation', 'meeting': 'consultation', '相談': 'consultation',
      'payment': 'payment', 'billing': 'payment', '支払': 'payment',

      // General
      'location': 'location', 'office': 'location', '住所': 'location', '場所': 'location',
      'support': 'support', 'contact': 'support', 'help': 'support', 'サポート': 'support',
      'about': 'about', 'company': 'about', '会社概要': 'about',
      'main menu': 'main-menu', 'menu': 'main-menu', 'ホーム': 'main-menu', 'メニュー': 'main-menu',
      'start over': 'start-over', 'reset': 'start-over', '最初から': 'start-over',
      'talk to human': 'talk-to-human', 'human': 'talk-to-human', '担当者': 'talk-to-human'
    };

    if (keywordMap[normalized]) return keywordMap[normalized];
    for (const [keyword, action] of Object.entries(keywordMap)) {
      if (normalized.includes(keyword)) return action;
    }
    return null;
  };

  const generateBotResponse = (action: string): Message => {
    const resBase = `chatbot_card.responses.${action}`;
    const messageId = action === 'initial-greeting' ? 'greeting-1' : action === 'facebook-teaser' ? 'facebook-1' : `bot-${Date.now()}`;

    // Map SVGs to translated buttons based on action keys
    const rawButtons = t(`${resBase}.buttons`, { returnObjects: true, defaultValue: [] }) as ButtonOption[];
    const buttons = rawButtons.map(btn => {
      if (btn.action === 'services') btn.icon = <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="14" rx="1" fill="#DC2626" /><path d="M10 16H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>;
      if (btn.action === 'careers') btn.icon = <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none"><rect x="5" y="7" width="14" height="12" rx="1" fill="#92400E" /><path d="M9 7V5c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v2" stroke="#92400E" fill="#92400E" /></svg>;
      if (btn.action === 'location') btn.icon = <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#DC2626" /><circle cx="12" cy="9" r="3" fill="white" /></svg>;
      if (btn.action === 'support') btn.icon = <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" fill="#DC2626" /><text x="12" y="15" fill="white" textAnchor="middle" fontSize="8" fontWeight="bold">SOS</text></svg>;
      if (btn.action === 'about') btn.icon = <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#3B82F6" /><text x="12" y="16" fill="white" textAnchor="middle" fontSize="12" fontWeight="bold">i</text></svg>;
      return btn;
    });

    return {
      id: messageId,
      type: 'bot',
      content: {
        text: t(`${resBase}.text`),
        buttons: buttons.length > 0 ? buttons : undefined,
        actionButtons: t(`${resBase}.actionButtons`, { returnObjects: true, defaultValue: [] }) as ActionButton[],
      },
      timestamp: new Date(),
    };
  };

  const handleButtonClick = (action: string, buttonText: string) => {
    if (action === 'start-over') {
      window.dispatchEvent(new CustomEvent('reset-chatbot'));
      setMessages([]); setInputValue(''); initializationRef.current = false; hasInitializedRef.current = false; setIsInitializing(true);
      return;
    }

    const navMap: Record<string, string> = {
      'learn-more-3d': '/services?service=3d-modeling',
      'learn-more-2d': '/services?service=2d-detailing',
      'learn-more-inspection': '/services?service=parts-inspection',
      'learn-more-assembly': '/services?service=machine-assembly',
      'learn-more-about': '/about', 'go-projects': '/projects', 'view-projects': '/projects'
    };

    if (navMap[action]) {
      if (onClose) onClose();
      navigate(navMap[action]);
      return;
    }

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, type: 'user', content: { text: buttonText }, timestamp: new Date() }]);
    const typingId = `typing-${Date.now()}`;
    setMessages((prev) => [...prev, { id: typingId, type: 'typing', timestamp: new Date() }]);

    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== typingId));
      setMessages((prev) => [...prev, generateBotResponse(action)]);
    }, 1000);
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    const matched = matchInputToAction(inputValue);
    if (matched) handleButtonClick(matched, inputValue);
    else {
      setMessages((prev) => [...prev, { id: `user-${Date.now()}`, type: 'user', content: { text: inputValue }, timestamp: new Date() }]);
      const tid = `typing-${Date.now()}`;
      setMessages((prev) => [...prev, { id: tid, type: 'typing', timestamp: new Date() }]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== tid));
        setMessages((prev) => [...prev, generateBotResponse('default')]);
      }, 1000);
    }
    setInputValue('');
  };

  const handleActionButtonClick = (action: ActionButton) => {
    if (action.action === 'facebook' || action.action === 'message') {
      if (action.action === 'facebook' && onFacebookClick) {
        onFacebookClick();
      } else {
        window.open(action.url || 'https://www.facebook.com/kmti.com.ph/', '_blank');
      }
    }
    else if (action.action === 'maps') window.open('https://maps.app.goo.gl/CyS8xB8sLNPaSYoc8', '_blank');
    else if (action.action === 'call') window.location.href = 'tel:+63464134509';
    else if (action.action === 'email') window.open(action.url || 'mailto:info@kmti.com.ph', '_blank');
    else if (action.action === 'start-over') handleButtonClick('start-over', '');
    else if (action.action === 'talk-to-human') handleButtonClick('talk-to-human', action.text);
    else if (action.navigateAction) handleButtonClick(action.navigateAction, action.text);
    else if (action.action === 'apply') {
      if (action.url) window.open(action.url, '_blank');
      else { if (onClose) onClose(); navigate('/careers'); }
    }
  };

  return (
    <div className={`chatbot-card ${className}`}>
      <div className="chatbot-card-top">
        <div className="chatbot-card-header-content">
          <div className="chatbot-card-header-avatar">
            <img src={profileImage || defaultProfileImage} alt="Bot" className="chatbot-card-header-avatar-img" />
          </div>
          <div className="chatbot-card-header-text">
            <div className="chatbot-card-header-title">{t('chatbot_card.header.name')}</div>
            <div className="chatbot-card-header-status">
              <span className="chatbot-card-status-dot"></span>
              <span className="chatbot-card-status-text">{t('chatbot_card.header.status')}</span>
            </div>
          </div>
          {onClose && (
            <button className="chatbot-card-close-button" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="chatbot-card-body" ref={bodyRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`chatbot-card-message-bubble ${msg.type === 'user' ? 'chatbot-card-message-user' : ''}`}>
            {msg.type !== 'user' && (
              <div className="chatbot-card-message-icon-left">
                <img src={profileImage || defaultProfileImage} alt="Bot" className="chatbot-card-message-bot-icon" />
              </div>
            )}
            <div className={`chatbot-card-message-content ${msg.type === 'user' ? 'chatbot-card-message-content-user' : ''}`}>
              {msg.type === 'typing' ? (
                <div className="chatbot-card-typing-indicator"><span></span><span></span><span></span></div>
              ) : (
                <div className={`chatbot-card-message-text-content ${msg.type === 'user' ? 'chatbot-card-message-text-content-user' : ''}`}>
                  {msg.content?.text && (
                    <p style={{ margin: 0 }}>
                      {msg.content.text.split('\n').map((line, i, arr) => (
                        <React.Fragment key={i}>
                          {(line.includes(':') && i === 0) ? <strong>{line}</strong> : line}
                          {i < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  )}
                  {msg.content?.actionButtons && msg.content.actionButtons.length > 0 && (
                    <div className="chatbot-card-action-buttons">
                      {msg.content.actionButtons.map((btn) => (
                        <button key={btn.id} className="chatbot-card-action-button chatbot-card-apply-button" onClick={() => handleActionButtonClick(btn)}>
                          <span className="chatbot-card-action-button-text">{btn.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.content?.buttons && msg.content.buttons.length > 0 && (
                    <div className="chatbot-card-menu-buttons">
                      {msg.content.buttons.map((btn) => (
                        <button key={btn.id} className="chatbot-card-menu-button chatbot-card-menu-button-clickable" onClick={() => handleButtonClick(btn.action, btn.text)}>
                          {btn.icon}<span className="chatbot-card-menu-button-text">{btn.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-card-footer">
        <input
          type="text"
          placeholder={t('chatbot_card.footer.placeholder')}
          className="chatbot-card-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
        />
        <div className="chatbot-card-menu-icon-wrapper chatbot-card-menu-icon-clickable" onClick={() => handleButtonClick('main-menu', 'Menu')}>
          <img src={menuIcon} alt="Menu" className="chatbot-card-menu-icon" />
        </div>
      </div>
    </div>
  );
};

export { ChatbotCard };
export default ChatbotCard;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './chatbot.css';
import { getAssetUrl } from '../../../utils/assets';
import LazyImage from '../LazyImage/LazyImage';
const defaultProfileImage = getAssetUrl('logo/profile.webp');
const menuIcon = getAssetUrl('icons/menu-icon.webp');

// Helper for fuzzy matching (Levenshtein Distance)
// Returns the number of edits (insertions, deletions, substitutions) needed to turn 'a' into 'b'
const levenshteinDistance = (a: string, b: string): number => {
  // Make a the shorter string for optimization
  if (a.length > b.length) {
    [a, b] = [b, a];
  }
  
  const m = a.length;
  const n = b.length;
  
  // Use two rows instead of full matrix
  let prevRow = Array(m + 1).fill(0).map((_, i) => i);
  let currRow = Array(m + 1).fill(0);
  
  for (let i = 1; i <= n; i++) {
    currRow[0] = i;
    
    for (let j = 1; j <= m; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1,        // deletion
        currRow[j - 1] + 1,    // insertion
        prevRow[j - 1] + cost  // substitution
      );
    }
    
    [prevRow, currRow] = [currRow, prevRow];
  }
  
  return prevRow[m];
};

// Detect language mixing and respond appropriately
const detectLanguageMixing = (text: string): boolean => {
  const japaneseChars = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
  const englishChars = /[a-zA-Z]/;
  
  const hasJapanese = japaneseChars.test(text);
  const hasEnglish = englishChars.test(text);
  
  return hasJapanese && hasEnglish;
};

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
    actionButtons?: ActionButton[]
    copyable?: boolean;
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

// New component for each Q&A item to fix the hook error
const QAItem: React.FC<{ qa: { user: string; bot: string; }; index: number }> = ({ qa, index }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(false);
  const isLongAnswer = qa.bot.length > 200;

  return (
    <div className="chatbot-qa-item">
      <div className="chatbot-qa-question">
        <strong>{t('chatbot_card.qa_modal.question_prefix')}{index + 1}:</strong> {qa.user}
      </div>
      <div className="chatbot-qa-answer">
        <strong>{t('chatbot_card.qa_modal.answer_prefix')}:</strong>{' '}
        {isLongAnswer && !expanded ? (
          <>
            {qa.bot.substring(0, 200)}...
            <button
              className="chatbot-qa-expand-btn"
              onClick={() => setExpanded(true)}
            >
              {t('chatbot_card.qa_modal.show_more')}
            </button>
          </>
        ) : (
          <>
            {qa.bot}
            {isLongAnswer && expanded && (
              <button
                className="chatbot-qa-expand-btn"
                onClick={() => setExpanded(false)}
              >
                {t('chatbot_card.qa_modal.show_less')}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// New component for each message bubble to manage its own state (like 'copied') and clean up the main component
const MessageBubble: React.FC<{
  msg: Message;
  profileImage: string;
  onButtonClick: (action: string, text: string) => void;
  onActionButtonClick: (action: ActionButton) => void;
}> = ({ msg, profileImage, onButtonClick, onActionButtonClick }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (msg.content?.text) {
      navigator.clipboard.writeText(msg.content.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className={`chatbot-card-message-bubble ${msg.type === 'user' ? 'chatbot-card-message-user' : ''}`}>
      {msg.type !== 'user' && (
        <div className="chatbot-card-message-icon-left">
          <LazyImage src={profileImage} alt="Bot" className="chatbot-card-message-bot-icon" />
        </div>
      )}
      <div className={`chatbot-card-message-content ${msg.type === 'user' ? 'chatbot-card-message-content-user' : ''}`}>
        {msg.type === 'typing' ? (
          <div className="chatbot-card-typing-indicator"><span></span><span></span><span></span></div>
        ) : (
          <div className={`chatbot-card-message-text-content ${msg.type === 'user' ? 'chatbot-card-message-text-content-user' : ''}`}>
            {msg.content?.text && (
              <p>{msg.content.text}</p>
            )}
            {msg.content?.copyable && (
              <button onClick={handleCopy} className="chatbot-copy-btn">
                {isCopied ? '✅ Copied' : '📋 Copy'}
              </button>
            )}
            {msg.content?.actionButtons && msg.content.actionButtons.length > 0 && (
              <div className="chatbot-card-action-buttons">
                {msg.content.actionButtons.map((btn) => (
                  <button key={btn.id} className="chatbot-card-action-button chatbot-card-apply-button" onClick={() => onActionButtonClick(btn)}>
                    <span className="chatbot-card-action-button-text">{btn.text}</span>
                  </button>
                ))}
              </div>
            )}
            {msg.content?.buttons && msg.content.buttons.length > 0 && (
              <div className="chatbot-card-menu-buttons">
                {msg.content.buttons.map((btn) => (
                  <button key={btn.id} className="chatbot-card-menu-button chatbot-card-menu-button-clickable" onClick={() => onButtonClick(btn.action, btn.text)}>
                    {btn.icon}<span className="chatbot-card-menu-button-text">{btn.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [personalityMode, setPersonalityMode] = useState<'formal' | 'casual' | 'motivational'>('casual');
  const [questionCount, setQuestionCount] = useState(0);
  const [showAllQA, setShowAllQA] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Common questions pool for suggestions
  const commonQuestions = t('chatbot_card.faq_suggestions', { 
    returnObjects: true, 
    defaultValue: [
      'How do I apply for a job?',
      'What services do you offer?',
      'Where is your office located?',
      'Do you accept OJT students?',
      'What are the requirements?',
      'What benefits do you provide?',
      'How can I request a quote?',
      'What is the project timeline?',
      'Tell me about the hiring process',
      'What is the working schedule?',
      'Do you do 3D Modeling?',
      'Do you offer Machine Assembly?',
      'Do you accept fresh graduates?',
      'Show me your projects'
    ] 
  }) as string[];

  const filteredSuggestions = commonQuestions.filter(q => 
    q.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 5);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const initializationRef = useRef(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasInitializedRef = useRef(false);
  const sessionStartTimeRef = useRef<Date>(new Date());

  const logUnmatchedQuery = (input: string) => {
    const existingLogs = JSON.parse(localStorage.getItem('chatbot-unmatched') || '[]');
    existingLogs.push({ 
      query: input, 
      timestamp: new Date().toISOString(),
      language: i18n.language 
    });
    localStorage.setItem('chatbot-unmatched', JSON.stringify(existingLogs));
  };

  const getPersonalityModifiedText = (text: string): string => {
    if (personalityMode === 'formal') {
      // This regex removes a wide range of emojis and symbols to maintain a formal tone.
      const emojiRegex = /[😄🎉👋💼🔧📋✅💡🌟😂✨🎓📚📞📍🔙🔄👤✉️💬🔎🚀💰🏥💵🍽️🌏📈👥💡⏱️📅🔵💪😊🏛️1️⃣2️⃣3️⃣]/gu;
      return text.replace(emojiRegex, '').replace(/  +/g, ' ').trim();
    }
    if (personalityMode === 'motivational') {
      // Use a pool of translatable motivational quotes for variety.
      const motivationalQuotes = t('chatbot_card.motivational_quotes', { returnObjects: true, defaultValue: [] }) as string[];
      if (motivationalQuotes && motivationalQuotes.length > 0) {
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        return text + `\n\n${randomQuote}`;
      }
      // Fallback if quotes are not available for some reason.
      return text + '\n\n✨ You\'ve got this! Keep exploring to find your perfect fit! 💪';
    }
    return text;
  };

  // --- Reset Functionality ---
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current = [];
      initializationRef.current = false;
      hasInitializedRef.current = false;
      setMessages([]);
      setInputValue('');
      setQuestionCount(0);
      setShowAllQA(false);
      sessionStartTimeRef.current = new Date();
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

  // --- Keyword Matching (Word-Based Scoring) ---
  const matchInputToAction = (input: string): string | null => {
    const normalizedInput = input.toLowerCase().trim();

    // A set of common "stop words" to ignore during matching.
    // This helps focus on the important parts of the user's query.
    const stopWords = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'for', 'to', 'of', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'what', 'where', 'when', 'why', 'how', 'do', 'does', 'did', 'and', 'or', 'but', 'if', 'me', 'my', 'your', 'our', 'their',
      'about', 'with', 'can', 'could', 'please', 'tell', 'give', 'show',
      // Japanese stop words
      'か', 'は', 'を', 'に', 'が', 'と', 'も', 'の', 'で', 'です', 'ます', 'ください', 'について', '教えて', '知りたい'
    ]);

    const keywordMap: { [key: string]: string } = {
      // Services
      'services': 'services', 'service': 'services', 'our services': 'services', 'サービス': 'services', 'お客様向けサービス': 'services',
      'tube mill': 'services', 'pipe mill': 'services', 'チューブミル': 'services', 'パイプミル': 'services',
      '3d modeling': '3d-modeling', '3d': '3d-modeling', 'modeling': '3d-modeling', '3dモデリング': '3d-modeling', '三次元モデリング': '3d-modeling',
      '2d detailing': '2d-detailing', '2d': '2d-detailing', 'detailing': '2d-detailing', '2d詳細設計': '2d-detailing', '二次元詳細設計': '2d-detailing',
      'parts inspection': 'parts-inspection', 'inspection': 'parts-inspection', 'parts': 'parts-inspection', '部品検査': 'parts-inspection', 'パーツ検査': 'parts-inspection',
      'machine assembly': 'machine-assembly', 'assembly': 'machine-assembly', 'machine': 'machine-assembly', '機械組立': 'machine-assembly', 'マシンアセンブリー': 'machine-assembly',
      

      // Greetings & Etiquette
      'hi': 'greeting-response', 'hello': 'greeting-response', 'hey': 'greeting-response', 'greetings': 'greeting-response',
      'こんにちは': 'greeting-response', 'やあ': 'greeting-response', 'よう': 'greeting-response',
      'good morning': 'greeting-response', 'good afternoon': 'greeting-response', 'good evening': 'greeting-response',
      'おはよう': 'greeting-response', 'おはようございます': 'greeting-response', 'こんばんは': 'greeting-response',
      'kamusta': 'greeting-response', 'musta': 'greeting-response', 'konnichiwa': 'greeting-response', 'ohayo': 'greeting-response', 'konbanwa': 'greeting-response',

      'thank you': 'gratitude-response', 'thanks': 'gratitude-response', 'thx': 'gratitude-response', 'salamat': 'gratitude-response', 'arigato': 'gratitude-response', 'arigatou': 'gratitude-response',
      'ありがとう': 'gratitude-response', 'ありがとうございます': 'gratitude-response', 'どうもありがとう': 'gratitude-response',

      'bye': 'farewell-response', 'goodbye': 'farewell-response', 'see you': 'farewell-response', 'paalam': 'farewell-response', 'sayonara': 'farewell-response',
      'さようなら': 'farewell-response', 'じゃあね': 'farewell-response', 'またね': 'farewell-response', 'またあした': 'farewell-response',

      // SKiils Requirements
      'skill requirement' : 'application-requirement', 'skill requirements' : 'application-requirement', 'required skill' : 'application-requirement',

      // Service Requirements
      'service requirements' : 'requirements', 'service requirement' : 'requirements',

      // ======== CAREERS / APPLICANT QUESTIONS ========
      // General Career Questions
      'careers': 'careers', 'career': 'careers', 'job': 'careers', 'jobs': 'careers','apply': 'careers', '採用': 'careers', '求人': 'careers','join': 'careers', 'joins': 'careers',
      'キャリア': 'careers', 'キャリア採用': 'careers', '職務': 'careers', '仕事': 'careers', '就職': 'careers',
      'hire': 'careers', 'hiring': 'careers', 'recruit': 'careers', 'recruitment': 'careers', '採用情報': 'careers',
      '雇用': 'careers', '採用活動': 'careers', '採用進行中': 'careers', 'リクルート': 'careers',
      'work at kmti': 'careers', 'work with you': 'careers',
      'vacancy': 'careers', 'vacancies': 'careers', 'opening': 'careers', 'openings': 'careers', '空きポジション': 'careers',
      '求人情報': 'careers', '空いているポジション': 'careers', '募集中': 'careers', 'ポジション募集': 'careers',
      
      // Application Process
      'how to apply?': 'how-to-apply','I want to apply': 'how-to-apply','how to apply': 'how-to-apply', 'apply now': 'how-to-apply', 'apply online': 'how-to-apply', 'application process': 'how-to-apply', '応募方法': 'how-to-apply',
      '応募手続き': 'how-to-apply', '申請方法': 'how-to-apply', 'オンライン申請': 'how-to-apply', 'どのように応募するか': 'how-to-apply',
      'submit resume': 'how-to-apply', 'submit application': 'how-to-apply', 'application submission': 'how-to-apply',
      'どこに提出': 'how-to-apply', '履歴書提出': 'how-to-apply', '申請提出': 'how-to-apply', '応募提出': 'how-to-apply',
      'submit my cv': 'how-to-apply', 'send resume': 'how-to-apply',
      '履歴書提出方法': 'how-to-apply', 'cv送信': 'how-to-apply',
      'apply for': 'how-to-apply', 'apply for position': 'how-to-apply',
      'ポジションへの応募方法': 'how-to-apply', 'どのようにポジションに応募するか': 'how-to-apply',
      
      // Hiring & Interview
      'hiring process': 'hiring-process', 'interview': 'hiring-process', 'interview process': 'hiring-process',
      '採用プロセス': 'hiring-process', '面接': 'hiring-process', '面接プロセス': 'hiring-process', 'インタビュー': 'hiring-process',
      'interview stage': 'hiring-process', 'interview timeline': 'hiring-process', 'selection process': 'hiring-process',
      '面接段階': 'hiring-process', '面接スケジュール': 'hiring-process', '選考プロセス': 'hiring-process',
      'next step': 'hiring-process', 'interview question': 'hiring-process', 'interview questions': 'hiring-process',
      '次のステップ': 'hiring-process', '次はどうなるか': 'hiring-process', '面接の質問': 'hiring-process',

      // Positions & Roles
      'available position': 'q3-available-positions', 'available job position': 'q3-available-positions', 'open position': 'q3-available-positions', 'current opening': 'q3-available-positions', '募集職種': 'q3-available-positions', '現在の求人': 'q3-available-positions',
      '利用可能なポジション': 'q3-available-positions', 'オープンポジション': 'q3-available-positions', '募集ポジション': 'q3-available-positions', 'どんなポジション': 'q3-available-positions',
      'position': 'q3-available-positions', 'positions': 'q3-available-positions', 'role': 'q3-available-positions', 'job role': 'q3-available-positions', 'job description': 'q3-available-positions',
      'ポジション': 'q3-available-positions', 'ポジション説明': 'q3-available-positions', '職務説明': 'q3-available-positions', '役職': 'q3-available-positions',
      'engineer position': 'q3-available-positions', 'cad position': 'q3-available-positions', 'admin position': 'q3-available-positions',
      'エンジニア職': 'q3-available-positions', 'cadポジション': 'q3-available-positions', '管理職': 'q3-available-positions',
      
      
      'available job positions': 'q3-available-positions', 'current job positions': 'q3-available-positions', 'job openings': 'q3-available-positions', 'positions hiring': 'q3-available-positions', 'jobs available': 'q3-available-positions', 'openings available': 'q3-available-positions',
      '利用可能なポジションは何ですか': 'q3-available-positions', '現在募集中のポジション': 'q3-available-positions', 'どのポジションが採用中': 'q3-available-positions',
      'what jobs are available': 'q3-available-positions', 'what positions are open': 'q3-available-positions',
      'interested in specific field': 'q3-available-positions', 'interested in field': 'q3-available-positions', 'openings in field': 'q3-available-positions', 'positions in field': 'q3-available-positions', 'any available slots': 'q3-available-positions', 'available slots': 'q3-available-positions', 'any opening in': 'q3-available-positions',
      '特定分野に興味': 'q3-available-positions', '分野のポジション': 'q3-available-positions', 'スロット': 'q3-available-positions',
      
      // Requirements & Qualifications
      'req': 'q2-requirements', 'requirement': 'q2-requirements', 'requirements': 'q2-requirements', 'requirements needed': 'q2-requirements', '応募に必要な書類': 'q2-requirements', '必要な書類': 'q2-requirements', 'needed documents': 'q2-requirements', 'required documents': 'q2-requirements',
      '要件': 'q2-requirements', '必要な要件': 'q2-requirements', '何が必要': 'q2-requirements', '要件は何': 'q2-requirements',
      'qualifications': 'q2-requirements', 'education required': 'q2-requirements', 'documents needed': 'q2-requirements', 'document required': 'q2-requirements',
      '資格': 'q2-requirements', '学歴要件': 'q2-requirements', '提出書類': 'q2-requirements',
      

// engineering & Design Job Requirements
      'engineering job': 'q13-engineering-staff-requirements','engineering skill requirement': 'q13-engineering-staff-requirements', 'design job': 'q13-engineering-staff-requirements', 'engineering position': 'q13-engineering-staff-requirements', 'design position': 'q13-engineering-staff-requirements', 'engineering role': 'q13-engineering-staff-requirements', 'design role': 'q13-engineering-staff-requirements',
      'エンジニアリング職': 'q13-engineering-staff-requirements', 'デザイン職': 'q13-engineering-staff-requirements', 'エンジニアリングポジション': 'q13-engineering-staff-requirements', 'デザインポジション': 'q13-engineering-staff-requirements', 'エンジニアリング役職': 'q13-engineering-staff-requirements', 'デザイン役職': 'q13-engineering-staff-requirements',
      'engineering job requirements': 'q13-engineering-staff-requirements', 'design job requirements': 'q13-engineering-staff-requirements', 'engineering position requirements': 'q13-engineering-staff-requirements', 'design position requirements': 'q13-engineering-staff-requirements', 'engineering role requirements': 'q13-engineering-staff-requirements', 'design role requirements': 'q13-engineering-staff-requirements',
      'エンジニアリング職の要件': 'q13-engineering-staff-requirements', 'デザイン職の要件': 'q13-engineering-staff-requirements', 'エンジニアリングポジションの要件': 'q13-engineering-staff-requirements', 'デザインポジションの要件': 'q13-engineering-staff-requirements', 'エンジニアリング役職の要件': 'q13-engineering-staff-requirements', 'デザイン役職の要件': 'q13-engineering-staff-requirements',
      'engineering skills': 'q13-engineering-staff-requirements', 'design skills': 'q13-engineering-staff-requirements', 'engineering skill': 'q13-engineering-staff-requirements', 'design skill': 'q13-engineering-staff-requirements',
      
      // CAD Operator Skills
      'cad operator': 'q9-cad-operator-skills', 'cad skills': 'q9-cad-operator-skills', 'cad skill': 'q9-cad-operator-skills', 'cad operator skills': 'q9-cad-operator-skills', 'cad operator skill': 'q9-cad-operator-skills', 'cad operators': 'q9-cad-operator-skills', 'cad operators skills': 'q9-cad-operator-skills',
      'cadオペレーター': 'q9-cad-operator-skills', 'cadスキル': 'q9-cad-operator-skills', 'cadオペレーターのスキル': 'q9-cad-operator-skills', 'cadオペレータースキル': 'q9-cad-operator-skills', 'cadオペレータースキル要件': 'q9-cad-operator-skills', 'cad needed skill': 'q9-cad-operator-skills', 'cad operator needed skill': 'q9-cad-operator-skills',
      'cad skilled': 'q9-cad-operator-skills', 'cad operator staff skills': 'q9-cad-operator-skills', 'cad operator skill requirements': 'q9-cad-operator-skills',
      'cadオペレーターに必要なスキル': 'q9-cad-operator-skills',
      
// OJT Skills
      'ojt skills': 'q14-ojt-requirements', 'ojt skill': 'q14-ojt-requirements', 'ojt trainee skills': 'q14-ojt-requirements', 'trainee skills required': 'q14-ojt-requirements', 'ojt skill needed': 'q14-ojt-requirements',
      'ojt実習生スキル': 'q14-ojt-requirements',
      'ojt skill neededs': 'q14-ojt-requirements', 'ojt required skill': 'q14-ojt-requirements', 'ojt skilled': 'q14-ojt-requirements',
      'ojtスキル要件': 'q14-ojt-requirements', 'ojtに필要なスキル': 'q14-ojt-requirements',
 
      // Accounting Skills
      'account': 'q15-accounting-requirements', 'accounting': 'q15-accounting-requirements', 'accounting needed skill': 'q15-accounting-requirements', 'accounting skill': 'q15-accounting-requirements', 'accounting req': 'q15-accounting-requirements', 'accounting staff': 'q15-accounting-requirements', 'accounting staffs': 'q15-accounting-requirements', 'accounting qualifications': 'q15-accounting-requirements',
      '会計': 'q15-accounting-requirements', '会計スキル': 'q15-accounting-requirements', '会計要件': 'q15-accounting-requirements', '会計に必要な': 'q15-accounting-requirements',
      'accounting skills': 'q15-accounting-requirements', 'accounting skilled': 'q15-accounting-requirements', 'accounting staff skills': 'q15-accounting-requirements', 'accountant skills': 'q15-accounting-requirements',
      '会計職スキル': 'q15-accounting-requirements', '簿記': 'q15-accounting-requirements',
      'accounting skill ': 'q15-accounting-requirements', 'accounting skills ': 'q15-accounting-requirements', 'accounting skill needed': 'q15-accounting-requirements', 'accounting required skill': 'q15-accounting-requirements', 'accountings': 'q15-accounting-requirements',
      '会計スキル要件': 'q15-accounting-requirements', '会計に必要なスキル': 'q15-accounting-requirements',
 
     // Admin Skills
      'admins ': 'q16-admin-staff-requirements', 'admin skill': 'q16-admin-staff-requirements', 'admin': 'q16-admin-staff-requirements', 'admin skilled': 'q16-admin-staff-requirements', 'admins required skill': 'q16-admin-staff-requirements', 'admins': 'q16-admin-staff-requirements', 'admin staff': 'q16-admin-staff-requirements', 'admin staffs': 'q16-admin-staff-requirements', 'admin qualifications': 'q16-admin-staff-requirements',
      '管理': 'q16-admin-staff-requirements', '管理スキル': 'q16-admin-staff-requirements', '管理者': 'q16-admin-staff-requirements', '管理職要件': 'q16-admin-staff-requirements', '管理に必要な': 'q16-admin-staff-requirements',
      'admin skills': 'q16-admin-staff-requirements', 'admin skill ': 'q16-admin-staff-requirements', 'admin staff skills': 'q16-admin-staff-requirements', 'administrative skills': 'q16-admin-staff-requirements',
      '管理職スキル': 'q16-admin-staff-requirements', '事務スキル': 'q16-admin-staff-requirements',
      'admin skill requirements': 'q16-admin-staff-requirements', 'admin skills requirement': 'q16-admin-staff-requirements', 'admin skill needed': 'q16-admin-staff-requirements', 'admin required skill': 'q16-admin-staff-requirements', 'admin req': 'q16-admin-staff-requirements',
      '管理スキル要件': 'q16-admin-staff-requirements', '管理に必要なスキル': 'q16-admin-staff-requirements',
 
      // IT Skills & OJT
      'it relate': 'q17-ojt-it-requirements', 'it': 'q17-ojt-it-requirements','it related': 'q17-ojt-it-requirements', 'ojt for it': 'q17-ojt-it-requirements', 'it requirement': 'q17-ojt-it-requirements', 'it requirements': 'q17-ojt-it-requirements',
      'IT': 'q17-ojt-it-requirements', 'IT スキル': 'q17-ojt-it-requirements', 'IT 技術': 'q17-ojt-it-requirements', 'IT要件': 'q17-ojt-it-requirements', '情報技術': 'q17-ojt-it-requirements',
      'it ojt': 'q17-ojt-it-requirements', 'it internship': 'q17-ojt-it-requirements', 'it student training': 'q17-ojt-it-requirements',
      'IT OJT': 'q17-ojt-it-requirements', 'IT トレーニング': 'q17-ojt-it-requirements', 'IT 実習': 'q17-ojt-it-requirements',
      'programming': 'q17-ojt-it-requirements', 'coding': 'q17-ojt-it-requirements', 'software development': 'q17-ojt-it-requirements', 'web development': 'q17-ojt-it-requirements',
      'プログラミング': 'q17-ojt-it-requirements', 'コーディング': 'q17-ojt-it-requirements', 'ソフトウェア開発': 'q17-ojt-it-requirements', 'ウェブ開発': 'q17-ojt-it-requirements',
      'database': 'q17-ojt-it-requirements', 'network': 'q17-ojt-it-requirements', 'system administration': 'q17-ojt-it-requirements', 'system admin': 'q17-ojt-it-requirements',
      'データベース': 'q17-ojt-it-requirements', 'ネットワーク': 'q17-ojt-it-requirements', 'システム管理': 'q17-ojt-it-requirements', 'システム': 'q17-ojt-it-requirements',
      'it staff': 'q17-ojt-it-requirements', 'it staff requirement': 'q17-ojt-it-requirements', 'it staff ': 'q17-ojt-it-requirements', 'it technician': 'q17-ojt-it-requirements',
      'IT スタッフ': 'q17-ojt-it-requirements', 'IT 技術者': 'q17-ojt-it-requirements', 'IT サポート': 'q17-ojt-it-requirements',
      'it needed': 'q17-ojt-it-requirements', 'it  required': 'q17-ojt-it-requirements', 'it qualifications': 'q17-ojt-it-requirements',
      'IT に必要なスキル': 'q17-ojt-it-requirements', 'IT スキル要件': 'q17-ojt-it-requirements', 'IT に必要な資格': 'q17-ojt-it-requirements',


      // Engineering OJT & Skills
      'engineering ojt': 'q13-ojt-engineering', 'engineering training': 'q13-ojt-engineering', 'engineering internship': 'q13-ojt-engineering', 'engineering on-the-job training': 'q13-ojt-engineering', 'engineer trainee': 'q13-ojt-engineering',
      'エンジニアOJT': 'q13-ojt-engineering', 'エンジニア実習': 'q13-ojt-engineering', '工学OJT': 'q13-ojt-engineering', '工学実習': 'q13-ojt-engineering', 'エンジニアトレーニング': 'q13-ojt-engineering',
      'engineering ojt program': 'q13-ojt-engineering', 'engineering student training': 'q13-ojt-engineering', 'accepted engineering ojt': 'q13-ojt-engineering', 'accept engineering ojt': 'q13-ojt-engineering', 'accepting engineering ojt': 'q13-ojt-engineering', 'エンジニア学生訓練': 'q13-ojt-engineering', 'エンジニアオンザジョブトレーニング': 'q13-ojt-engineering', 'エンジニアojt要件': 'q13-ojt-engineering', 'エンジニアojt学生': 'q13-ojt-engineering',
      'エンジニアojt受け入れ': 'q13-ojt-engineering', 'エンジニア学生実習': 'q13-ojt-engineering',
      
      // Experience & Fresh Graduates
      'non work experiences': 'q6-non-work-experience', 'non work experience': 'q6-non-work-experience', 'no experience': 'q6-non-work-experience', 'fresh graduate': 'q6-non-work-experience', 'accept fresh grad': 'q6-non-work-experience', 'hire graduate': 'q6-non-work-experience', '未経験': 'q6-non-work-experience', '経験なし': 'q6-non-work-experience',
      '職務経歴なし': 'q6-non-work-experience', 'キャリアなし': 'q6-non-work-experience', '経験不問': 'q6-non-work-experience', 'experience needed': 'q6-non-work-experience',
      'entry level': 'q6-non-work-experience', 'beginner friendly': 'q6-non-work-experience', 'no prior experience': 'q6-non-work-experience',
      'エントリーレベル': 'q6-non-work-experience', '初心者向け': 'q6-non-work-experience', '以前の経験なし': 'q6-non-work-experience',
      'fresh grad': 'q10-fresh-grad-acceptance', 'new graduate': 'q10-fresh-grad-acceptance', 'graduate applicant': 'q10-fresh-grad-acceptance', 'fresh graduate hiring': 'q10-fresh-grad-acceptance', 'accept new grad': 'q10-fresh-grad-acceptance', '新卒': 'q10-fresh-grad-acceptance', 'フレッシュグラデュエート': 'q10-fresh-grad-acceptance', '新卒者': 'q10-fresh-grad-acceptance', '大学卒業': 'q10-fresh-grad-acceptance', '新卒採用': 'q10-fresh-grad-acceptance',
      '最近の卒業生': 'q10-fresh-grad-acceptance', '新しい卒業生': 'q10-fresh-grad-acceptance', 'グラデュエート': 'q10-fresh-grad-acceptance',
      
      // Work Schedule & Hours
      'work schedule': 'working-schedule', 'working schedule': 'working-schedule', 'hours': 'working-schedule', 'office hours': 'working-schedule', 'office time': 'working-schedule', '勤務スケジュール': 'working-schedule',
      '勤務時間': 'working-schedule', '作業時間': 'working-schedule', 'シフト': 'working-schedule',
      'work hours': 'working-schedule', 'opening hours': 'working-schedule', '営業時間': 'working-schedule',
      'operating hours': 'working-schedule', 'business hours': 'working-schedule', 'いつ開いて': 'working-schedule',
      'いつ営業': 'working-schedule', '営業時間は': 'working-schedule', '何時に開く': 'working-schedule',
      'work timing': 'working-schedule', 'starting time': 'working-schedule', 'ending time': 'working-schedule', 'shift': 'working-schedule',
      '開始時間': 'working-schedule', '終了時間': 'working-schedule',
      'flexible schedule': 'working-schedule', 'part time': 'working-schedule', 'full time': 'working-schedule', 'remote work': 'working-schedule',
      'フレックス勤務': 'working-schedule', 'パートタイム': 'working-schedule', 'フルタイム': 'working-schedule', 'リモートワーク': 'working-schedule',
      'hybrid': 'q12-work-setup', 'work from home': 'q12-work-setup', 'wfh': 'q12-work-setup', 'remote': 'q12-work-setup', 'wfh setup': 'q12-work-setup', 'hybrid setup': 'q12-work-setup', 'work setup': 'q12-work-setup', 'office setup': 'q12-work-setup', 'on-site': 'q12-work-setup', 'hybrid wfh': 'q12-work-setup',
      'ハイブリッド': 'q12-work-setup', '在宅勤務': 'q12-work-setup', 'リモート': 'q12-work-setup', 'ハイブリッド設定': 'q12-work-setup', 'オフィス': 'q12-work-setup', 'オンサイト': 'q12-work-setup', '在宅勤務は利用可能': 'q12-work-setup',
      
      // Compensation & Benefits
      'benefits': 'benefits', 'compensation': 'benefits', 'pay': 'benefits', 'salary': 'benefits', '福利厚生': 'benefits',
      'メリット': 'benefits', '給与': 'benefits', '報酬': 'benefits', '給与パッケージ': 'benefits',
      'salary range': 'benefits', 'wage': 'benefits', 'paycheck': 'benefits',
      '給与範囲': 'benefits', '賃金': 'benefits',
      'allowance': 'benefits', 'bonus': 'benefits', 'incentive': 'benefits', 'perks': 'benefits',
      '手当': 'benefits', 'ボーナス': 'benefits', 'インセンティブ': 'benefits', '福利': 'benefits',
      'insurance': 'benefits', 'health insurance': 'benefits', 'medical': 'benefits', 'retirement plan': 'benefits',
      '保険': 'benefits', '医療保険': 'benefits', '健康保険': 'benefits', '退職金': 'benefits',
      'transportation allowance': 'benefits', 'meal allowance': 'benefits', 'housing allowance': 'benefits',
      '交通費': 'benefits', '食事手当': 'benefits', '住宅手当': 'benefits',
      
      // Training & Development
      'training': 'training', 'development': 'training', '研修': 'training',
      'トレーニング': 'training', '開発': 'training', 'スキル習得': 'training',
      'new employee training': 'q11-new-employee-training', 'training for new': 'q11-new-employee-training', 'new hire training': 'q11-new-employee-training', 'orientation': 'q11-new-employee-training', 'onboarding': 'q11-new-employee-training', '新入社員研修': 'q11-new-employee-training', '新入社員': 'q11-new-employee-training', '研修プログラム': 'q11-new-employee-training', 'オリエンテーション': 'q11-new-employee-training',
      '新入社員トレーニング': 'q11-new-employee-training', 'オンボーディング': 'q11-new-employee-training', '導入研修': 'q11-new-employee-training',
      'skills training': 'q11-new-employee-training', 'professional development': 'q11-new-employee-training', 'learning opportunity': 'q11-new-employee-training',
      'スキルトレーニング': 'q11-new-employee-training', 'プロフェッショナル開発': 'q11-new-employee-training', '学習機会': 'q11-new-employee-training',
      'intern': 'training', 'internship': 'training',
      
      'ojt training': 'q8-ojt-student', 'on-the-job training': 'q8-ojt-student', 'trainee': 'training',
      'インターン': 'training', 'インターンシップ': 'training', '実習': 'training', '訓練生': 'training',
      'ojt program': 'q8-ojt-student', 'student training': 'q8-ojt-student','accepted ojt': 'q8-ojt-student', 'accept ojt': 'q8-ojt-student','accepting ojt': 'q8-ojt-student', '学生訓練': 'q8-ojt-student', 'オンザジョブトレーニング': 'q8-ojt-student', 'ojt要件': 'q8-ojt-student', 'ojt学生': 'q8-ojt-student',
      'ojt受け入れ': 'q8-ojt-student', '学生実習': 'q8-ojt-student',


      'japan training': 'q11-new-employee-training', 'overseas training': 'q11-new-employee-training',
      '日本研修': 'q11-new-employee-training', '海外研修': 'q11-new-employee-training', '短期研修': 'q11-new-employee-training',
      
      // Company Culture & Environment
      'company culture': 'about', 'team': 'about', 'team environment': 'about', 'work environment': 'about', 'culture': 'about',
      '企業文化': 'about', 'チーム': 'about', 'チーム環境': 'about', '職場環境': 'about',
      'company atmosphere': 'about', 'company values': 'about', 'company mission': 'about',
      '企業雰囲気': 'about', '企業価値': 'about', '企業使命': 'about',
      'company team': 'about', 'team members': 'about', 'colleague': 'about', 'workplace': 'about',
      '会社チーム': 'about', 'チームメンバー': 'about', '同僚': 'about', '勤務地': 'about',
      'friendly': 'about', 'supportive': 'about', 'collaborative': 'about',
      'フレンドリー': 'about', 'サポート的': 'about', '協力的': 'about',

      
      // Career Growth
      'career opportunities': 'career-opportunities', 'career growth': 'career-opportunities', 'advancement': 'career-opportunities',
      'promotion': 'career-opportunities', 'career path': 'career-opportunities', 'career development': 'career-opportunities',
      'long term': 'career-opportunities', 'future opportunity': 'career-opportunities', 'growth potential': 'career-opportunities',
      'キャリア成長': 'career-opportunities', 'キャリアパス': 'career-opportunities',
      
      // Application Status & Timeline
      'application status': 'application-status', 'status': 'application-status', '進捗': 'application-status',
      'check my application': 'application-status', 'application result': 'application-status', 'application update': 'application-status',
      'decision time': 'application-status', 'result update': 'application-status',
      
      // HR Contact
      'contact hr': 'contact-hr', 'hr': 'contact-hr', '人事': 'contact-hr',
      'human resources': 'contact-hr', 'hr email': 'contact-hr', 'hr phone': 'contact-hr', 'hr team': 'contact-hr',

      // ======== CLIENT / SERVICE QUESTIONS ========
      // Service Inquiries
      'service offering': 'services', 'service offerings': 'services',
      'engineering service': 'services', 'design service': 'services', 'manufacturing service': 'services',
      'サービス内容': 'services',
      
      // 3D Modeling Specifics
      'three dimensional': '3d-modeling', '3d model': '3d-modeling', 'cad modeling': '3d-modeling',
      'design model': '3d-modeling', 'visualization': '3d-modeling', '3d design': '3d-modeling',
      
      // 2D Detailing Specifics
      'technical drawing': '2d-detailing', 'engineering drawing': '2d-detailing', 'blueprint': '2d-detailing',
      'drawing service': '2d-detailing', 'cad drawing': '2d-detailing',
      
      // Parts Inspection Specifics
      'quality inspection': 'parts-inspection', 'quality check': 'parts-inspection', 'quality assurance': 'parts-inspection',
      'testing': 'parts-inspection', 'parts testing': 'parts-inspection', 'verification': 'parts-inspection',
      
      // Machine Assembly Specifics
      'equipment assembly': 'machine-assembly', 'system assembly': 'machine-assembly', 'manufacturing': 'machine-assembly',
      
      // Pricing & Quotes
      'price': 'pricing', 'pricing': 'pricing', 'cost': 'pricing', 'quote': 'pricing', 'quotation': 'pricing', 'quotations': 'pricing', 'estimate': 'pricing', 'proposal': 'pricing', 'budget': 'pricing', 'rates': 'pricing', 'fees': 'pricing', '見積': 'pricing', '価格': 'pricing', '費用': 'pricing',
      'cost estimation': 'pricing', 'price range': 'pricing', 'financial': 'pricing',
      'affordable': 'pricing', 'discount': 'pricing', 'package deal': 'pricing',
      
      // Timeline & Deadlines
      'timeline': 'timeline', 'deadline': 'timeline', '納期': 'timeline', '期間': 'timeline',
      'delivery time': 'timeline', 'turnaround time': 'timeline', 'completion date': 'timeline',
      'fast': 'timeline', 'quick': 'timeline', 'urgent': 'timeline', 'expedite': 'timeline',
      'time frame': 'timeline', 'project duration': 'timeline',
      
      // Projects & Portfolio
      'projects': 'projects', 'project': 'projects', 'portfolio': 'projects', 'works': 'projects', 'case studies': 'projects', '実績': 'projects', '作品': 'projects', 'dedimpler': 'projects',
      'past projects': 'projects', 'completed work': 'projects', 'sample work': 'projects', 'reference': 'projects',
      'project example': 'projects', 'previous work': 'projects', 'showcase': 'projects',
      
      // Process, Workflow & Requirements (for clients)
      'workflow': 'process', 'steps': 'process', 'procedure': 'process', '流れ': 'process', '手順': 'process',
      'design process': 'process', 'production process': 'process', 'manufacturing process': 'process',
      'step by step': 'process', 'work process': 'process', 'method': 'process',
      
      // Quality & Standards
      'quality': 'qualifications', 'quality control': 'qualifications',
      'standard': 'qualifications', 'certification': 'qualifications', 'certified': 'qualifications',
      'accuracy': 'qualifications', 'precision': 'qualifications', 'high quality': 'qualifications',
      'project requirements': 'requirements', 'specifications': 'requirements', 'specs': 'requirements',
      '品質': 'qualifications', '認証': 'qualifications',
      
      // Consultation & Communication
      'consultation': 'consultation', 'meeting': 'consultation', 'discuss': 'consultation', 'discussion': 'consultation', 'consult': 'consultation', 'inquiry': 'consultation', 'inquiries': 'consultation', '相談': 'consultation', '打ち合わせ': 'consultation', '問い合わせ': 'consultation',
      'talk to you': 'consultation', 'speak with': 'consultation', 'speak to team': 'consultation', 'contact team': 'consultation',
      'initial consultation': 'consultation', 'free consultation': 'consultation', 'schedule meeting': 'consultation',
      'requirements discussion': 'requirements', 'project discussion': 'consultation',
      
      // Revisions & Support
      'revision': 'consultation', 'revisions': 'consultation', 'changes': 'consultation', 'modification': 'consultation',
      'support': 'support', 'help': 'support', 'assist': 'support', 'assistance': 'support', 'issue': 'support', 'problem': 'support', 'question': 'support', 'questions': 'support', 'サポート': 'support', 'ヘルプ': 'support',
      'customer support': 'support', 'after sales': 'support', 'technical support': 'support',
      
      // Experience & Expertise
      'experience': 'qualifications', 'expertise': 'qualifications', 'experience level': 'qualifications',
      'years experience': 'qualifications', 'years of experience': 'qualifications', 'track record': 'qualifications',
      
      // Confidentiality & Security
      'confidential': 'qualifications', 'confidentiality': 'qualifications', 'secure': 'qualifications', 'security': 'qualifications', 'ip protection': 'qualifications',
      'nda': 'qualifications', 'intellectual property': 'qualifications', 'privacy': 'qualifications', 'data protection': 'qualifications',
      '機密': 'qualifications', '秘密保持': 'qualifications',
      
      // Payment & Terms
      'billing': 'payment', 'invoicing': 'payment', 'invoice': 'payment', '支払': 'payment', '請求': 'payment',
      'payment terms': 'payment', 'payment method': 'payment', 'installment': 'payment', 'deposit': 'payment',
      'payment schedule': 'payment', 'payment plan': 'payment', 'cash flow': 'payment',

      // Equipment & Technology
      'equipment': 'qualifications', 'technology': 'qualifications', 'tools': 'qualifications', 'software': 'qualifications',
      'latest technology': 'qualifications', 'advanced equipment': 'qualifications', 'state of art': 'qualifications',
      'icad': 'qualifications', 'autocad': 'qualifications', 'solidworks': 'qualifications',

      // ======== COMPANY INFORMATION ========
      // Q17 - Vision & Mission
      'company vision': 'q17-company-vision-mission',
      'your vision': 'q17-company-vision-mission', 'your mission': 'q17-company-vision-mission',
      'vision mission': 'q17-company-vision-mission', 'our vision': 'q17-company-vision-mission', 'our mission': 'q17-company-vision-mission', '企業理念': 'q17-company-vision-mission', 'ミッション': 'q17-company-vision-mission', 'ビジョン': 'q17-company-vision-mission',
      'company goals': 'q17-company-vision-mission', 'long term goals': 'q17-company-vision-mission', 'company purpose': 'q17-company-vision-mission', 'our purpose': 'q17-company-vision-mission',
      
      // Q18 - Company Story
      'company story': 'q18-company-story', 'kmti story': 'q18-company-story',
      'kmti founded': 'q18-company-story', 'kmti history': 'q18-company-story', 'company founded': 'q18-company-story', 'kmti founding': 'q18-company-story',
      'company background': 'q18-company-story', 'company formation': 'q18-company-story', 'kusakabe maeno story': 'q18-company-story', '会社の歴史': 'q18-company-story',
      'establishment year': 'q18-company-story', 'founding year': 'q18-company-story', 'established': 'q18-company-story',
      
      // Q19 - Company Partners
      'partners': 'q19-company-partners', 'partner companies': 'q19-company-partners', 'company partners': 'q19-company-partners',
      'kusakabe': 'q19-company-partners', 'maeno giken': 'q19-company-partners', 'next engineering': 'q19-company-partners', 'affiliated company': 'q19-company-partners',
      'partner with': 'q19-company-partners', 'partnership': 'q19-company-partners', 'collaborators': 'q19-company-partners', 'related companies': 'q19-company-partners',
      'japan partner': 'q19-company-partners', 'industry partners': 'q19-company-partners', 'manufacturing partners': 'q19-company-partners',
      'kemco': 'q19-company-partners', 'mgk': 'q19-company-partners',
      
      // Q20 - Company History & Milestones
      'company history': 'q20-company-history', 'milestones': 'q20-company-history',
      'company milestones': 'q20-company-history', 'company events': 'q20-company-history',
      '2014': 'q20-company-history', '2017': 'q20-company-history', '2023': 'q20-company-history', '2025': 'q20-company-history',
      'company achievements': 'q20-company-history', 'company development': 'q20-company-history', 'company expansion': 'q20-company-history',
      'since 2014': 'q20-company-history', 'established 2014': 'q20-company-history', 'past events': 'q20-company-history', 'company journey': 'q20-company-history',
      
      // Q21 - Detailed Benefits
      'detailed benefits': 'benefits', 'all benefits': 'benefits', 'comprehensive benefits': 'benefits', 'full benefits': 'benefits',
      'sss': 'benefits', 'pag ibig': 'benefits', 'philhealth': 'benefits',
      'rice subsidy': 'benefits', 'rice allowance': 'benefits',
      'employee benefits': 'benefits',
      'government benefits': 'benefits', 'mandated benefits': 'benefits', '福利厚生詳細': 'benefits',
      'monthly allowance': 'benefits', 'yearly bonus': 'benefits', 'vacation days': 'benefits', 'leave benefits': 'benefits',
      
      // Q22 - Services Workflow
      'service workflow': 'q22-services-workflow',
      'stages': 'q22-services-workflow',
      'order process': 'q22-services-workflow', 'project process': 'q22-services-workflow', 'delivery process': 'q22-services-workflow', 'complete process': 'q22-services-workflow',
      'process flow': 'q22-services-workflow',
      
      // Q23 - Application Timeline
      'application timeline': 'hiring-process', 'hiring timeline': 'hiring-process',
      'duration': 'hiring-process', 'days needed': 'hiring-process', 'start date': 'hiring-process', 'starting date': 'hiring-process',
      'fast hiring': 'hiring-process', 'quick hiring': 'hiring-process', 'rapid hiring': 'hiring-process',
      'interview duration': 'hiring-process', 'one day interview': 'hiring-process', 'fast track hiring': 'hiring-process',
      
      // General - Company & About
      'location': 'location', 'located': 'location', 'locate': 'location', 'address': 'location', 'map': 'location', 'where': 'location', '住所': 'location', '場所': 'location', '地図': 'location',
      'direction': 'location', 'navigate': 'location', 'gps': 'location',
      'about': 'about', 'kmti': 'about', '会社概要': 'about',
      'about us': 'about', 'our company': 'about', 'company info': 'about', 'company information': 'about',
      'about kmti': 'q17-company-vision-mission', 'kmti info': 'q17-company-vision-mission', 'kmti information': 'q17-company-vision-mission',
      
      'main menu': 'main-menu', 'menu': 'main-menu', 'options': 'main-menu', 'ホーム': 'main-menu', 'メニュー': 'main-menu',
      'start over': 'start-over', 'reset': 'start-over', 'restart': 'start-over', '最初から': 'start-over', 'リセット': 'start-over',
      'talk to human': 'talk-to-human', 'human': 'talk-to-human', 'person': 'talk-to-human', 'agent': 'talk-to-human', 'representative': 'talk-to-human', 'operator': 'talk-to-human', '担当者': 'talk-to-human', '人': 'talk-to-human', 'オペレーター': 'talk-to-human',
      'speak to someone': 'talk-to-human', 'real person': 'talk-to-human', 'live chat': 'talk-to-human'
    };
    
    // 1. Exact match (fastest and most accurate)
    if (keywordMap[normalizedInput]) {
      return keywordMap[normalizedInput];
    }

    // 2. Enhanced Scoring Logic for partial and multi-word matches
    const inputWords = normalizedInput.split(/[\s,.\-?]+/).filter(w => w.length > 1 && !stopWords.has(w));
    if (inputWords.length === 0) {
      return null; // Input was only stop words or empty
    }

    let bestMatch = { action: null as string | null, score: 0 };

    for (const [keyword, action] of Object.entries(keywordMap)) {
      const keywordWords = keyword.toLowerCase().split(/[\s,.\-?]+/).filter(w => w.length > 0 && !stopWords.has(w));
      if (keywordWords.length === 0) continue;

      let matchedWordsCount = 0;
      const matchedInputWords = new Set<string>();

      // Check for matches, including partial/stem matches
      for (const kw of keywordWords) {
        for (const iw of inputWords) {
          // Match if input word starts with keyword word (e.g., "apply" matches "applying")
          // or if keyword word starts with input word (e.g., "applic" matches "application")
          // or if keyword word starts with input word (e.g., "applic" matches "application") 
          let isMatch = false;

          if (iw.startsWith(kw) || kw.startsWith(iw)) {
            if (!matchedInputWords.has(iw)) {
              matchedWordsCount++;
              matchedInputWords.add(iw);
            }
            isMatch = true;
          } else if (iw.length >= 4 && kw.length >= 4) {
            // Fuzzy match: Allow typos for words with 4+ characters
            const dist = levenshteinDistance(iw, kw);
            // Allow 1 error for medium words, 2 errors for long words
            const threshold = iw.length > 5 ? 2 : 1;
            if (dist <= threshold) isMatch = true;
          }
          
          if (isMatch && !matchedInputWords.has(iw)) {
            matchedWordsCount++;
            matchedInputWords.add(iw);
          }
        }
      }

      if (matchedWordsCount > 0) {
        // Score calculation:
        // - Relevance: How many of the keyword's words were found?
        const relevance = matchedWordsCount / keywordWords.length;
        // - Coverage: How much of the user's input is explained by the keyword?
        const coverage = matchedWordsCount / inputWords.length;
        // - Phrase Bonus: Give a significant boost if the keyword appears as a whole phrase.
        const phraseBonus = normalizedInput.includes(keyword) ? 1.5 : 1.0;

        // Combine scores. Relevance and Coverage are multiplied to favor keywords that are a good fit both ways.
        const score = (relevance * coverage) * phraseBonus;
        
        if (score > bestMatch.score) {
          bestMatch = { action, score };
        }
      }
    }
    
    // Only return a match if it has a reasonable confidence score (threshold can be tuned).
    // This prevents matching on single, common words that appear in many keywords.
    return bestMatch.score > 0.3 ? bestMatch.action : null;
  };

  const generateBotResponse = (action: string): Message => {
    const resBase = `chatbot_card.responses.${action}`;
    const isCopyable = Boolean(t(`${resBase}.copyable`, { defaultValue: false }));
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

    let responseText = t(`${resBase}.text`);
    responseText = getPersonalityModifiedText(responseText);

    return {
      id: messageId,
      type: 'bot',
      content: {
        text: responseText,
        buttons: buttons.length > 0 ? buttons : undefined,
        copyable: isCopyable,
        actionButtons: t(`${resBase}.actionButtons`, { returnObjects: true, defaultValue: [] }) as ActionButton[],
      },
      timestamp: new Date(),
    };
  };

  const handleButtonClick = (action: string, buttonText: string) => {
    if (action === 'start-over') {
      window.dispatchEvent(new CustomEvent('reset-chatbot'));
      setMessages([]); 
      setInputValue(''); 
      setQuestionCount(0);
      setShowAllQA(false);
      sessionStartTimeRef.current = new Date();
      initializationRef.current = false; 
      hasInitializedRef.current = false; 
      setIsInitializing(true);
      return;
    }

    const navMap: Record<string, string> = {
      'learn-more-3d': '/services/3d-modeling',
      'learn-more-2d': '/services/2d-detailing',
      'learn-more-inspection': '/services/parts-inspection',
      'learn-more-assembly': '/services/machine-assembly',
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

  const handleInputSubmit = (submittedText?: string) => {
    const textToProcess = submittedText || inputValue;
    if (!textToProcess.trim()) return;
    
    // Check for mixed languages
    if (detectLanguageMixing(textToProcess)) {
      handleButtonClick('mixed-language-response', textToProcess);
      setInputValue('');
      setShowSuggestions(false);
      return;
    }

    // Increment question count
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    const matched = matchInputToAction(textToProcess);
    if (matched) {
      handleButtonClick(matched, textToProcess);
    } else {
      // Log unmatched query
      logUnmatchedQuery(textToProcess);
      
      setMessages((prev) => [...prev, { id: `user-${Date.now()}`, type: 'user', content: { text: textToProcess }, timestamp: new Date() }]);
      const tid = `typing-${Date.now()}`;
      setMessages((prev) => [...prev, { id: tid, type: 'typing', timestamp: new Date() }]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== tid));
        setMessages((prev) => [...prev, generateBotResponse('default')]);
      }, 1000);
    }
    setInputValue('');
    setShowSuggestions(false);
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
            <LazyImage src={profileImage || defaultProfileImage} alt="Bot" className="chatbot-card-header-avatar-img" loading="eager" />
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

        {/* Personality Mode Toggle, Streak & Q&A Icon */}
        <div className="chatbot-card-controls">
          <select 
            value={personalityMode} 
            onChange={(e) => setPersonalityMode(e.target.value as 'formal' | 'casual' | 'motivational')}
            className="chatbot-mode-selector"
          >
            <option value="formal">{t('chatbot_card.personality_modes.formal')}</option>
            <option value="casual">{t('chatbot_card.personality_modes.casual')}</option>
            <option value="motivational">{t('chatbot_card.personality_modes.motivational')}</option>
          </select>
          
          {/* Q&A Icon Button */}
          <button 
            onClick={() => setShowAllQA(!showAllQA)}
            className="chatbot-qa-icon-button"
            data-count={questionCount > 0 ? questionCount.toString() : undefined}
            data-state={showAllQA ? 'open' : 'closed'}
            title={showAllQA ? 'Close Q&A' : `View Questions & Answers (${questionCount})`}
          >
            {showAllQA ? '✕' : '📋'}
          </button>
        </div>

        
      <div className="chatbot-card-body" ref={bodyRef}>
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            msg={msg} 
            profileImage={profileImage || defaultProfileImage}
            onButtonClick={handleButtonClick}
            onActionButtonClick={handleActionButtonClick}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

        {/* Q&A Viewer Modal */}
        {showAllQA && (
          <div className="chatbot-qa-modal">
            <div className="chatbot-qa-modal-content">
              <div className="chatbot-qa-modal-header">
                <h3>📋 {t('chatbot_card.qa_modal.title')} ({questionCount})</h3>
                <button 
                  className="chatbot-qa-close-btn"
                  onClick={() => setShowAllQA(false)}
                  aria-label={t('chatbot_card.qa_modal.close') || 'Close'}
                >
                  ✕
                </button>
              </div>
              <div className="chatbot-qa-list">
                {messages
                  .filter((msg) => msg.type === 'user' || (msg.type === 'bot' && msg.content?.text))
                  .reduce((acc: any[], msg, idx, arr) => {
                    if (msg.type === 'user') {
                      const nextBot = arr.find((m, i) => i > idx && m.type === 'bot');
                      acc.push({ 
                        user: msg.content?.text, 
                        bot: nextBot?.content?.text || t('chatbot_card.qa_modal.processing')
                      });
                    }
                    return acc;
                  }, [])
                  .map((qa, idx) => (
                    <QAItem key={idx} qa={qa} index={idx} />
                  ))
                }
                {messages.filter(m => m.type === 'user').length === 0 && (
                  <div className="chatbot-qa-empty">
                    {t('chatbot_card.qa_modal.no_questions')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      <div className="chatbot-card-footer">
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="chatbot-input-suggestions">
            {filteredSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="chatbot-input-suggestion"
                onClick={() => {
                  setInputValue(suggestion);
                  setShowSuggestions(false);
                  handleInputSubmit(suggestion);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
        <input
          type="text"
          placeholder={t('chatbot_card.footer.placeholder')}
          className="chatbot-card-input"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
        />
        <div className="chatbot-card-menu-icon-wrapper chatbot-card-menu-icon-clickable" onClick={() => handleButtonClick('main-menu', 'Menu')}>
          <LazyImage src={menuIcon} alt="Menu" className="chatbot-card-menu-icon" />
        </div>
      </div>
    </div>
  );
};

export { ChatbotCard };
export default ChatbotCard;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatbot.css';
import defaultProfileImage from '../../../assets/profile.png';
import lineIcon from '../../../assets/icons/line.png';
import facebookIcon from '../../../assets/icons/facebook.png';
import linkedinIcon from '../../../assets/icons/linkedin-icon.png';
import menuIcon from '../../../assets/icons/menu-icon.png';

interface ChatbotCardProps {
  profileImage?: string;
  onLineClick?: () => void;
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
  action: 'line' | 'facebook' | 'maps' | 'apply' | 'call' | 'message' | 'back' | 'email';
  url?: string;
  navigateAction?: string;
}

const ChatbotCard: React.FC<ChatbotCardProps> = ({
  profileImage,
  onLineClick,
  onFacebookClick,
  onClose,
  className = '',
  resetTrigger,
  isOpen = false,
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const initializationRef = useRef(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const hasInitializedRef = useRef(false);

  // Reset chatbot when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      // Clear all timeouts first to prevent any ongoing animations
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current = [];

      // Reset initialization ref first to allow re-initialization
      initializationRef.current = false;
      hasInitializedRef.current = false;

      // Clear all messages including any leftover typing indicators
      setMessages([]);
      setInputValue('');

      // Set isInitializing to true after ensuring messages are cleared
      // Use double requestAnimationFrame to ensure state updates are fully processed
      // This prevents race conditions where initialization might start before messages are cleared
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsInitializing(true);
        });
      });
    }
  }, [resetTrigger]);

  // Initialize when chatbot opens for the first time
  useEffect(() => {
    if (isOpen && !hasInitializedRef.current && messages.length === 0 && !initializationRef.current) {
      setIsInitializing(true);
      hasInitializedRef.current = true;
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sequential flow initialization with typing indicators
  useEffect(() => {
    // Only initialize if:
    // 1. isInitializing is true (first mount or explicit reset)
    // 2. initializationRef is false (hasn't been initialized yet)
    // 3. messages array is empty (fresh page load/refresh)
    // 4. chatbot is open
    // Additional check: ensure no typing indicators are present
    const hasTypingIndicators = messages.some((msg) => msg.type === 'typing');
    if (!isInitializing || initializationRef.current || messages.length > 0 || hasTypingIndicators || !isOpen) return;
    initializationRef.current = true;

    const typingDelay = 1000; // Delay for typing indicator
    const delays = [800, 800, 800]; // Delays between messages after typing

    const showTypingIndicator = (id: string): string => {
      const typingId = `typing-${id}-${Date.now()}`;
      const typingMessage: Message = {
        id: typingId,
        type: 'typing',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, typingMessage]);
      return typingId;
    };

    const removeTypingIndicator = (typingId: string) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== typingId));
    };

    const showGreeting = () => {
      // Check if greeting already exists
      setMessages((prev) => {
        const greetingExists = prev.some((msg) => msg.id === 'greeting-1');
        if (greetingExists) return prev;

        const greetingMessage: Message = {
          id: 'greeting-1',
          type: 'bot',
          content: {
            text: "Hi there! I'm KMTI Assistant 👋 How can I help you today?",
            buttons: [
              {
                id: 'services',
                text: 'Our Services',
                action: 'services',
                icon: (
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
                ),
              },
              {
                id: 'careers',
                text: 'Careers & Application',
                action: 'careers',
                icon: (
                  <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="7" width="14" height="12" rx="1" fill="#92400E" />
                    <path d="M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7" stroke="#92400E" strokeWidth="1.5" fill="#92400E" />
                    <rect x="8" y="11" width="8" height="1" rx="0.5" fill="white" />
                    <rect x="8" y="13" width="6" height="1" rx="0.5" fill="white" />
                  </svg>
                ),
              },
              {
                id: 'location',
                text: 'Office Location',
                action: 'location',
                icon: (
                  <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#DC2626" />
                    <circle cx="12" cy="9" r="3" fill="white" />
                  </svg>
                ),
              },
              {
                id: 'support',
                text: 'Contact Support',
                action: 'support',
                icon: (
                  <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#DC2626" />
                    <text x="12" y="15" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">SOS</text>
                  </svg>
                ),
              },
              {
                id: 'about',
                text: 'About KMTI',
                action: 'about',
                icon: (
                  <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#3B82F6" />
                    <text x="12" y="16" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">i</text>
                  </svg>
                ),
              },
            ],
          },
          timestamp: new Date(),
        };
        return [...prev, greetingMessage];
      });
    };

    const showLineMessage = () => {
      setMessages((prev) => {
        const lineExists = prev.some((msg) => msg.id === 'line-1');
        if (lineExists) return prev;

        const lineMessage: Message = {
          id: 'line-1',
          type: 'bot',
          content: {
            text: 'Got product or service inquiries? Message our support team on LINE.',
            actionButtons: [
              {
                id: 'line-btn',
                text: 'Message us on LINE',
                action: 'line',
                icon: 'line',
              },
            ],
          },
          timestamp: new Date(),
        };
        return [...prev, lineMessage];
      });
    };

    const showFacebookMessage = () => {
      setMessages((prev) => {
        const facebookExists = prev.some((msg) => msg.id === 'facebook-1');
        if (facebookExists) return prev;

        const facebookMessage: Message = {
          id: 'facebook-1',
          type: 'bot',
          content: {
            text: 'Interested in joining us? Chat with our HR team on Facebook.',
            actionButtons: [
              {
                id: 'facebook-btn',
                text: 'Chat us on Facebook',
                action: 'facebook',
                icon: 'facebook',
              },
            ],
          },
          timestamp: new Date(),
        };
        return [...prev, facebookMessage];
      });
    };

    // Step 1: Show typing indicator first
    const typingId1 = showTypingIndicator('greeting');
    const timeout1 = setTimeout(() => {
      removeTypingIndicator(typingId1);
      // Step 2: Show greeting with all buttons after typing stops
      showGreeting();

      // Step 3: Show typing indicator again
      const timeout2 = setTimeout(() => {
        const typingId2 = showTypingIndicator('line');
        const timeout3 = setTimeout(() => {
          removeTypingIndicator(typingId2);
          // Step 4: Show LINE message after typing stops
          showLineMessage();

          // Step 5: Show typing indicator again
          const timeout4 = setTimeout(() => {
            const typingId3 = showTypingIndicator('facebook');
            const timeout5 = setTimeout(() => {
              removeTypingIndicator(typingId3);
              // Step 6: Show Facebook message after typing stops
              showFacebookMessage();
              setIsInitializing(false);
            }, typingDelay);
            timeoutRefs.current.push(timeout5);
          }, delays[1] + typingDelay);
          timeoutRefs.current.push(timeout4);
        }, typingDelay);
        timeoutRefs.current.push(timeout3);
      }, delays[0] + typingDelay);
      timeoutRefs.current.push(timeout2);
    }, typingDelay);
    timeoutRefs.current.push(timeout1);

    return () => {
      // Cleanup all timeouts if component unmounts
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current = [];
      initializationRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitializing, isOpen]);

  const handleButtonClick = (action: string, buttonText: string) => {
    // Handle special navigation actions
    if (action === 'learn-more-3d') {
      // Close chatbot
      if (onClose) {
        onClose();
      }
      // Navigate to services page with 3D Modeling modal
      navigate('/services?service=3d-modeling');
      return;
    }

    if (action === 'learn-more-2d') {
      // Close chatbot
      if (onClose) {
        onClose();
      }
      // Navigate to services page with 2D Detailing modal
      navigate('/services?service=2d-detailing');
      return;
    }

    if (action === 'learn-more-inspection') {
      // Close chatbot
      if (onClose) {
        onClose();
      }
      // Navigate to services page with Parts Inspection modal
      navigate('/services?service=parts-inspection');
      return;
    }

    if (action === 'learn-more-assembly') {
      // Close chatbot
      if (onClose) {
        onClose();
      }
      // Navigate to services page with Machine Assembly modal
      navigate('/services?service=machine-assembly');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      type: 'user',
      content: { text: buttonText },
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Generate bot response first to calculate its length
    const botResponse = generateBotResponse(action);

    // Calculate response text length (including buttons text)
    let responseLength = 0;
    if (botResponse.content?.text) {
      responseLength += botResponse.content.text.length;
    }
    if (botResponse.content?.buttons) {
      botResponse.content.buttons.forEach(btn => {
        responseLength += btn.text.length;
      });
    }
    if (botResponse.content?.actionButtons) {
      botResponse.content.actionButtons.forEach(btn => {
        responseLength += btn.text.length;
      });
    }

    // Calculate delay based on response length
    // Base delay: 800ms
    // Additional delay: ~50ms per 100 characters
    // Minimum: 800ms, Maximum: 3000ms
    const baseDelay = 800;
    const lengthMultiplier = Math.floor(responseLength / 100) * 50;
    const randomVariation = Math.random() * 400; // Random 0-400ms
    const calculatedDelay = Math.min(Math.max(baseDelay + lengthMultiplier + randomVariation, 800), 3000);

    // Show typing indicator with unique ID
    const typingId = `typing-${Date.now()}-${Math.random()}`;
    const typingMessage: Message = {
      id: typingId,
      type: 'typing',
      timestamp: new Date(),
    };

    // Add typing indicator immediately
    setMessages((prev) => [...prev, typingMessage]);

    // Show bot response after calculated delay
    setTimeout(() => {
      // Remove typing indicator by specific ID
      setMessages((prev) => prev.filter((msg) => msg.id !== typingId));

      // Add bot response
      setMessages((prev) => [...prev, botResponse]);
    }, calculatedDelay);
  };

  // Match user input to actions based on keywords
  const matchInputToAction = (input: string): string | null => {
    const normalizedInput = input.toLowerCase().trim();

    // Keyword mapping
    const keywordMap: { [key: string]: string } = {
      // Services
      'services': 'services',
      'service': 'services',
      'our services': 'services',
      '3d modeling': '3d-modeling',
      '3d': '3d-modeling',
      'modeling': '3d-modeling',
      '2d detailing': '2d-detailing',
      '2d': '2d-detailing',
      'detailing': '2d-detailing',
      'parts inspection': 'parts-inspection',
      'inspection': 'parts-inspection',
      'parts': 'parts-inspection',
      'machine assembly': 'machine-assembly',
      'assembly': 'machine-assembly',
      'machine': 'machine-assembly',

      // Careers
      'careers': 'careers',
      'career': 'careers',
      'application': 'careers',
      'apply': 'careers',
      'job': 'careers',
      'jobs': 'careers',
      'hiring': 'careers',
      'how to apply': 'how-to-apply',
      'apply now': 'how-to-apply',
      'hiring process': 'hiring-process',
      'process': 'hiring-process',
      'working schedule': 'working-schedule',
      'schedule': 'working-schedule',
      'hours': 'working-schedule',
      'contact hr': 'contact-hr',
      'hr': 'contact-hr',
      'human resources': 'contact-hr',

      // Location
      'location': 'location',
      'office': 'location',
      'address': 'location',
      'where': 'location',
      'map': 'location',
      'maps': 'location',

      // Support
      'support': 'support',
      'contact': 'support',
      'help': 'support',
      'inquiry': 'support',
      'inquiries': 'support',

      // About
      'about': 'about',
      'about kmti': 'about',
      'company': 'about',
      'info': 'about',
      'information': 'about',

      // Main menu
      'main menu': 'main-menu',
      'menu': 'main-menu',
      'home': 'main-menu',
      'back': 'main-menu',
    };

    // Direct match
    if (keywordMap[normalizedInput]) {
      return keywordMap[normalizedInput];
    }

    // Partial match - check if input contains any keyword
    for (const [keyword, action] of Object.entries(keywordMap)) {
      if (normalizedInput.includes(keyword) || keyword.includes(normalizedInput)) {
        return action;
      }
    }

    return null;
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;

    const matchedAction = matchInputToAction(inputValue);

    if (matchedAction) {
      handleButtonClick(matchedAction, inputValue);
    } else {
      // Show helpful message for unmatched input
      const userMessage: Message = {
        id: `user-${Date.now()}-${Math.random()}`,
        type: 'user',
        content: { text: inputValue },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Show typing indicator
      const typingId = `typing-${Date.now()}-${Math.random()}`;
      const typingMessage: Message = {
        id: typingId,
        type: 'typing',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, typingMessage]);

      // Show helpful response
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== typingId));

        const helpMessage: Message = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: {
            text: "I'm not sure how to help with that. Would you like to return to the main menu?",
            actionButtons: [
              { id: 'back-main', text: '🔙Back to Main Menu', action: 'back', navigateAction: 'main-menu' },
            ],
          },
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, helpMessage]);
      }, 1000);
    }

    // Clear input
    setInputValue('');
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const handleActionButtonClick = (action: ActionButton) => {
    switch (action.action) {
      case 'line':
        if (onLineClick) {
          onLineClick();
        } else {
          window.open('https://line.me/ti/p/~emji000', '_blank');
        }
        break;
      case 'facebook':
        if (onFacebookClick) {
          onFacebookClick();
        } else {
          window.open('https://www.facebook.com/kmti.com.ph/', '_blank');
        }
        break;
      case 'maps':
        window.open('https://maps.app.goo.gl/CyS8xB8sLNPaSYoc8', '_blank');
        break;
      case 'apply':
        // If URL is LinkedIn, open LinkedIn, otherwise navigate to careers page
        if (action.url && action.url.includes('linkedin.com')) {
          window.open(action.url, '_blank');
        } else {
          // Close chatbot and navigate to careers page
          if (onClose) {
            onClose();
          }
          navigate('/careers');
        }
        break;
      case 'call':
        window.location.href = 'tel:+63495734000';
        break;
      case 'message':
        // Use URL from action button if provided, otherwise use default Facebook URL
        if (action.url) {
          window.open(action.url, '_blank');
        } else {
          window.open('https://www.facebook.com/kmti.com.ph/', '_blank');
        }
        break;
      case 'back':
        if (action.navigateAction) {
          handleButtonClick(action.navigateAction, action.text);
        }
        break;
      case 'email':
        if (action.url) {
          window.open(action.url, '_blank');
        } else {
          window.open('https://mail.google.com/mail/?view=cm&to=info@kmti.com.ph&su=Inquiry&body=Hello%20KMTI%20Team,%0A%0AI%20would%20like%20to%20inquire%20about%20your%20services.%0A%0AThank%20you!', '_blank');
        }
        break;
    }
  };

  const generateBotResponse = (action: string): Message => {
    const messageId = `bot-${Date.now()}`;

    switch (action) {
      case 'services':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'Which service would you like to learn more about?',
            buttons: [
              { id: '3d-modeling', text: '3D Modeling', action: '3d-modeling' },
              { id: '2d-detailing', text: '2D Detailing', action: '2d-detailing' },
              { id: 'parts-inspection', text: 'Parts Inspection', action: 'parts-inspection' },
              { id: 'machine-assembly', text: 'Machine Assembly', action: 'machine-assembly' },
              { id: 'back-main', text: '🔙Back to Main Menu', action: 'main-menu' },
            ],
          },
          timestamp: new Date(),
        };

      case '3d-modeling':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'Our 3D Modeling service creates detailed models for high-precision engineering and visualization, ensuring accurate fabrication and assembly. \n\n⏩Want to learn more about our projects?',
            buttons: [
              { id: 'learn-more-3d', text: 'Learn More', action: 'learn-more-3d' },
              { id: 'back-services', text: 'Back to Services', action: 'services' },
            ],
          },
          timestamp: new Date(),
        };

      case '2d-detailing':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'Our 2D Detailing converts 3D models into precise manufacturing drawings and quality check documents.',
            buttons: [
              { id: 'learn-more-2d', text: 'Learn More', action: 'learn-more-2d' },
              { id: 'back-services', text: 'Back to Services', action: 'services' },
            ],
          },
          timestamp: new Date(),
        };

      case 'parts-inspection':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'We inspect fabricated parts based on our design to ensure quality before assembly. Each part undergoes a series of tests usigng hightech devices to verify accuracy and precicion.',
            buttons: [
              { id: 'learn-more-inspection', text: 'Learn More', action: 'learn-more-inspection' },
              { id: 'back-services', text: 'Back to Services', action: 'services' },
            ],
          },
          timestamp: new Date(),
        };

      case 'machine-assembly':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'In collaboration with industry pioneers Kusakabe Electric & Machinery Co., Ltd., Next Engineering, and Maeno Giken Inc., we ensure our clients receive hight-performance products built for effieciency and long-term success.',
            buttons: [
              { id: 'learn-more-assembly', text: 'Learn More', action: 'learn-more-assembly' },
              { id: 'back-services', text: 'Back to Services', action: 'services' },
            ],
          },
          timestamp: new Date(),
        };

      case 'careers':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'Interested in joining KMTI? We\'re always looking for skilled and passionate individuals. What would you like to know?',
            buttons: [
              { id: 'view-positions', text: '🔎View Open Positions', action: 'view-positions' },
              { id: 'how-to-apply', text: '📔How to Apply', action: 'how-to-apply' },
              { id: 'hiring-process', text: '⏲️Hiring Process', action: 'hiring-process' },
              { id: 'career-opportunities', text: '🚀Career Opportunities', action: 'career-opportunities' },
              { id: 'working-schedule', text: '⏰Working Schedule', action: 'working-schedule' },
              { id: 'contact-hr', text: '📞Contact HR', action: 'contact-hr' },
              { id: 'back-main', text: '🔙Back to Main Menu', action: 'main-menu' },
            ],
          },
          timestamp: new Date(),
        };

      case 'how-to-apply':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'You can apply in two ways:\n1️Submit your resume directly at our office:\n🏛Team Quest Building, FCIE, Dasmarinas Cavite\n2️Apply online through our LinkedIn page\n3️For more personal or quick inquiries, message our HR directly on Facebook Messenger',
            actionButtons: [
              { id: 'apply-linkedin', text: 'Apply via LinkedIn', action: 'apply', url: 'https://www.linkedin.com/company/kusakabe-maeno-tech-inc/' },
              { id: 'message-hr-fb', text: 'Message HR on Facebook', action: 'message', url: 'https://www.facebook.com/kmti.com.ph/' },
              { id: 'back-careers', text: 'Back', action: 'back', navigateAction: 'careers' },
            ],
          },
          timestamp: new Date(),
        };

      case 'hiring-process':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'The hiring process from the initial interview to the final assessment usually takes about one day.',
            actionButtons: [
              { id: 'back-careers', text: 'Back', action: 'back', navigateAction: 'careers' },
            ],
          },
          timestamp: new Date(),
        };

      case 'career-opportunities':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'We believe in continuous improvement. One of the great opportunities for career growth at KMTI is the chance to undergo training in Japan to develop technical skills.',
            actionButtons: [
              { id: 'apply-now', text: 'Apply Now', action: 'apply', url: 'https://www.facebook.com/kmti.com.ph/' },
            ],
          },
          timestamp: new Date(),
        };

      case 'view-positions':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'Current openings include:\n• Engineering Staff / CAD Operator / OJT\n• Accounting / Admin Staff\n📍 Located in Dasmarinas, Cavite',
            actionButtons: [
              { id: 'apply-now', text: 'Apply Now', action: 'apply', url: 'https://www.facebook.com/kmti.com.ph/' },
            ],
          },
          timestamp: new Date(),
        };

      case 'working-schedule':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'Our company operates on a compressed work schedule:\nWork Days: Monday to Friday\nWork Hours:\nMonday to Thursday: 7:00 AM - 6:00 PM\nFriday: 7:00 AM - 4:00 PM',
            actionButtons: [
              { id: 'apply-now', text: 'Apply Now', action: 'apply', url: 'https://www.facebook.com/kmti.com.ph/' },
            ],
          },
          timestamp: new Date(),
        };

      case 'contact-hr':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'You can reach our HR team through:\n💌info@kmti.com.ph\n☎️(046) 413-4509\n💬Or message us on Facebook Messenger for faster response.',
            actionButtons: [
              { id: 'email-hr', text: 'Email HR', action: 'email', url: 'https://mail.google.com/mail/?view=cm&to=info@kmti.com.ph&su=Inquiry&body=Hello%20KMTI%20Team,%0A%0AI%20would%20like%20to%20inquire%20about%20your%20services.%0A%0AThank%20you!' },
              { id: 'message-hr-fb', text: 'Message HR on Facebook', action: 'message', url: 'https://www.facebook.com/kmti.com.ph/' },
              { id: 'back-careers', text: 'Back', action: 'back', navigateAction: 'careers' },
            ],
          },
          timestamp: new Date(),
        };

      case 'location':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'Our main office is located at:\n\n🏢Vital Industrial Prop. Inc. Bldg. B, nit 2-B, First Cavite Industrial Estate Langkaan 1, Dasmarinas City, Cavite 4126 Philippines\nNeed Directions? ',
            actionButtons: [
              { id: 'open-maps', text: 'Open in Google Maps', action: 'maps' },
            ],
          },
          timestamp: new Date(),
        };

      case 'support':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'Need help with something else? You can reach our support team directly for:\n• Service or project inquiries\n• Technical assistance\n• Sales inquiries',
            buttons: [
              { id: 'message-fb', text: 'Message us on FB', action: 'message-fb' },
              { id: 'call-us', text: 'Call us', action: 'call-us' },
              { id: 'back-main', text: 'Back', action: 'main-menu' },
            ],
          },
          timestamp: new Date(),
        };

      case 'message-fb':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'Got product or service inquiries? Message our support team on LINE.',
            actionButtons: [
              { id: 'chat-fb', text: 'Chat with our FB team', action: 'facebook', url: 'https://www.facebook.com/kmti.com.ph/' },
            ],
          },
          timestamp: new Date(),
        };

      case 'call-us':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'You can reach us at:\n(046) 413-4509',
            actionButtons: [
              { id: 'call-button', text: 'Call us', action: 'call' },
            ],
          },
          timestamp: new Date(),
        };

      case 'about':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'KMTI (Kusakabe & Maeno Tech., Inc.) is a leading engineering services company providing innovative solutions in 3D modeling, 2D detailing, parts inspection, and machine assembly.',
            buttons: [
              { id: 'learn-more-about', text: 'Learn More', action: 'learn-more-about' },
              { id: 'back-main', text: '🔙Back to Main Menu', action: 'main-menu' },
            ],
          },
          timestamp: new Date(),
        };

      case 'learn-more-about':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'KMTI is committed to delivering high-quality engineering solutions with precision and excellence. Our team of skilled professionals works closely with clients to ensure their projects meet the highest standards.',
            buttons: [
              { id: 'back-main', text: '🔙Back to Main Menu', action: 'main-menu' },
            ],
          },
          timestamp: new Date(),
        };

      case 'main-menu':
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'How can I help you today?',
            buttons: [
              {
                id: 'services',
                text: 'Our Services',
                action: 'services',
                icon: (
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
                ),
              },
              {
                id: 'careers',
                text: 'Careers & Application',
                action: 'careers',
                icon: (
                  <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="7" width="14" height="12" rx="1" fill="#92400E" />
                    <path d="M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7" stroke="#92400E" strokeWidth="1.5" fill="#92400E" />
                    <rect x="8" y="11" width="8" height="1" rx="0.5" fill="white" />
                    <rect x="8" y="13" width="6" height="1" rx="0.5" fill="white" />
                  </svg>
                ),
              },
              {
                id: 'location',
                text: 'Office Location',
                action: 'location',
                icon: (
                  <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#DC2626" />
                    <circle cx="12" cy="9" r="3" fill="white" />
                  </svg>
                ),
              },
              {
                id: 'support',
                text: 'Contact Support',
                action: 'support',
                icon: (
                  <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#DC2626" />
                    <text x="12" y="15" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">SOS</text>
                  </svg>
                ),
              },
              {
                id: 'about',
                text: 'About KMTI',
                action: 'about',
                icon: (
                  <svg className="chatbot-card-menu-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#3B82F6" />
                    <text x="12" y="16" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">i</text>
                  </svg>
                ),
              },
            ],
          },
          timestamp: new Date(),
        };

      default:
        return {
          id: messageId,
          type: 'bot',
          content: {
            text: 'I\'m not sure how to help with that. Would you like to return to the main menu?',
            buttons: [
              { id: 'back-main', text: '🔙Back to Main Menu', action: 'main-menu' },
            ],
          },
          timestamp: new Date(),
        };
    }
  };

  return (
    <div className={`chatbot-card ${className}`}>
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
          {onClose && (
            <button
              className="chatbot-card-close-button"
              onClick={onClose}
              aria-label="Close chatbot"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Body Section - Messages */}
      <div className="chatbot-card-body" ref={bodyRef}>
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === 'typing' ? (
              <div className="chatbot-card-message-bubble">
                <div className="chatbot-card-message-icon-left">
                  <img
                    src={profileImage || defaultProfileImage}
                    alt="Bot"
                    className="chatbot-card-message-bot-icon"
                  />
                </div>
                <div className="chatbot-card-message-content">
                  <div className="chatbot-card-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            ) : message.type === 'bot' ? (
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
                    {message.content?.text && (
                      <p style={{ margin: 0, marginBottom: message.content?.actionButtons && message.content.actionButtons.length > 0 ? '0.5rem' : '0' }}>
                        {message.content.text.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {i === 0 && (line.includes('You can reach our HR team through:') || line.includes('You can apply in two ways:') || line.includes('Current openings include:')) ? (
                              <strong>{line}</strong>
                            ) : (
                              line
                            )}
                            {i < message.content!.text!.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    )}
                    {message.content?.actionButtons && message.content.actionButtons.length > 0 && (
                      <div className="chatbot-card-action-buttons">
                        {message.content.actionButtons.map((actionBtn) => (
                          <button
                            key={actionBtn.id}
                            className={`chatbot-card-action-button ${actionBtn.action === 'line' ? 'chatbot-card-line-button' :
                              actionBtn.action === 'facebook' ? 'chatbot-card-facebook-button' :
                                actionBtn.action === 'maps' ? 'chatbot-card-apply-button' :
                                  actionBtn.action === 'apply' ? 'chatbot-card-apply-button' :
                                    actionBtn.action === 'call' ? 'chatbot-card-apply-button' :
                                      actionBtn.action === 'back' ? 'chatbot-card-apply-button' :
                                        actionBtn.action === 'email' ? 'chatbot-card-apply-button' :
                                          'chatbot-card-message-button'
                              }`}
                            onClick={() => handleActionButtonClick(actionBtn)}
                          >
                            {(actionBtn.action === 'line' || actionBtn.action === 'facebook' || actionBtn.action === 'message' || (actionBtn.action === 'apply' && actionBtn.url && actionBtn.url.includes('linkedin.com'))) && (
                              <img
                                src={actionBtn.action === 'line' ? lineIcon :
                                  actionBtn.action === 'facebook' ? facebookIcon :
                                    actionBtn.action === 'apply' && actionBtn.url && actionBtn.url.includes('linkedin.com') ? linkedinIcon :
                                      facebookIcon}
                                alt={actionBtn.action}
                                className="chatbot-card-action-button-icon"
                              />
                            )}
                            <span className="chatbot-card-action-button-text">{actionBtn.text}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.content?.buttons && message.content.buttons.length > 0 && (
                    <div className="chatbot-card-menu-buttons">
                      {message.content.buttons.map((button) => (
                        <button
                          key={button.id}
                          className="chatbot-card-menu-button chatbot-card-menu-button-clickable"
                          onClick={() => handleButtonClick(button.action, button.text)}
                        >
                          {button.icon}
                          <span className="chatbot-card-menu-button-text">{button.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="chatbot-card-message-bubble chatbot-card-message-user">
                <div className="chatbot-card-message-content chatbot-card-message-content-user">
                  <p className="chatbot-card-message-text-content chatbot-card-message-text-content-user">
                    {message.content?.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Section */}
      <div className="chatbot-card-footer">
        <input
          type="text"
          placeholder="Type a message..."
          className="chatbot-card-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleInputKeyPress}
        />
        <div
          className="chatbot-card-menu-icon-wrapper chatbot-card-menu-icon-clickable"
          onClick={() => handleButtonClick('main-menu', 'Main Menu')}
        >
          <img src={menuIcon} alt="Menu" className="chatbot-card-menu-icon" />
        </div>
      </div>
    </div>
  );
};

export { ChatbotCard };
export default ChatbotCard;

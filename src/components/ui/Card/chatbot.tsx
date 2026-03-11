import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './chatbot.css';
import { getAssetUrl } from '../../../utils/assets';
import LazyImage from '../LazyImage/LazyImage';
const defaultProfileImage = getAssetUrl('logo/profile.png');
const menuIcon = getAssetUrl('icons/menu-icon.png');

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

  // --- Keyword Matching (Word-Based Scoring) ---
  const matchInputToAction = (input: string): string | null => {
    const normalized = input.toLowerCase().trim();
    const keywordMap: { [key: string]: string } = {
      // Services
      'services': 'services', 'service': 'services', 'our services': 'services', 'サービス': 'services', 'お客様向けサービス': 'services',
      '3d modeling': '3d-modeling', '3d': '3d-modeling', 'modeling': '3d-modeling', '3dモデリング': '3d-modeling', '三次元モデリング': '3d-modeling',
      '2d detailing': '2d-detailing', '2d': '2d-detailing', 'detailing': '2d-detailing', '2d詳細設計': '2d-detailing', '二次元詳細設計': '2d-detailing',
      'parts inspection': 'parts-inspection', 'inspection': 'parts-inspection', 'parts': 'parts-inspection', '部品検査': 'parts-inspection', 'パーツ検査': 'parts-inspection',
      'machine assembly': 'machine-assembly', 'assembly': 'machine-assembly', 'machine': 'machine-assembly', '機械組立': 'machine-assembly', 'マシンアセンブリー': 'machine-assembly',
      'tube mill': 'services', 'pipe mill': 'services', 'チューブミル': 'services', 'パイプミル': 'services',

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

      // ======== CAREERS / APPLICANT QUESTIONS ========
      // General Career Questions
      'careers': 'careers', 'career': 'careers', 'application': 'careers', 'apply': 'careers', 'job': 'careers', 'jobs': 'careers', '採用': 'careers', '求人': 'careers',
      'キャリア': 'careers', 'キャリア採用': 'careers', '職務': 'careers', '仕事': 'careers', '就職': 'careers',
      'hire': 'careers', 'hiring': 'careers', 'recruit': 'careers', 'recruitment': 'careers', '採用情報': 'careers',
      '雇用': 'careers', '採用活動': 'careers', '採用進行中': 'careers', 'リクルート': 'careers',
      'vacancy': 'careers', 'vacancies': 'careers', 'opening': 'careers', 'openings': 'careers', '空きポジション': 'careers',
      '求人情報': 'careers', '空いているポジション': 'careers', '募集中': 'careers', 'ポジション募集': 'careers',
      
      // Application Process
      'how to apply': 'how-to-apply', 'apply now': 'how-to-apply', 'apply online': 'how-to-apply', 'application process': 'how-to-apply', '応募方法': 'how-to-apply',
      '応募手続き': 'how-to-apply', '申請方法': 'how-to-apply', 'オンライン申請': 'how-to-apply', 'どのように応募するか': 'how-to-apply',
      'where to submit': 'how-to-apply', 'submit resume': 'how-to-apply', 'submit application': 'how-to-apply', 'application submission': 'how-to-apply',
      'どこに提出': 'how-to-apply', '履歴書提出': 'how-to-apply', '申請提出': 'how-to-apply', '応募提出': 'how-to-apply',
      'submit my cv': 'how-to-apply', 'send resume': 'how-to-apply',
      '履歴書提出方法': 'how-to-apply', 'cv送信': 'how-to-apply',
      'how to apply for': 'how-to-apply', 'how can i apply for': 'how-to-apply', 'how do i apply for': 'how-to-apply', 'how to apply for position': 'how-to-apply', 'apply for position': 'how-to-apply',
      'ポジションへの応募方法': 'how-to-apply', 'どのようにポジションに応募するか': 'how-to-apply',
      
      // Hiring & Interview
      'hiring process': 'hiring-process', 'interview': 'hiring-process', 'interview process': 'hiring-process',
      '採用プロセス': 'hiring-process', '面接': 'hiring-process', '面接プロセス': 'hiring-process', 'インタビュー': 'hiring-process',
      'interview stage': 'hiring-process', 'interview timeline': 'hiring-process', 'selection process': 'hiring-process',
      '面接段階': 'hiring-process', '面接スケジュール': 'hiring-process', '選考プロセス': 'hiring-process',
      'next step': 'hiring-process', 'what happens next': 'hiring-process', 'interview question': 'hiring-process',
      '次のステップ': 'hiring-process', '次はどうなるか': 'hiring-process', '面接の質問': 'hiring-process',

      // Positions & Roles
      'available position': 'q3-available-positions','available job position': 'q3-available-positions', 'what positions': 'q3-available-positions', 'open position': 'q3-available-positions', 'current opening': 'q3-available-positions', '募集職種': 'q3-available-positions', '現在の求人': 'q3-available-positions',
      '利用可能なポジション': 'q3-available-positions', 'オープンポジション': 'q3-available-positions', '募集ポジション': 'q3-available-positions', 'どんなポジション': 'q3-available-positions',
      'position': 'q3-available-positions', 'positions': 'q3-available-positions', 'role': 'q3-available-positions', 'job role': 'q3-available-positions', 'job description': 'q3-available-positions',
      'ポジション': 'q3-available-positions', 'ポジション説明': 'q3-available-positions', '職務説明': 'q3-available-positions', '役職': 'q3-available-positions',
      'engineer position': 'q3-available-positions', 'cad position': 'q3-available-positions', 'admin position': 'q3-available-positions',
      'エンジニア職': 'q3-available-positions', 'cadポジション': 'q3-available-positions', '管理職': 'q3-available-positions',
      'engineering job': 'q3-available-positions', 'design job': 'q3-available-positions',
      'デザイン職': 'q3-available-positions',
      'what are the available positions': 'q3-available-positions', 'available job positions': 'q3-available-positions', 'current job positions': 'q3-available-positions', 'what job openings': 'q3-available-positions', 'what positions are hiring': 'q3-available-positions', 'what jobs are available': 'q3-available-positions', 'what openings do you have': 'q3-available-positions',
      '利用可能なポジションは何ですか': 'q3-available-positions', '現在募集中のポジション': 'q3-available-positions', 'どのポジションが採用中': 'q3-available-positions',
      'interested in specific field': 'q3-available-positions', 'interested in field': 'q3-available-positions', 'openings in field': 'q3-available-positions', 'positions in field': 'q3-available-positions', 'any available slots': 'q3-available-positions', 'available slots': 'q3-available-positions', 'any opening in': 'q3-available-positions',
      '特定分野に興味': 'q3-available-positions', '分野のポジション': 'q3-available-positions', 'スロット': 'q3-available-positions',
      
      // Requirements & Qualifications
      'req': 'q2-requirements', 'what is the requirement': 'q2-requirements', 'requirement': 'q2-requirements', 'requirements': 'q2-requirements', 'what requirements': 'q2-requirements', 'what do i need': 'q2-requirements', 'requirements needed': 'q2-requirements', '応募に必要な書類': 'q2-requirements', '必要な書類': 'q2-requirements',
      '要件': 'q2-requirements', '必要な要件': 'q2-requirements', '何が必要': 'q2-requirements', '要件は何': 'q2-requirements',
      'qualifications': 'q2-requirements', 'education required': 'q2-requirements', 'documents needed': 'q2-requirements', 'document required': 'q2-requirements',
      '資格': 'q2-requirements', '学歴要件': 'q2-requirements', '提出書類': 'q2-requirements',
      'ojt skills': 'q14-ojt-requirements', 'ojt skill requirement': 'q14-ojt-requirements', 'ojt trainee skills': 'q14-ojt-requirements', 'trainee skills required': 'q14-ojt-requirements',
      'ojt実習生スキル': 'q14-ojt-requirements',
      'ojt skill requirements': 'q14-ojt-requirements', 'ojt skills requirement': 'q14-ojt-requirements', 'ojt skill needed': 'q14-ojt-requirements', 'what ojt skills needed': 'q14-ojt-requirements', 'ojt required skill': 'q14-ojt-requirements', 'ojt skilled': 'q14-ojt-requirements',
      'ojtスキル要件': 'q14-ojt-requirements', 'ojtに필要なスキル': 'q14-ojt-requirements',
 
      // Accounting Skills
      'account': 'q15-accounting-requirements', 'accounting': 'q15-accounting-requirements', 'accounting needed skill': 'q15-accounting-requirements','accounting skill': 'q15-accounting-requirements', 'accounting requirements': 'q15-accounting-requirements', 'accounting requirement': 'q15-accounting-requirements', 'accounting req': 'q15-accounting-requirements', 'accounting staff requirement': 'q15-accounting-requirements', 'accounting staff requirements': 'q15-accounting-requirements', 'what is needed for accounting': 'q15-accounting-requirements', 'what do i need for accounting': 'q15-accounting-requirements', 'accounting qualifications': 'q15-accounting-requirements',
      '会計': 'q15-accounting-requirements', '会計スキル': 'q15-accounting-requirements', '会計要件': 'q15-accounting-requirements', '会計に必要な': 'q15-accounting-requirements',
      'accounting skills': 'q15-accounting-requirements', 'accounting skill requirement': 'q15-accounting-requirements', 'accounting staff skills': 'q15-accounting-requirements', 'accountant skills': 'q15-accounting-requirements',
      '会計職スキル': 'q15-accounting-requirements', '簿記': 'q15-accounting-requirements',
      'accounting skill requirements': 'q15-accounting-requirements', 'accounting skills requirement': 'q15-accounting-requirements', 'accounting skill needed': 'q15-accounting-requirements', 'what accounting skills needed': 'q15-accounting-requirements', 'accounting required skill': 'q15-accounting-requirements', 'accountings': 'q15-accounting-requirements',
      '会計スキル要件': 'q15-accounting-requirements', '会計に必要なスキル': 'q15-accounting-requirements',
 
     // Admin Skills
      'admin requirement': 'q16-admin-staff-requirements', 'admin skill': 'q16-admin-staff-requirements', 'admin': 'q16-admin-staff-requirements', 'admin requirements': 'q16-admin-staff-requirements', 'admins requirement': 'q16-admin-staff-requirements', 'admins': 'q16-admin-staff-requirements', 'admin staff requirement': 'q16-admin-staff-requirements', 'admin staff requirements': 'q16-admin-staff-requirements', 'what is needed for admin': 'q16-admin-staff-requirements', 'what do i need for admin': 'q16-admin-staff-requirements', 'admin qualifications': 'q16-admin-staff-requirements',
      '管理': 'q16-admin-staff-requirements', '管理スキル': 'q16-admin-staff-requirements', '管理者': 'q16-admin-staff-requirements', '管理職要件': 'q16-admin-staff-requirements', '管理に必要な': 'q16-admin-staff-requirements',
      'admin skills': 'q16-admin-staff-requirements', 'admin skill requirement': 'q16-admin-staff-requirements', 'admin staff skills': 'q16-admin-staff-requirements', 'administrative skills': 'q16-admin-staff-requirements',
      '管理職スキル': 'q16-admin-staff-requirements', '事務スキル': 'q16-admin-staff-requirements',
      'admin skill requirements': 'q16-admin-staff-requirements', 'admin skills requirement': 'q16-admin-staff-requirements', 'admin skill needed': 'q16-admin-staff-requirements', 'what admin skills needed': 'q16-admin-staff-requirements', 'admin required skill': 'q16-admin-staff-requirements', 'admin req': 'q16-admin-staff-requirements',
      '管理スキル要件': 'q16-admin-staff-requirements', '管理に必要なスキル': 'q16-admin-staff-requirements',
 
      
      'non work experiences': 'q6-non-work-experience', 'non work experience': 'q6-non-work-experience', 'no experience': 'q6-non-work-experience', 'fresh graduate': 'q6-non-work-experience', 'accept fresh grad': 'q6-non-work-experience', 'hire graduate': 'q6-non-work-experience', '未経験': 'q6-non-work-experience', '経験なし': 'q6-non-work-experience',
      '職務経歴なし': 'q6-non-work-experience', 'キャリアなし': 'q6-non-work-experience', '経験不問': 'q6-non-work-experience',
      'entry level': 'q6-non-work-experience', 'beginner friendly': 'q6-non-work-experience', 'no prior experience': 'q6-non-work-experience',
      'エントリーレベル': 'q6-non-work-experience', '初心者向け': 'q6-non-work-experience', '以前の経験なし': 'q6-non-work-experience',
      'fresh grad': 'q10-fresh-grad-acceptance', 'new graduate': 'q10-fresh-grad-acceptance', 'graduate applicant': 'q10-fresh-grad-acceptance', 'fresh graduate hiring': 'q10-fresh-grad-acceptance', 'accept new grad': 'q10-fresh-grad-acceptance', '新卒': 'q10-fresh-grad-acceptance', 'フレッシュグラデュエート': 'q10-fresh-grad-acceptance', '新卒者': 'q10-fresh-grad-acceptance', '大学卒業': 'q10-fresh-grad-acceptance', '新卒採用': 'q10-fresh-grad-acceptance',
      '最近の卒業生': 'q10-fresh-grad-acceptance', '新しい卒業生': 'q10-fresh-grad-acceptance', 'グラデュエート': 'q10-fresh-grad-acceptance',
      
      // Work Schedule & Hours
      'work schedule': 'working-schedule', 'working schedule': 'working-schedule', 'hours': 'working-schedule', '勤務スケジュール': 'working-schedule',
      '勤務時間': 'working-schedule', '作業時間': 'working-schedule', 'シフト': 'working-schedule',
      'work hours': 'working-schedule', 'opening hours': 'q5-operating-hours', '営業時間': 'q5-operating-hours',
      'what time': 'q5-operating-hours', 'when is open': 'q5-operating-hours', 'いつ開いて': 'q5-operating-hours',
      'いつ営業': 'q5-operating-hours', '営業時間は': 'q5-operating-hours', '何時に開く': 'q5-operating-hours',
      'work timing': 'working-schedule', 'starting time': 'working-schedule', 'ending time': 'working-schedule', 'shift': 'working-schedule',
      '開始時間': 'working-schedule', '終了時間': 'working-schedule',
      'flexible schedule': 'working-schedule', 'part time': 'working-schedule', 'full time': 'working-schedule', 'remote work': 'working-schedule',
      'フレックス勤務': 'working-schedule', 'パートタイム': 'working-schedule', 'フルタイム': 'working-schedule', 'リモートワーク': 'working-schedule',
      'hybrid': 'q12-work-setup', 'work from home': 'q12-work-setup', 'wfh': 'q12-work-setup', 'remote': 'q12-work-setup', 'wfh setup': 'q12-work-setup', 'hybrid setup': 'q12-work-setup', 'work setup': 'q12-work-setup', 'office setup': 'q12-work-setup', 'on-site': 'q12-work-setup', 'do you offer hybrid': 'q12-work-setup', 'hybrid or wfh': 'q12-work-setup', 'work from home available': 'q12-work-setup',
      'ハイブリッド': 'q12-work-setup', '在宅勤務': 'q12-work-setup', 'リモート': 'q12-work-setup', 'ハイブリッド設定': 'q12-work-setup', 'オフィス': 'q12-work-setup', 'オンサイト': 'q12-work-setup', '在宅勤務は利用可能': 'q12-work-setup',
      
      // Compensation & Benefits
      'benefits': 'benefits', 'compensation': 'benefits', 'pay': 'benefits', '福利厚生': 'benefits',
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
      'intern': 'training', 'internship': 'training', 'ojts': 'q8-ojt-student', 'on the job training': 'q8-ojt-student', 'trainee': 'training',
      'インターン': 'training', 'インターンシップ': 'training', '実習': 'training', '訓練生': 'training',
      'ojt program': 'q8-ojt-student', 'student training': 'q8-ojt-student', 'accept ojt': 'q8-ojt-student', '学生訓練': 'q8-ojt-student', 'オンザジョブトレーニング': 'q8-ojt-student', 'ojt要件': 'q8-ojt-student', 'ojt学生': 'q8-ojt-student',
      'ojt受け入れ': 'q8-ojt-student', '学生実習': 'q8-ojt-student',
      'japan training': 'q11-new-employee-training', 'overseas training': 'q11-new-employee-training',
      '日本研修': 'q11-new-employee-training', '海外研修': 'q11-new-employee-training', '短期研修': 'q11-new-employee-training',
      
      // Company Culture & Environment
      'company culture': 'about', 'team': 'about', 'team environment': 'about', 'work environment': 'about',
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
      
      // Application Status
      'application status': 'application-status', 'status': 'application-status', '進捗': 'application-status',
      'check my application': 'application-status', 'application result': 'application-status', 'application update': 'application-status',
      'when will i hear': 'application-status', 'decision time': 'application-status', 'result update': 'application-status',
      
      // HR Contact
      'contact hr': 'contact-hr', 'hr': 'contact-hr', '人事': 'contact-hr',
      'human resources': 'contact-hr', 'hr email': 'contact-hr', 'hr phone': 'contact-hr', 'hr team': 'contact-hr',

      // ======== CLIENT / SERVICE QUESTIONS ========
      // Service Inquiries
      'service offering': 'services', 'what do you offer': 'services',
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
      'timeline': 'timeline', 'duration': 'timeline', 'deadline': 'timeline', '納期': 'timeline', '期間': 'timeline',
      'delivery time': 'timeline', 'turnaround time': 'timeline', 'completion date': 'timeline',
      'fast': 'timeline', 'quick': 'timeline', 'urgent': 'timeline', 'expedite': 'timeline',
      'time frame': 'timeline', 'project duration': 'timeline',
      
      // Projects & Portfolio
      'projects': 'projects', 'project': 'projects', 'portfolio': 'projects', 'works': 'projects', 'case studies': 'projects', '実績': 'projects', '作品': 'projects', 'dedimpler': 'projects',
      'past projects': 'projects', 'completed work': 'projects', 'sample work': 'projects', 'reference': 'projects',
      'project example': 'projects', 'previous work': 'projects', 'showcase': 'projects',
      
      // Process & Workflow
      'workflow': 'process', 'how it works': 'process', 'steps': 'process', 'procedure': 'process', '流れ': 'process', '手順': 'process',
      'design process': 'process', 'production process': 'process', 'manufacturing process': 'process',
      'step by step': 'process', 'work process': 'process', 'method': 'process',
      
      // Quality & Standards
      'quality': 'qualifications', 'quality control': 'qualifications',
      'standard': 'qualifications', 'certification': 'qualifications', 'certified': 'qualifications',
      'accuracy': 'qualifications', 'precision': 'qualifications', 'high quality': 'qualifications',
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
      'how long in business': 'qualifications', 'years of experience': 'qualifications', 'track record': 'qualifications',
      
      // Confidentiality & Security
      'confidential': 'qualifications', 'confidentiality': 'qualifications', 'secure': 'qualifications', 'security': 'qualifications',
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
      'what is your vision': 'q17-company-vision-mission', 'what is your mission': 'q17-company-vision-mission', 'tell me your vision': 'q17-company-vision-mission', 'tell me your mission': 'q17-company-vision-mission',
      'vision mission': 'q17-company-vision-mission', 'our vision': 'q17-company-vision-mission', 'our mission': 'q17-company-vision-mission', '企業理念': 'q17-company-vision-mission', 'ミッション': 'q17-company-vision-mission', 'ビジョン': 'q17-company-vision-mission',
      'company goals': 'q17-company-vision-mission', 'long term goals': 'q17-company-vision-mission', 'company purpose': 'q17-company-vision-mission', 'our purpose': 'q17-company-vision-mission',
      
      // Q18 - Company Story
      'company story': 'q18-company-story', 'kmti story': 'q18-company-story', 'how was kmti established': 'q18-company-story',
      'when was kmti founded': 'q18-company-story', 'kmti history': 'q18-company-story', 'company founded': 'q18-company-story', 'about kmti founding': 'q18-company-story',
      'company background': 'q18-company-story', 'company formation': 'q18-company-story', 'kusakabe maeno story': 'q18-company-story', '会社の歴史': 'q18-company-story',
      'establishment year': 'q18-company-story', 'founding year': 'q18-company-story', 'when established': 'q18-company-story',
      
      // Q19 - Company Partners
      'partners': 'q19-company-partners', 'partner companies': 'q19-company-partners', 'company partners': 'q19-company-partners', 'who are your partners': 'q19-company-partners',
      'kusakabe': 'q19-company-partners', 'maeno giken': 'q19-company-partners', 'next engineering': 'q19-company-partners', 'affiliated company': 'q19-company-partners',
      'partner with': 'q19-company-partners', 'partnership': 'q19-company-partners', 'collaborators': 'q19-company-partners', 'related companies': 'q19-company-partners',
      'japan partner': 'q19-company-partners', 'industry partners': 'q19-company-partners', 'manufacturing partners': 'q19-company-partners',
      'kemco': 'q19-company-partners', 'mgk': 'q19-company-partners', 'who do you work with': 'q19-company-partners',
      
      // Q20 - Company History & Milestones
      'company history': 'q20-company-history', 'milestones': 'q20-company-history',
      'company milestones': 'q20-company-history', 'what happened': 'q20-company-history', 'company events': 'q20-company-history',
      '2014': 'q20-company-history', '2017': 'q20-company-history', '2023': 'q20-company-history', '2025': 'q20-company-history',
      'company achievements': 'q20-company-history', 'company development': 'q20-company-history', 'company expansion': 'q20-company-history',
      'since 2014': 'q20-company-history', 'established 2014': 'q20-company-history', 'past events': 'q20-company-history', 'company journey': 'q20-company-history',
      
      // Q21 - Detailed Benefits
      'detailed benefits': 'q21-detailed-benefits', 'all benefits': 'q21-detailed-benefits', 'comprehensive benefits': 'q21-detailed-benefits', 'full benefits': 'q21-detailed-benefits',
      'sss': 'q21-detailed-benefits', 'pag ibig': 'q21-detailed-benefits', 'philhealth': 'q21-detailed-benefits',
      'rice subsidy': 'q21-detailed-benefits', 'rice allowance': 'q21-detailed-benefits',
      'what benefits do you offer': 'q21-detailed-benefits', 'employee benefits': 'q21-detailed-benefits',
      'government benefits': 'q21-detailed-benefits', 'mandated benefits': 'q21-detailed-benefits', '福利厚生詳細': 'q21-detailed-benefits',
      'monthly allowance': 'q21-detailed-benefits', 'yearly bonus': 'q21-detailed-benefits', 'vacation days': 'q21-detailed-benefits', 'leave benefits': 'q21-detailed-benefits',
      
      // Q22 - Services Workflow
      'service workflow': 'q22-services-workflow', 'how do you work': 'q22-services-workflow',
      'stages': 'q22-services-workflow',
      'order process': 'q22-services-workflow', 'project process': 'q22-services-workflow', 'delivery process': 'q22-services-workflow', 'complete process': 'q22-services-workflow',
      'process flow': 'q22-services-workflow',
      
      // Q23 - Application Timeline
      'application timeline': 'q23-application-timeline', 'hiring timeline': 'q23-application-timeline', 'how long': 'q23-application-timeline',
      'how long does it take': 'q23-application-timeline', 'how many days': 'q23-application-timeline', 'start date': 'q23-application-timeline', 'when can i start': 'q23-application-timeline',
      'how fast': 'q23-application-timeline', 'quick hiring': 'q23-application-timeline', 'fast hiring': 'q23-application-timeline', 'rapid hiring': 'q23-application-timeline',
      'how long interview': 'q23-application-timeline', 'interview duration': 'q23-application-timeline', 'one day interview': 'q23-application-timeline', 'fast track hiring': 'q23-application-timeline',
      
      // General - Company & About
      'location': 'location', 'office': 'location', 'address': 'address', 'map': 'location', 'where': 'location', '住所': 'location', '場所': 'location', '地図': 'location',
      'direction': 'location', 'how to get': 'location', 'navigate': 'location', 'gps': 'location',
      'about': 'about', 'company': 'about', 'kmti': 'about', 'who are you': 'about', '会社概要': 'about',
      'who we are': 'about', 'about us': 'about', 'our company': 'about', 'company info': 'about', 'company information': 'about',
      'about kmti': 'q17-company-vision-mission', 'kmti info': 'q17-company-vision-mission', 'kmti information': 'q17-company-vision-mission', 'tell me about kmti': 'q17-company-vision-mission',
      
      'main menu': 'main-menu', 'menu': 'main-menu', 'options': 'main-menu', 'ホーム': 'main-menu', 'メニュー': 'main-menu',
      'start over': 'start-over', 'reset': 'start-over', 'restart': 'start-over', '最初から': 'start-over', 'リセット': 'start-over',
      'talk to human': 'talk-to-human', 'human': 'talk-to-human', 'person': 'talk-to-human', 'agent': 'talk-to-human', 'representative': 'talk-to-human', 'operator': 'talk-to-human', '担当者': 'talk-to-human', '人': 'talk-to-human', 'オペレーター': 'talk-to-human',
      'speak to someone': 'talk-to-human', 'real person': 'talk-to-human', 'live chat': 'talk-to-human'
    };

    // Exact match first
    if (keywordMap[normalized]) return keywordMap[normalized];

    // Word-based scoring: count how many words from the user input match keyword words
    const inputWords = normalized.split(/\s+/).filter(w => w.length > 0);
    let bestMatch: { action: string | null; score: number } = { action: null, score: 0 };

    for (const [keyword, action] of Object.entries(keywordMap)) {
      const keywordWords = keyword.split(/\s+/).filter(w => w.length > 0);
      let matchedWords = 0;

      // Count how many words from the keyword appear in the input
      for (const kwWord of keywordWords) {
        if (inputWords.includes(kwWord)) {
          matchedWords++;
        }
      }

      // Calculate score: prioritize complete matches, then by number of matched words, then keyword length
      if (matchedWords > 0) {
        const isCompleteMatch = matchedWords === keywordWords.length;
        // Complete matches get a 1000 bonus, ensuring they're prioritized
        const score = isCompleteMatch ? (1000 + matchedWords + keyword.length) : (matchedWords + keyword.length / 1000);

        if (score > bestMatch.score) {
          bestMatch = { action, score };
        }
      }
    }

    return bestMatch.action;
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

      <div className="chatbot-card-body" ref={bodyRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`chatbot-card-message-bubble ${msg.type === 'user' ? 'chatbot-card-message-user' : ''}`}>
            {msg.type !== 'user' && (
              <div className="chatbot-card-message-icon-left">
                <LazyImage src={profileImage || defaultProfileImage} alt="Bot" className="chatbot-card-message-bot-icon" />
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
          <LazyImage src={menuIcon} alt="Menu" className="chatbot-card-menu-icon" />
        </div>
      </div>
    </div>
  );
};

export { ChatbotCard };
export default ChatbotCard;
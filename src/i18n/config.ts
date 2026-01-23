import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en';
import jp from './locales/jp';

i18n
  .use(initReactI18next)
  .use(LanguageDetector) // Comment this out to stop browser detection
  .init({
    resources: {
      en: { translation: en },
      jp: { translation: jp },
    },
    // lng: 'jp', // Force Japanese
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
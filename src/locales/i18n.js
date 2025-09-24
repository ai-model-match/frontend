import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { enTranslations } from './en';
import { itTranslations } from './it';

const resources = {
  en: { translation: enTranslations },
  it: { translation: itTranslations },
};

const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
const detectedLang = i18n.language.split('-')[0];

/* eslint-disable no-undef */
document.documentElement.lang = detectedLang;
document.documentElement.dir = rtlLanguages.includes(detectedLang) ? 'rtl' : 'ltr';
/* eslint-enable no-undef */

export default i18n;

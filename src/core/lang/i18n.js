import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { enTranslations } from './en';
import { itTranslations } from './it';

// Traduzioni esempio
const resources = {
    en: { translation: enTranslations },
    it: { translation: itTranslations },
};

const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

i18n
    .use(LanguageDetector) // rileva automaticamente la lingua del browser
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React già protegge dal XSS
        },
    });

// Imposta la direzione del testo automaticamente
const detectedLang = i18n.language.split('-')[0];
document.documentElement.lang = detectedLang;
document.documentElement.dir = rtlLanguages.includes(detectedLang) ? 'rtl' : 'ltr';

export default i18n;

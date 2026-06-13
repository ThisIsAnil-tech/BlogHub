import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

// Initialize i18next with file system backend
export const initI18n = async () => {
  await i18next.use(Backend).init({
    fallbackLng: 'en',
    preload: ['en', 'es', 'fr', 'de', 'zh', 'ja'],
    backend: {
      loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.json')
    },
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie']
    }
  });

  return i18next;
};

// Translation helper
export const t = (key: string, options?: any) => {
  return i18next.t(key, options);
};

// Get supported languages
export const getSupportedLanguages = () => {
  return i18next.languages;
};

// Change language
export const changeLanguage = async (lng: string) => {
  await i18next.changeLanguage(lng);
};
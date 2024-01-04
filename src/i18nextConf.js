import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { i18nextPlugin } from 'translation-check';

const fallbackLng = ['vn'];
const availableLanguages = [
    'en',
    'vn',
    'da',
    'de',
    'es',
    'fr',
    'hi',
    'hu',
    'ja',
    'ko',
    'nl',
    'ru',
    'tr',
    'zh',
    'si'
];

i18n.use(Backend) // load translations using http (default public/assets/locals/en/translations)
    //.use(LanguageDetector) // detect user language
    .use(initReactI18next) // pass the i18n instance to react-i18next.
    .use(i18nextPlugin)
    .init({
        fallbackLng, // fallback language is english.

        backend: {
            loadPath: 'locales/{{lng}}/translate.json'
        },

        detection: {
            checkWhitelist: true // options for language detection
        },

        debug: false,

        whitelist: availableLanguages,

        interpolation: {
            escapeValue: false // no need for react. it escapes by default
        }
    });

export default i18n;

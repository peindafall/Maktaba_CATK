import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Les traductions sont intégrées au bundle (plus de requête HTTP au démarrage) :
// l'interface s'affiche immédiatement dans la bonne langue, même avec un réseau lent.
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';
import ar from '../../public/locales/ar/translation.json';

export const SUPPORTED_LANGUAGES = ['fr', 'en', 'ar'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const applyDirection = (lng: string) => {
  const base = (lng || 'fr').split('-')[0];
  document.documentElement.dir = base === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = base;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    nonExplicitSupportedLngs: true, // "en-US" -> "en"
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  });

applyDirection(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', applyDirection);

export default i18n;

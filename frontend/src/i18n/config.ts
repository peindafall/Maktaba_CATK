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

// Une seule fois : les visiteurs déjà venus avaient reçu la langue du téléphone automatiquement.
// Tant qu'ils n'ont pas choisi eux-mêmes une langue, on les remet en français.
try {
  if (!localStorage.getItem('catk-lang-chosen')) localStorage.setItem('i18nextLng', 'fr');
} catch {
  /* navigation privée */
}

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
    // Langue par défaut : FRANÇAIS pour un nouveau visiteur (avant : langue du téléphone, d'où
    // « The server is waking up » en anglais). Le choix fait avec le globe est ensuite mémorisé.
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  });

applyDirection(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', applyDirection);

export default i18n;

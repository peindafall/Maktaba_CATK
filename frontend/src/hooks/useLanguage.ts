import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: 'fr' | 'en' | 'ar') => {
    i18n.changeLanguage(lang);
  };

  const isRTL = i18n.language === 'ar';

  return {
    currentLanguage: i18n.language as 'fr' | 'en' | 'ar',
    changeLanguage,
    isRTL,
  };
};

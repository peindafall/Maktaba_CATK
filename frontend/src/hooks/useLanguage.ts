import { useTranslation } from 'react-i18next';
import type { AppLanguage } from '../i18n/config';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const current = ((i18n.resolvedLanguage || i18n.language || 'fr').split('-')[0] as AppLanguage) || 'fr';

  const changeLanguage = (lang: AppLanguage) => {
    i18n.changeLanguage(lang);
  };

  return {
    currentLanguage: current,
    changeLanguage,
    isRTL: current === 'ar',
  };
};

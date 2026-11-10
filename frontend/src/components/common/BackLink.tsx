import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

/** Retour à la page précédente si on vient du site, sinon vers la liste. */
export const BackLink = ({ fallback }: { fallback: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const canGoBack = location.key !== 'default';
  return (
    <Link
      to={fallback}
      onClick={(e) => {
        if (canGoBack) {
          e.preventDefault();
          navigate(-1);
        }
      }}
      className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary mb-5 transition-colors"
    >
      <ArrowLeft size={16} className="rtl:rotate-180" /> {t('common.back')}
    </Link>
  );
};

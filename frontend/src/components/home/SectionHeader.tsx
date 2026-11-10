import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

export const SectionHeader = ({ title, to }: { title: string; to?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-tight">{title}</h2>
      {to && (
        <Link
          to={to}
          className="flex-shrink-0 inline-flex items-center gap-1 text-primary font-medium text-sm whitespace-nowrap hover:gap-2 transition-all"
        >
          {t('common.see_all')} <ArrowRight size={16} className="rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
};

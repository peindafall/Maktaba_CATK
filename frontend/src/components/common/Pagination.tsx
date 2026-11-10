import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    onChange(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="flex items-center justify-center gap-3 mt-10" aria-label="pagination">
      <Button variant="outline" size="sm" onClick={() => go(Math.max(1, page - 1))} disabled={page <= 1}>
        <ChevronLeft size={16} className="rtl:rotate-180" />
        <span className="hidden sm:inline">{t('common.previous')}</span>
      </Button>
      <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">
        {t('common.page')} {page} {t('common.of')} {totalPages}
      </span>
      <Button variant="outline" size="sm" onClick={() => go(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
        <span className="hidden sm:inline">{t('common.next')}</span>
        <ChevronRight size={16} className="rtl:rotate-180" />
      </Button>
    </nav>
  );
};

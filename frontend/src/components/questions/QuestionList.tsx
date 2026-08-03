import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import { useQuestions } from '../../hooks/useQuestions';
import { QuestionCard } from './QuestionCard';
import { SkeletonList } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';

export const QuestionList = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch } = useQuestions({
    page,
    page_size: 12,
    search: search || undefined,
  });

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{t('common.error')}</p>
        <Button onClick={() => refetch()}>{t('common.retry')}</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Rechercher une question..."
          className="input-base"
        />
      </div>

      {isLoading ? (
        <SkeletonList count={8} />
      ) : !data?.results.length ? (
        <EmptyState icon={<HelpCircle />} title={t('questions.no_questions')} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.results.map((question, i) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <QuestionCard question={question} />
              </motion.div>
            ))}
          </div>

          {data.total_pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                {t('common.previous')}
              </Button>
              <span className="text-sm text-[var(--text-secondary)]">
                {t('common.page')} {page} {t('common.of')} {data.total_pages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))} disabled={page === data.total_pages}>
                {t('common.next')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Filter, SortAsc } from 'lucide-react';
import { useTeachings } from '../../hooks/useTeachings';
import { TeachingCard } from './TeachingCard';
import { SkeletonList } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { FileText } from 'lucide-react';

interface TeachingListProps {
  categorySlug?: string;
  searchQuery?: string;
}

export const TeachingList = ({ categorySlug, searchQuery }: TeachingListProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState('-published_at');

  const params: Record<string, unknown> = { page, ordering, page_size: 12 };
  if (categorySlug) params.category__slug = categorySlug;
  if (searchQuery) params.search = searchQuery;

  const { data, isLoading, isError, refetch } = useTeachings(params);

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
      {/* Filters bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Filter size={16} />
          {data && <span>{data.count} {t('teachings.title').toLowerCase()}</span>}
        </div>
        <div className="flex items-center gap-2">
          <SortAsc size={16} className="text-[var(--text-secondary)]" />
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="input-base py-1.5 px-3 text-sm w-auto"
          >
            <option value="-published_at">Plus récent</option>
            <option value="published_at">Plus ancien</option>
            <option value="-views_count">Plus vus</option>
            <option value="-downloads_count">Plus téléchargés</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <SkeletonList count={12} />
      ) : !data?.results.length ? (
        <EmptyState
          icon={<FileText />}
          title={t('teachings.no_teachings')}
          description="Aucun enseignement ne correspond à vos critères."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.results.map((teaching, i) => (
              <motion.div
                key={teaching.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <TeachingCard teaching={teaching} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {data.total_pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {t('common.previous')}
              </Button>
              <span className="text-sm text-[var(--text-secondary)]">
                {t('common.page')} {page} {t('common.of')} {data.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page === data.total_pages}
              >
                {t('common.next')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

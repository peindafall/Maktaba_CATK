import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, SortAsc } from 'lucide-react';
import { useTeachings } from '../../hooks/useTeachings';
import { TeachingCard } from './TeachingCard';
import { SkeletonList } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Pagination } from '../common/Pagination';
import { ListError } from '../common/ListError';

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

  const { data, isLoading, isError, refetch, isPlaceholderData } = useTeachings(params);

  if (isError) return <ListError onRetry={() => refetch()} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-sm text-[var(--text-secondary)]">{data && t('teachings.count', { count: data.count })}</p>
        <label className="flex items-center gap-2">
          <SortAsc size={16} className="text-[var(--text-secondary)]" />
          <span className="sr-only">{t('teachings.sort_by')}</span>
          <select
            value={ordering}
            onChange={(e) => {
              setOrdering(e.target.value);
              setPage(1);
            }}
            className="input-base py-2 px-3 w-auto"
          >
            <option value="-published_at">{t('teachings.sort_newest')}</option>
            <option value="published_at">{t('teachings.sort_oldest')}</option>
            <option value="-views_count">{t('teachings.sort_views')}</option>
            <option value="-downloads_count">{t('teachings.sort_downloads')}</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <SkeletonList count={8} />
      ) : !data?.results.length ? (
        <EmptyState icon={<FileText className="w-full h-full" />} title={t('teachings.no_teachings')} description={t('teachings.no_match')} />
      ) : (
        <>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
            {data.results.map((teaching) => (
              <TeachingCard key={teaching.id} teaching={teaching} />
            ))}
          </div>
          <Pagination page={page} totalPages={data.total_pages} onChange={setPage} />
        </>
      )}
    </div>
  );
};

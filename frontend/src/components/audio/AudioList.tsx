import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Headphones, SortAsc } from 'lucide-react';
import { useAudios } from '../../hooks/useAudios';
import { AudioCard } from './AudioCard';
import { SkeletonList } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Pagination } from '../common/Pagination';
import { ListError } from '../common/ListError';
import { usePlayerStore } from '../../stores/playerStore';

interface AudioListProps {
  categorySlug?: string;
}

export const AudioList = ({ categorySlug }: AudioListProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState('-created_at');

  const params: Record<string, unknown> = { page, ordering, page_size: 12 };
  if (categorySlug) params.category__slug = categorySlug;

  const { data, isLoading, isError, refetch, isPlaceholderData } = useAudios(params);

  // La page courante devient la file de lecture (enchaînement automatique)
  useEffect(() => {
    if (data?.results?.length) usePlayerStore.setState({ queue: data.results });
  }, [data]);

  if (isError) return <ListError onRetry={() => refetch()} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-sm text-[var(--text-secondary)]">{data && t('audio.count', { count: data.count })}</p>
        <label className="flex items-center gap-2">
          <SortAsc size={16} className="text-[var(--text-secondary)]" />
          <select
            value={ordering}
            onChange={(e) => {
              setOrdering(e.target.value);
              setPage(1);
            }}
            className="input-base py-2 px-3 w-auto"
          >
            <option value="-created_at">{t('audio.sort_newest')}</option>
            <option value="-plays_count">{t('audio.sort_popular')}</option>
            <option value="title_fr">{t('audio.sort_az')}</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <SkeletonList count={8} />
      ) : !data?.results.length ? (
        <EmptyState icon={<Headphones className="w-full h-full" />} title={t('audio.no_audios')} />
      ) : (
        <>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
            {data.results.map((audio) => (
              <AudioCard key={audio.id} audio={audio} />
            ))}
          </div>
          <Pagination page={page} totalPages={data.total_pages} onChange={setPage} />
        </>
      )}
    </div>
  );
};

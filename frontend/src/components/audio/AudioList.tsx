import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Filter } from 'lucide-react';
import { Headphones } from 'lucide-react';
import { useAudios } from '../../hooks/useAudios';
import { AudioCard } from './AudioCard';
import { SkeletonList } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';

interface AudioListProps {
  categorySlug?: string;
}

export const AudioList = ({ categorySlug }: AudioListProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState('-created_at');

  const params: Record<string, unknown> = { page, ordering, page_size: 12 };
  if (categorySlug) params.category__slug = categorySlug;

  const { data, isLoading, isError, refetch } = useAudios(params);

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Filter size={16} />
          {data && <span>{data.count} {t('audio.title').toLowerCase()}</span>}
        </div>
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="input-base py-1.5 px-3 text-sm w-auto"
        >
          <option value="-created_at">Plus récent</option>
          <option value="-plays_count">Plus écoutés</option>
          <option value="title_fr">A-Z</option>
        </select>
      </div>

      {isLoading ? (
        <SkeletonList count={12} />
      ) : !data?.results.length ? (
        <EmptyState icon={<Headphones />} title={t('audio.no_audios')} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.results.map((audio, i) => (
              <motion.div
                key={audio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AudioCard audio={audio} />
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

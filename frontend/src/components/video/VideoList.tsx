import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Video as VideoIcon } from 'lucide-react';
import { useVideos } from '../../hooks/useVideos';
import { VideoCard } from './VideoCard';
import { SkeletonList } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';

export const VideoList = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useVideos({ page, page_size: 12, ordering: '-published_at' });

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
      {isLoading ? (
        <SkeletonList count={12} />
      ) : !data?.results.length ? (
        <EmptyState icon={<VideoIcon />} title={t('videos.no_videos')} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.results.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <VideoCard video={video} />
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

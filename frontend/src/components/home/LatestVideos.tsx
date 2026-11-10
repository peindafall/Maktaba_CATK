import { useTranslation } from 'react-i18next';
import { useLatestVideos } from '../../hooks/useVideos';
import { VideoCard } from '../video/VideoCard';
import { SkeletonList } from '../common/Skeleton';
import { SectionHeader } from './SectionHeader';

export const LatestVideos = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useLatestVideos();
  const items = data?.results?.slice(0, 4) ?? [];

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('home.latest_videos')} to="/videos" />
        {isLoading ? (
          <SkeletonList count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
              <VideoCard key={item.id} video={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

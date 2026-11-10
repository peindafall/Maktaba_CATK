import { useTranslation } from 'react-i18next';
import { usePopularAudios } from '../../hooks/useAudios';
import { AudioCard } from '../audio/AudioCard';
import { SkeletonList } from '../common/Skeleton';
import { SectionHeader } from './SectionHeader';

export const PopularAudios = () => {
  const { t } = useTranslation();
  const { data, isLoading } = usePopularAudios();
  const items = data?.results?.slice(0, 4) ?? [];

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 bg-[var(--border-light)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('home.popular_audios')} to="/audios" />
        {isLoading ? (
          <SkeletonList count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
              <AudioCard key={item.id} audio={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

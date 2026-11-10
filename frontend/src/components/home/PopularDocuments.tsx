import { useTranslation } from 'react-i18next';
import { useTeachings } from '../../hooks/useTeachings';
import { TeachingCard } from '../teachings/TeachingCard';
import { SkeletonList } from '../common/Skeleton';
import { SectionHeader } from './SectionHeader';

export const PopularDocuments = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useTeachings({ ordering: '-downloads_count', page_size: 4 });
  const items = data?.results?.slice(0, 4) ?? [];
  if (!isLoading && items.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 bg-[var(--border-light)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('home.popular_teachings')} to="/enseignements" />
        {isLoading ? (
          <SkeletonList count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((teaching) => (
              <TeachingCard key={teaching.id} teaching={teaching} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

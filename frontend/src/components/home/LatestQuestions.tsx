import { useTranslation } from 'react-i18next';
import { useLatestQuestions } from '../../hooks/useQuestions';
import { QuestionCard } from '../questions/QuestionCard';
import { SkeletonList } from '../common/Skeleton';
import { SectionHeader } from './SectionHeader';

export const LatestQuestions = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useLatestQuestions();
  const items = data?.results?.slice(0, 4) ?? [];
  if (!isLoading && items.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('home.latest_questions')} to="/questions" />
        {isLoading ? (
          <SkeletonList count={2} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {items.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

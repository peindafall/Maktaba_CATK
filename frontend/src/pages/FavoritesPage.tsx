import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { useFavoritesDetailed } from '../hooks/useFavorites';
import { TeachingCard } from '../components/teachings/TeachingCard';
import { AudioCard } from '../components/audio/AudioCard';
import { VideoCard } from '../components/video/VideoCard';
import { QuestionCard } from '../components/questions/QuestionCard';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { ListError } from '../components/common/ListError';
import { PageHeader } from '../components/common/PageHeader';
import { usePageTitle } from '../hooks/usePageTitle';
import { cn } from '../utils/helpers';

type Tab = 'all' | 'teachings' | 'audios' | 'videos' | 'questions';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useFavoritesDetailed();
  const [tab, setTab] = useState<Tab>('all');
  usePageTitle(t('favorites.title'));

  if (isLoading) return <PageLoader />;
  if (isError || !data) return <ListError onRetry={() => refetch()} />;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: t('favorites.all'), count: data.total },
    { key: 'teachings', label: t('nav.teachings'), count: data.teachings.length },
    { key: 'audios', label: t('nav.audio'), count: data.audios.length },
    { key: 'videos', label: t('nav.videos'), count: data.videos.length },
    { key: 'questions', label: t('search.type_questions'), count: data.questions.length },
  ];
  const show = (k: Tab) => (tab === 'all' || tab === k) && data[k as Exclude<Tab, 'all'>]?.length > 0;
  const grid = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <PageHeader title={t('favorites.title')} subtitle={t('favorites.subtitle')} />

      {data.total === 0 ? (
        <EmptyState
          icon={<Heart className="w-full h-full" />}
          title={t('favorites.empty')}
          description={t('favorites.empty_desc')}
          action={
            <Link to="/enseignements" className="btn-primary inline-block">
              {t('favorites.explore')}
            </Link>
          }
        />
      ) : (
        <>
          <div className="chips-scroll flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs
              .filter((tb) => tb.key === 'all' || tb.count > 0)
              .map((tb) => (
                <button
                  key={tb.key}
                  onClick={() => setTab(tb.key)}
                  className={cn(
                    'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap',
                    tab === tb.key ? 'bg-primary text-white border-primary' : 'border-[var(--border-light)] text-[var(--text-secondary)]'
                  )}
                >
                  {tb.label} <span className="opacity-70">({tb.count})</span>
                </button>
              ))}
          </div>

          <div className="space-y-10">
            {show('teachings') && (
              <section>
                {tab === 'all' && <h2 className="text-lg font-bold mb-4">{t('nav.teachings')}</h2>}
                <div className={grid}>{data.teachings.map((x) => <TeachingCard key={x.id} teaching={x} />)}</div>
              </section>
            )}
            {show('audios') && (
              <section>
                {tab === 'all' && <h2 className="text-lg font-bold mb-4">{t('nav.audio')}</h2>}
                <div className={grid}>{data.audios.map((x) => <AudioCard key={x.id} audio={x} />)}</div>
              </section>
            )}
            {show('videos') && (
              <section>
                {tab === 'all' && <h2 className="text-lg font-bold mb-4">{t('nav.videos')}</h2>}
                <div className={grid}>{data.videos.map((x) => <VideoCard key={x.id} video={x} />)}</div>
              </section>
            )}
            {show('questions') && (
              <section>
                {tab === 'all' && <h2 className="text-lg font-bold mb-4">{t('search.type_questions')}</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{data.questions.map((x) => <QuestionCard key={x.id} question={x} />)}</div>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;

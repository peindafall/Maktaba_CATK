import { useTranslation } from 'react-i18next';
import type { SearchResult } from '../../types';
import { TeachingCard } from '../teachings/TeachingCard';
import { AudioCard } from '../audio/AudioCard';
import { VideoCard } from '../video/VideoCard';
import { QuestionCard } from '../questions/QuestionCard';
import { EmptyState } from '../common/EmptyState';
import { Search } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult;
  query: string;
}

export const SearchResults = ({ results, query }: SearchResultsProps) => {
  const { t } = useTranslation();
  const total = results.total || 0;

  if (total === 0) {
    return (
      <EmptyState
        icon={<Search />}
        title={t('search.no_results')}
        description={`Aucun résultat pour "${query}". Essayez d'autres mots-clés.`}
      />
    );
  }

  return (
    <div className="space-y-10">
      <p className="text-[var(--text-secondary)] text-sm">
        {t('search.results_found', { count: total })} pour &ldquo;{query}&rdquo;
      </p>

      {/* Teachings */}
      {results.results.teachings?.length ? (
        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            {t('search.type_teachings')} ({results.results.teachings.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.results.teachings.map((t) => (
              <TeachingCard key={t.id} teaching={t} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Audios */}
      {results.results.audios?.length ? (
        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            {t('search.type_audios')} ({results.results.audios.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.results.audios.map((a) => (
              <AudioCard key={a.id} audio={a} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Videos */}
      {results.results.videos?.length ? (
        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            {t('search.type_videos')} ({results.results.videos.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.results.videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Questions */}
      {results.results.questions?.length ? (
        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            {t('search.type_questions')} ({results.results.questions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.results.questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

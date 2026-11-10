import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Search } from 'lucide-react';
import { useQuestions } from '../../hooks/useQuestions';
import { useDebounce } from '../../hooks/useDebounce';
import { QuestionCard } from './QuestionCard';
import { SkeletonList } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Pagination } from '../common/Pagination';
import { ListError } from '../common/ListError';

export const QuestionList = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);

  const { data, isLoading, isError, refetch, isPlaceholderData } = useQuestions({
    page,
    page_size: 12,
    ordering: '-created_at',
    search: debounced || undefined,
  });

  return (
    <div>
      <div className="relative mb-6">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={t('questions.search_placeholder')}
          className="input-base ps-9"
        />
      </div>

      {isError ? (
        <ListError onRetry={() => refetch()} />
      ) : isLoading ? (
        <SkeletonList count={4} />
      ) : !data?.results.length ? (
        <EmptyState icon={<HelpCircle className="w-full h-full" />} title={t('questions.no_questions')} />
      ) : (
        <>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
            {data.results.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
          <Pagination page={page} totalPages={data.total_pages} onChange={setPage} />
        </>
      )}
    </div>
  );
};

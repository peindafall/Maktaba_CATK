import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SearchBar } from '../components/search/SearchBar';
import { SearchFilters } from '../components/search/SearchFilters';
import { SearchResults } from '../components/search/SearchResults';
import { useSearch } from '../hooks/useSearch';
import { PageLoader } from '../components/common/Spinner';
import { usePageTitle } from '../hooks/usePageTitle';

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const [activeType, setActiveType] = useState('');
  usePageTitle(query ? `${t('nav.search')} : ${query}` : t('nav.search'));

  const { data, isLoading } = useSearch(query, activeType ? { type: activeType } : undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{t('nav.search')}</h1>
      <SearchBar key={query} defaultValue={query} autoFocus={!query} className="max-w-2xl mb-6" />
      {query.length === 1 && <p className="text-sm text-[var(--text-secondary)]">{t('search.min_chars')}</p>}
      {query.length >= 2 && (
        <>
          <SearchFilters activeType={activeType} onTypeChange={setActiveType} />
          {isLoading ? <PageLoader /> : data ? <SearchResults results={data} query={query} /> : null}
        </>
      )}
    </div>
  );
};

export default SearchPage;

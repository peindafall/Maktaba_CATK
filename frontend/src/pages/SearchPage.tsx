import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { SearchBar } from '../components/search/SearchBar';
import { SearchFilters } from '../components/search/SearchFilters';
import { SearchResults } from '../components/search/SearchResults';
import { useSearch } from '../hooks/useSearch';
import { PageLoader } from '../components/common/Spinner';

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeType, setActiveType] = useState('');

  const { data, isLoading } = useSearch(query, activeType ? { type: activeType } : undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{t('nav.search')}</h1>
        <SearchBar defaultValue={query} autoFocus className="max-w-2xl" />
      </motion.div>

      {query && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <SearchFilters activeType={activeType} onTypeChange={setActiveType} />
          {isLoading ? (
            <PageLoader />
          ) : data ? (
            <SearchResults results={data} query={query} />
          ) : null}
        </motion.div>
      )}
    </div>
  );
};

export default SearchPage;

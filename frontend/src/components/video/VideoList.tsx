import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Video as VideoIcon } from 'lucide-react';
import { useVideos, useVideoThemes, useVideoTypes } from '../../hooks/useVideos';
import { useDebounce } from '../../hooks/useDebounce';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField } from '../../utils/formatters';
import { VideoCard } from './VideoCard';
import { SkeletonList } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Pagination } from '../common/Pagination';
import { ListError } from '../common/ListError';
import { cn } from '../../utils/helpers';

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border',
      active
        ? 'bg-primary text-white border-primary'
        : 'bg-[var(--surface)] border-[var(--border-light)] text-[var(--text-secondary)] hover:border-primary hover:text-primary'
    )}
  >
    {children}
  </button>
);

/** Émissions classées par type (Al Islam, Juste une question…) et par thème (Soufisme, Fiqh…). */
export const VideoList = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type') || '';
  const theme = searchParams.get('theme') || '';
  const page = Number(searchParams.get('page') || 1);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);

  const update = (next: Record<string, string>) => {
    const p = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    if (!('page' in next)) p.delete('page');
    setSearchParams(p, { replace: true });
  };

  const { data: types } = useVideoTypes();
  const { data: themes } = useVideoThemes();
  const { data, isLoading, isError, refetch, isPlaceholderData } = useVideos({
    page,
    page_size: 12,
    ordering: '-published_at',
    category: type || undefined,
    theme__slug: theme || undefined,
    search: debounced || undefined,
  });

  return (
    <div>
      <div className="relative mb-4 max-w-xl">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (page !== 1) update({});
          }}
          placeholder={t('videos.search_placeholder')}
          className="input-base ps-9 py-2.5"
        />
      </div>

      {types && types.length > 1 && (
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-2">{t('videos.types')}</p>
          {/* Défilement horizontal sur mobile, avec ombre de bord pour montrer qu'il y a plus */}
          <div className="chips-scroll flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            <Chip active={!type} onClick={() => update({ type: '' })}>
              {t('videos.all')}
            </Chip>
            {types.map((ty) => (
              <Chip key={ty.value} active={type === ty.value} onClick={() => update({ type: ty.value })}>
                {t(`videos.type_${ty.value}`, { defaultValue: ty.label })} <span className="opacity-60">({ty.count})</span>
              </Chip>
            ))}
          </div>
        </div>
      )}

      {themes && themes.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-2">{t('videos.themes')}</p>
          <div className="chips-scroll flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            <Chip active={!theme} onClick={() => update({ theme: '' })}>
              {t('videos.all')}
            </Chip>
            {themes.map((th) => (
              <Chip key={th.id} active={theme === th.slug} onClick={() => update({ theme: th.slug })}>
                {getLocalizedField(th, 'name', currentLanguage)}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {isError ? (
        <ListError onRetry={() => refetch()} />
      ) : isLoading ? (
        <SkeletonList count={8} />
      ) : !data?.results.length ? (
        <EmptyState icon={<VideoIcon className="w-full h-full" />} title={t('videos.no_videos')} />
      ) : (
        <>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
            {data.results.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          <Pagination page={page} totalPages={data.total_pages} onChange={(p) => update({ page: String(p) })} />
        </>
      )}
    </div>
  );
};

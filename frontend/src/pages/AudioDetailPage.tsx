import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Headphones, Play, Pause, Download, Clock } from 'lucide-react';
import { useAudio } from '../hooks/useAudios';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { useLanguage } from '../hooks/useLanguage';
import { getLocalizedField, formatNumber, formatTime, getCategoryName } from '../utils/formatters';
import { usePlayerStore } from '../stores/playerStore';
import { AudioDownloadButton } from '../components/audio/AudioDownloadButton';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { ShareButton } from '../components/common/ShareButton';
import { BackLink } from '../components/common/BackLink';
import { Badge } from '../components/common/Badge';
import { usePageTitle } from '../hooks/usePageTitle';

const AudioDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { data: audio, isLoading, isError } = useAudio(id!);
  const playAudio = usePlayerStore((s) => s.playAudio);
  const isCurrent = usePlayerStore((s) => s.currentAudio?.id === id);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const title = audio ? getLocalizedField(audio, 'title', currentLanguage) : '';
  usePageTitle(title || t('audio.title'));

  if (isLoading) return <PageLoader />;
  if (isError || !audio) {
    return <EmptyState icon={<Headphones className="w-full h-full" />} title={t('audio.not_found')} description={t('audio.not_found_desc')} />;
  }

  const description = getLocalizedField(audio, 'description', currentLanguage);
  const categoryName = getCategoryName(audio.category_info, currentLanguage, audio.category_name);
  const playing = isCurrent && isPlaying;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <BackLink fallback="/audios" />
      <article className="card p-6 sm:p-8 text-center">
        <div className="w-40 h-40 rounded-3xl mx-auto mb-6 overflow-hidden bg-primary/10 flex items-center justify-center shadow-xl">
          {audio.cover_image_url ? (
            <img src={audio.cover_image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <Headphones size={64} className="text-primary/50" />
          )}
        </div>

        {categoryName && (
          <Badge color={audio.category_info?.color} className="mb-3">
            {categoryName}
          </Badge>
        )}
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 break-words">{title}</h1>
        {description && <p className="text-[var(--text-secondary)] mb-6 whitespace-pre-line">{description}</p>}

        <button
          onClick={() => playAudio(audio)}
          aria-label={playing ? t('audio.pause') : t('audio.play')}
          className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center mx-auto shadow-xl hover:bg-primary-dark transition-transform active:scale-95"
        >
          {playing ? <Pause size={32} /> : <Play size={32} className="ms-1" fill="white" />}
        </button>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">{playing ? t('audio.now_playing') : t('audio.play')}</p>

        <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
          <AudioDownloadButton audio={audio} variant="outline" />
          <FavoriteButton type="audio" id={audio.id} title={audio.title_fr} size="md" />
          <ShareButton title={title} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
          {audio.duration_seconds ? (
            <span className="flex items-center gap-1">
              <Clock size={14} /> {formatTime(audio.duration_seconds)}
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            <Headphones size={14} /> {formatNumber(audio.plays_count, i18n.language)} {t('audio.plays')}
          </span>
          <span className="flex items-center gap-1">
            <Download size={14} /> {formatNumber(audio.downloads_count, i18n.language)} {t('audio.downloads')}
          </span>
        </div>
      </article>
    </div>
  );
};

export default AudioDetailPage;

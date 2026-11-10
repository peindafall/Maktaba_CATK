import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Clock, Headphones, Download } from 'lucide-react';
import type { Audio } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatNumber, formatTime, getCategoryName } from '../../utils/formatters';
import { usePlayerStore } from '../../stores/playerStore';
import { FavoriteButton } from '../common/FavoriteButton';
import { Badge } from '../common/Badge';

interface AudioCardProps {
  audio: Audio;
}

export const AudioCard = ({ audio }: AudioCardProps) => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const playAudio = usePlayerStore((s) => s.playAudio);
  const isCurrent = usePlayerStore((s) => s.currentAudio?.id === audio.id);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const title = getLocalizedField(audio, 'title', currentLanguage);
  const description = getLocalizedField(audio, 'description', currentLanguage);
  const categoryName = getCategoryName(audio.category_info, currentLanguage, audio.category_name);
  const isCurrentlyPlaying = isCurrent && isPlaying;

  return (
    <article className="card overflow-hidden group h-full flex flex-col" style={{ padding: 0 }}>
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-primary-dark/30">
        <Link to={`/audios/${audio.id}`} aria-label={title} className="absolute inset-0">
          {audio.cover_image_url ? (
            <img src={audio.cover_image_url} alt="" loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Headphones size={48} className="text-primary/40" />
            </div>
          )}
        </Link>
        {/* Bouton lecture toujours visible (sur mobile il n'y a pas de « survol ») */}
        <button
          onClick={() => playAudio(audio)}
          aria-label={isCurrentlyPlaying ? t('audio.pause') : t('audio.play')}
          className="absolute bottom-3 end-3 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
        >
          {isCurrentlyPlaying ? (
            <Pause size={18} className="text-primary" />
          ) : (
            <Play size={18} className="text-primary ms-0.5 rtl:rotate-180" fill="currentColor" />
          )}
        </button>
        <div className="absolute top-3 end-3">
          <FavoriteButton type="audio" id={audio.id} title={audio.title_fr} overlay />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {categoryName && (
          <Badge color={audio.category_info?.color} className="mb-2 self-start">
            {categoryName}
          </Badge>
        )}
        <Link to={`/audios/${audio.id}`}>
          <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug line-clamp-2 mb-1 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        {description && <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">{description}</p>}

        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-3 mt-auto pt-1">
          {audio.duration_seconds ? (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {formatTime(audio.duration_seconds)}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title={t('audio.plays')}>
              <Headphones size={11} /> {formatNumber(audio.plays_count, i18n.language)}
            </span>
            <span className="flex items-center gap-1" title={t('audio.downloads')}>
              <Download size={11} /> {formatNumber(audio.downloads_count, i18n.language)}
            </span>
          </div>
        </div>

        <button
          onClick={() => playAudio(audio)}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors ${
            isCurrentlyPlaying ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {isCurrentlyPlaying ? (
            <>
              <Pause size={14} /> {t('audio.pause')}
            </>
          ) : (
            <>
              <Play size={14} fill="currentColor" className="rtl:rotate-180" /> {t('audio.play')}
            </>
          )}
        </button>
      </div>
    </article>
  );
};

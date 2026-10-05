import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Clock, Headphones, Download } from 'lucide-react';
import type { Audio } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatNumber, formatDuration } from '../../utils/formatters';
import { usePlayerStore } from '../../stores/playerStore';

interface AudioCardProps {
  audio: Audio;
}

export const AudioCard = ({ audio }: AudioCardProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { setCurrentAudio, togglePlay, currentAudio, isPlaying } = usePlayerStore();

  const title = getLocalizedField(audio as unknown as Record<string, unknown>, 'title', currentLanguage);
  const description = getLocalizedField(audio as unknown as Record<string, unknown>, 'description', currentLanguage);
  const isCurrentlyPlaying = currentAudio?.id === audio.id && isPlaying;

  const handlePlay = () => {
    if (currentAudio?.id === audio.id) {
      togglePlay();
    } else {
      setCurrentAudio(audio);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card overflow-hidden group"
      style={{ padding: 0 }}
    >
      {/* Cover */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-primary-dark/30">
        {audio.cover_image_url ? (
          <img
            src={audio.cover_image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Headphones size={48} className="text-primary/40" />
          </div>
        )}
        {/* Overlay play button */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          >
            {isCurrentlyPlaying ? (
              <Pause size={20} className="text-primary" />
            ) : (
              <Play size={20} className="text-primary ml-0.5" fill="currentColor" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {audio.category && (
          <span
            className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2"
            style={{
              backgroundColor: `${audio.category.color || '#1EA478'}20`,
              color: audio.category.color || '#1EA478',
            }}
          >
            {getLocalizedField(audio.category as unknown as Record<string, unknown>, 'name', currentLanguage)}
          </span>
        )}

        {/* Titre */}
        <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug line-clamp-2 mb-1">
          {title}
        </h3>

        {/* Description courte (2 lignes max) */}
        {description && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">
            {description}
          </p>
        )}

        {/* Meta : durée + écoutes + téléchargements */}
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-3">
          {audio.duration && (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {formatDuration(audio.duration)}
            </span>
          )}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title={t('audio.plays', 'écoutes')}>
              <Headphones size={11} /> {formatNumber(audio.plays_count)}
            </span>
            <span className="flex items-center gap-1" title={t('audio.downloads', 'téléchargements')}>
              <Download size={11} /> {formatNumber(audio.downloads_count)}
            </span>
          </div>
        </div>

        {/* Play button */}
        <button
          onClick={handlePlay}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${
            isCurrentlyPlaying
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {isCurrentlyPlaying ? (
            <>
              <Pause size={14} />
              {t('audio.pause', 'Pause')}
            </>
          ) : (
            <>
              <Play size={14} fill="currentColor" />
              {t('audio.play', 'Écouter')}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
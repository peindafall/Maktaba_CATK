import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Headphones } from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatDuration } from '../../utils/formatters';

export const AudioPlayer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const {
    currentAudio,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    setCurrentTime,
    setDuration,
    setVolume,
    closePlayer,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current || !currentAudio) return;
    audioRef.current.src = currentAudio.audio_file;
    audioRef.current.load();
    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentAudio]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  if (!currentAudio) return null;

  const title = getLocalizedField(currentAudio as unknown as Record<string, unknown>, 'title', currentLanguage);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border-light)] shadow-2xl lg:bottom-0 bottom-16"
      >
        <audio
          ref={audioRef}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => togglePlay()}
        />

        {/* Progress bar */}
        <div
          className="h-1 bg-[var(--border-light)] cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const pct = x / rect.width;
            const newTime = pct * duration;
            setCurrentTime(newTime);
            if (audioRef.current) audioRef.current.currentTime = newTime;
          }}
        >
          <div
            className="h-full bg-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-4 px-4 py-3 max-w-7xl mx-auto">
          {/* Cover */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
            {currentAudio.cover_image_url ? (
              <img src={currentAudio.cover_image_url} alt={title} className="w-full h-full object-cover" />
            ) : (
              <Headphones size={20} className="text-primary" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{title}</p>
            <p className="text-xs text-[var(--text-secondary)]">
              {formatDuration(String(Math.floor(currentTime / 60)).padStart(2,'0') + ':' + String(Math.floor(currentTime % 60)).padStart(2,'0'))} 
              {' / '}
              {formatDuration(String(Math.floor(duration / 60)).padStart(2,'0') + ':' + String(Math.floor(duration % 60)).padStart(2,'0'))}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors hidden sm:block">
              <SkipBack size={18} />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
            </button>
            <button className="p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors hidden sm:block">
              <SkipForward size={18} />
            </button>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2">
            <Volume2 size={16} className="text-[var(--text-secondary)]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-primary"
            />
          </div>

          {/* Close */}
          <button
            onClick={closePlayer}
            className="p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

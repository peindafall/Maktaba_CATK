import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Headphones, Loader2 } from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore';
import { useLanguage } from '../../hooks/useLanguage';
import { useIncrementAudioPlay } from '../../hooks/useAudios';
import { getLocalizedField, formatTime } from '../../utils/formatters';
import { AudioDownloadButton } from './AudioDownloadButton';

const RATES = [0.75, 1, 1.25, 1.5, 2];

/**
 * Lecteur audio global.
 * Correctifs :
 *  - « Infinity:NaN » : certains fichiers (OGG, ou serveur sans requêtes Range) ont une durée
 *    inconnue => duration = Infinity. On utilise la durée connue en base, sinon on force le
 *    navigateur à la calculer, et l'affichage ne montre jamais NaN/Infinity.
 *  - barre de progression déplaçable (doigt / souris), boutons ±15 s fonctionnels, vitesse.
 *  - contrôles sur l'écran verrouillé du téléphone (Media Session).
 */
export const AudioPlayer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const {
    currentAudio, isPlaying, currentTime, duration, volume, playbackRate,
    togglePlay, setPlaying, setCurrentTime, setDuration, setVolume, setPlaybackRate, closePlayer, playNext,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const trackedRef = useRef<string | null>(null);
  const fixingDuration = useRef(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [muted, setMuted] = useState(false);
  const incrementPlay = useIncrementAudioPlay();

  // Charger la source quand l'audio change
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !currentAudio) return;
    setHasError(false);
    fixingDuration.current = false;
    el.src = currentAudio.audio_url;
    el.load();
  }, [currentAudio?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lecture / pause
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !currentAudio) return;
    if (isPlaying) {
      el.play().catch(() => setPlaying(false)); // ex. autoplay bloqué sur iOS
      if (trackedRef.current !== currentAudio.id && currentAudio.kind !== 'answer') {
        trackedRef.current = currentAudio.id;
        incrementPlay.mutate(currentAudio.id);
      }
    } else {
      el.pause();
    }
  }, [isPlaying, currentAudio?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate, currentAudio?.id]);

  const title = currentAudio ? getLocalizedField(currentAudio, 'title', currentLanguage) : '';

  // Contrôles écran verrouillé / casque Bluetooth
  useEffect(() => {
    if (!currentAudio || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: 'Pr. Cheikh Ahmet Tidiane KEBE',
      album: 'Maktaba CATK',
      artwork: currentAudio.cover_image_url
        ? [{ src: currentAudio.cover_image_url, sizes: '512x512' }]
        : [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
    });
    const seekBy = (delta: number) => {
      const el = audioRef.current;
      if (el) el.currentTime = Math.max(0, Math.min((el.currentTime || 0) + delta, effectiveDuration() || Infinity));
    };
    navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
    navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
    navigator.mediaSession.setActionHandler('seekbackward', () => seekBy(-15));
    navigator.mediaSession.setActionHandler('seekforward', () => seekBy(15));
  }, [currentAudio?.id, title]); // eslint-disable-line react-hooks/exhaustive-deps

  const effectiveDuration = () => {
    if (Number.isFinite(duration) && duration > 0) return duration;
    return currentAudio?.duration_seconds || 0;
  };

  const handleLoadedMetadata = () => {
    const el = audioRef.current;
    if (!el) return;
    if (Number.isFinite(el.duration) && el.duration > 0) {
      setDuration(el.duration);
    } else if (!fixingDuration.current) {
      // Astuce connue : se placer très loin force le navigateur à calculer la durée réelle
      fixingDuration.current = true;
      const restore = () => {
        el.removeEventListener('durationchange', restore);
        if (Number.isFinite(el.duration)) setDuration(el.duration);
        el.currentTime = 0;
      };
      el.addEventListener('durationchange', restore);
      try {
        el.currentTime = 1e7;
      } catch {
        /* ignore */
      }
    }
  };

  const seekTo = (value: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = value;
    setCurrentTime(value);
  };

  if (!currentAudio) return null;

  const total = effectiveDuration();
  const progress = total > 0 ? Math.min(100, (currentTime / total) * 100) : 0;
  const detailLink = currentAudio.kind === 'answer' ? null : `/audios/${currentAudio.id}`;

  return (
    <AnimatePresence>
      <motion.div
        role="region"
        aria-label={t('audio.now_playing')}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed inset-x-0 z-50 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border-light)] shadow-2xl bottom-[calc(58px+env(safe-area-inset-bottom))] lg:bottom-0"
      >
        <audio
          ref={audioRef}
          preload="metadata"
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={() => {
            const d = audioRef.current?.duration;
            if (d && Number.isFinite(d)) setDuration(d);
          }}
          onTimeUpdate={() => {
            if (!fixingDuration.current || Number.isFinite(audioRef.current?.duration ?? NaN)) {
              setCurrentTime(audioRef.current?.currentTime || 0);
            }
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => {
            setIsBuffering(false);
            setPlaying(true);
          }}
          onCanPlay={() => setIsBuffering(false)}
          onPause={() => {
            // Mise en pause depuis l'écran verrouillé / casque : on synchronise l'état
            if (!audioRef.current?.ended) setPlaying(false);
          }}
          onError={() => {
            setHasError(true);
            setIsBuffering(false);
            setPlaying(false);
          }}
          onEnded={() => {
            setPlaying(false);
            setCurrentTime(0);
            playNext();
          }}
        />

        {/* Barre de progression déplaçable */}
        <input
          type="range"
          min={0}
          max={total || 0}
          step={0.5}
          value={Math.min(currentTime, total || 0)}
          disabled={!total}
          onChange={(e) => seekTo(parseFloat(e.target.value))}
          aria-label={t('audio.seek')}
          className="player-range block w-full h-1.5 cursor-pointer"
          style={{ ['--progress' as string]: `${progress}%` }}
          dir="ltr"
        />

        <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 max-w-7xl mx-auto">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
            {currentAudio.cover_image_url ? (
              <img src={currentAudio.cover_image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <Headphones size={20} className="text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {detailLink ? (
              <Link to={detailLink} className="block text-sm font-semibold text-[var(--text-primary)] truncate hover:text-primary">
                {title}
              </Link>
            ) : (
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{title}</p>
            )}
            <p className="text-xs text-[var(--text-secondary)] tabular-nums" dir="ltr">
              {hasError ? (
                <span className="text-red-500">{t('audio.error')}</span>
              ) : (
                <>
                  {formatTime(currentTime)} / {total ? formatTime(total) : '--:--'}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2" dir="ltr">
            <button
              onClick={() => seekTo(Math.max(0, currentTime - 15))}
              className="p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors"
              aria-label={t('audio.back_15')}
              title={t('audio.back_15')}
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? t('audio.pause') : t('audio.play')}
              className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md active:scale-95"
            >
              {isBuffering && isPlaying ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} className="ms-0.5" fill="currentColor" />
              )}
            </button>
            <button
              onClick={() => seekTo(Math.min(total || currentTime + 15, currentTime + 15))}
              className="p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors hidden sm:block"
              aria-label={t('audio.forward_15')}
              title={t('audio.forward_15')}
            >
              <RotateCw size={18} />
            </button>
            <button
              onClick={() => setPlaybackRate(RATES[(RATES.indexOf(playbackRate) + 1) % RATES.length])}
              className="px-2 py-1 rounded-lg text-xs font-semibold border border-[var(--border-light)] hover:border-primary hover:text-primary transition-colors tabular-nums"
              aria-label={t('audio.speed')}
              title={t('audio.speed')}
            >
              {playbackRate}×
            </button>
            <AudioDownloadButton audio={currentAudio} variant="icon" className="hidden sm:inline-flex" />
          </div>

          <div className="hidden md:flex items-center gap-2" dir="ltr">
            <button onClick={() => setMuted((m) => { const nm = !m; if (audioRef.current) audioRef.current.muted = nm; return nm; })} aria-label={t('audio.volume')}>
              {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} className="text-[var(--text-secondary)]" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label={t('audio.volume')}
              className="w-20 accent-primary"
            />
          </div>

          <button
            onClick={() => {
              audioRef.current?.pause();
              closePlayer();
            }}
            className="p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors"
            aria-label={t('audio.close_player')}
            title={t('audio.close_player')}
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

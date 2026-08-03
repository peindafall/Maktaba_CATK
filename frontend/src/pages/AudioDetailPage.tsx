import { useParams } from 'react-router-dom';
import { useAudio } from '../hooks/useAudios';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { getLocalizedField } from '../utils/formatters';
import { usePlayerStore } from '../stores/playerStore';
import { Play, Pause } from 'lucide-react';
import { AudioCard } from '../components/audio/AudioCard';

const AudioDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { data: audio, isLoading, isError } = useAudio(id!);
  const { currentAudio, isPlaying, setCurrentAudio, togglePlay } = usePlayerStore();

  if (isLoading) return <PageLoader />;
  if (isError || !audio) {
    return (
      <EmptyState
        icon={<Headphones />}
        title="Audio non trouvé"
        description="Cet enregistrement n'existe pas."
      />
    );
  }

  const title = getLocalizedField(audio as unknown as Record<string, unknown>, 'title', currentLanguage);
  const isCurrentlyPlaying = currentAudio?.id === audio.id && isPlaying;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 text-center"
      >
        {/* Cover */}
        <div className="w-40 h-40 rounded-3xl mx-auto mb-6 overflow-hidden bg-primary/10 flex items-center justify-center shadow-xl">
          {audio.cover_image_url ? (
            <img src={audio.cover_image_url} alt={title} className="w-full h-full object-cover" />
          ) : (
            <Headphones size={64} className="text-primary/50" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{title}</h1>
        {audio.category && (
          <p className="text-primary font-medium mb-6">
            {getLocalizedField(audio.category as unknown as Record<string, unknown>, 'name', currentLanguage)}
          </p>
        )}

        <button
          onClick={() => {
            if (currentAudio?.id === audio.id) {
              togglePlay();
            } else {
              setCurrentAudio(audio);
            }
          }}
          className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center mx-auto shadow-xl hover:bg-primary-dark transition-colors hover:scale-105"
        >
          {isCurrentlyPlaying ? (
            <Pause size={32} />
          ) : (
            <Play size={32} className="ml-1" fill="white" />
          )}
        </button>

        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          {isCurrentlyPlaying ? t('audio.now_playing') : t('audio.play')}
        </p>
      </motion.div>
    </div>
  );
};

export default AudioDetailPage;

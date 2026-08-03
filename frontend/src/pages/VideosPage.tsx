import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { VideoList } from '../components/video/VideoList';

const VideosPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{t('videos.title')}</h1>
        <p className="text-[var(--text-secondary)]">
          Regardez les émissions et conférences vidéo du Professeur KEBE
        </p>
      </motion.div>
      <VideoList />
    </div>
  );
};

export default VideosPage;

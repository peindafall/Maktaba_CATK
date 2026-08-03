import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home, BookOpen } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* 404 visual */}
        <div
          className="text-9xl font-bold mb-4 bg-clip-text text-transparent"
          style={{ background: 'linear-gradient(135deg, #1EA478, #114D0D)' }}
        >
          404
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
          {t('errors.not_found')}
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          {t('errors.not_found_desc')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <Home size={16} /> {t('errors.go_home')}
          </Link>
          <Link to="/enseignements" className="btn-outline inline-flex items-center justify-center gap-2">
            <BookOpen size={16} /> {t('nav.teachings')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;

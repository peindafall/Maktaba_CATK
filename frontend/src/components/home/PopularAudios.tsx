import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePopularAudios } from '../../hooks/useAudios';
import { AudioCard } from '../audio/AudioCard';
import { SkeletonList } from '../common/Skeleton';

export const PopularAudios = () => {
  const { t } = useTranslation();
  const { data, isLoading } = usePopularAudios();

  return (
    <section className="py-12 bg-[var(--border-light)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-[var(--text-primary)]"
          >
            {t('home.popular_audios')}
          </motion.h2>
          <Link
            to="/audios"
            className="flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all"
          >
            {t('common.see_all')} <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <SkeletonList count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.results.slice(0, 4).map((audio, i) => (
              <motion.div
                key={audio.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <AudioCard audio={audio} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

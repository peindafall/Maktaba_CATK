import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, Headphones, Video, HelpCircle, Star } from 'lucide-react';

const categories = [
  {
    to: '/enseignements',
    icon: <BookOpen size={28} />,
    labelKey: 'nav.teachings',
    color: '#1EA478',
    bg: 'linear-gradient(135deg, #1EA478, #114D0D)',
  },
  {
    to: '/audios',
    icon: <Headphones size={28} />,
    labelKey: 'nav.audio',
    color: '#BF8B28',
    bg: 'linear-gradient(135deg, #BF8B28, #A67723)',
  },
  {
    to: '/videos',
    icon: <Video size={28} />,
    labelKey: 'nav.videos',
    color: '#B35214',
    bg: 'linear-gradient(135deg, #B35214, #431C03)',
  },
  {
    to: '/questions',
    icon: <HelpCircle size={28} />,
    labelKey: 'nav.questions',
    color: '#1FA645',
    bg: 'linear-gradient(135deg, #1FA645, #114D0D)',
  },
];

export const CategoriesGrid = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-[var(--border-light)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-[var(--text-primary)] mb-8 text-center"
        >
          {t('home.categories')}
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.to}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Link
                to={cat.to}
                className="block rounded-3xl p-6 text-white text-center shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ background: cat.bg }}
              >
                <div className="flex justify-center mb-3 opacity-90">{cat.icon}</div>
                <h3 className="font-semibold text-lg">{t(cat.labelKey)}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

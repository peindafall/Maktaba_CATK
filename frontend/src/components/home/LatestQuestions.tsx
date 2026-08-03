import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLatestQuestions } from '../../hooks/useQuestions';
import { QuestionCard } from '../questions/QuestionCard';
import { SkeletonList } from '../common/Skeleton';

export const LatestQuestions = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useLatestQuestions();

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-[var(--text-primary)]"
        >
          {t('home.latest_questions')}
        </motion.h2>
        <Link
          to="/questions"
          className="flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all"
        >
          {t('common.see_all')} <ArrowRight size={16} />
        </Link>
      </div>

      {isLoading ? (
        <SkeletonList count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {data?.results.slice(0, 4).map((question, i) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <QuestionCard question={question} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

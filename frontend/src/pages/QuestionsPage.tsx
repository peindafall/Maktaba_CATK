import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { QuestionList } from '../components/questions/QuestionList';

const QuestionsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{t('questions.title')}</h1>
        <p className="text-[var(--text-secondary)]">
          Retrouvez les réponses du Professeur KEBE aux questions sur la Tarikha Tidiane
        </p>
      </motion.div>
      <QuestionList />
    </div>
  );
};

export default QuestionsPage;

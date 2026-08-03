import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Eye, Headphones } from 'lucide-react';
import type { Question } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatNumber } from '../../utils/formatters';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const title = getLocalizedField(question as unknown as Record<string, unknown>, 'title', currentLanguage);
  const questionText = getLocalizedField(question as unknown as Record<string, unknown>, 'question', currentLanguage);
  const categoryName = question.category
    ? getLocalizedField(question.category as unknown as Record<string, unknown>, 'name', currentLanguage)
    : '';

  const hasAudio = question.answers?.some((a) => !!a.audio_file);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card p-5"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <HelpCircle size={16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          {categoryName && (
            <span
              className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1.5"
              style={{
                backgroundColor: `${question.category?.color || '#1EA478'}20`,
                color: question.category?.color || '#1EA478',
              }}
            >
              {categoryName}
            </span>
          )}
          <Link to={`/questions/${question.id}`}>
            <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Question preview */}
      {questionText && (
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 pl-11">
          {questionText}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pl-11">
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <Eye size={11} /> {formatNumber(question.views_count)}
          </span>
          {hasAudio && (
            <span className="flex items-center gap-1 text-primary">
              <Headphones size={11} /> {t('questions.listen_answer')}
            </span>
          )}
        </div>
        <Link
          to={`/questions/${question.id}`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          {t('questions.answer')} →
        </Link>
      </div>
    </motion.div>
  );
};

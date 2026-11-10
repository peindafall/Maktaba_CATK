import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Eye, Headphones, ArrowRight } from 'lucide-react';
import type { Question } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatNumber, getCategoryName } from '../../utils/formatters';
import { FavoriteButton } from '../common/FavoriteButton';
import { Badge } from '../common/Badge';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();

  const title = getLocalizedField(question, 'title', currentLanguage);
  const questionText = getLocalizedField(question, 'question', currentLanguage);
  const categoryName = getCategoryName(question.category_info, currentLanguage, question.category_name);
  const hasAudio = question.has_audio ?? question.answers?.some((a) => !!a.audio_url);

  return (
    <article className="card p-5 h-full flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <HelpCircle size={17} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          {categoryName && (
            <Badge color={question.category_info?.color} className="mb-1.5">
              {categoryName}
            </Badge>
          )}
          <Link to={`/questions/${question.id}`}>
            <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
        </div>
        <FavoriteButton type="question" id={question.id} title={question.title_fr} />
      </div>

      {questionText && <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 ps-12">{questionText}</p>}

      <div className="flex items-center justify-between gap-2 ps-12 mt-auto">
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <Eye size={11} /> {formatNumber(question.views_count, i18n.language)}
          </span>
          {hasAudio && (
            <span className="flex items-center gap-1 text-primary">
              <Headphones size={11} /> {t('questions.listen_answer')}
            </span>
          )}
        </div>
        <Link
          to={`/questions/${question.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary whitespace-nowrap hover:underline"
        >
          {t('questions.see_answer')} <ArrowRight size={12} className="rtl:rotate-180" />
        </Link>
      </div>
    </article>
  );
};

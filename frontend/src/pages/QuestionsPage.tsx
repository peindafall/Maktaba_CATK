import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCirclePlus } from 'lucide-react';
import { QuestionList } from '../components/questions/QuestionList';
import { AskQuestionModal } from '../components/questions/AskQuestionModal';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { useMyQuestions } from '../hooks/useQuestions';
import { useAuthStore } from '../stores/authStore';
import { useLanguage } from '../hooks/useLanguage';
import { getLocalizedField, formatDate } from '../utils/formatters';
import { usePageTitle } from '../hooks/usePageTitle';

const statusStyle = {
  pending: 'bg-gold/15 text-gold',
  answered: 'bg-primary/15 text-primary',
  rejected: 'bg-red-500/10 text-red-500',
};

const MyQuestions = () => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { data } = useMyQuestions();
  if (!data?.length) return null;
  return (
    <section className="card p-5 mb-8">
      <h2 className="font-semibold text-[var(--text-primary)] mb-3">{t('questions.my_questions')}</h2>
      <ul className="divide-y divide-[var(--border-light)]">
        {data.map((q) => (
          <li key={q.id} className="py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              {q.is_published ? (
                <Link to={`/questions/${q.id}`} className="text-sm font-medium hover:text-primary line-clamp-1">
                  {getLocalizedField(q, 'title', currentLanguage)}
                </Link>
              ) : (
                <p className="text-sm font-medium line-clamp-1">{getLocalizedField(q, 'title', currentLanguage)}</p>
              )}
              <p className="text-xs text-[var(--text-secondary)]">{formatDate(q.created_at, i18n.language)}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyle[q.status]}`}>
              {t(`questions.status_${q.status}`)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const QuestionsPage = () => {
  const { t } = useTranslation();
  const [askOpen, setAskOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  usePageTitle(t('questions.title'));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <PageHeader
        title={t('questions.title')}
        subtitle={t('pages.questions_subtitle')}
        action={
          <Button onClick={() => setAskOpen(true)} leftIcon={<MessageCirclePlus size={18} />} className="w-full sm:w-auto">
            {t('questions.ask_button')}
          </Button>
        }
      />
      {isAuthenticated && <MyQuestions />}
      <QuestionList />
      <AskQuestionModal isOpen={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
};

export default QuestionsPage;

import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import { useQuestion } from '../hooks/useQuestions';
import { QuestionDetail } from '../components/questions/QuestionDetail';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { usePageTitle } from '../hooks/usePageTitle';
import { useLanguage } from '../hooks/useLanguage';
import { getLocalizedField } from '../utils/formatters';

const QuestionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { data, isLoading, isError } = useQuestion(id!);
  usePageTitle(data ? getLocalizedField(data, 'title', currentLanguage) : t('questions.title'));

  if (isLoading) return <PageLoader />;
  if (isError || !data) {
    return <EmptyState icon={<HelpCircle className="w-full h-full" />} title={t('questions.not_found')} description={t('questions.not_found_desc')} />;
  }
  return <QuestionDetail question={data} />;
};

export default QuestionDetailPage;

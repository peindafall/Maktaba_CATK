import { useParams } from 'react-router-dom';
import { useQuestion } from '../hooks/useQuestions';
import { QuestionDetail } from '../components/questions/QuestionDetail';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { HelpCircle } from 'lucide-react';

const QuestionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useQuestion(id!);

  if (isLoading) return <PageLoader />;
  if (isError || !data) {
    return (
      <EmptyState
        icon={<HelpCircle />}
        title="Question non trouvée"
        description="Cette question n'existe pas."
      />
    );
  }

  return <QuestionDetail question={data} />;
};

export default QuestionDetailPage;

import { useParams } from 'react-router-dom';
import { useTeaching } from '../hooks/useTeachings';
import { TeachingDetail } from '../components/teachings/TeachingDetail';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { FileText } from 'lucide-react';

const TeachingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTeaching(id!);

  if (isLoading) return <PageLoader />;
  if (isError || !data) {
    return (
      <EmptyState
        icon={<FileText />}
        title="Enseignement non trouvé"
        description="Cet enseignement n'existe pas ou a été supprimé."
      />
    );
  }

  return <TeachingDetail teaching={data} />;
};

export default TeachingDetailPage;

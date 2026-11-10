import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { useTeaching } from '../hooks/useTeachings';
import { TeachingDetail } from '../components/teachings/TeachingDetail';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { usePageTitle } from '../hooks/usePageTitle';
import { useLanguage } from '../hooks/useLanguage';
import { getLocalizedField } from '../utils/formatters';

const TeachingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { data, isLoading, isError } = useTeaching(id!);
  usePageTitle(data ? getLocalizedField(data, 'title', currentLanguage) : t('teachings.title'));

  if (isLoading) return <PageLoader />;
  if (isError || !data) {
    return <EmptyState icon={<FileText className="w-full h-full" />} title={t('teachings.not_found')} description={t('teachings.not_found_desc')} />;
  }
  return <TeachingDetail teaching={data} />;
};

export default TeachingDetailPage;

import { useTranslation } from 'react-i18next';
import { TeachingList } from '../components/teachings/TeachingList';
import { PageHeader } from '../components/common/PageHeader';
import { usePageTitle } from '../hooks/usePageTitle';

const TeachingsPage = () => {
  const { t } = useTranslation();
  usePageTitle(t('teachings.title'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <PageHeader title={t('teachings.title')} subtitle={t('pages.teachings_subtitle')} />
      <TeachingList />
    </div>
  );
};

export default TeachingsPage;

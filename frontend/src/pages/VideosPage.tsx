import { useTranslation } from 'react-i18next';
import { VideoList } from '../components/video/VideoList';
import { PageHeader } from '../components/common/PageHeader';
import { usePageTitle } from '../hooks/usePageTitle';

const VideosPage = () => {
  const { t } = useTranslation();
  usePageTitle(t('videos.title'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <PageHeader title={t('videos.title')} subtitle={t('pages.videos_subtitle')} />
      <VideoList />
    </div>
  );
};

export default VideosPage;

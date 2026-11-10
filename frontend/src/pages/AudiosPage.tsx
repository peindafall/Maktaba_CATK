import { useTranslation } from 'react-i18next';
import { AudioList } from '../components/audio/AudioList';
import { PageHeader } from '../components/common/PageHeader';
import { usePageTitle } from '../hooks/usePageTitle';

const AudiosPage = () => {
  const { t } = useTranslation();
  usePageTitle(t('audio.title'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <PageHeader title={t('audio.title')} subtitle={t('pages.audios_subtitle')} />
      <AudioList />
    </div>
  );
};

export default AudiosPage;

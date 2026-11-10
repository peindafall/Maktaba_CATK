import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, ExternalLink, Video } from 'lucide-react';
import { useVideo } from '../hooks/useVideos';
import { PageLoader } from '../components/common/Spinner';
import { useLanguage } from '../hooks/useLanguage';
import { getLocalizedField, formatNumber, formatDate, getCategoryName } from '../utils/formatters';
import { YouTubeEmbed } from '../components/video/YouTubeEmbed';
import { EmptyState } from '../components/common/EmptyState';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { ShareButton } from '../components/common/ShareButton';
import { BackLink } from '../components/common/BackLink';
import { usePageTitle } from '../hooks/usePageTitle';

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { data: video, isLoading, isError } = useVideo(id!);
  const title = video ? getLocalizedField(video, 'title', currentLanguage) : '';
  usePageTitle(title || t('videos.title'));

  if (isLoading) return <PageLoader />;
  if (isError || !video) {
    return <EmptyState icon={<Video className="w-full h-full" />} title={t('videos.not_found')} description={t('videos.not_found_desc')} />;
  }

  const description = getLocalizedField(video, 'description', currentLanguage);
  const theme = getCategoryName(video.theme_info, currentLanguage);
  const typeLabel = video.category ? t(`videos.type_${video.category}`, { defaultValue: video.category_label || '' }) : '';

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8">
      <div className="hidden sm:block">
        <BackLink fallback="/videos" />
      </div>

      {/* La vidéo est en haut de page et visible immédiatement (plus besoin de remonter) */}
      <YouTubeEmbed videoId={video.youtube_id} modelId={video.id} title={title} className="sm:rounded-2xl" />

      <div className="px-4 sm:px-0 mt-4 sm:mt-6">
        <div className="sm:hidden">
          <BackLink fallback="/videos" />
        </div>
        <article className="card p-5 sm:p-6">
          {(theme || typeLabel) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {theme && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">{theme}</span>}
              {typeLabel && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brown/10 text-brown dark:text-orange-300">{typeLabel}</span>}
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 break-words">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
            {video.published_at && <span>{formatDate(video.published_at, i18n.language)}</span>}
            <span className="flex items-center gap-1">
              <Eye size={14} /> {formatNumber(video.views_count, i18n.language)}
            </span>
          </div>
          {description && <p className="text-[var(--text-secondary)] leading-relaxed mb-5 whitespace-pre-line">{description}</p>}
          <div className="flex flex-wrap items-center gap-3">
            {video.youtube_url && (
              <a
                href={video.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-light)] text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                <ExternalLink size={14} /> {t('videos.open_youtube')}
              </a>
            )}
            <FavoriteButton type="video" id={video.id} title={video.title_fr} size="md" />
            <ShareButton title={title} />
          </div>
          <p className="mt-4 text-xs text-[var(--text-secondary)]">{t('videos.no_download')}</p>
        </article>
      </div>
    </div>
  );
};

export default VideoDetailPage;

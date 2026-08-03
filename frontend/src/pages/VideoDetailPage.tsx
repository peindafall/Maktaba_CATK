import { useParams, Link } from 'react-router-dom';
import { useVideo } from '../hooks/useVideos';
import { PageLoader } from '../components/common/Spinner';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { getLocalizedField, formatNumber, formatDate } from '../utils/formatters';
import { YouTubeEmbed } from '../components/video/YouTubeEmbed';
import { ArrowLeft, Eye, ExternalLink, Video } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { data: video, isLoading, isError } = useVideo(id!);

  if (isLoading) return <PageLoader />;
  if (isError || !video) {
    return (
      <EmptyState
        icon={<Video />}
        title="Vidéo non trouvée"
        description="Cette vidéo n'existe pas."
      />
    );
  }

  const title = getLocalizedField(video as unknown as Record<string, unknown>, 'title', currentLanguage);
  const description = getLocalizedField(video as unknown as Record<string, unknown>, 'description', currentLanguage);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/videos"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> {t('common.back')}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* YouTube Player */}
        <YouTubeEmbed videoId={video.youtube_id} className="mb-6" />

        {/* Info */}
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
            {video.published_at && <span>{formatDate(video.published_at, i18n.language)}</span>}
            <span className="flex items-center gap-1">
              <Eye size={14} /> {formatNumber(video.views_count)}
            </span>
          </div>
          {description && (
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">{description}</p>
          )}
          <a
            href={video.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            <ExternalLink size={14} /> {t('videos.open_youtube')}
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoDetailPage;

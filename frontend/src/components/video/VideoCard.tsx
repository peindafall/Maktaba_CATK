import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, Clock, Eye } from 'lucide-react';
import type { Video } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatNumber, formatTime, getCategoryName } from '../../utils/formatters';
import { FavoriteButton } from '../common/FavoriteButton';
import { VideoThumbnail } from './VideoThumbnail';

interface VideoCardProps {
  video: Video;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const title = getLocalizedField(video, 'title', currentLanguage);
  const theme = getCategoryName(video.theme_info, currentLanguage);
  const typeLabel = video.category ? t(`videos.type_${video.category}`, { defaultValue: video.category_label || '' }) : '';

  return (
    <article className="card overflow-hidden group h-full flex flex-col" style={{ padding: 0 }}>
      <Link to={`/videos/${video.id}`} className="block relative" aria-label={title}>
        <div className="relative aspect-video overflow-hidden bg-black">
          <VideoThumbnail video={video} className="transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl opacity-90"
              style={{ background: 'linear-gradient(135deg, #BF8B28, #A67723)' }}
            >
              <Play size={22} className="text-white ms-0.5" fill="white" />
            </span>
          </div>
          {video.duration_seconds ? (
            <span className="absolute bottom-2 end-2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
              {formatTime(video.duration_seconds)}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {(typeLabel || theme) && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {theme && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{theme}</span>
            )}
            {typeLabel && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brown/10 text-brown dark:text-orange-300">
                {typeLabel}
              </span>
            )}
          </div>
        )}
        <Link to={`/videos/${video.id}`}>
          <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-3 mt-auto">
          <span className="flex items-center gap-1">
            <Eye size={11} /> {formatNumber(video.views_count, i18n.language)}
          </span>
          {video.duration_seconds ? (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {formatTime(video.duration_seconds)}
            </span>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Link
            to={`/videos/${video.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #B35214, #431C03)' }}
          >
            <Play size={13} fill="currentColor" className="rtl:rotate-180" />
            {t('videos.watch')}
          </Link>
          <FavoriteButton type="video" id={video.id} title={video.title_fr} />
        </div>
      </div>
    </article>
  );
};

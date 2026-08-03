import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Play, Clock, Eye, Video as VideoIcon } from 'lucide-react';
import type { Video } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatNumber, formatDuration } from '../../utils/formatters';

interface VideoCardProps {
  video: Video;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const title = getLocalizedField(video as unknown as Record<string, unknown>, 'title', currentLanguage);

  const thumbnail = video.thumbnail_url || 
    (video.youtube_id ? `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg` : '');

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card overflow-hidden group"
      style={{ padding: 0 }}
    >
      {/* Thumbnail */}
      <Link to={`/videos/${video.id}`} className="block relative">
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-brown/20 to-brown-dark/30">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <VideoIcon size={48} className="text-brown/40" />
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
              style={{ background: 'linear-gradient(135deg, #BF8B28, #A67723)' }}
            >
              <Play size={22} className="text-white ml-0.5" fill="white" />
            </div>
          </div>

          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/videos/${video.id}`}>
          <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-3">
          <span className="flex items-center gap-1">
            <Eye size={11} /> {formatNumber(video.views_count)}
          </span>
          {video.duration && (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {formatDuration(video.duration)}
            </span>
          )}
        </div>

        <Link
          to={`/videos/${video.id}`}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #B35214, #431C03)', color: '#fff' }}
        >
          <Play size={13} fill="currentColor" />
          {t('videos.watch')}
        </Link>
      </div>
    </motion.div>
  );
};

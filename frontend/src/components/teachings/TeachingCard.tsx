import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Eye, Download, FileText, Heart } from 'lucide-react';
import type { Teaching } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatNumber } from '../../utils/formatters';
import { teachingService } from '../../services/teachingService';

interface TeachingCardProps {
  teaching: Teaching;
}

export const TeachingCard = ({ teaching }: TeachingCardProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const title = getLocalizedField(teaching as unknown as Record<string, unknown>, 'title', currentLanguage);
  const description = getLocalizedField(teaching as unknown as Record<string, unknown>, 'description', currentLanguage);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await teachingService.incrementDownload(teaching.id);
      window.open(teaching.pdf_file, '_blank');
    } catch {
      window.open(teaching.pdf_file, '_blank');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card overflow-hidden group"
      style={{ padding: 0 }}
    >
      {/* Cover image */}
      <Link to={`/enseignements/${teaching.id}`} className="block relative">
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-primary-dark/30">
          {teaching.cover_image_url ? (
            <img
              src={teaching.cover_image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText size={48} className="text-primary/40" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Featured badge */}
          {teaching.is_featured && (
            <div
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-semibold"
              style={{ background: 'linear-gradient(135deg, #BF8B28, #A67723)' }}
            >
              {t('teachings.featured')}
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category badge */}
        {teaching.category && (
          <span
            className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2"
            style={{
              backgroundColor: `${teaching.category.color || '#1EA478'}20`,
              color: teaching.category.color || '#1EA478',
            }}
          >
            {getLocalizedField(teaching.category as unknown as Record<string, unknown>, 'name', currentLanguage)}
          </span>
        )}

        {/* Title */}
        <Link to={`/enseignements/${teaching.id}`}>
          <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug mb-2 line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Description */}
        {description && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{description}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-3">
          <span className="flex items-center gap-1">
            <Eye size={12} /> {formatNumber(teaching.views_count)}
          </span>
          <span className="flex items-center gap-1">
            <Download size={12} /> {formatNumber(teaching.downloads_count)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            <Download size={13} />
            {t('teachings.download')}
          </button>
          <button className="p-2 rounded-xl border border-[var(--border-light)] hover:border-red-300 hover:text-red-400 transition-colors">
            <Heart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

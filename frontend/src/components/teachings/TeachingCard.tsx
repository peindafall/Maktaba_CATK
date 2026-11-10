import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Eye, Download, FileText } from 'lucide-react';
import type { Teaching } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatNumber, getCategoryName } from '../../utils/formatters';
import { teachingService } from '../../services/teachingService';
import { triggerDownload } from '../../utils/helpers';
import { toast } from '../../stores/toastStore';
import { useDownloadHelp } from '../common/DownloadHelpModal';
import { FavoriteButton } from '../common/FavoriteButton';
import { Badge } from '../common/Badge';

interface TeachingCardProps {
  teaching: Teaching;
}

export const TeachingCard = ({ teaching }: TeachingCardProps) => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const openHelp = useDownloadHelp((s) => s.open);
  const [imgFailed, setImgFailed] = useState(false);

  const title = getLocalizedField(teaching, 'title', currentLanguage);
  const description = getLocalizedField(teaching, 'description', currentLanguage);
  const categoryName = getCategoryName(teaching.category_info, currentLanguage, teaching.category_name);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerDownload(teachingService.getDownloadUrl(teaching.id));
    toast.success(t('downloads.started'), { action: { label: t('downloads.help_link'), onClick: openHelp }, duration: 6000 });
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ['teachings'] }), 3000);
  };

  return (
    <article className="card overflow-hidden group h-full flex flex-col" style={{ padding: 0 }}>
      <Link to={`/enseignements/${teaching.id}`} className="block relative" aria-label={title}>
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-primary-dark/30">
          {teaching.cover_image_url && !imgFailed ? (
            <img
              src={teaching.cover_image_url}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText size={48} className="text-primary/40" />
            </div>
          )}
          {teaching.is_featured && (
            <span
              className="absolute top-3 start-3 px-2.5 py-1 rounded-full text-white text-xs font-semibold"
              style={{ background: 'linear-gradient(135deg, #BF8B28, #A67723)' }}
            >
              {t('teachings.featured')}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {categoryName && (
          <Badge color={teaching.category_info?.color} className="mb-2 self-start">
            {categoryName}
          </Badge>
        )}
        <Link to={`/enseignements/${teaching.id}`}>
          <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug mb-2 line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        {description && <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{description}</p>}
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-3 mt-auto">
          <span className="flex items-center gap-1" title={t('teachings.views')}>
            <Eye size={12} /> {formatNumber(teaching.views_count, i18n.language)}
          </span>
          <span className="flex items-center gap-1" title={t('teachings.downloads')}>
            <Download size={12} /> {formatNumber(teaching.downloads_count, i18n.language)}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            <Download size={13} /> {t('teachings.download_short')}
          </button>
          <FavoriteButton type="teaching" id={teaching.id} title={teaching.title_fr} />
        </div>
      </div>
    </article>
  );
};

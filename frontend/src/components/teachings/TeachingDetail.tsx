import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, Eye, Share2, ArrowLeft, FileText, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Teaching } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatDate, formatNumber } from '../../utils/formatters';
import { teachingService } from '../../services/teachingService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PDFViewer } from './PDFViewer';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface TeachingDetailProps {
  teaching: Teaching;
}

export const TeachingDetail = ({ teaching }: TeachingDetailProps) => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showPDF, setShowPDF] = useState(false);
  const [views, setViews] = useState(teaching.views_count || 0);
  const [downloads, setDownloads] = useState(teaching.downloads_count || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const pdfSectionRef = useRef<HTMLDivElement>(null);

  const title = getLocalizedField(teaching as unknown as Record<string, unknown>, 'title', currentLanguage);
  const description = getLocalizedField(teaching as unknown as Record<string, unknown>, 'description', currentLanguage);
  const categoryName = teaching.category
    ? getLocalizedField(teaching.category as unknown as Record<string, unknown>, 'name', currentLanguage)
    : '';

  useEffect(() => {
    if (isAuthenticated) {
      teachingService
        .getFavorites()
        .then((favorites) => {
          const favorited = favorites.some((fav) => fav.id === teaching.id);
          setIsFavorited(favorited);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, teaching.id]);

  const handleDownload = () => {
    const url = teachingService.getDownloadUrl(teaching.id);
    window.location.href = url;
    setDownloads((prev) => prev + 1);
  };

  const handleRead = () => {
    teachingService.incrementView(teaching.id).catch(() => {});
    setViews((prev) => prev + 1);
    setShowPDF(true);
    // Scroll automatique vers le PDF après le rendu
    setTimeout(() => {
      pdfSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour ajouter aux favoris.');
      return;
    }
    setLoadingFavorite(true);
    try {
      const result = await teachingService.toggleFavorite(teaching.id);
      setIsFavorited(result.is_favorited);
    } catch (error) {
      console.error('Erreur favori:', error);
    }
    setLoadingFavorite(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <Link
        to="/enseignements"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> {t('common.back')}
      </Link>

      <div className="card p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-shrink-0">
            <div className="w-full lg:w-48 aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary-dark/30">
              {teaching.cover_image_url ? (
                <img
                  src={teaching.cover_image_url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText size={48} className="text-primary/40" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {categoryName && (
              <Badge color={teaching.category?.color} className="mb-3">
                {categoryName}
              </Badge>
            )}
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-3">
              {title}
            </h1>
            {description && (
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">{description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] mb-6">
              {teaching.published_at && (
                <span>{formatDate(teaching.published_at, i18n.language)}</span>
              )}
              <span className="flex items-center gap-1">
                <Eye size={14} /> {formatNumber(views)} {t('teachings.views')}
              </span>
              <span className="flex items-center gap-1">
                <Download size={14} /> {formatNumber(downloads)} {t('teachings.downloads')}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload} leftIcon={<Download size={16} />}>
                {t('teachings.download')}
              </Button>
              {teaching.pdf_file_url && (
                <Button
                  variant="outline"
                  onClick={handleRead}
                  leftIcon={<FileText size={16} />}
                >
                  {t('teachings.read_online')}
                </Button>
              )}
              <button
                onClick={toggleFavorite}
                disabled={loadingFavorite}
                className={`p-2.5 rounded-2xl border transition-colors ${
                  isFavorited
                    ? 'border-red-300 text-red-500 bg-red-50'
                    : 'border-[var(--border-light)] hover:border-red-300 hover:text-red-400'
                }`}
                title={isFavorited ? t('common.remove_favorite') : t('common.add_favorite')}
              >
                <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => navigator.share?.({ title, url: window.location.href })}
                className="p-2.5 rounded-2xl border border-[var(--border-light)] hover:border-primary hover:text-primary transition-colors"
                title={t('common.share')}
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {showPDF && teaching.pdf_file_url && (
          <motion.div
            ref={pdfSectionRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-[var(--border-light)] pt-6"
          >
            <PDFViewer fileUrl={teachingService.getReadUrl(teaching.id)} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
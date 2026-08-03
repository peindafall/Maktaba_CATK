import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, Eye, Share2, ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Teaching } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatDate, formatNumber } from '../../utils/formatters';
import { teachingService } from '../../services/teachingService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PDFViewer } from './PDFViewer';
import { useState } from 'react';

interface TeachingDetailProps {
  teaching: Teaching;
}

export const TeachingDetail = ({ teaching }: TeachingDetailProps) => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [showPDF, setShowPDF] = useState(false);

  const title = getLocalizedField(teaching as unknown as Record<string, unknown>, 'title', currentLanguage);
  const description = getLocalizedField(teaching as unknown as Record<string, unknown>, 'description', currentLanguage);
  const categoryName = teaching.category
    ? getLocalizedField(teaching.category as unknown as Record<string, unknown>, 'name', currentLanguage)
    : '';

  const handleDownload = async () => {
    try {
      await teachingService.incrementDownload(teaching.id);
    } catch { /* ignore */ }
    window.open(teaching.pdf_file, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Back link */}
      <Link
        to="/enseignements"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> {t('common.back')}
      </Link>

      <div className="card p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Cover */}
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

          {/* Info */}
          <div className="flex-1 min-w-0">
            {categoryName && (
              <Badge
                color={teaching.category?.color}
                className="mb-3"
              >
                {categoryName}
              </Badge>
            )}
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-3">
              {title}
            </h1>
            {description && (
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">{description}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] mb-6">
              {teaching.published_at && (
                <span>{formatDate(teaching.published_at, i18n.language)}</span>
              )}
              <span className="flex items-center gap-1">
                <Eye size={14} /> {formatNumber(teaching.views_count)} {t('teachings.views')}
              </span>
              <span className="flex items-center gap-1">
                <Download size={14} /> {formatNumber(teaching.downloads_count)} {t('teachings.downloads')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload} leftIcon={<Download size={16} />}>
                {t('teachings.download')}
              </Button>
              {teaching.pdf_file && (
                <Button
                  variant="outline"
                  onClick={() => setShowPDF(!showPDF)}
                  leftIcon={<FileText size={16} />}
                >
                  {showPDF ? 'Masquer' : t('teachings.read_online')}
                </Button>
              )}
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

        {/* PDF Viewer */}
        {showPDF && teaching.pdf_file && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-[var(--border-light)] pt-6"
          >
            <PDFViewer fileUrl={teaching.pdf_file} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

import { useRef, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Download, Eye, FileText, X } from 'lucide-react';
import type { Teaching } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatDate, formatNumber, getCategoryName } from '../../utils/formatters';
import { teachingService } from '../../services/teachingService';
import { triggerDownload } from '../../utils/helpers';
import { toast } from '../../stores/toastStore';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Spinner } from '../common/Spinner';
import { FavoriteButton } from '../common/FavoriteButton';
import { ShareButton } from '../common/ShareButton';
import { BackLink } from '../common/BackLink';
import { useDownloadHelp } from '../common/DownloadHelpModal';

// Le lecteur PDF (lourd) n'est chargé que si l'on clique sur « Lire en ligne »
const PDFViewer = lazy(() => import('./PDFViewer').then((m) => ({ default: m.PDFViewer })));

interface TeachingDetailProps {
  teaching: Teaching;
}

export const TeachingDetail = ({ teaching }: TeachingDetailProps) => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const openHelp = useDownloadHelp((s) => s.open);
  const [showPDF, setShowPDF] = useState(false);
  const [views, setViews] = useState(teaching.views_count || 0);
  const [downloads, setDownloads] = useState(teaching.downloads_count || 0);
  const pdfSectionRef = useRef<HTMLDivElement>(null);

  const title = getLocalizedField(teaching, 'title', currentLanguage);
  const description = getLocalizedField(teaching, 'description', currentLanguage);
  const categoryName = getCategoryName(teaching.category_info, currentLanguage, teaching.category_name);

  const handleDownload = () => {
    triggerDownload(teachingService.getDownloadUrl(teaching.id));
    setDownloads((d) => d + 1);
    toast.success(t('downloads.started'), { action: { label: t('downloads.help_link'), onClick: openHelp }, duration: 6000 });
    queryClient.invalidateQueries({ queryKey: ['teachings'] });
  };

  const handleRead = () => {
    if (showPDF) {
      setShowPDF(false);
      return;
    }
    teachingService.incrementView(teaching.id).then((r) => setViews(r.views_count)).catch(() => {});
    setShowPDF(true);
    setTimeout(() => pdfSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <BackLink fallback="/enseignements" />

      <article className="card p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="flex-shrink-0 mx-auto sm:mx-0 w-40 sm:w-44 lg:w-48">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary-dark/30 shadow-lg">
              {teaching.cover_image_url ? (
                <img src={teaching.cover_image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText size={48} className="text-primary/40" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {categoryName && (
              <Badge color={teaching.category_info?.color} className="mb-3">
                {categoryName}
              </Badge>
            )}
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-3 break-words">{title}</h1>
            {description && <p className="text-[var(--text-secondary)] leading-relaxed mb-4 whitespace-pre-line">{description}</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] mb-6">
              {teaching.published_at && <span>{formatDate(teaching.published_at, i18n.language)}</span>}
              <span className="flex items-center gap-1">
                <Eye size={14} /> {formatNumber(views, i18n.language)} {t('teachings.views')}
              </span>
              <span className="flex items-center gap-1">
                <Download size={14} /> {formatNumber(downloads, i18n.language)} {t('teachings.downloads')}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {teaching.pdf_file_url && (
                <>
                  <Button onClick={handleDownload} leftIcon={<Download size={16} />}>
                    {t('teachings.download')}
                  </Button>
                  <Button variant="outline" onClick={handleRead} leftIcon={showPDF ? <X size={16} /> : <FileText size={16} />}>
                    {showPDF ? t('teachings.close_reader') : t('teachings.read_online')}
                  </Button>
                </>
              )}
              <FavoriteButton type="teaching" id={teaching.id} title={teaching.title_fr} size="md" />
              <ShareButton title={title} />
            </div>
          </div>
        </div>

        {showPDF && teaching.pdf_file_url && (
          <div ref={pdfSectionRef} className="border-t border-[var(--border-light)] pt-6 scroll-mt-20">
            <Suspense fallback={<div className="py-16 flex justify-center"><Spinner size="lg" /></div>}>
              <PDFViewer fileUrl={teachingService.getReadUrl(teaching.id)} />
            </Suspense>
          </div>
        )}
      </article>
    </div>
  );
};

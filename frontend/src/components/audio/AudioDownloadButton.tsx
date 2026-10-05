import { Download, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDownloadAudio } from '../../hooks/useAudios';
import type { Audio } from '../../types';

interface AudioDownloadButtonProps {
  audio: Audio;
  variant?: 'primary' | 'outline' | 'icon';
  className?: string;
}

export const AudioDownloadButton = ({
  audio,
  variant = 'primary',
  className = '',
}: AudioDownloadButtonProps) => {
  const { t } = useTranslation();
  const downloadMutation = useDownloadAudio();

  const handleDownload = async () => {
    try {
      const data = await downloadMutation.mutateAsync(audio.id);
      if (!data.audio_url) return;

      // Force le téléchargement via un <a> invisible
      const link = document.createElement('a');
      link.href = data.audio_url;
      link.download = data.filename || `audio-${audio.id}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleDownload}
        disabled={downloadMutation.isPending}
        className={`p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors disabled:opacity-50 ${className}`}
        title={t('audio.download') || 'Télécharger'}
      >
        {downloadMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handleDownload}
        disabled={downloadMutation.isPending}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary hover:bg-primary/5 transition-colors disabled:opacity-50 ${className}`}
      >
        {downloadMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {t('audio.download') || 'Télécharger'}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloadMutation.isPending}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 ${className}`}
    >
      {downloadMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {t('audio.download') || 'Télécharger'}
    </button>
  );
};
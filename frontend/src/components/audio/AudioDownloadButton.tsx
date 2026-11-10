import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { audioService } from '../../services/audioService';
import { triggerDownload, cn } from '../../utils/helpers';
import { toast } from '../../stores/toastStore';
import { useDownloadHelp } from '../common/DownloadHelpModal';
import type { Audio } from '../../types';

interface AudioDownloadButtonProps {
  audio: Audio;
  variant?: 'primary' | 'outline' | 'icon';
  className?: string;
}

/**
 * Télécharge VRAIMENT le fichier (le serveur répond « Content-Disposition: attachment »).
 * Avant, l'attribut HTML « download » était ignoré (domaines différents) : sur iPhone l'audio
 * s'ouvrait dans un nouvel onglet au lieu d'être enregistré dans l'app Fichiers.
 */
export const AudioDownloadButton = ({ audio, variant = 'primary', className = '' }: AudioDownloadButtonProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const openHelp = useDownloadHelp((s) => s.open);

  // Les réponses aux questions n'ont pas d'endpoint de téléchargement dédié : on télécharge le fichier directement
  const url = audio.kind === 'answer' ? audio.audio_url : audioService.getDownloadUrl(audio.id);

  const handleDownload = () => {
    if (!url) return;
    triggerDownload(url);
    toast.success(t('downloads.started'), {
      action: { label: t('downloads.help_link'), onClick: openHelp },
      duration: 6000,
    });
    if (audio.kind !== 'answer') {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['audio', audio.id] });
      }, 2500);
    }
  };

  const label = t('audio.download');

  if (variant === 'icon') {
    return (
      <button
        onClick={handleDownload}
        className={cn('p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors', className)}
        title={label}
        aria-label={label}
      >
        <Download size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors',
        variant === 'outline'
          ? 'border border-primary text-primary hover:bg-primary/5'
          : 'bg-primary text-white hover:bg-primary-dark',
        className
      )}
    >
      <Download size={16} />
      {label}
    </button>
  );
};

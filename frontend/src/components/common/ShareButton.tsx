import { Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '../../stores/toastStore';

export const ShareButton = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* annulé */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('common.link_copied'));
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      onClick={share}
      className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-[var(--border-light)] hover:border-primary hover:text-primary transition-colors"
      title={t('common.share')}
      aria-label={t('common.share')}
    >
      <Share2 size={18} />
    </button>
  );
};

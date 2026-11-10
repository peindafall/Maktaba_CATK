import { create } from 'zustand';
import { useTranslation } from 'react-i18next';
import { Smartphone, Monitor, Apple, Youtube } from 'lucide-react';
import { Modal } from './Modal';

interface DownloadHelpState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useDownloadHelp = create<DownloadHelpState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

/** Explique où retrouver les fichiers téléchargés (iPhone, Android, ordinateur). */
export const DownloadHelpModal = () => {
  const { t } = useTranslation();
  const { isOpen, close } = useDownloadHelp();

  const items = [
    { icon: <Apple size={18} />, title: t('downloads.iphone_title'), text: t('downloads.iphone_text') },
    { icon: <Smartphone size={18} />, title: t('downloads.android_title'), text: t('downloads.android_text') },
    { icon: <Monitor size={18} />, title: t('downloads.computer_title'), text: t('downloads.computer_text') },
    { icon: <Youtube size={18} />, title: t('nav.videos'), text: t('downloads.videos_note') },
  ];

  return (
    <Modal isOpen={isOpen} onClose={close} title={t('downloads.help_title')} size="md">
      <ul className="space-y-4">
        {items.map((it) => (
          <li key={it.title} className="flex gap-3">
            <span className="mt-0.5 w-9 h-9 flex-shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              {it.icon}
            </span>
            <div>
              <p className="font-semibold text-[var(--text-primary)] text-sm">{it.title}</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{it.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

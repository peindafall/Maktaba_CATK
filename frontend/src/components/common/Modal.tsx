import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/helpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) => {
  const { t } = useTranslation();
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
    full: 'sm:max-w-full sm:mx-4',
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
            className={cn(
              // Sur mobile : panneau qui monte du bas (plus facile au pouce), sur ordinateur : fenêtre centrée
              'relative w-full max-h-[90dvh] overflow-y-auto bg-[var(--surface)] rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 pb-[env(safe-area-inset-bottom)]',
              sizes[size],
              className
            )}
          >
            {title ? (
              <div className="sticky top-0 bg-[var(--surface)] flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border-light)]">
                <h2 id={titleId} className="text-lg font-bold text-[var(--text-primary)]">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  aria-label={t('common.close')}
                  className="p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                aria-label={t('common.close')}
                className="absolute top-4 end-4 p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors z-10"
              >
                <X size={20} />
              </button>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';

const icons = {
  success: <CheckCircle2 size={18} className="text-primary flex-shrink-0" />,
  error: <AlertCircle size={18} className="text-red-500 flex-shrink-0" />,
  info: <Info size={18} className="text-gold flex-shrink-0" />,
};

/** Petites notifications en bas de l'écran (remplace les alert() du navigateur). */
export const Toaster = () => {
  const { toasts, dismiss } = useToastStore();

  return (
    <div
      className="fixed inset-x-0 z-[70] flex flex-col items-center gap-2 px-4 pointer-events-none bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:bottom-6"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-auto w-full max-w-sm flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border border-[var(--border-light)] bg-[var(--surface)] text-[var(--text-primary)] text-sm"
          >
            {icons[t.kind]}
            <span className="flex-1">{t.message}</span>
            {t.action && (
              <button
                onClick={() => {
                  t.action?.onClick();
                  dismiss(t.id);
                }}
                className="font-semibold text-primary whitespace-nowrap"
              >
                {t.action.label}
              </button>
            )}
            <button onClick={() => dismiss(t.id)} className="p-1 rounded-lg opacity-60 hover:opacity-100" aria-label="×">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

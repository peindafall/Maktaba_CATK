import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  danger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: React.ReactNode;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  danger,
  isLoading,
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="sm">
      <div className="text-center pt-2">
        {icon && <div className="flex justify-center mb-4">{icon}</div>}
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h2>
        {message && <p className="text-sm text-[var(--text-secondary)] mb-6">{message}</p>}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button variant="ghost" className="flex-1 border border-[var(--border-light)]" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
            autoFocus
          >
            {confirmLabel || t('common.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

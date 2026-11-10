import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/helpers';
import { useUIStore } from '../../stores/uiStore';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div
      className={cn(
        'border-2 border-[var(--border-light)] border-t-primary rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  );
};

export const PageLoader = () => {
  const { t } = useTranslation();
  const serverWaking = useUIStore((s) => s.serverWaking);
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <Spinner size="lg" className="mx-auto" />
        <p className="text-[var(--text-secondary)] animate-pulse">
          {serverWaking ? t('common.server_waking') : t('common.loading')}
        </p>
      </div>
    </div>
  );
};

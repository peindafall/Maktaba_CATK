import { cn } from '../../utils/helpers';

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

export const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="text-center space-y-4">
      <Spinner size="lg" />
      <p className="text-[var(--text-secondary)] animate-pulse">Chargement...</p>
    </div>
  </div>
);

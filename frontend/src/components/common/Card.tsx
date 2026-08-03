import { cn } from '../../utils/helpers';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ hoverable = true, padding = 'md', className, children, ...props }: CardProps) => {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

  return (
    <div
      className={cn(
        'bg-[var(--surface)] rounded-3xl border border-[var(--border-light)] shadow-sm',
        hoverable && 'hover:shadow-md transition-all duration-200 hover:-translate-y-0.5',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

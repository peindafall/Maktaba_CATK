import { cn } from '../../utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'solid' | 'outline' | 'soft';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge = ({ children, color, variant = 'soft', size = 'sm', className }: BadgeProps) => {
  const sizes = { sm: 'px-2.5 py-0.5 text-xs', md: 'px-3 py-1 text-sm' };
  const defaultStyles =
    variant === 'solid'
      ? 'bg-primary text-white'
      : variant === 'outline'
      ? 'border border-primary text-primary'
      : 'bg-primary/10 text-primary';

  return (
    <span
      className={cn('inline-flex items-center font-medium rounded-full', sizes[size], !color && defaultStyles, className)}
      style={
        color
          ? {
              backgroundColor: variant === 'solid' ? color : `${color}22`,
              color: variant === 'solid' ? '#fff' : color,
              border: variant === 'outline' ? `1px solid ${color}` : undefined,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
};

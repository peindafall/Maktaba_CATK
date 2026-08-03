import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn('text-center py-16 px-4', className)}
  >
    {icon && (
      <div className="flex justify-center mb-4 text-[var(--text-secondary)] opacity-40">
        <div className="w-16 h-16">{icon}</div>
      </div>
    )}
    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
    {description && <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">{description}</p>}
    {action}
  </motion.div>
);

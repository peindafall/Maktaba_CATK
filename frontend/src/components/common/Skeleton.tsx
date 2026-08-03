import { cn } from '../../utils/helpers';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn('animate-pulse bg-[var(--border-light)] rounded-2xl', className)} />
);

export const SkeletonCard = () => (
  <div className="card p-4 space-y-3">
    <Skeleton className="h-48 w-full rounded-2xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  </div>
);

export const SkeletonList = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

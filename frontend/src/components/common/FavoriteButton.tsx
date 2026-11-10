import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../../hooks/useFavorites';
import { cn } from '../../utils/helpers';
import type { FavoriteContentType } from '../../types';

interface FavoriteButtonProps {
  type: FavoriteContentType;
  id: string;
  title?: string;
  size?: 'sm' | 'md';
  className?: string;
  /** Pour les cœurs posés sur une image (fond sombre) */
  overlay?: boolean;
}

export const FavoriteButton = ({ type, id, title, size = 'sm', className, overlay }: FavoriteButtonProps) => {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(type, id);
  const label = active ? t('favorites.remove') : t('favorites.add');

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(type, id, title);
      }}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-xl border transition-all duration-150 active:scale-90',
        size === 'sm' ? 'w-9 h-9' : 'w-11 h-11 rounded-2xl',
        overlay
          ? active
            ? 'bg-white text-red-500 border-white shadow'
            : 'bg-black/40 text-white border-white/30 backdrop-blur hover:bg-black/60'
          : active
          ? 'border-red-400/60 text-red-500 bg-red-500/10'
          : 'border-[var(--border-light)] text-[var(--text-secondary)] hover:border-red-300 hover:text-red-400',
        className
      )}
    >
      <Heart size={size === 'sm' ? 15 : 18} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
};

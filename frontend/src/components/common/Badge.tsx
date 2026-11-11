import { cn } from '../../utils/helpers';
import { useUIStore } from '../../stores/uiStore';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'solid' | 'outline' | 'soft';
  size?: 'sm' | 'md';
  className?: string;
}

/** Luminosité perçue d'une couleur hex (0 = noir, 1 = blanc). */
const luminance = (hex: string): number | null => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Badge de catégorie.
 * Correctif : la couleur par défaut d'une catégorie est #000000 (noir) → texte noir sur fond noir
 * en mode sombre (« Aqida (Croyance) » illisible). Une couleur trop sombre (mode sombre) ou trop
 * claire (mode clair) est remplacée par le vert de la charte.
 */
export const Badge = ({ children, color, variant = 'soft', size = 'sm', className }: BadgeProps) => {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const sizes = { sm: 'px-2.5 py-0.5 text-xs', md: 'px-3 py-1 text-sm' };

  const lum = color ? luminance(color) : null;
  const readable = lum !== null && (isDarkMode ? lum > 0.25 : lum < 0.8);
  const safeColor = readable ? color : undefined;

  const defaultStyles =
    variant === 'solid'
      ? 'bg-primary text-white'
      : variant === 'outline'
      ? 'border border-primary text-primary'
      : 'bg-primary/15 text-primary';

  return (
    <span
      className={cn('inline-flex items-center font-medium rounded-full', sizes[size], !safeColor && defaultStyles, className)}
      style={
        safeColor
          ? {
              backgroundColor: variant === 'solid' ? safeColor : `${safeColor}26`,
              color: variant === 'solid' ? '#fff' : safeColor,
              border: variant === 'outline' ? `1px solid ${safeColor}` : undefined,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
};

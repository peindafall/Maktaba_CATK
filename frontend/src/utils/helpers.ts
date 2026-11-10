import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '…';
};

export const extractYouTubeId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const buildQueryString = (params: Record<string, unknown>): string => {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  return filtered.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
};

export const scrollToTop = (smooth = false) => {
  window.scrollTo({ top: 0, left: 0, behavior: smooth ? 'smooth' : 'auto' });
};

/** Déclenche le téléchargement d'un fichier servi en « Content-Disposition: attachment ». */
export const triggerDownload = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.rel = 'noopener';
  // Pas de target="_blank" : sur iPhone cela ouvrait un nouvel onglet qui lisait le fichier
  // au lieu de le télécharger. Le serveur renvoie une pièce jointe : la page actuelle ne change pas.
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

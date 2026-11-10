import { format, formatDistanceToNow } from 'date-fns';
import { fr, enUS, ar } from 'date-fns/locale';
import type { CategoryInfo } from '../types';

const localeMap = { fr, en: enUS, ar };
const baseLang = (lang?: string) => (lang || 'fr').split('-')[0] as keyof typeof localeMap;

export const formatDate = (dateStr: string | null | undefined, lang = 'fr', fmt = 'dd MMM yyyy') => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, fmt, { locale: localeMap[baseLang(lang)] || fr });
};

export const timeAgo = (dateStr: string, lang = 'fr') => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return formatDistanceToNow(date, { addSuffix: true, locale: localeMap[baseLang(lang)] || fr });
};

/**
 * Secondes -> "m:ss" ou "h:mm:ss".
 * Ne renvoie JAMAIS "NaN" ni "Infinity" (corrige l'affichage « Infinity:NaN » du lecteur).
 */
export const formatTime = (seconds: number | null | undefined): string => {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return '--:--';
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};

/** Durée Django ("HH:MM:SS" / "MM:SS") ou secondes -> texte court. */
export const formatDuration = (duration: string | number | null | undefined): string => {
  if (duration == null || duration === '') return '';
  if (typeof duration === 'number') return formatTime(duration);
  const parts = duration.split(':').map((p) => parseInt(p, 10));
  if (parts.some((p) => Number.isNaN(p))) return '';
  let seconds = 0;
  for (const p of parts) seconds = seconds * 60 + p;
  return formatTime(seconds);
};

export const formatNumber = (num: number | null | undefined, lang = 'fr'): string => {
  const value = Number.isFinite(num as number) ? (num as number) : 0;
  const l = baseLang(lang);
  return new Intl.NumberFormat(l === 'ar' ? 'ar-SA' : l === 'en' ? 'en-US' : 'fr-FR').format(value);
};

/** Renvoie le champ dans la langue courante, sinon FR, sinon EN, sinon AR. */
export const getLocalizedField = (obj: unknown, field: string, lang: string): string => {
  if (!obj || typeof obj !== 'object') return '';
  const o = obj as Record<string, unknown>;
  const l = baseLang(lang);
  const order = [l, 'fr', 'en', 'ar'];
  for (const code of order) {
    const v = o[`${field}_${code}`];
    if (typeof v === 'string' && v.trim()) return v;
  }
  return '';
};

export const getCategoryName = (cat: CategoryInfo | null | undefined, lang: string, fallback?: string | null) =>
  cat ? getLocalizedField(cat, 'name', lang) : fallback || '';

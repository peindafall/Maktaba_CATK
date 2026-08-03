import { format, formatDistanceToNow } from 'date-fns';
import { fr, enUS, ar } from 'date-fns/locale';

const localeMap = { fr, en: enUS, ar };

export const formatDate = (dateStr: string, lang = 'fr', fmt = 'dd MMM yyyy') => {
  const date = new Date(dateStr);
  return format(date, fmt, { locale: localeMap[lang as keyof typeof localeMap] || fr });
};

export const timeAgo = (dateStr: string, lang = 'fr') => {
  const date = new Date(dateStr);
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: localeMap[lang as keyof typeof localeMap] || fr,
  });
};

export const formatDuration = (duration: string | null): string => {
  if (!duration) return '';
  // duration format: "HH:MM:SS" or "MM:SS"
  const parts = duration.split(':');
  if (parts.length === 3) {
    const [h, m, s] = parts;
    if (parseInt(h) === 0) return `${m}:${s}`;
    return `${h}h ${m}m`;
  }
  return duration;
};

export const formatNumber = (num: number, lang = 'fr'): string => {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-DZ' : lang).format(num);
};

export const getLocalizedField = <T extends Record<string, unknown>>(
  obj: T,
  field: string,
  lang: string
): string => {
  const key = `${field}_${lang}` as keyof T;
  const fallbackKey = `${field}_fr` as keyof T;
  return (obj[key] as string) || (obj[fallbackKey] as string) || '';
};

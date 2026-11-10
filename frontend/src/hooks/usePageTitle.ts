import { useEffect } from 'react';

/** Titre de l'onglet du navigateur (utile aussi pour le partage et le référencement). */
export const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} · Maktaba CATK` : 'Maktaba CATK';
  }, [title]);
};

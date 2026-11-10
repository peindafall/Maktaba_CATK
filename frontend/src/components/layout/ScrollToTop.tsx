import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Remonte en haut de page à chaque changement de page.
 * Avant : en cliquant sur « Regarder » depuis le bas de l'accueil, la page vidéo s'ouvrait
 * à la même hauteur de défilement (on ne voyait pas la vidéo).
 * Le bouton « retour » du navigateur (POP) conserve, lui, la position précédente.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useLayoutEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, navType]);

  return null;
};

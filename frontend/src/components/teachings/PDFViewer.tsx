import { useEffect, useState } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Spinner } from '../common/Spinner';
import { useUIStore } from '../../stores/uiStore';
// Worker servi par notre propre site (plus de dépendance au CDN unpkg.com)
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

interface PDFViewerProps {
  fileUrl: string;
  height?: string;
}

const isSmallScreen = () => typeof window !== 'undefined' && window.innerWidth < 768;

/**
 * Lecteur PDF intégré.
 * Correctifs :
 *  - les boutons de la barre d'outils n'apparaissaient pas (les « slots » sont des composants :
 *    il faut écrire <ZoomIn />, pas {slots.ZoomIn}) ;
 *  - sur téléphone : pas de panneau latéral, page ajustée à la largeur de l'écran (plus de texte coupé).
 */
export const PDFViewer = ({ fileUrl, height }: PDFViewerProps) => {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const [small, setSmall] = useState(isSmallScreen());

  useEffect(() => {
    const onResize = () => setSmall(isSmallScreen());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const layout = defaultLayoutPlugin({
    // Pas de miniatures / signets sur mobile : toute la largeur pour la page
    sidebarTabs: (defaultTabs) => (small ? [] : defaultTabs),
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const { ZoomOut, Zoom, ZoomIn, GoToPreviousPage, CurrentPageInput, NumberOfPages, GoToNextPage, EnterFullScreen } =
            slots;
          return (
            <div className="flex items-center justify-between w-full gap-1 px-1 text-[var(--text-primary)]">
              <div className="flex items-center gap-0.5">
                <ZoomOut />
                {!small && <Zoom />}
                <ZoomIn />
              </div>
              <div className="flex items-center gap-1">
                <GoToPreviousPage />
                <span className="w-10">
                  <CurrentPageInput />
                </span>
                <span className="text-xs whitespace-nowrap">
                  / <NumberOfPages />
                </span>
                <GoToNextPage />
              </div>
              {/* Plein écran : très pratique sur téléphone. Pas de bouton « Télécharger » ici (compteur). */}
              <EnterFullScreen />
            </div>
          );
        }}
      </Toolbar>
    ),
  });

  return (
    <div
      style={height ? { height } : undefined}
      className={`rounded-2xl overflow-hidden border border-[var(--border-light)] w-full ${
        height ? '' : 'h-[75dvh] md:h-[750px]'
      }`}
    >
      <Worker workerUrl={pdfWorkerUrl}>
        <Viewer
          key={small ? 'mobile' : 'desktop'}
          fileUrl={fileUrl}
          plugins={[layout]}
          theme={isDarkMode ? 'dark' : 'light'}
          defaultScale={small ? SpecialZoomLevel.PageWidth : 1}
          renderLoader={() => (
            <div className="flex items-center justify-center h-full">
              <Spinner size="lg" />
            </div>
          )}
        />
      </Worker>
    </div>
  );
};

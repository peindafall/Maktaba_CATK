import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Spinner } from '../common/Spinner';

interface PDFViewerProps {
  fileUrl: string;
  height?: string;
}

export const PDFViewer = ({ fileUrl, height }: PDFViewerProps) => {
  // On surcharge la barre d'outils pour retirer le bouton "Télécharger" par défaut
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => (
          <>
            {slots.zoomOut}
            {slots.zoomIn}
            <span className="mx-2 text-xs">
              {slots.currentPageInput} / {slots.numPages}
            </span>
            {slots.goToNextPage}
            {slots.goToPreviousPage}
            {slots.rotateClockwise}
            {slots.fullScreen}
            {/* On ne rend pas slots.download — c'est ce qui empêche le bouton
                de télécharger de s'afficher, et donc de contourner le compteur */}
          </>
        )}
      </Toolbar>
    ),
  });

  return (
    <div
      style={height ? { height } : undefined}
      className={`rounded-2xl overflow-hidden border border-[var(--border-light)] w-full ${
        height ? '' : 'h-[60vh] sm:h-[70vh] md:h-[700px]'
      }`}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={1}
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
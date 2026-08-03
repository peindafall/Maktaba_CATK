import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Spinner } from '../common/Spinner';

interface PDFViewerProps {
  fileUrl: string;
  height?: string;
}

export const PDFViewer = ({ fileUrl, height = '700px' }: PDFViewerProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden border border-[var(--border-light)]">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
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

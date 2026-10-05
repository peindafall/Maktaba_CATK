import { useRef } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useIncrementVideoView } from '../../hooks/useVideos';

interface YouTubeEmbedProps {
  /** ID YouTube de la vidéo (ex: aoZdGEvtJU0) */
  videoId: string;
  /** UUID du modèle Video en base (ex: 1f0ba5c8-...) */
  modelId?: string;
  className?: string;
  /** Si true, on compte une vue au premier clic sur Play */
  trackView?: boolean;
}

export const YouTubeEmbed = ({
  videoId,
  modelId,
  className,
  trackView = true,
}: YouTubeEmbedProps) => {
  // Évite de compter plusieurs fois dans la même session
  const hasTracked = useRef(false);
  const incrementView = useIncrementVideoView();

  const handlePlay = (_event: YouTubeEvent) => {
    if (!trackView || hasTracked.current || !modelId) return;
    hasTracked.current = true;
    incrementView.mutate(modelId);
  };

  return (
    <div
      className={`relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl ${className || ''}`}
    >
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
          },
        }}
        onPlay={handlePlay}
        className="absolute inset-0 w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
};
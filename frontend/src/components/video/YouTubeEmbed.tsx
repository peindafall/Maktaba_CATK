import { useRef } from 'react';
import YouTube, { type YouTubeEvent } from 'react-youtube';
import { useIncrementVideoView } from '../../hooks/useVideos';
import { cn } from '../../utils/helpers';

interface YouTubeEmbedProps {
  videoId: string;
  modelId?: string;
  title?: string;
  className?: string;
  trackView?: boolean;
}

export const YouTubeEmbed = ({ videoId, modelId, title, className, trackView = true }: YouTubeEmbedProps) => {
  const hasTracked = useRef(false);
  const incrementView = useIncrementVideoView();

  const handlePlay = (_event: YouTubeEvent) => {
    if (!trackView || hasTracked.current || !modelId) return;
    hasTracked.current = true;
    incrementView.mutate(modelId);
  };

  return (
    <div className={cn('relative aspect-video w-full overflow-hidden bg-black shadow-xl', className)}>
      <YouTube
        videoId={videoId}
        title={title}
        opts={{
          width: '100%',
          height: '100%',
          host: 'https://www.youtube-nocookie.com',
          playerVars: { autoplay: 0, modestbranding: 1, rel: 0, playsinline: 1 },
        }}
        onPlay={handlePlay}
        className="absolute inset-0 w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
};

import YouTube from 'react-youtube';

interface YouTubeEmbedProps {
  videoId: string;
  className?: string;
}

export const YouTubeEmbed = ({ videoId, className }: YouTubeEmbedProps) => {
  return (
    <div className={`relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl ${className || ''}`}>
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
        className="absolute inset-0 w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
};

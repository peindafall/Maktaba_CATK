import { useState } from 'react';
import { Video as VideoIcon } from 'lucide-react';
import type { Video } from '../../types';
import { cn } from '../../utils/helpers';

/** Miniature YouTube avec repli : maxresdefault n'existe pas pour toutes les vidéos (=> image grise). */
export const VideoThumbnail = ({ video, className }: { video: Video; className?: string }) => {
  const candidates = [
    video.thumbnail_url,
    video.youtube_id ? `https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg` : '',
    video.youtube_id ? `https://i.ytimg.com/vi/${video.youtube_id}/mqdefault.jpg` : '',
  ].filter(Boolean) as string[];
  const [index, setIndex] = useState(0);

  if (!candidates[index]) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-brown/20">
        <VideoIcon size={48} className="text-white/40" />
      </div>
    );
  }

  return (
    <img
      src={candidates[index]}
      alt=""
      loading="lazy"
      className={cn('w-full h-full object-cover', className)}
      onLoad={(e) => {
        // YouTube renvoie une image grise 120x90 au lieu d'une erreur quand maxres n'existe pas
        if ((e.currentTarget as HTMLImageElement).naturalWidth <= 120) setIndex((i) => i + 1);
      }}
      onError={() => setIndex((i) => i + 1)}
    />
  );
};

import { useState } from "react";
import { Play } from "lucide-react";
import { LPContent } from "@/lib/cms-v2/cms-types";
import { SectionCTAV2 } from "./SectionCTAV2";

type VideoV2Props = {
  data: LPContent["video"];
  lpKey: string;
  couponCode?: string;
};

const convertToEmbedUrl = (url: string): string => {
  if (!url) return '';

  // YouTube: suporta watch, youtu.be, shorts, embed
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
  }

  // Vimeo: vimeo.com/ID -> player.vimeo.com/video/ID
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return url;
};

const getYouTubeThumbnail = (url: string): string | null => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
};

export const VideoV2 = ({ data, lpKey, couponCode }: VideoV2Props) => {
  const [playing, setPlaying] = useState(false);

  if (!data || data.enabled === false) return null;

  const embedUrl = convertToEmbedUrl(data.url || '');
  const thumbnail = getYouTubeThumbnail(data.url || '');

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <p className="mb-12 md:mb-16 text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {data.subtitle}
        </p>

        <div className="w-full rounded-[var(--ds-radius)] aspect-video overflow-hidden glass-card flex items-center justify-center relative">
          {!embedUrl ? (
            <span className="image-placeholder">Video</span>
          ) : !playing && thumbnail ? (
            // Video Facade — thumbnail + play button
            <button
              onClick={() => setPlaying(true)}
              className="w-full h-full relative group cursor-pointer"
              aria-label="Reproduzir video"
            >
              <img
                loading="lazy"
                src={thumbnail}
                alt={data.title || 'Video'}
                className="w-full h-full object-cover"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[hsl(var(--ds-color-icon))] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--ds-color-btn-text))] ml-1" />
                </div>
              </div>
            </button>
          ) : (
            // iframe real — carrega apenas quando clica
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Video"
            />
          )}
        </div>

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

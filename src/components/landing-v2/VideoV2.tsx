import { useState } from "react";
import { Play } from "lucide-react";
import { LPContent } from "@/lib/cms-v2/cms-types";
import { getEmbedUrlV2, getYouTubeThumbnail } from "@/lib/cms-v2/video-utils-v2";
import { SectionCTAV2 } from "./SectionCTAV2";

type VideoV2Props = {
  data: LPContent["video"];
  lpKey: string;
  couponCode?: string;
};

export const VideoV2 = ({ data, lpKey, couponCode }: VideoV2Props) => {
  const [playing, setPlaying] = useState(false);

  if (!data || data.enabled === false) return null;

  const rawEmbed = getEmbedUrlV2(data.url || '');
  const embedUrl = rawEmbed ? `${rawEmbed}${rawEmbed.includes('?') ? '&' : '?'}autoplay=1` : '';
  const thumbnail = getYouTubeThumbnail(data.url || '');

  return (
    <section className="w-full px-4 md:px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <p className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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

import { useState, useCallback } from "react";
import { Play } from "lucide-react";
import { LPContent } from "@/lib/cms-v2/cms-types";
import { getEmbedUrlV2 } from "@/lib/cms-v2/video-utils-v2";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { SectionCTAV2 } from "./SectionCTAV2";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

type VideoCarouselV2Props = {
  data: LPContent["videoCarousel"];
  lpKey: string;
  couponCode?: string;
};

const getYouTubeThumbnail = (url: string): string | null => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
};

const VideoCard = ({ item, index }: { item: { title: string; url: string }; index: number }) => {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrlV2(item.url);
  const thumbnail = getYouTubeThumbnail(item.url);
  const autoplayUrl = embedUrl ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1` : '';

  const handlePlay = useCallback(() => setPlaying(true), []);

  if (!embedUrl) return null;

  return (
    <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
      <div className="glass-card rounded-2xl overflow-hidden shadow-lg border border-border/20 min-h-[250px]">
        <AspectRatio ratio={16 / 9}>
          {!playing && thumbnail ? (
            <button
              onClick={handlePlay}
              className="w-full h-full relative group cursor-pointer"
              aria-label={`Reproduzir ${item.title || `Video ${index + 1}`}`}
            >
              <img
                loading="lazy"
                src={thumbnail}
                alt={item.title || `Video ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                <div className="w-14 h-14 rounded-full bg-[hsl(var(--ds-color-icon))] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 text-[hsl(var(--ds-color-btn-text))] ml-0.5" />
                </div>
              </div>
            </button>
          ) : (
            <iframe
              src={autoplayUrl || embedUrl}
              title={item.title || `Video ${index + 1}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </AspectRatio>
        {item.title && (
          <div className="p-4">
            <p className="text-sm md:text-base font-medium text-foreground text-center">
              {item.title}
            </p>
          </div>
        )}
      </div>
    </CarouselItem>
  );
};

export const VideoCarouselV2 = ({ data, lpKey, couponCode }: VideoCarouselV2Props) => {
  if (!data || data.enabled === false) return null;
  if (!data?.items || data.items.length === 0) return null;

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <Carousel
          opts={{ align: "start" }}
          className="w-full max-w-7xl mx-auto mt-8 md:mt-12"
        >
          <CarouselContent className="py-4">
            {data.items.map((item, index) => (
              <VideoCard key={index} item={item} index={index} />
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12 hidden lg:flex w-12 h-12 bg-[hsl(var(--ds-color-accent))] hover:bg-[hsl(var(--ds-color-accent))]/80 text-[hsl(var(--ds-color-btn-text))] border-0 shadow-lg" />
          <CarouselNext className="-right-12 hidden lg:flex w-12 h-12 bg-[hsl(var(--ds-color-accent))] hover:bg-[hsl(var(--ds-color-accent))]/80 text-[hsl(var(--ds-color-btn-text))] border-0 shadow-lg" />
        </Carousel>

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

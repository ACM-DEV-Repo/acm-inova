import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { LPContent } from '@/lib/cms-v2/cms-types';
import { SectionCTAV2 } from './SectionCTAV2';
import { safeUrl } from '@/lib/cms-v2/safe-url';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  data: LPContent['carousel'];
  lpKey: string;
  couponCode?: string;
};

const HEIGHT_MAP: Record<string, string> = {
  sm: '200px',
  md: '350px',
  lg: '500px',
  xl: '650px',
};

const OVERLAY_POSITION_CLASSES: Record<string, string> = {
  left: 'items-end justify-start text-left pl-8 md:pl-16 pb-8 md:pb-12',
  center: 'items-center justify-center text-center px-8',
  right: 'items-end justify-end text-right pr-8 md:pr-16 pb-8 md:pb-12',
  bottom: 'items-end justify-center text-center pb-8 md:pb-12 px-8',
};

export const CarouselV2 = memo(({ data, lpKey, couponCode }: Props) => {
  if (!data || data.enabled === false) return null;
  if (!data.slides || data.slides.length === 0) return null;

  const { settings } = data;
  const isFade = settings.transition === 'fade';
  const slideCount = data.slides.length;

  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % slideCount) + slideCount) % slideCount;
      setCurrent(next);
      if (!isFade && scrollRef.current) {
        scrollRef.current.scrollTo({
          left: next * scrollRef.current.offsetWidth,
          behavior: 'smooth',
        });
      }
    },
    [slideCount, isFade],
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (!settings.autoplay) return;
    if (settings.pauseOnHover && isHovered) return;
    if (slideCount <= 1) return;

    intervalRef.current = setInterval(goNext, settings.interval * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [settings.autoplay, settings.interval, settings.pauseOnHover, isHovered, goNext, slideCount]);

  // Sync scroll-snap position on manual swipe (slide mode)
  useEffect(() => {
    if (isFade) return;
    const el = scrollRef.current;
    if (!el) return;

    let timeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const idx = Math.round(el.scrollLeft / el.offsetWidth);
        if (idx !== current && idx >= 0 && idx < slideCount) {
          setCurrent(idx);
        }
      }, 60);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [isFade, current, slideCount]);

  const height = HEIGHT_MAP[settings.height] || HEIGHT_MAP.md;
  const borderRadius = settings.rounded ? 'var(--ds-radius, 1rem)' : '0';

  return (
    <section className="w-full px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(data.title || data.subtitle) && (
          <div className="text-center mb-8 md:mb-10">
            {data.title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--ds-color-title))]">
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className="text-muted-foreground text-lg md:text-xl mt-4 max-w-3xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Carousel container */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ borderRadius }}
        >
          {/* === FADE mode === */}
          {isFade && (
            <div
              className="relative w-full overflow-hidden"
              style={{ height, borderRadius }}
            >
              {data.slides.map((slide, index) => (
                <div
                  key={index}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{ opacity: index === current ? 1 : 0 }}
                  aria-hidden={index !== current}
                >
                  <img
                    src={slide.image}
                    alt={slide.title || `Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    style={{ borderRadius }}
                  />
                  {/* Overlay */}
                  {settings.overlay && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: `rgba(0,0,0,${(settings.overlayOpacity || 40) / 100})`,
                        borderRadius,
                      }}
                    />
                  )}
                  {/* Text overlay (desktop) */}
                  <SlideOverlay slide={slide} />
                </div>
              ))}
            </div>
          )}

          {/* === SLIDE (scroll-snap) mode === */}
          {!isFade && (
            <div
              ref={scrollRef}
              className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{
                height,
                borderRadius,
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {data.slides.map((slide, index) => (
                <div
                  key={index}
                  className="snap-center shrink-0 w-full relative"
                  style={{ height }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title || `Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    style={{ borderRadius }}
                  />
                  {/* Overlay */}
                  {settings.overlay && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: `rgba(0,0,0,${(settings.overlayOpacity || 40) / 100})`,
                        borderRadius,
                      }}
                    />
                  )}
                  {/* Text overlay (desktop) */}
                  <SlideOverlay slide={slide} />
                </div>
              ))}
            </div>
          )}

          {/* Mobile text below image */}
          <div className="block md:hidden mt-4">
            {data.slides[current] && (
              <MobileSlideContent slide={data.slides[current]} />
            )}
          </div>

          {/* Arrows (desktop only) */}
          {settings.showArrows && slideCount > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
                aria-label="Próximo slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dots */}
          {settings.showDots && slideCount > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {data.slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'w-8 bg-[hsl(var(--ds-color-accent))]'
                      : 'w-2.5 bg-[hsl(var(--ds-color-accent))]/30 hover:bg-[hsl(var(--ds-color-accent))]/50'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
});

CarouselV2.displayName = 'CarouselV2';

/* ---- Internal sub-components ---- */

type SlideData = LPContent['carousel']['slides'][number];

const SlideOverlay = memo(({ slide }: { slide: SlideData }) => {
  if (!slide.title && !slide.description && !slide.cta?.enabled) return null;

  const positionClasses =
    OVERLAY_POSITION_CLASSES[slide.overlayPosition || 'bottom'] ||
    OVERLAY_POSITION_CLASSES.bottom;

  return (
    <div
      className={`absolute inset-0 hidden md:flex flex-col ${positionClasses} z-[2]`}
    >
      <div className="glass-card max-w-lg p-6 md:p-8 backdrop-blur-md bg-black/30 border-white/10">
        {slide.title && (
          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
            {slide.title}
          </h3>
        )}
        {slide.description && (
          <p className="text-white/80 text-sm md:text-base mt-2 leading-relaxed">
            {slide.description}
          </p>
        )}
        {slide.cta?.enabled && slide.cta.text && (
          <a
            href={safeUrl(slide.cta.link)}
            className="inline-flex items-center justify-center mt-4 px-6 py-2.5 rounded-full text-sm font-bold bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))] hover:scale-105 transition-transform duration-300"
          >
            {slide.cta.text}
          </a>
        )}
      </div>
    </div>
  );
});

SlideOverlay.displayName = 'SlideOverlay';

const MobileSlideContent = memo(({ slide }: { slide: SlideData }) => {
  if (!slide.title && !slide.description && !slide.cta?.enabled) return null;

  return (
    <div className="px-1">
      {slide.title && (
        <h3 className="text-lg font-bold text-foreground leading-tight">
          {slide.title}
        </h3>
      )}
      {slide.description && (
        <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
          {slide.description}
        </p>
      )}
      {slide.cta?.enabled && slide.cta.text && (
        <a
          href={safeUrl(slide.cta.link)}
          className="inline-flex items-center justify-center mt-3 px-5 py-2 rounded-full text-sm font-bold bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))] hover:scale-105 transition-transform duration-300"
        >
          {slide.cta.text}
        </a>
      )}
    </div>
  );
});

MobileSlideContent.displayName = 'MobileSlideContent';

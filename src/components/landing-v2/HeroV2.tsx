import { LPContent } from "@/lib/cms-v2/cms-types";
import { applyUTMv2 } from "@/lib/cms-v2/utm-v2";
import { safeUrl } from "@/lib/cms-v2/safe-url";
import { SectionCTAV2 } from "./SectionCTAV2";
import { HeroAnimatedBackground } from "./HeroBackgrounds";

type HeroV2Props = {
  data: LPContent["hero"];
  lpKey: string;
  couponCode?: string;
};

const OBJ_POSITION: Record<string, string> = {
  top: 'object-top',
  center: 'object-center',
  bottom: 'object-bottom',
};

export const HeroV2 = ({ data, lpKey, couponCode }: HeroV2Props) => {
  if (!data || data.enabled === false) return null;

  const posClass = OBJ_POSITION[data.imagePosition || 'center'] || 'object-center';
  const bgType = data.backgroundType || 'image';
  const useAnimatedBg = bgType !== 'image';
  const hasLogo = !!data.heroLogo?.trim();
  const hasTagline = !!(data.tagline?.trim() || (!hasLogo && data.subtitle?.trim()));
  const shadowI = data.logoShadowIntensity ?? 0.7;

  return (
    <section
      data-section="hero"
      className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center px-4 md:px-6 overflow-hidden after:absolute after:bottom-0 after:left-0 after:right-0 after:h-32 after:bg-gradient-to-b after:from-transparent after:to-[hsl(var(--ds-color-bg))] after:z-[5] after:pointer-events-none"
    >
      {/* Background layer */}
      {useAnimatedBg ? (
        <HeroAnimatedBackground type={bgType} />
      ) : data.imageDesktop ? (
        <>
          <picture className="absolute inset-0 w-full h-full">
            {data.imageMobile && (
              <source media="(max-width: 767px)" srcSet={data.imageMobile} />
            )}
            <img
              src={data.imageDesktop}
              alt=""
              fetchPriority="high"
              className={`w-full h-full object-cover ${posClass}`}
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/40 to-[hsl(var(--ds-color-bg))]/60 backdrop-blur-sm" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]" />
      )}

      {/* Content layer */}
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Logo do evento OU título em texto */}
        {hasLogo ? (
          <div className="relative">
            {/* Barra de destaque — ponta a ponta */}
            {data.logoHighlight?.enabled && !useAnimatedBg && (
              <div
                style={{
                  position: 'absolute',
                  left: 'calc(-50vw + 50%)',
                  right: 'calc(-50vw + 50%)',
                  top: '-2rem',
                  bottom: '-2rem',
                  backgroundColor: data.logoHighlight.color || '#000000',
                  opacity: data.logoHighlight.opacity ?? 0.4,
                }}
              />
            )}
            <div className={`relative ${hasTagline ? 'mb-6 md:mb-8' : 'mb-10 md:mb-14'}`}>
              <img
                src={data.heroLogo}
                alt={data.title || 'Logo do evento'}
                className="relative mx-auto max-h-[140px] md:max-h-[220px] lg:max-h-[280px] xl:max-h-[320px] max-w-[85vw] md:max-w-[70vw] w-auto object-contain"
                style={data.logoShadow !== false ? {
                  filter: `drop-shadow(0 4px ${Math.round(10 + shadowI * 16)}px rgba(0,0,0,${shadowI})) drop-shadow(0 2px ${Math.round(4 + shadowI * 8)}px rgba(0,0,0,${shadowI * 0.6}))`
                } : undefined}
                fetchPriority="high"
              />
            </div>
          </div>
        ) : (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 md:mb-10 text-[hsl(var(--ds-color-title))] leading-[1.15] tracking-tight">
            {data.title}
          </h1>
        )}

        {/* Tagline (embaixo da logo) OU subtitle padrão */}
        {data.tagline?.trim() ? (
          <p className="text-lg md:text-xl lg:text-2xl mb-10 md:mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            {data.tagline}
          </p>
        ) : !hasLogo && data.subtitle ? (
          <p className="text-lg md:text-xl lg:text-2xl mb-10 md:mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        ) : null}

        {/* CTAs — sem mt extra, o mb da tagline/logo já faz o trabalho */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          {data.ctaPrimary && (
            <a
              href={applyUTMv2(safeUrl(data.ctaPrimary.link), lpKey)}
              className="w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 rounded-full font-bold text-base md:text-lg transition-transform duration-300 bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))] hover:scale-105 hover:shadow-[0_16px_32px_hsl(var(--ds-color-accent)/0.4)] shadow-[0_8px_16px_hsl(var(--ds-color-accent)/0.2)]"
            >
              {data.ctaPrimary.text}
            </a>
          )}
          {data.ctaSecondary && (
            <a
              href={applyUTMv2(safeUrl(data.ctaSecondary.link), lpKey)}
              className="w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 rounded-full font-bold text-base md:text-lg transition-transform duration-300 border-2 border-[hsl(var(--ds-color-accent))] text-[hsl(var(--ds-color-accent))] bg-transparent hover:bg-[hsl(var(--ds-color-accent)/0.1)] hover:scale-105"
            >
              {data.ctaSecondary.text}
            </a>
          )}
        </div>
      </div>

      <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
    </section>
  );
};

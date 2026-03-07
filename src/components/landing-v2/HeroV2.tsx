import { LPContent } from "@/lib/cms-v2/cms-types";
import { applyUTMv2 } from "@/lib/cms-v2/utm-v2";
import { SectionCTAV2 } from "./SectionCTAV2";

type HeroV2Props = {
  data: LPContent["hero"];
  lpKey: string;
  couponCode?: string;
};

const BG_POSITION: Record<string, string> = {
  top: 'bg-top',
  center: 'bg-center',
  bottom: 'bg-bottom',
};

export const HeroV2 = ({ data, lpKey, couponCode }: HeroV2Props) => {
  if (!data || data.enabled === false) return null;

  const posClass = BG_POSITION[data.imagePosition || 'center'] || 'bg-center';

  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-4 md:px-6 py-16 md:py-24 overflow-hidden">
      {data.imageDesktop && (
        <>
          <div className={`absolute inset-0 bg-cover ${posClass} hidden md:block`} style={{ backgroundImage: `url(${data.imageDesktop})` }} />
          {data.imageMobile && (<div className={`absolute inset-0 bg-cover ${posClass} md:hidden`} style={{ backgroundImage: `url(${data.imageMobile})` }} />)}
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/40 to-[hsl(var(--ds-color-bg))]/60 backdrop-blur-sm" />
        </>
      )}
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 text-[hsl(var(--ds-color-title))] leading-[1.1] tracking-tight">{data.title}</h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-10 md:mb-14 text-muted-foreground max-w-3xl mx-auto leading-relaxed">{data.subtitle}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-6 md:mt-10">
          {data.ctaPrimary && (<a href={applyUTMv2(data.ctaPrimary.link, lpKey)} className="w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 rounded-full font-bold text-base md:text-lg transition-all duration-300 bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))] hover:scale-105 hover:shadow-[0_16px_32px_hsl(var(--ds-color-accent)/0.4)] shadow-[0_8px_16px_hsl(var(--ds-color-accent)/0.2)]">{data.ctaPrimary.text}</a>)}
          {data.ctaSecondary && (<a href={applyUTMv2(data.ctaSecondary.link, lpKey)} className="w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 rounded-full font-bold text-base md:text-lg transition-all duration-300 border-2 border-[hsl(var(--ds-color-accent))] text-[hsl(var(--ds-color-accent))] bg-transparent hover:bg-[hsl(var(--ds-color-accent)/0.1)] hover:scale-105">{data.ctaSecondary.text}</a>)}
        </div>
      </div>
      <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
    </section>
  );
};

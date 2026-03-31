import { LPContent, ConversionSettings } from "@/lib/cms-v2/cms-types";
import { applyUTMv2, applyCoupon } from "@/lib/cms-v2/utm-v2";
import { renderRichText } from "@/lib/cms-v2/rich-text";
import { CountdownTimerV2 } from "./CountdownTimerV2";

type CTAFinalV2Props = {
  data: LPContent["ctaFinal"];
  lpKey: string;
  couponCode?: string;
  conversion?: ConversionSettings;
};


export const CTAFinalV2 = ({ data, lpKey, couponCode, conversion }: CTAFinalV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section id="ctaFinal" className="w-full py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Background Image */}
      {(data.imageDesktop || data.imageMobile) && (
        <div className="absolute inset-0 z-0">
          <picture>
            {data.imageDesktop && (
              <source media="(min-width: 768px)" srcSet={data.imageDesktop} />
            )}
            {data.imageMobile && (
              <source media="(max-width: 767px)" srcSet={data.imageMobile} />
            )}
            <img loading="lazy"
              src={data.imageDesktop || data.imageMobile}
              className="w-full h-full object-cover"
              alt="CTA Background"
            />
          </picture>
          {/* Overlay escuro para legibilidade */}
          <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]/40" />
        </div>
      )}

      <div className="max-w-4xl mx-auto text-center glass-card p-10 md:p-16 lg:p-20 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-[hsl(var(--ds-color-title))] leading-tight">
          {renderRichText(data.title)}
        </h2>

        <p className="mb-6 md:mb-8 text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {renderRichText(data.subtitle)}
        </p>

        {/* Countdown Timer */}
        {conversion?.countdown?.enabled && conversion.countdown.showInCtaFinal && (
          <div className="mb-8">
            <CountdownTimerV2 settings={conversion.countdown} lpKey={lpKey} />
          </div>
        )}

        <a
          href={applyCoupon(applyUTMv2(data.buttonLink, lpKey), couponCode)}
          className="inline-block w-full sm:w-auto px-12 md:px-16 py-4 md:py-6 rounded-full font-bold text-lg md:text-xl transition-all duration-300 bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))] hover:scale-105 hover:shadow-[0_16px_32px_hsl(var(--ds-color-accent)/0.4)] shadow-[0_8px_16px_hsl(var(--ds-color-accent)/0.2)]"
        >
          {data.buttonText}
        </a>

        {/* Trust Text */}
        {data.trustText && (
          <p className="mt-4 text-sm text-muted-foreground/70">
            {renderRichText(data.trustText)}
          </p>
        )}
      </div>
    </section>
  );
};

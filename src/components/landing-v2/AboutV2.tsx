import { LPContent } from "@/lib/cms-v2/cms-types";
import { SectionCTAV2 } from "./SectionCTAV2";

type AboutV2Props = {
  data: LPContent["about"];
  lpKey: string;
  couponCode?: string;
};

export const AboutV2 = ({ data, lpKey, couponCode }: AboutV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <p className="mb-12 md:mb-16 text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {data.text}
        </p>

        {(data.imageDesktop || data.imageMobile) && (
          <div className="w-full max-w-4xl mx-auto rounded-[var(--ds-radius)] aspect-video overflow-hidden glass-card flex items-center justify-center">
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
                alt="Sobre"
              />
            </picture>
          </div>
        )}

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

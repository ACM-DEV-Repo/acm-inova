import { LPContent } from "@/lib/cms-v2/cms-types";
import { SectionCTAV2 } from "./SectionCTAV2";
import { CircleX, CircleCheck } from "lucide-react";

type BeforeAfterV2Props = {
  data: LPContent["beforeAfter"];
  lpKey: string;
  couponCode?: string;
};

export const BeforeAfterV2 = ({ data, lpKey, couponCode }: BeforeAfterV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section className="w-full px-4 md:px-6 relative overflow-hidden">
      {/* Background Image opcional */}
      {(data.imageDesktop || data.imageMobile) && (
        <div className="absolute inset-0 -z-10 opacity-10">
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
              alt="Background"
            />
          </picture>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <p className="text-center mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {data.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-12 mt-6 md:mt-8">
          {data.images?.map((item, index) => (
            <div key={index} className="glass-card p-8 md:p-12 flex flex-col items-center hover:scale-[1.02] transition-transform duration-300">
              <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
                <div className="flex flex-col items-center">
                  <span className="inline-flex items-center gap-1.5 text-sm md:text-base mb-3 md:mb-4 font-bold text-foreground">
                    <CircleX size={16} className="text-red-400/70" />
                    Antes
                  </span>
                  <div className="w-full aspect-square rounded-[var(--ds-radius)] overflow-hidden glass-card flex items-center justify-center text-xs md:text-sm">
                    {item.before ? (
                      <img loading="lazy" src={item.before} className="w-full h-full object-cover" alt="Antes" />
                    ) : (
                      <span className="image-placeholder">Imagem Antes</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="inline-flex items-center gap-1.5 text-sm md:text-base mb-3 md:mb-4 font-bold text-foreground">
                    <CircleCheck size={16} className="text-[hsl(var(--ds-color-icon))]" />
                    Depois
                  </span>
                  <div className="w-full aspect-square rounded-[var(--ds-radius)] overflow-hidden glass-card flex items-center justify-center text-xs md:text-sm">
                    {item.after ? (
                      <img loading="lazy" src={item.after} className="w-full h-full object-cover" alt="Depois" />
                    ) : (
                      <span className="image-placeholder">Imagem Depois</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-8 text-center text-base text-muted-foreground leading-relaxed">
                {item.caption}
              </p>
            </div>
          ))}
        </div>

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

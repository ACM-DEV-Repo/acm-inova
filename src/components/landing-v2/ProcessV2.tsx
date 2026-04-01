import { LPContent } from "@/lib/cms-v2/cms-types";
import { SectionCTAV2 } from "./SectionCTAV2";
import { Calendar, MapPin, Sparkles, Camera } from "lucide-react";
import { resolveIcon } from "@/lib/cms-v2/iconResolver";

const fallbackIcons = [Calendar, MapPin, Sparkles, Camera];

type ProcessV2Props = {
  data: LPContent["process"];
  lpKey: string;
  couponCode?: string;
};

export const ProcessV2 = ({ data, lpKey, couponCode }: ProcessV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 md:mb-8 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <p className="text-center mb-12 md:mb-20 text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {data.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {data.steps?.map((step, index) => {
            const IconComp = step.icon
              ? resolveIcon(step.icon, fallbackIcons[index % fallbackIcons.length])
              : fallbackIcons[index % fallbackIcons.length];
            return (
            <div key={index} className="glass-card p-8 md:p-10 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <IconComp
                  size={24}
                  className="text-[hsl(var(--ds-color-icon))] flex-shrink-0"
                />
                <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                  {step.title}
                </h3>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
            );
          })}
        </div>

        {(data.imageDesktop || data.imageMobile) && (
          <div className="w-full max-w-5xl mx-auto mt-12 md:mt-20 rounded-[var(--ds-radius)] aspect-video overflow-hidden glass-card">
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
                alt="Processo"
              />
            </picture>
          </div>
        )}

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

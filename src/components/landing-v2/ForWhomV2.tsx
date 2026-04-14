import { LPContent } from "@/lib/cms-v2/cms-types";
import { Check } from "lucide-react";
import { SectionCTAV2 } from "./SectionCTAV2";

type ForWhomV2Props = {
  data: LPContent["forWhom"];
  lpKey: string;
  couponCode?: string;
};

export const ForWhomV2 = ({ data, lpKey, couponCode }: ForWhomV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section className="w-full px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            {(data.imageDesktop || data.imageMobile) && (
              <picture>
                {data.imageMobile && (
                  <source media="(max-width: 767px)" srcSet={data.imageMobile} />
                )}
                <img
                  src={data.imageDesktop || data.imageMobile}
                  alt={data.title}
                  loading="lazy"
                  className="w-full h-auto rounded-[var(--ds-radius)] glass-card object-cover aspect-[4/3] md:aspect-[4/3]"
                />
              </picture>
            )}
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--ds-color-title))] leading-tight">
              {data.title}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mt-6 md:mt-8 leading-relaxed">
              {data.subtitle}
            </p>

            <div className="space-y-4 md:space-y-6 mt-6 md:mt-8">
              {data.items?.map((item, index) => (
                <div key={index} className="flex items-start gap-4 md:gap-5">
                  <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center mt-0.5 bg-[hsl(var(--ds-color-icon))] shadow-[0_2px_8px_hsl(var(--ds-color-accent)/0.3)]">
                    <Check
                      className="w-4 h-4 md:w-5 md:h-5 text-[hsl(var(--ds-color-btn-text))] stroke-[3]"
                    />
                  </div>
                  <p className="text-base md:text-lg text-foreground leading-relaxed font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

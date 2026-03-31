import { LPContent } from "@/lib/cms-v2/cms-types";
import { SectionCTAV2 } from "./SectionCTAV2";
import { PhoneCall, CalendarCheck, Sparkles } from "lucide-react";
import { resolveIcon } from "@/lib/cms-v2/iconResolver";

const fallbackIcons = [PhoneCall, CalendarCheck, Sparkles];

/** Helper: extrai texto do step (string legado ou objeto novo) */
const getStepText = (step: string | { text: string; icon?: string }): string =>
  typeof step === 'string' ? step : step.text;
const getStepIcon = (step: string | { text: string; icon?: string }): string | undefined =>
  typeof step === 'string' ? undefined : step.icon;

type HowItWorksV2Props = {
  data: LPContent["howItWorks"];
  lpKey: string;
  couponCode?: string;
};

export const HowItWorksV2 = ({ data, lpKey, couponCode }: HowItWorksV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section id="howItWorks" className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
          {data.steps?.map((step, index) => {
            const iconName = getStepIcon(step);
            const IconComp = iconName
              ? resolveIcon(iconName, fallbackIcons[index % fallbackIcons.length])
              : fallbackIcons[index % fallbackIcons.length];
            const stepText = getStepText(step);
            return (
            <div key={index} className="glass-card p-8 md:p-10 text-center hover:scale-[1.02] transition-all duration-300">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[hsl(var(--ds-color-icon)/0.15)] border-2 border-[hsl(var(--ds-color-icon)/0.3)] flex items-center justify-center mx-auto mb-6">
                <IconComp size={32} className="text-[hsl(var(--ds-color-icon))]" />
              </div>
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                <span className="font-bold text-[hsl(var(--ds-color-icon))]">{index + 1}</span>
                <span className="mx-2 text-muted-foreground">&mdash;</span>
                {stepText}
              </p>
            </div>
            );
          })}
        </div>

        {(data.imageDesktop || data.imageMobile) && (
          <div className="w-full max-w-5xl mx-auto mt-12 md:mt-20 rounded-[var(--ds-radius)] aspect-video flex items-center justify-center overflow-hidden glass-card">
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
                alt="Como funciona"
              />
            </picture>
          </div>
        )}

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

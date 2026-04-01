import { LPContent } from "@/lib/cms-v2/cms-types";
import { Check } from "lucide-react";
import { SectionCTAV2 } from "./SectionCTAV2";

type ServicesV2Props = {
  data: LPContent["services"];
  lpKey: string;
  couponCode?: string;
};

export const ServicesV2 = ({ data, lpKey, couponCode }: ServicesV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {data.items?.map((item, index) =>
            item.enabled !== false ? (
              <li key={index} className="glass-card px-6 md:px-8 py-5 md:py-6 flex items-start gap-4 hover:scale-[1.02] transition-transform duration-300">
                <div className="w-6 h-6 rounded-full bg-[hsl(var(--ds-color-icon))] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-[hsl(var(--ds-color-btn-text))] stroke-[3]" />
                </div>
                <span className="text-base md:text-lg text-foreground leading-relaxed">{item.text}</span>
              </li>
            ) : null,
          )}
        </ul>

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

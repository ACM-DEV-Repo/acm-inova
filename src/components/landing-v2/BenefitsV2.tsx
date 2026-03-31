import { LPContent } from "@/lib/cms-v2/cms-types";
import { SectionCTAV2 } from "./SectionCTAV2";
import { IconBadgeV2 } from "./IconBadgeV2";
import { Home, Leaf, Users, Clock, Shield, Sparkles } from "lucide-react";
import { resolveIcon } from "@/lib/cms-v2/iconResolver";

const fallbackIcons = [Home, Leaf, Users, Clock, Shield, Sparkles];

type BenefitsV2Props = {
  data: LPContent["benefits"];
  lpKey: string;
  couponCode?: string;
};

export const BenefitsV2 = ({ data, lpKey, couponCode }: BenefitsV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section id="benefits" className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.items?.map((item, index) => {
            const IconComp = item.icon
              ? resolveIcon(item.icon, fallbackIcons[index % fallbackIcons.length])
              : fallbackIcons[index % fallbackIcons.length];
            return (
            <div key={index} className="glass-card p-8 md:p-10 text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <IconBadgeV2 icon={IconComp} />
              </div>
              {item.image && (
                <img
                  loading="lazy"
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 md:h-56 object-cover rounded-[var(--ds-radius)] mb-6"
                />
              )}
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground leading-tight">
                {item.title}
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
            );
          })}
        </div>

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

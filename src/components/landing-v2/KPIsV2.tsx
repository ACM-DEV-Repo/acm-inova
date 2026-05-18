import { LPContent } from "@/lib/cms-v2/cms-types";
import { SectionCTAV2 } from "./SectionCTAV2";
import { IconBadgeV2 } from "./IconBadgeV2";
import { Users, Wrench, Star } from "lucide-react";
import { resolveIcon } from "@/lib/cms-v2/iconResolver";

const fallbackIcons = [Users, Wrench, Star];

type KPIsV2Props = {
  data: LPContent["kpis"];
  lpKey: string;
  couponCode?: string;
};

export const KPIsV2 = ({ data, lpKey, couponCode }: KPIsV2Props) => {
  if (!data || data.enabled === false) return null;
  if (!data.items || data.items.length === 0) return null;

  const enabledKpis = data.items.filter((k) => k.enabled);
  if (enabledKpis.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {enabledKpis.map((kpi, idx) => {
            const IconComp = kpi.icon
              ? resolveIcon(kpi.icon, fallbackIcons[idx % fallbackIcons.length])
              : fallbackIcons[idx % fallbackIcons.length];
            return (
            <div key={idx} className="text-center glass-card p-10 md:p-14 hover:scale-[1.03] transition-transform duration-300 w-full md:w-[calc(33.33%-28px)]">
              <div className="flex justify-center mb-5">
                <IconBadgeV2 icon={IconComp} size="lg" />
              </div>
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-[hsl(var(--ds-color-accent))] mb-4 md:mb-6">
                {kpi.value}
              </p>
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-3">
                {kpi.label}
              </p>
              {kpi.description && (
                <p className="text-sm md:text-base mt-3 text-muted-foreground leading-relaxed">
                  {kpi.description}
                </p>
              )}
            </div>
            );
          })}
        </div>

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

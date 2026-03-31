import { LPContent, ConversionSettings } from "@/lib/cms-v2/cms-types";
import { applyUTMv2, applyCoupon } from "@/lib/cms-v2/utm-v2";
import { resolveIcon } from "@/lib/cms-v2/iconResolver";
import { Check, Package } from "lucide-react";
import { SectionCTAV2 } from "./SectionCTAV2";
import { CountdownTimerV2 } from "./CountdownTimerV2";

type PlansV2Props = {
  data: LPContent["plans"];
  lpKey: string;
  couponCode?: string;
  conversion?: ConversionSettings;
};


export const PlansV2 = ({ data, lpKey, couponCode, conversion }: PlansV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section id="plans" className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        {/* Countdown Timer */}
        {conversion?.countdown?.enabled && conversion.countdown.showInPlans && (
          <CountdownTimerV2 settings={conversion.countdown} lpKey={lpKey} />
        )}

        <div className={`grid grid-cols-1 gap-6 md:gap-8 mt-8 md:mt-12 ${
          (() => {
            const count = data.items?.length ?? 0;
            if (count === 1) return 'md:grid-cols-1 max-w-sm mx-auto';
            if (count === 2) return 'md:grid-cols-2 max-w-3xl mx-auto';
            if (count === 3) return 'md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto';
            return 'md:grid-cols-2 lg:grid-cols-4';
          })()
        }`}>
          {data.items?.map((plan) => {
            const IconComponent = resolveIcon(plan.icon, Package);

              return (
              <div key={plan.id} className={`glass-card p-8 md:p-10 flex flex-col hover:scale-[1.02] transition-transform duration-300 relative ${plan.recommended ? 'ring-2 ring-[hsl(var(--ds-color-accent))] shadow-[0_0_30px_hsl(var(--ds-color-accent)/0.3)] scale-[1.02]' : ''}`}>
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-semibold bg-[hsl(var(--ds-color-accent))] text-[hsl(var(--ds-color-btn-text))]">
                    Recomendado
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0 bg-[hsl(var(--ds-color-accent)/0.1)] border-[hsl(var(--ds-color-accent)/0.3)]"
                  >
                    <IconComponent
                      size={24}
                      className="text-[hsl(var(--ds-color-icon))]"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                </div>

                <p className="text-sm mb-6 text-muted-foreground">
                  {plan.frequency}
                </p>

                {plan.originalPrice && (
                  <p className={`text-base mb-1 text-muted-foreground ${plan.showStrikethrough ? 'line-through' : ''}`}>
                    {plan.originalPrice}
                  </p>
                )}

                <p className="text-4xl font-bold mb-2 text-[hsl(var(--ds-color-accent))]">
                  {plan.price}
                </p>

                {plan.discount && (
                  <p className="text-sm mb-2 font-semibold text-[hsl(var(--ds-color-accent))]">
                    {plan.discount}
                  </p>
                )}

                {plan.supportText && (
                  <p className="text-sm mb-6 text-muted-foreground leading-relaxed">
                    {plan.supportText}
                  </p>
                )}

                {plan.features && plan.features.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check
                          size={16}
                          className="mt-0.5 flex-shrink-0 text-[hsl(var(--ds-color-icon))]"
                        />
                        <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex-grow" />

                <a
                  href={applyCoupon(applyUTMv2(plan.link, lpKey), couponCode)}
                  className="w-full text-center py-4 font-semibold text-base transition-transform duration-300 mt-6 rounded-full bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_hsl(var(--ds-color-accent)/0.4)]"
                >
                  {plan.ctaText || 'Assinar'}
                </a>
              </div>
            );
          })}
        </div>

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

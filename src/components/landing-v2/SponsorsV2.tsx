import { memo } from 'react';
import { LPContent } from '@/lib/cms-v2/cms-types';
import { renderRichText } from '@/lib/cms-v2/rich-text';
import { SectionCTAV2 } from './SectionCTAV2';

type Props = {
  data: LPContent['sponsors'];
  lpKey: string;
  couponCode?: string;
};

const LOGO_HEIGHTS: Record<string, string> = {
  sm: 'h-12',   // 48px
  md: 'h-20',   // 80px
  lg: 'h-[120px]',
};

const LOGO_PADDING: Record<string, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const GRID_COLS: Record<string, string> = {
  sm: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
  md: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  lg: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
};

export const SponsorsV2 = memo(({ data, lpKey, couponCode }: Props) => {
  if (!data || data.enabled === false) return null;

  const activeTiers = (data.tiers || []).filter(
    (tier) => tier.enabled && tier.items && tier.items.length > 0
  );
  if (activeTiers.length === 0) return null;

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(data.title || data.subtitle) && (
          <div className="text-center mb-12 md:mb-20">
            {data.title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--ds-color-title))]">
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className="text-muted-foreground text-lg md:text-xl mt-4 max-w-3xl mx-auto">
                {renderRichText(data.subtitle)}
              </p>
            )}
          </div>
        )}

        {/* Tiers */}
        <div className="space-y-12 md:space-y-16">
          {activeTiers.map((tier, tierIndex) => {
            const logoHeight = tier.logoHeight || 'md';
            const tierColor = tier.color || '';
            const hasColor = tierColor.length > 0;

            return (
              <div key={`tier-${tierIndex}`}>
                {/* Separador entre tiers (não no primeiro) */}
                {tierIndex > 0 && (
                  <div className="border-t border-[hsl(var(--ds-border-color))]/30 mb-10 md:mb-14" />
                )}

                {/* Tier heading */}
                <div className="text-center mb-8 md:mb-12">
                  <h3
                    className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wide uppercase"
                    style={hasColor ? { color: tierColor } : undefined}
                  >
                    {!hasColor && (
                      <span className="text-foreground">{tier.name}</span>
                    )}
                    {hasColor && tier.name}
                  </h3>
                </div>

                {/* Logos grid */}
                <div className={`grid gap-4 md:gap-6 ${GRID_COLS[logoHeight]}`}>
                  {tier.items.map((sponsor, sponsorIndex) => {
                    const cardContent = (
                      <div
                        className={`glass-card flex items-center justify-center transition-transform duration-300 hover:scale-[1.03] ${LOGO_PADDING[logoHeight]} ${
                          hasColor
                            ? 'ring-1 ring-opacity-40'
                            : ''
                        }`}
                        style={
                          hasColor
                            ? {
                                boxShadow: `0 0 20px ${tierColor}20, 0 0 40px ${tierColor}10`,
                                borderColor: `${tierColor}40`,
                              }
                            : undefined
                        }
                      >
                        {sponsor.logo ? (
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name || 'Patrocinador'}
                            className={`${LOGO_HEIGHTS[logoHeight]} w-auto max-w-full object-contain`}
                            loading="lazy"
                          />
                        ) : (
                          <div className={`${LOGO_HEIGHTS[logoHeight]} flex items-center justify-center text-muted-foreground text-sm`}>
                            {sponsor.name || 'Logo'}
                          </div>
                        )}
                      </div>
                    );

                    // Se tiver URL, card vira link
                    if (sponsor.url) {
                      return (
                        <a
                          key={`sponsor-${tierIndex}-${sponsorIndex}`}
                          href={sponsor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:opacity-90 transition-opacity"
                        >
                          {cardContent}
                        </a>
                      );
                    }

                    return (
                      <div key={`sponsor-${tierIndex}-${sponsorIndex}`}>
                        {cardContent}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
});

SponsorsV2.displayName = 'SponsorsV2';

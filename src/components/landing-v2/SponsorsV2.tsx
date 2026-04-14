import type { CSSProperties } from 'react';
import { memo } from 'react';
import { LPContent } from '@/lib/cms-v2/cms-types';
import { renderRichText } from '@/lib/cms-v2/rich-text';
import { safeUrl } from '@/lib/cms-v2/safe-url';
import { resolveIcon } from '@/lib/cms-v2/iconResolver';
import { SectionCTAV2 } from './SectionCTAV2';

type Props = {
  data: LPContent['sponsors'];
  lpKey: string;
  couponCode?: string;
};

const LOGO_HEIGHTS: Record<string, string> = {
  sm: 'h-12',
  md: 'h-20',
  lg: 'h-28',
};

const CARD_MIN_HEIGHTS: Record<string, string> = {
  sm: 'min-h-[80px]',
  md: 'min-h-[120px]',
  lg: 'min-h-[160px]',
};

const LOGO_PADDING: Record<string, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/** Grid com colunas fixas + justify-content:center = itens orfaos centralizam */
const GRID_STYLE: Record<string, CSSProperties> = {
  sm: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 160px))', justifyContent: 'center', gap: '1rem' },
  md: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 280px))', justifyContent: 'center', gap: '1.5rem' },
  lg: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 340px))', justifyContent: 'center', gap: '1.5rem' },
};

const getInitials = (name: string) => {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
};

export const SponsorsV2 = memo(({ data, lpKey, couponCode }: Props) => {
  if (!data || data.enabled === false) return null;

  const activeTiers = (data.tiers || []).filter(
    (tier) => tier.enabled && tier.items && tier.items.length > 0
  );
  if (activeTiers.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(data.title || data.subtitle) && (
          <div className="text-center">
            {data.title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--ds-color-title))]">
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className="text-muted-foreground text-lg md:text-xl mt-6 md:mt-8 max-w-3xl mx-auto">
                {renderRichText(data.subtitle)}
              </p>
            )}
          </div>
        )}

        {/* Tiers */}
        <div className="space-y-12 md:space-y-16 mt-6 md:mt-8">
          {activeTiers.map((tier, tierIndex) => {
            const logoHeight = tier.logoHeight || 'md';
            const tierColor = tier.color || '';
            const hasColor = tierColor.length > 0;
            const safeLogoHeight = LOGO_HEIGHTS[logoHeight] || LOGO_HEIGHTS['md'];
            const safeCardMinH = CARD_MIN_HEIGHTS[logoHeight] || CARD_MIN_HEIGHTS['md'];
            const safePadding = LOGO_PADDING[logoHeight] || LOGO_PADDING['md'];
            const safeGridStyle = GRID_STYLE[logoHeight] || GRID_STYLE['md'];

            return (
              <div key={`tier-${tierIndex}`}>
                {/* Separador entre tiers */}
                {tierIndex > 0 && (
                  <div className="border-t border-[hsl(var(--ds-border-color)/var(--ds-border-opacity))] mb-10 md:mb-14" />
                )}

                {/* Tier heading com linha decorativa */}
                <div className="text-center mb-8 md:mb-12">
                  <h3
                    className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wide uppercase flex items-center justify-center gap-3"
                    style={hasColor ? { color: tierColor } : undefined}
                  >
                    {tier.icon && (() => {
                      const TierIcon = resolveIcon(tier.icon);
                      return <TierIcon className="h-6 w-6 md:h-7 md:w-7 shrink-0" />;
                    })()}
                    {!hasColor && (
                      <span className="text-foreground">{tier.name}</span>
                    )}
                    {hasColor && tier.name}
                  </h3>
                  {hasColor && (
                    <div
                      className="w-16 h-0.5 mx-auto mt-3 rounded-full"
                      style={{ backgroundColor: tierColor }}
                    />
                  )}
                </div>

                {/* Logos grid */}
                <div style={safeGridStyle}>
                  {tier.items.map((sponsor, sponsorIndex) => {
                    const cardContent = (
                      <div
                        className={`glass-card flex flex-col items-center justify-center transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl ${safePadding} ${safeCardMinH}`}
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
                            className={`${safeLogoHeight} w-auto max-w-[80%] object-contain`}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className={`${safeLogoHeight} aspect-square rounded-full flex items-center justify-center text-lg font-bold`}
                            style={{
                              backgroundColor: hasColor ? `${tierColor}15` : 'hsl(var(--ds-color-accent) / 0.1)',
                              color: hasColor ? tierColor : 'hsl(var(--ds-color-accent))',
                            }}
                          >
                            {sponsor.name ? getInitials(sponsor.name) : '?'}
                          </div>
                        )}
                        {sponsor.name && (
                          <span className="text-xs text-muted-foreground mt-2 text-center line-clamp-1">
                            {sponsor.name}
                          </span>
                        )}
                      </div>
                    );

                    const cleanUrl = safeUrl(sponsor.url);
                    if (cleanUrl) {
                      return (
                        <a
                          key={`sponsor-${tierIndex}-${sponsorIndex}`}
                          href={cleanUrl}
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

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
});

SponsorsV2.displayName = 'SponsorsV2';

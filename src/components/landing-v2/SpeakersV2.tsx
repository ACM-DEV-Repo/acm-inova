import { memo } from 'react';
import { LPContent } from '@/lib/cms-v2/cms-types';
import { renderRichText } from '@/lib/cms-v2/rich-text';
import { SectionCTAV2 } from './SectionCTAV2';
import { Instagram, Linkedin, Globe } from 'lucide-react';

type Props = {
  data: LPContent['speakers'];
  lpKey: string;
  couponCode?: string;
};

const SpeakerCard = memo(({
  speaker,
  isFeatured,
}: {
  speaker: Props['data']['items'][number];
  isFeatured?: boolean;
}) => {
  const hasSocials = speaker.socials?.instagram || speaker.socials?.linkedin || speaker.socials?.website;

  return (
    <div
      className={`glass-card overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-lg hover:shadow-[hsl(var(--ds-color-accent))]/10 ${
        isFeatured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Foto */}
      {speaker.image && (
        <div className="relative overflow-hidden">
          <div className={`${isFeatured ? 'aspect-[4/3]' : 'aspect-square'}`}>
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
          {/* Gradient overlay na parte inferior da foto */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Conteudo */}
      <div className={`flex flex-col flex-1 ${isFeatured ? 'p-8 md:p-10' : 'p-6 md:p-8'}`}>
        {/* Nome */}
        <h3
          className={`font-bold text-foreground leading-tight ${
            isFeatured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          }`}
        >
          {speaker.name}
        </h3>

        {/* Cargo */}
        {speaker.role && (
          <p className="text-[hsl(var(--ds-color-accent))] font-semibold text-sm md:text-base mt-1.5">
            {speaker.role}
          </p>
        )}

        {/* Bio */}
        {speaker.bio && (
          <div
            className={`text-muted-foreground leading-relaxed mt-4 flex-1 ${
              isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-base'
            }`}
          >
            {renderRichText(speaker.bio)}
          </div>
        )}

        {/* Socials */}
        {hasSocials && (
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[hsl(var(--ds-border-color))]/30">
            {speaker.socials?.instagram && (
              <a
                href={speaker.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-[hsl(var(--ds-color-accent))] hover:bg-[hsl(var(--ds-color-accent))]/10 transition-transform duration-200"
                aria-label={`Instagram de ${speaker.name}`}
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {speaker.socials?.linkedin && (
              <a
                href={speaker.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-[hsl(var(--ds-color-accent))] hover:bg-[hsl(var(--ds-color-accent))]/10 transition-transform duration-200"
                aria-label={`LinkedIn de ${speaker.name}`}
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {speaker.socials?.website && (
              <a
                href={speaker.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-[hsl(var(--ds-color-accent))] hover:bg-[hsl(var(--ds-color-accent))]/10 transition-transform duration-200"
                aria-label={`Website de ${speaker.name}`}
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

SpeakerCard.displayName = 'SpeakerCard';

export const SpeakersV2 = memo(({ data, lpKey, couponCode }: Props) => {
  if (!data || data.enabled === false) return null;
  if (!data.items || data.items.length === 0) return null;

  const isFeaturedLayout = data.layout === 'featured';

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

        {/* Grid */}
        <div
          className={`flex flex-wrap justify-center gap-6 md:gap-8`}
        >
          {data.items.map((speaker, index) => (
            <div key={`speaker-${index}`} className={
              isFeaturedLayout
                ? 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]'
                : 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] xl:w-[calc(25%-18px)]'
            }>
              <SpeakerCard
                speaker={speaker}
                isFeatured={isFeaturedLayout && index === 0}
              />
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
});

SpeakersV2.displayName = 'SpeakersV2';

import { memo, useState } from 'react';
import { LPContent } from '@/lib/cms-v2/cms-types';
import { renderRichText } from '@/lib/cms-v2/rich-text';
import { SectionCTAV2 } from './SectionCTAV2';
import { Clock, MapPin, User } from 'lucide-react';

type Props = {
  data: LPContent['schedule'];
  lpKey: string;
  couponCode?: string;
};

export const ScheduleV2 = memo(({ data, lpKey, couponCode }: Props) => {
  if (!data || data.enabled === false) return null;
  if (!data.days || data.days.length === 0) return null;

  const [activeDay, setActiveDay] = useState(0);
  const currentDay = data.days[activeDay];

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
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

        {/* Tabs por dia */}
        {data.days.length > 1 && (
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {data.days.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setActiveDay(idx)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-transform duration-300 ${
                  activeDay === idx
                    ? 'bg-[hsl(var(--ds-color-accent))] text-[hsl(var(--ds-color-btn-text))] shadow-lg shadow-[hsl(var(--ds-color-accent))]/25'
                    : 'glass-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="block">{day.label}</span>
                {day.date && (
                  <span className={`block text-xs mt-0.5 ${
                    activeDay === idx ? 'opacity-80' : 'opacity-60'
                  }`}>
                    {day.date}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Timeline do dia ativo */}
        {currentDay && (
          <div className="space-y-4">
            {currentDay.items.map((item, idx) => (
              <div
                key={`${currentDay.id}-${idx}`}
                className="glass-card p-6 md:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-transform duration-300 hover:shadow-lg hover:shadow-[hsl(var(--ds-color-accent))]/5"
              >
                {/* Horario */}
                {item.time && (
                  <div className="flex items-center gap-2 sm:min-w-[100px] shrink-0">
                    <Clock className="h-4 w-4 text-[hsl(var(--ds-color-accent))]" />
                    <span className="text-lg font-bold text-[hsl(var(--ds-color-accent))]">
                      {item.time}
                    </span>
                  </div>
                )}

                {/* Conteudo */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-foreground leading-tight">
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {item.speaker && (
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        {item.speaker}
                      </span>
                    )}
                    {item.location && (
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
});

ScheduleV2.displayName = 'ScheduleV2';

import { memo, useState } from 'react';
import { LPContent } from '@/lib/cms-v2/cms-types';
import { renderRichText } from '@/lib/cms-v2/rich-text';
import { SectionCTAV2 } from './SectionCTAV2';
import { Clock, MapPin, User, Coffee } from 'lucide-react';

type Props = {
  data: LPContent['schedule'];
  lpKey: string;
  couponCode?: string;
};

const isBreakItem = (title: string) => {
  const lower = title.toLowerCase();
  return lower.includes('coffee') || lower.includes('intervalo') || lower.includes('break')
    || lower.includes('almoço') || lower.includes('almoco') || lower.includes('lanche');
};

export const ScheduleV2 = memo(({ data, lpKey, couponCode }: Props) => {
  if (!data || data.enabled === false) return null;
  if (!data.days || data.days.length === 0) return null;

  const [activeDay, setActiveDay] = useState(0);
  const currentDay = data.days[activeDay];

  return (
    <section className="w-full px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
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

        {/* Tabs por dia */}
        {data.days.length > 1 && (
          <div className="flex justify-center gap-2 mt-6 md:mt-8 flex-wrap" role="tablist" aria-label="Dias do evento">
            {data.days.map((day, idx) => (
              <button
                key={day.id}
                role="tab"
                aria-selected={activeDay === idx}
                onClick={() => setActiveDay(idx)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-[transform,box-shadow] duration-300 ${
                  activeDay === idx
                    ? 'bg-[hsl(var(--ds-color-accent))] text-[hsl(var(--ds-color-btn-text))] shadow-lg shadow-[hsl(var(--ds-color-accent))]/25 ring-2 ring-[hsl(var(--ds-color-accent))]/50'
                    : 'glass-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {day.date && (
                  <span className={`block text-xs ${
                    activeDay === idx ? 'opacity-80' : 'opacity-60'
                  }`}>
                    {day.date}
                  </span>
                )}
                <span className="block font-bold">{day.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timeline do dia ativo */}
        {currentDay && (
          <div className="space-y-3 mt-6 md:mt-8">
            {currentDay.items.map((item, idx) => {
              const isBreak = isBreakItem(item.title);

              if (isBreak) {
                return (
                  <div
                    key={`${currentDay.id}-${idx}`}
                    className="glass-effect rounded-[var(--ds-radius)] p-3 md:p-4 flex items-center justify-center gap-3 text-muted-foreground"
                  >
                    <Coffee className="h-4 w-4 text-[hsl(var(--ds-color-accent))]" />
                    {item.time && (
                      <span className="text-sm font-semibold text-[hsl(var(--ds-color-accent))]">{item.time}</span>
                    )}
                    <span className="text-sm">{item.title}</span>
                  </div>
                );
              }

              return (
                <div
                  key={`${currentDay.id}-${idx}`}
                  className="glass-card p-5 md:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[hsl(var(--ds-color-accent))]/5"
                >
                  {/* Horário */}
                  {item.time && (
                    <div className="flex items-center gap-2 sm:min-w-[100px] shrink-0">
                      <Clock className="h-4 w-4 text-[hsl(var(--ds-color-accent))]" />
                      <span className="text-lg font-bold text-[hsl(var(--ds-color-accent))]">
                        {item.time}
                      </span>
                    </div>
                  )}

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-foreground leading-tight">
                      {item.title}
                    </h4>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {item.speaker && (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <div className="w-6 h-6 rounded-full bg-[hsl(var(--ds-color-accent)/0.15)] flex items-center justify-center">
                            <User className="h-3 w-3 text-[hsl(var(--ds-color-accent))]" />
                          </div>
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
              );
            })}
          </div>
        )}

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
});

ScheduleV2.displayName = 'ScheduleV2';

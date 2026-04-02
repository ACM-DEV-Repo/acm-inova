import { useState, useEffect, useCallback, memo } from 'react';
import type { CountdownSettings } from '@/lib/cms-v2/cms-types';

interface CountdownTimerV2Props {
  settings: CountdownSettings;
  lpKey: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const COOKIE_PREFIX = 'lp_countdown_';

/** Limpa entradas antigas do mesmo lpKey/modo que não batem com a config atual */
const cleanOldKeys = (lpKey: string, currentKey: string, modePrefix: string) => {
  try {
    const prefix = `${COOKIE_PREFIX}${lpKey}_${modePrefix}`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix) && k !== currentKey) {
        localStorage.removeItem(k);
      }
    }
  } catch { /* ignore */ }
};

const getEvergreenDeadline = (lpKey: string, hours: number): number => {
  const key = `${COOKIE_PREFIX}${lpKey}_eg_${hours}h`;
  cleanOldKeys(lpKey, key, 'eg');
  const stored = localStorage.getItem(key);
  if (stored) {
    const deadline = parseInt(stored, 10);
    if (!isNaN(deadline)) return deadline;
  }
  const deadline = Date.now() + hours * 60 * 60 * 1000;
  localStorage.setItem(key, deadline.toString());
  return deadline;
};

/**
 * Round Hour mode: calcula a proxima hora cheia N horas a frente.
 * Ex: visitante entra 15:37, roundHourAhead=2 → deadline = 17:00:00
 * Usa localStorage para manter consistente durante a visita.
 */
const getRoundHourDeadline = (lpKey: string, hoursAhead: number): number => {
  const key = `${COOKIE_PREFIX}${lpKey}_rh_${hoursAhead}h`;
  cleanOldKeys(lpKey, key, 'rh');
  const stored = localStorage.getItem(key);
  if (stored) {
    const deadline = parseInt(stored, 10);
    if (!isNaN(deadline)) return deadline;
  }

  const now = new Date();
  const target = new Date(now);
  target.setMinutes(0, 0, 0);
  target.setHours(target.getHours() + hoursAhead);

  const deadline = target.getTime();
  localStorage.setItem(key, deadline.toString());
  return deadline;
};

const calcTimeLeft = (deadline: number): TimeLeft | null => {
  const diff = deadline - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const pad = (n: number) => n.toString().padStart(2, '0');

export const CountdownTimerV2 = memo(({ settings, lpKey }: CountdownTimerV2Props) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [expired, setExpired] = useState(false);

  const getDeadline = useCallback((): number => {
    if (settings.mode === 'deadline' && settings.deadline) {
      return new Date(settings.deadline).getTime();
    }
    if (settings.mode === 'roundHour') {
      return getRoundHourDeadline(lpKey, settings.roundHourAhead || 2);
    }
    return getEvergreenDeadline(lpKey, settings.evergreenHours || 24);
  }, [settings.mode, settings.deadline, settings.evergreenHours, settings.roundHourAhead, lpKey]);

  useEffect(() => {
    if (!settings.enabled) return;

    const deadline = getDeadline();

    const tick = () => {
      const tl = calcTimeLeft(deadline);
      if (!tl) {
        setExpired(true);
        setTimeLeft(null);
      } else {
        setTimeLeft(tl);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [getDeadline, settings.enabled]);

  if (!settings.enabled) return null;

  if (expired) {
    if (settings.expiredText) {
      return (
        <div className="w-full text-center py-3">
          <p className="text-sm text-muted-foreground font-medium">{settings.expiredText}</p>
        </div>
      );
    }
    return null;
  }

  if (!timeLeft) return null;

  // Urgency color system
  const uc = settings.urgencyColor || undefined;
  const labelStyle = uc ? { color: uc } : undefined;
  const labelClass = uc ? '' : 'text-[hsl(var(--ds-color-accent))]';
  const boxStyle = uc
    ? { backgroundColor: `${uc}20`, borderColor: `${uc}55`, boxShadow: `0 0 20px ${uc}30, inset 0 1px 0 ${uc}15` }
    : undefined;
  const boxClass = uc
    ? ''
    : 'bg-[hsl(var(--ds-color-accent)/0.12)] border-[hsl(var(--ds-color-accent)/0.35)] shadow-[0_0_20px_hsl(var(--ds-color-accent)/0.15)]';
  const separatorStyle = uc ? { color: uc } : undefined;
  const separatorClass = uc ? '' : 'text-[hsl(var(--ds-color-accent))]';

  return (
    <div className="w-full flex flex-col items-center gap-4 py-6">
      {/* Label — grande, bold, grita urgencia */}
      {settings.label && (
        <p
          className={`text-base md:text-lg font-extrabold uppercase tracking-[0.15em] ${labelClass}`}
          style={labelStyle}
        >
          {settings.label}
        </p>
      )}

      {/* Timer boxes */}
      <div className="flex items-center gap-3 md:gap-4">
        {timeLeft.days > 0 && (
          <>
            <TimerUnit value={timeLeft.days} label="Dias" boxStyle={boxStyle} boxClass={boxClass} />
            <span className={`text-3xl md:text-4xl font-black -mt-4 opacity-60 ${separatorClass}`} style={separatorStyle}>:</span>
          </>
        )}
        <TimerUnit value={timeLeft.hours} label="Horas" boxStyle={boxStyle} boxClass={boxClass} />
        <span className={`text-3xl md:text-4xl font-black -mt-4 opacity-60 ${separatorClass}`} style={separatorStyle}>:</span>
        <TimerUnit value={timeLeft.minutes} label="Min" boxStyle={boxStyle} boxClass={boxClass} />
        <span className={`text-3xl md:text-4xl font-black -mt-4 opacity-60 ${separatorClass}`} style={separatorStyle}>:</span>
        <TimerUnit value={timeLeft.seconds} label="Seg" boxStyle={boxStyle} boxClass={boxClass} isSeconds />
      </div>
    </div>
  );
});

CountdownTimerV2.displayName = 'CountdownTimerV2';

const TimerUnit = ({ value, label, boxStyle, boxClass, isSeconds }: {
  value: number;
  label: string;
  boxStyle?: React.CSSProperties;
  boxClass: string;
  isSeconds?: boolean;
}) => (
  <div className="flex flex-col items-center">
    <span
      className={`text-3xl md:text-5xl font-black text-foreground tabular-nums rounded-xl px-4 md:px-5 py-2.5 md:py-3 min-w-[3.5rem] md:min-w-[4.5rem] text-center border-2 ${boxClass} ${isSeconds ? 'animate-[pulse_1s_ease-in-out_infinite]' : ''}`}
      style={boxStyle}
    >
      {pad(value)}
    </span>
    <span className="text-[10px] md:text-xs text-muted-foreground mt-1.5 uppercase tracking-[0.2em] font-bold">
      {label}
    </span>
  </div>
);

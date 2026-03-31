import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { SocialProofSettings } from '@/lib/cms-v2/cms-types';

interface SocialProofToastV2Props {
  data?: SocialProofSettings;
  lpKey: string;
}

const SESSION_KEY_PREFIX = 'lp_social_count_';

export const SocialProofToastV2 = memo(({ data, lpKey }: SocialProofToastV2Props) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(0);
  const hideTimeoutsRef = useRef<number[]>([]);

  const maxPerVisit = data?.maxPerVisit || 5;
  const interval = (data?.intervalSeconds || 20) * 1000;
  const position = data?.position || 'bottom-left';
  const toastDuration = (data?.toastDuration || 4) * 1000;

  const getShownCount = useCallback((): number => {
    const key = `${SESSION_KEY_PREFIX}${lpKey}`;
    const stored = sessionStorage.getItem(key);
    return stored ? parseInt(stored, 10) : 0;
  }, [lpKey]);

  const incrementShown = useCallback(() => {
    const key = `${SESSION_KEY_PREFIX}${lpKey}`;
    const current = getShownCount() + 1;
    sessionStorage.setItem(key, current.toString());
    return current;
  }, [lpKey, getShownCount]);

  useEffect(() => {
    if (!data?.enabled || !data.items || data.items.length === 0) return;

    const initialShown = getShownCount();
    setShown(initialShown);

    if (initialShown >= maxPerVisit) return;

    let itemIndex = 0;

    const showNext = () => {
      setCurrentIndex(itemIndex % data.items.length);
      setVisible(true);

      // Hide after toastDuration — track the timeout for cleanup
      const hideTimeout = window.setTimeout(() => {
        setVisible(false);
      }, toastDuration);
      hideTimeoutsRef.current.push(hideTimeout);

      itemIndex++;
      const newCount = incrementShown();
      setShown(newCount);

      if (newCount >= maxPerVisit) {
        clearInterval(timer);
      }
    };

    // First toast after initial delay (half interval)
    const initialDelay = window.setTimeout(() => {
      showNext();
    }, interval / 2);

    // Subsequent toasts at interval
    const timer = window.setInterval(() => {
      showNext();
    }, interval);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(timer);
      // Cleanup all pending hide timeouts
      hideTimeoutsRef.current.forEach((t) => clearTimeout(t));
      hideTimeoutsRef.current = [];
    };
  }, [data, maxPerVisit, interval, toastDuration, getShownCount, incrementShown]);

  if (!data?.enabled || !data.items || data.items.length === 0) return null;
  if (shown >= maxPerVisit && !visible) return null;
  if (currentIndex < 0) return null;

  const item = data.items[currentIndex % data.items.length];
  if (!item) return null;

  return (
    <div
      className={`fixed z-40 pointer-events-none ${
        position === 'bottom-left' ? 'bottom-6 left-4' : 'bottom-6 right-4'
      }`}
    >
      <div
        className={`pointer-events-auto transition-transform duration-500 ease-out ${
          visible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="flex items-center gap-3 bg-background border border-border/50 rounded-xl shadow-lg px-4 py-3 max-w-xs backdrop-blur-md">
          <div className="shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--ds-color-accent)/0.15)] flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-[hsl(var(--ds-color-accent))]" />
          </div>
          <div className="min-w-0">
            {item.message ? (
              <p className="text-sm text-foreground">{item.message}</p>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground truncate">
                  {item.name} de {item.city}
                </p>
                <p className="text-xs text-muted-foreground">
                  Contratou o plano {item.plan} <span className="opacity-70">ha {item.timeAgo}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SocialProofToastV2.displayName = 'SocialProofToastV2';

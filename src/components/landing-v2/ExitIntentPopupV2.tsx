import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { X } from 'lucide-react';
import type { ExitIntentSettings } from '@/lib/cms-v2/cms-types';
import { applyUTMv2, applyCoupon } from '@/lib/cms-v2/utm-v2';
import { renderRichText } from '@/lib/cms-v2/rich-text';

interface ExitIntentPopupV2Props {
  data?: ExitIntentSettings;
  coupon?: string;
  lpKey: string;
}

const COOKIE_PREFIX = 'lp_exit_';

const shouldShow = (lpKey: string, frequency: string): boolean => {
  const key = `${COOKIE_PREFIX}${lpKey}_seen`;

  if (frequency === 'session') {
    return !sessionStorage.getItem(key);
  }

  const stored = localStorage.getItem(key);
  if (!stored) return true;

  const timestamp = parseInt(stored, 10);
  if (isNaN(timestamp)) return true;

  const now = Date.now();
  switch (frequency) {
    case 'day':
      return now - timestamp > 24 * 60 * 60 * 1000;
    case 'week':
      return now - timestamp > 7 * 24 * 60 * 60 * 1000;
    default:
      return true;
  }
};

const markAsSeen = (lpKey: string, frequency: string) => {
  const key = `${COOKIE_PREFIX}${lpKey}_seen`;
  if (frequency === 'session') {
    sessionStorage.setItem(key, Date.now().toString());
  } else {
    localStorage.setItem(key, Date.now().toString());
  }
};


export const ExitIntentPopupV2 = memo(({ data, coupon, lpKey }: ExitIntentPopupV2Props) => {
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);
  const dismissedRef = useRef(false);
  const onReturnRef = useRef<((e: Event) => void) | null>(null);

  const dismiss = useCallback(() => {
    setShow(false);
    dismissedRef.current = true;
    if (data) markAsSeen(lpKey, data.frequency);

    // Remove any pending onReturn listener
    if (onReturnRef.current) {
      document.removeEventListener('visibilitychange', onReturnRef.current);
      onReturnRef.current = null;
    }
  }, [lpKey, data]);

  useEffect(() => {
    if (!data?.enabled) return;

    // Check frequency
    if (!shouldShow(lpKey, data.frequency)) return;

    // Delay antes de ativar o listener
    const delayTimer = setTimeout(() => {
      setReady(true);
    }, (data.delaySeconds || 5) * 1000);

    return () => clearTimeout(delayTimer);
  }, [data, lpKey]);

  useEffect(() => {
    if (!ready || !data?.enabled) return;

    // Desktop: mouseleave no topo
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !dismissedRef.current) {
        setShow(true);
      }
    };

    // Mobile: visibilitychange (usuario saindo do tab)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && !dismissedRef.current) {
        // Remove previous onReturn if any
        if (onReturnRef.current) {
          document.removeEventListener('visibilitychange', onReturnRef.current);
        }
        // Quando voltar, mostra o popup
        const onReturn = () => {
          if (document.visibilityState === 'visible' && !dismissedRef.current) {
            setShow(true);
            document.removeEventListener('visibilitychange', onReturn);
            onReturnRef.current = null;
          }
        };
        onReturnRef.current = onReturn;
        document.addEventListener('visibilitychange', onReturn);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      // Cleanup onReturn listener on unmount
      if (onReturnRef.current) {
        document.removeEventListener('visibilitychange', onReturnRef.current);
        onReturnRef.current = null;
      }
    };
  }, [ready, data]);

  if (!data?.enabled || !show) return null;

  const ctaUrl = applyCoupon(applyUTMv2(data.ctaLink, lpKey), coupon);
  const hasImage = !!data.imageUrl?.trim();
  const imageLeft = hasImage && data.imagePosition === 'left';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={dismiss} aria-label="Fechar"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        className={`relative z-10 w-full bg-background border border-border/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300 ${
          imageLeft ? 'max-w-2xl' : hasImage ? 'max-w-lg' : 'max-w-lg'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={dismiss} aria-label="Fechar"
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-muted-foreground/70 hover:text-foreground hover:bg-muted/30 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Layout: image left + content right, or image top + content below, or no image */}
        <div className={imageLeft ? 'grid grid-cols-1 md:grid-cols-[2fr_3fr]' : ''}>
          {/* Image — top or left */}
          {hasImage && (
            <div className={`overflow-hidden ${
              imageLeft
                ? 'hidden md:block h-full min-h-[280px]'
                : 'w-full h-48 md:h-56'
            }`}>
              <img
                src={data.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-10">
            <div className={`space-y-5 ${!imageLeft ? 'text-center' : ''}`}>
              <h3 id="exit-intent-title" className={`text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight ${data.titleUppercase !== false ? 'uppercase' : ''}`}>
                {renderRichText(data.title)}
              </h3>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {renderRichText(data.text)}
              </p>

              {/* CTA */}
              <a
                href={ctaUrl}
                onClick={dismiss} aria-label="Fechar"
                className={`inline-block w-full py-5 rounded-full font-bold text-xl uppercase tracking-wide transition-transform duration-300 bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))] hover:scale-[1.02] hover:shadow-[0_16px_40px_hsl(var(--ds-color-accent)/0.45)] ${
                  !imageLeft ? 'text-center' : 'text-center'
                }`}
              >
                {data.ctaText}
              </a>

              {/* Dismiss text */}
              <button
                onClick={dismiss} aria-label="Fechar"
                className="text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors underline underline-offset-2 w-full"
              >
                {data.dismissText || 'Não, obrigado'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ExitIntentPopupV2.displayName = 'ExitIntentPopupV2';

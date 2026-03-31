import { useState, useEffect, memo } from 'react';
import type { FloatingWhatsappSettings } from '@/lib/cms-v2/cms-types';
import { applyUTMv2, applyCoupon } from '@/lib/cms-v2/utm-v2';

interface StickyMobileCtaV2Props {
  data?: FloatingWhatsappSettings['stickyCta'];
  coupon?: string;
  lpKey: string;
}


export const StickyMobileCtaV2 = memo(({ data, coupon, lpKey }: StickyMobileCtaV2Props) => {
  const [visible, setVisible] = useState(false);

  const threshold = data?.scrollThreshold || 30;

  useEffect(() => {
    if (!data?.enabled) return;

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) {
        setVisible(false);
        return;
      }
      const scrollPercent = (window.scrollY / scrollableHeight) * 100;
      setVisible(scrollPercent >= threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check initial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [data?.enabled, threshold]);

  if (!data?.enabled) return null;

  const urlWithUTM = applyUTMv2(data.link, lpKey);
  const href = applyCoupon(urlWithUTM, coupon);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-background/95 backdrop-blur-md border-t border-border/30 px-4 py-3 safe-bottom">
        <a
          href={href}
          className="block w-full text-center py-3.5 rounded-full font-bold text-base transition-transform duration-300 bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))] hover:shadow-[0_8px_24px_hsl(var(--ds-color-accent)/0.4)] active:scale-[0.98]"
        >
          {data.text || 'Contratar agora'}
        </a>
      </div>
    </div>
  );
});

StickyMobileCtaV2.displayName = 'StickyMobileCtaV2';

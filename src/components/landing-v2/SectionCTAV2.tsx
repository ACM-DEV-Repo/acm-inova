import { LPContent } from "@/lib/cms-v2/cms-types";
import { applyUTMv2, applyCoupon } from "@/lib/cms-v2/utm-v2";
import { safeUrl } from "@/lib/cms-v2/safe-url";
import { cn } from "@/lib/utils";

type SectionCTAV2Props = {
  data?: LPContent['hero']['footerCta'];
  className?: string;
  lpKey: string;
  couponCode?: string;
};


export const SectionCTAV2 = ({ data, className, lpKey, couponCode }: SectionCTAV2Props) => {
  if (!data?.enabled) return null;

  const href = applyCoupon(applyUTMv2(safeUrl(data.link), lpKey), couponCode);

  return (
    <div
      className={cn(
        "w-full flex justify-center pt-10 md:pt-12 pb-0 relative z-10",
        data.mobileHidden && "hidden md:flex",
        className
      )}
    >
      <a
        href={href}
        className="
          group relative inline-flex items-center justify-center
          px-12 py-4 text-lg font-bold transition-transform duration-300
          rounded-full shadow-lg
          bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))]
          hover:scale-105 hover:shadow-[0_8px_24px_hsl(var(--ds-color-accent)/0.4)]
          active:scale-95
        "
      >
        {data.text}
      </a>
    </div>
  );
};

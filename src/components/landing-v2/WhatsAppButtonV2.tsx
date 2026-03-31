import { WhatsAppIcon } from "./icons/WhatsAppIconV2";
import { LPContent } from "@/lib/cms-v2/cms-types";
import { cn } from "@/lib/utils";

// SVG oficial do WhatsApp

interface WhatsAppButtonV2Props {
  data: LPContent['floatingWhatsapp'];
  lpKey: string;
}

export const WhatsAppButtonV2 = ({ data, lpKey }: WhatsAppButtonV2Props) => {
  if (!data?.enabled) return null;

  const whatsappUrl = `https://wa.me/${data.phoneNumber}?text=${encodeURIComponent(data.message || '')}`;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 group",
        !data.showOnMobile && "hidden md:flex"
      )}
    >
      {/* Label pill — desktop hover, mobile conditional */}
      <span
        className={cn(
          "bg-card/90 backdrop-blur-md text-foreground px-4 py-2 rounded-full font-semibold shadow-lg border border-border/20",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          !data.showLabelOnMobile && "hidden md:inline-block"
        )}
      >
        {data.label}
      </span>

      {/* Main button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative"
      >
        {/* Pulse glow */}
        {data.pulseEffect && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        )}

        {/* Icon button */}
        <span
          className={cn(
            "relative flex items-center justify-center",
            "w-14 h-14 rounded-full",
            "bg-[#25D366] hover:bg-[#1da851] text-white",
            "shadow-[0_0_20px_rgba(37,211,102,0.5)]",
            "hover:shadow-[0_0_30px_rgba(37,211,102,0.7)]",
            "hover:scale-110 transition-all duration-300"
          )}
        >
          <WhatsAppIcon className="h-7 w-7" />
        </span>
      </a>
    </div>
  );
};

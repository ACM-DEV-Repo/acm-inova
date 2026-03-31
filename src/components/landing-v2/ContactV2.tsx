import { WhatsAppIcon } from "./icons/WhatsAppIconV2";
import { LPContent } from "@/lib/cms-v2/cms-types";

// SVG oficial do WhatsApp

type ContactV2Props = {
  data: LPContent["contact"];
  lpKey: string;
};

export const ContactV2 = ({ data, lpKey }: ContactV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section id="contact" className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center glass-card p-10 md:p-16 lg:p-20">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <p className="mb-10 md:mb-14 text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {data.subtitle}
        </p>

        <a
          href={data.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 md:px-16 py-4 md:py-6 rounded-full font-bold text-lg md:text-xl bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))] hover:scale-105 hover:shadow-[0_16px_32px_hsl(var(--ds-color-accent)/0.4)] shadow-[0_8px_16px_hsl(var(--ds-color-accent)/0.2)] transition-all duration-300"
        >
          <WhatsAppIcon className="w-6 h-6" />
          Falar no WhatsApp
        </a>
      </div>
    </section>
  );
};

import { LPContent } from "@/lib/cms-v2/cms-types";
import { SectionCTAV2 } from "./SectionCTAV2";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQV2Props = {
  data: LPContent["faq"];
  lpKey: string;
  couponCode?: string;
};

export const FAQV2 = ({ data, lpKey, couponCode }: FAQV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <div className="glass-card p-6 md:p-10 lg:p-12">
          <Accordion type="single" collapsible className="space-y-4 md:space-y-6">
            {data.items?.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border pb-2"
              >
                <AccordionTrigger className="text-left text-base md:text-lg lg:text-xl font-bold text-foreground hover:text-[hsl(var(--ds-color-accent))] transition-colors py-4 md:py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed pt-3 pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

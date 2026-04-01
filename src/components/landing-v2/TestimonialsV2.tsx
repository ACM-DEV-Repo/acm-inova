import { LPContent } from "@/lib/cms-v2/cms-types";
import { TestimonialCardV2 } from "./TestimonialCardV2";
import { SectionCTAV2 } from "./SectionCTAV2";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

type TestimonialsV2Props = {
  data: LPContent["testimonials"];
  lpKey: string;
  couponCode?: string;
};

export const TestimonialsV2 = ({ data, lpKey, couponCode }: TestimonialsV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-[hsl(var(--ds-color-title))] leading-tight">
          {data.title}
        </h2>

        <Carousel
          opts={{ align: "start" }}
          className="w-full max-w-7xl mx-auto mt-8 md:mt-12"
        >
          <CarouselContent className="pt-12 pb-4">
            {data.items?.map((item, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="pt-10">
                  <TestimonialCardV2 item={item} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12 hidden lg:flex w-12 h-12 bg-[hsl(var(--ds-color-accent))] hover:bg-[hsl(var(--ds-color-accent))]/80 text-[hsl(var(--ds-color-btn-text))] border-0 shadow-lg" />
          <CarouselNext className="-right-12 hidden lg:flex w-12 h-12 bg-[hsl(var(--ds-color-accent))] hover:bg-[hsl(var(--ds-color-accent))]/80 text-[hsl(var(--ds-color-btn-text))] border-0 shadow-lg" />
        </Carousel>

        <SectionCTAV2 data={data.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};

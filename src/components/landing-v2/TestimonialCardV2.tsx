type TestimonialItem = {
  image?: string;
  text: string;
  name: string;
  city: string;
  rating: number;
};

type TestimonialCardV2Props = {
  item: TestimonialItem;
};

export const TestimonialCardV2 = ({ item }: TestimonialCardV2Props) => {
  return (
    <div className="glass-card relative p-8 pt-16 hover:scale-[1.02] transition-transform duration-300">
      {/* Avatar posicionado como "selo" no topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {item.image ? (
          <img loading="lazy"
            src={item.image}
            className="w-20 h-20 rounded-full object-cover border-4 border-card shadow-lg"
            alt={item.name}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-muted border-4 border-card shadow-lg flex items-center justify-center">
            <span className="text-muted-foreground text-xs">Foto</span>
          </div>
        )}
      </div>

      {/* Nome e Cidade */}
      <div className="flex items-center justify-center gap-2">
        <p className="font-bold text-lg md:text-xl text-foreground">{item.name}</p>
        <span className="text-muted-foreground">&bull;</span>
        <p className="text-sm md:text-base text-muted-foreground">{item.city}</p>
      </div>

      {/* Texto/Citacao */}
      <div className="min-h-[220px] mt-4">
        <p className="italic text-base md:text-lg text-muted-foreground leading-relaxed text-center">
          "{item.text}"
        </p>
      </div>

      {/* Rating */}
      <p className="text-[hsl(var(--ds-color-star))] mt-4 text-xl md:text-2xl text-center">
        {"★".repeat(Math.max(0, Math.min(5, Math.floor(Number(item.rating) || 0))))}
      </p>
    </div>
  );
};

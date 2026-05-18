import { LPContent } from "@/lib/cms-v2/cms-types";
import { Instagram, Facebook, Linkedin, Youtube, Music2, type LucideIcon } from "lucide-react";

type FooterV2Props = {
  data: LPContent["footer"];
  lpKey: string;
};

const socialIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music2,
};

export const FooterV2 = ({ data, lpKey }: FooterV2Props) => {
  if (!data || data.enabled === false) return null;

  return (
    <footer className="w-full px-4 md:px-6 border-t border-border backdrop-blur-lg">
      <div className="max-w-7xl mx-auto">
        {/* Logo */}
        {(data.logoDesktop || data.logoMobile || data.logo) && (
          <div className="w-full flex justify-center">
            <picture>
              {data.logoDesktop && (
                <source media="(min-width: 768px)" srcSet={data.logoDesktop} />
              )}
              {data.logoMobile && (
                <source media="(max-width: 767px)" srcSet={data.logoMobile} />
              )}
              <img loading="lazy"
                src={data.logoDesktop || data.logoMobile || data.logo}
                alt="Logo"
                className="h-12 md:h-14 object-contain"
              />
            </picture>
          </div>
        )}

        {/* Navigation Links */}
        {data.links && data.links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8 md:mt-10">
            {data.links.filter(link => link.enabled !== false).map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="text-sm md:text-base text-muted-foreground hover:text-[hsl(var(--ds-color-accent))] transition-colors duration-300 font-medium"
              >
                {link.text}
              </a>
            ))}
          </div>
        )}

        {/* Privacy & Terms */}
        <div className="text-center text-sm md:text-base space-y-2 md:space-y-3 text-muted-foreground mb-8 md:mb-10">
          {data.privacy?.enabled !== false && (
            data.privacy?.hasLink && data.privacy?.url ? (
              <a
                href={data.privacy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[hsl(var(--ds-color-accent))] transition-colors duration-300"
              >
                {data.privacy.text || 'Política de Privacidade'}
              </a>
            ) : data.privacy?.text ? (
              <p>{data.privacy.text}</p>
            ) : null
          )}

          {data.terms?.enabled !== false && (
            data.terms?.hasLink && data.terms?.url ? (
              <a
                href={data.terms.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[hsl(var(--ds-color-accent))] transition-colors duration-300"
              >
                {data.terms.text || 'Termos de Uso'}
              </a>
            ) : data.terms?.text ? (
              <p>{data.terms.text}</p>
            ) : null
          )}

          {data.cnpj?.enabled !== false && data.cnpj?.text && (
            <p>{data.cnpj.text}</p>
          )}
        </div>

        {/* Social Icons */}
        {data.socials && (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8 md:mt-10">
            {Object.entries(data.socials).map(([key, social]) => {
              if (!social.enabled || !social.url) return null;
              const IconComponent = socialIcons[key];
              if (!IconComponent) return null;

              return (
                <a
                  key={key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[hsl(var(--ds-color-accent))] transition-colors duration-300"
                  aria-label={key}
                >
                  <IconComponent className="w-6 h-6" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </footer>
  );
};

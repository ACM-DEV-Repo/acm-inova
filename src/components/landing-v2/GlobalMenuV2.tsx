import { memo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { GlobalMenuSettings, FooterSection } from '@/lib/cms-v2/cms-types';

interface GlobalMenuV2Props {
  data?: GlobalMenuSettings;
  footer?: FooterSection;
}

export const GlobalMenuV2 = memo(({ data, footer }: GlobalMenuV2Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!data?.enabled) return null;

  const logoSrc = data.logoUrl?.trim() || footer?.logo?.trim() || footer?.logoDesktop?.trim() || '';
  const links = data.links || [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--ds-color-bg))]/6 backdrop-blur-[18px] border-b border-[hsl(var(--ds-border-color))]/30">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        {logoSrc && (
          <a href="#" className="flex items-center shrink-0">
            <img
              src={logoSrc}
              alt="Logo"
              className="h-10 w-auto object-contain transition-transform hover:scale-105"
            />
          </a>
        )}

        {/* NAV LINKS — Desktop */}
        {links.length > 0 && (
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.text}
              </a>
            ))}
          </nav>
        )}

        {/* Hamburger — Mobile */}
        {links.length > 0 && (
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-[hsl(var(--ds-color-surface))]/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && links.length > 0 && (
        <nav id="mobile-menu" className="md:hidden bg-[hsl(var(--ds-color-bg))]/95 backdrop-blur-xl border-b border-[hsl(var(--ds-border-color))]/20 px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-foreground/80 hover:text-foreground py-2 transition-colors"
            >
              {link.text}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
});

GlobalMenuV2.displayName = 'GlobalMenuV2';

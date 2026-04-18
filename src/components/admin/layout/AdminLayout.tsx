import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutTemplate, Image, TrendingUp, BarChart3, Settings,
  LogOut, Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface NavItem {
  label: string;
  icon: typeof LayoutTemplate;
  path: string;
  enabled: boolean;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Landing Pages', icon: LayoutTemplate, path: '/admin/lps', enabled: true },
  { label: 'Biblioteca', icon: Image, path: '/admin/media', enabled: false, badge: 'Em breve' },
  { label: 'Tráfego', icon: TrendingUp, path: '/admin/trafego', enabled: false, badge: 'Em breve' },
  { label: 'Relatórios', icon: BarChart3, path: '/admin/relatorios', enabled: false, badge: 'Em breve' },
  { label: 'Configurações', icon: Settings, path: '/admin/configuracoes', enabled: false, badge: 'Em breve' },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sessão encerrada');
    navigate('/login');
  };

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[240px]';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo centered + hamburger */}
      <div className="flex flex-col items-center border-b border-border/40 py-5 gap-3">
        <img
          src="/logo-acm.png"
          alt="ACM"
          className={cn('object-contain transition-all', collapsed ? 'h-7' : 'h-10')}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/[0.06] transition-all"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          if (!item.enabled) {
            return (
              <div
                key={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-muted-foreground/50 cursor-not-allowed',
                  collapsed && 'justify-center px-0'
                )}
                title={item.badge}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded-full">{item.badge}</span>
                    )}
                  </>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                    : 'text-foreground/70 hover:bg-black/[0.04] hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/40 p-2 space-y-1">
        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all w-full',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar - desktop */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 bg-white shadow-[4px_0_20px_rgba(0,0,0,0.08)] z-20 transition-all duration-300 rounded-r-2xl',
          sidebarWidth
        )}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar - mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[240px] border-r border-border/40 bg-background shadow-2xl transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-muted/50">
        {/* Top bar - mobile hamburger */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-white lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
          <img src="/logo-acm.png" alt="ACM" className="h-7 object-contain" />
        </header>

        {/* Page content with rounded inner area */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-4">
          <div className="bg-background rounded-2xl min-h-full shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

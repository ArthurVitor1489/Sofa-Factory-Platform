'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sofa, LayoutDashboard, FileSpreadsheet, Package, Settings, LogOut, ShieldCheck, History } from 'lucide-react';
import { UserSession } from '@/lib/auth';

interface AdminSidebarProps {
  session: UserSession;
}

export default function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Produtos', href: '/admin/produtos', icon: Package },
    { name: 'Leads & Orçamentos', href: '/admin/leads', icon: FileSpreadsheet },
    { name: 'Logs de Auditoria', href: '/admin/logs', icon: History, adminOnly: true },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isLinkActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-stone-900 text-stone-200 flex flex-col h-screen border-r border-stone-800 shrink-0">
      {/* Brand Logo header */}
      <div className="p-6 border-b border-stone-800 flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
          <Sofa className="w-4.5 h-4.5" />
        </div>
        <div>
          <span className="font-serif text-sm font-bold tracking-tight text-white block leading-none">
            ARTE & CONFORTO
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#C5A880] block font-sans mt-0.5">
            Painel Administrativo
          </span>
        </div>
      </div>

      {/* User Session Profile details */}
      <div className="p-5 bg-stone-950/40 border-b border-stone-800 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm uppercase">
          {session.nome.substring(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-white truncate">{session.nome}</p>
          <div className="flex items-center space-x-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
            <span className="text-[9px] text-[#C5A880] uppercase tracking-wider font-semibold">
              {session.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.adminOnly && session.role !== 'admin') return null;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isLinkActive(item.href)
                  ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/10'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-stone-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:bg-red-950/20 hover:text-red-400 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}

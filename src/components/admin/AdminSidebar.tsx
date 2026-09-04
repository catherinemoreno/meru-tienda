"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tags, ShoppingCart, LogOut, ExternalLink, Settings } from "lucide-react";
import { storeConfig } from "@/config/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface p-5">
      <Link href="/admin" className="font-display text-xl font-bold">
        {storeConfig.name} <span className="text-accent">Admin</span>
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-accent/15 text-accent" : "text-muted hover:bg-surface-2 hover:text-foreground"
              )}
            >
              <Icon className="h-4.5 w-4.5" /> {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-2 hover:text-foreground"
        >
          <ExternalLink className="h-4.5 w-4.5" /> Ver tienda
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted hover:bg-surface-2 hover:text-red-400"
        >
          <LogOut className="h-4.5 w-4.5" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

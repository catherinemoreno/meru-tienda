"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, Heart, ShoppingBag, X, ChevronDown, ChevronRight } from "lucide-react";
import { storeConfig } from "@/config/store";
import { categories } from "@/lib/data/categories";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";
import CartDrawer from "@/components/layout/CartDrawer";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/tienda" },
  { label: "Novedades", href: "/tienda?filtro=nuevo" },
  { label: "Más vendidos", href: "/tienda?filtro=masVendido" },
  { label: "Ofertas", href: "/tienda?filtro=oferta" },
];

export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            className="lg:hidden"
            aria-label="Abrir menú"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
            {storeConfig.name}
            <span className="text-accent">.</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link, i) =>
              link.label === "Tienda" ? (
                <div
                  key="cat"
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-foreground/90 transition-colors hover:text-accent">
                    Categorías <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {megaOpen && (
                    <div className="absolute left-1/2 top-full z-50 w-[820px] -translate-x-1/2 pt-4">
                      <div className="glass grid grid-cols-4 gap-6 rounded-2xl border border-border p-6 shadow-2xl shadow-black/50">
                        {categories.map((cat) => (
                          <div key={cat.slug}>
                            <Link
                              href={`/categoria/${cat.slug}`}
                              className={cn(
                                "mb-2 block text-sm font-semibold",
                                cat.slug === "hallazgos" ? "text-accent" : "text-foreground"
                              )}
                            >
                              {cat.name}
                            </Link>
                            <ul className="space-y-1.5">
                              {cat.subcategories.slice(0, 6).map((sub) => (
                                <li key={sub}>
                                  <Link
                                    href={`/categoria/${cat.slug}?sub=${encodeURIComponent(sub)}`}
                                    className="text-xs text-muted transition-colors hover:text-accent"
                                  >
                                    {sub}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={i}
                  href={link.href}
                  className="text-sm font-medium text-foreground/90 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/tienda"
              aria-label="Buscar"
              className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-2 sm:flex"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/tienda?favoritos=1"
              aria-label="Favoritos"
              className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-2 sm:flex"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <button
              onClick={openCart}
              aria-label="Carrito"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-2"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-[#1a1408]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-surface p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-xl font-bold">{storeConfig.name}</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="mb-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted">
              Categorías
            </p>
            <div className="flex flex-col">
              {categories.map((cat) => (
                <div key={cat.slug} className="border-b border-border">
                  <button
                    className="flex w-full items-center justify-between px-3 py-3 text-sm font-medium"
                    onClick={() =>
                      setOpenAccordion(openAccordion === cat.slug ? null : cat.slug)
                    }
                  >
                    <span className={cat.slug === "hallazgos" ? "text-accent" : ""}>
                      {cat.name}
                    </span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openAccordion === cat.slug && "rotate-90"
                      )}
                    />
                  </button>
                  {openAccordion === cat.slug && (
                    <ul className="pb-3 pl-3">
                      {cat.subcategories.map((sub) => (
                        <li key={sub}>
                          <Link
                            href={`/categoria/${cat.slug}?sub=${encodeURIComponent(sub)}`}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-1.5 text-sm text-muted hover:text-accent"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
}

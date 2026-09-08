"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { CategorySlug, Category } from "@/types";

const filterLabels: Record<string, string> = {
  nuevo: "Novedades",
  masVendido: "Más vendidos",
  oferta: "Ofertas",
};

export default function StoreFilters({
  hideCategory,
  categories,
}: {
  hideCategory?: CategorySlug;
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParam("q", searchText.trim() || null);
  }

  const activeCategory = searchParams.get("categoria");
  const activeFilter = searchParams.get("filtro");
  const activeSort = searchParams.get("orden") ?? "relevancia";
  const activePrecio = searchParams.get("precio") ?? "";
  const soloDisponibles = searchParams.get("disponible") === "1";

  return (
    <div className="mb-6 flex flex-col gap-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="¿Qué estás buscando?"
            className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent"
          />
        </div>
        <button type="submit" className="rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-[#1a1408]">
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {["nuevo", "masVendido", "oferta"].map((f) => (
          <button
            key={f}
            onClick={() => setParam("filtro", activeFilter === f ? null : f)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              activeFilter === f
                ? "border-accent bg-accent text-[#1a1408]"
                : "border-border text-muted hover:border-accent/50"
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
        <button
          onClick={() => setParam("disponible", soloDisponibles ? null : "1")}
          className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
            soloDisponibles
              ? "border-accent bg-accent text-[#1a1408]"
              : "border-border text-muted hover:border-accent/50"
          }`}
        >
          Disponibilidad
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!hideCategory && (
          <select
            value={activeCategory ?? ""}
            onChange={(e) => setParam("categoria", e.target.value || null)}
            className="rounded-full border border-border bg-surface px-4 py-2 text-xs text-foreground"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        <select
          value={activePrecio}
          onChange={(e) => setParam("precio", e.target.value || null)}
          className="rounded-full border border-border bg-surface px-4 py-2 text-xs text-foreground"
        >
          <option value="">Cualquier precio</option>
          <option value="0-50000">Hasta $50.000</option>
          <option value="50000-100000">$50.000 - $100.000</option>
          <option value="100000-200000">$100.000 - $200.000</option>
          <option value="200000-500000">$200.000 - $500.000</option>
          <option value="500000-">Más de $500.000</option>
        </select>

        <select
          value={activeSort}
          onChange={(e) => setParam("orden", e.target.value)}
          className="rounded-full border border-border bg-surface px-4 py-2 text-xs text-foreground"
        >
          <option value="relevancia">Relevancia</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nuevo">Más recientes</option>
        </select>
      </div>
    </div>
  );
}

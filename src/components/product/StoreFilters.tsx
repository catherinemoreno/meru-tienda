"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
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

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCategory = searchParams.get("categoria");
  const activeFilter = searchParams.get("filtro");
  const activeSort = searchParams.get("orden") ?? "relevancia";

  return (
    <div className="mb-6 flex flex-col gap-4">
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

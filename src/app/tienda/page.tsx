import { Suspense } from "react";
import { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/repository";
import ProductGrid from "@/components/product/ProductGrid";
import StoreFilters from "@/components/product/StoreFilters";
import { CategorySlug, ProductTag } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tienda",
  description: "Explora todo el catálogo de Meru: hogar, moda, tecnología, decoración y más.",
};

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const category = params.categoria as CategorySlug | undefined;
  const sort = params.orden as
    | "relevancia"
    | "precio-asc"
    | "precio-desc"
    | "nuevo"
    | undefined;
  const filtro = params.filtro as ProductTag | undefined;

  let products = await getProducts({ category, sort });
  const categories = await getCategories();
  if (filtro) {
    products = products.filter((p) => p.tags.includes(filtro));
  }

  return (
    <div>
      <div className="border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Catálogo completo
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-5xl">
            Tienda
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted sm:text-lg">
            Todo lo que necesitas, en un solo lugar: hogar, moda, tecnología,
            decoración y los hallazgos más virales del momento.
          </p>
          <p className="mt-4 text-sm text-muted">
            {products.length}{" "}
            {products.length === 1 ? "producto disponible" : "productos disponibles"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <Suspense>
          <StoreFilters categories={categories} />
        </Suspense>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}

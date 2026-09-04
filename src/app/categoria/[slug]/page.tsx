import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryBySlug, getProducts } from "@/lib/repository";
import ProductGrid from "@/components/product/ProductGrid";
import { categories } from "@/lib/data/categories";
import { CategorySlug } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const { slug } = await params;
  const { sub } = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProducts({
    category: slug as CategorySlug,
    subcategory: sub,
  });

  const isHallazgos = category.slug === "hallazgos";

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className={cn(isHallazgos && "rounded-2xl border border-accent/30 bg-accent/5 p-6")}>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 text-muted">{category.tagline ?? category.description}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`/categoria/${slug}`}
          className={cn(
            "rounded-full border px-4 py-2 text-xs font-medium",
            !sub ? "border-accent bg-accent text-[#1a1408]" : "border-border text-muted"
          )}
        >
          Todas
        </Link>
        {category.subcategories.map((s) => (
          <Link
            key={s}
            href={`/categoria/${slug}?sub=${encodeURIComponent(s)}`}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium",
              sub === s ? "border-accent bg-accent text-[#1a1408]" : "border-border text-muted"
            )}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

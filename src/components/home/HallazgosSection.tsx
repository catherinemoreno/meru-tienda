import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import { getCategoryBySlug } from "@/lib/data/categories";

export default function HallazgosSection({ products }: { products: Product[] }) {
  const category = getCategoryBySlug("hallazgos");
  return (
    <section className="border-y border-accent/20 bg-gradient-to-b from-accent/[0.06] via-transparent to-transparent">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Hallazgos
            </span>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              {category?.tagline ?? "Cosas que no sabías que necesitabas"}
            </h2>
          </div>
          <Link
            href="/categoria/hallazgos"
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

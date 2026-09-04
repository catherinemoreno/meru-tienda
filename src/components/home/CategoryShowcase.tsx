import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import SectionHeader from "@/components/ui/SectionHeader";

export default function CategoryShowcase() {
  const mainCategories = categories.filter((c) => c.slug !== "hallazgos");
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeader eyebrow="Explora" title="Explora por categoría" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mainCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categoria/${cat.slug}`}
            className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl border border-border p-5"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="relative flex items-end justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold text-white">{cat.name}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-white/70">{cat.description}</p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

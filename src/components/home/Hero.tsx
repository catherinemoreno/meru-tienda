"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import { storeConfig } from "@/config/store";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function Hero({ featured }: { featured?: Product }) {
  const { hero } = storeConfig;
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-12 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent-purple/40 bg-accent-purple/15 px-3 py-1 text-xs font-medium text-accent-purple-soft">
            <Sparkles className="h-3.5 w-3.5" /> {hero.eyebrow}
          </span>
          <h1 className="font-display text-3xl font-bold leading-[1.1] text-foreground sm:text-4xl lg:text-[2.75rem]">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted sm:text-base">{hero.subtitle}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={hero.ctaPrimary.href}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-[#10240a] transition-transform hover:scale-[1.02] active:scale-95"
            >
              {hero.ctaPrimary.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={hero.ctaSecondary.href}
              className="flex items-center justify-center gap-2 rounded-full border border-border bg-surface-2 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/50"
            >
              {hero.ctaSecondary.label}
            </Link>
          </div>
        </motion.div>

        {featured ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto w-full max-w-md"
          >
            <Link
              href={`/producto/${featured.slug}`}
              className="block overflow-hidden rounded-3xl border border-border bg-surface-2 shadow-xl shadow-black/40 transition-transform hover:scale-[1.01]"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={featured.images[0]}
                  alt={featured.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 448px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-accent">Producto destacado</p>
                  <p className="mt-0.5 line-clamp-1 text-sm font-medium">{featured.name}</p>
                  <p className="mt-0.5 text-lg font-semibold">{formatPrice(featured.price)}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-[#10240a]">
                  <ShoppingBag className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto flex w-full max-w-md aspect-square items-center justify-center rounded-3xl border border-border bg-surface-2"
          >
            <span className="font-display text-2xl font-bold text-accent">{storeConfig.name}.</span>
          </motion.div>
        )}
      </div>
    </section>
  );
}

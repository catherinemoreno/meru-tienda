"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function Hero({ featured }: { featured?: Product }) {
  const { hero } = storeConfig;
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <Image src={hero.image} alt="" fill priority className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20 sm:py-28 lg:flex-row lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" /> {hero.eyebrow}
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-md text-base text-muted sm:text-lg">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={hero.ctaPrimary.href}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-[#1a1408] transition-transform hover:scale-[1.02] active:scale-95"
            >
              {hero.ctaPrimary.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={hero.ctaSecondary.href}
              className="flex items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-accent/50"
            >
              {hero.ctaSecondary.label}
            </Link>
          </div>
        </motion.div>

        {featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-xs lg:ml-auto"
          >
            <Link
              href={`/producto/${featured.slug}`}
              className="glass block overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/50"
            >
              <div className="relative aspect-square w-full">
                <Image src={featured.images[0]} alt={featured.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-accent">Producto destacado</p>
                <p className="mt-1 line-clamp-1 text-sm font-medium">{featured.name}</p>
                <p className="mt-1 text-lg font-semibold">{formatPrice(featured.price)}</p>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

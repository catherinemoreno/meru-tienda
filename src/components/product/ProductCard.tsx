"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useFavoritesStore } from "@/lib/store/favorites";

const tagLabels: Record<string, string> = {
  nuevo: "Nuevo",
  masVendido: "Más vendido",
  oferta: "Oferta",
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const discount = discountPercent(product.price, product.previousPrice);
  const isHallazgo = product.category === "hallazgos";

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      previousPrice: product.previousPrice,
      quantity: 1,
      stock: product.stock,
    });
    openCart();
  }

  return (
    <Link
      href={`/producto/${product.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30",
        isHallazgo ? "border-accent/30" : "border-border"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-2">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isHallazgo && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#1a1408]">
              Hallazgo
            </span>
          )}
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-foreground backdrop-blur"
            >
              {tagLabels[tag]}
            </span>
          ))}
          {discount && (
            <span className="rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-semibold text-white">
              -{discount}%
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          aria-label="Agregar a favoritos"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur transition-colors hover:bg-black/70"
        >
          <Heart
            className={cn("h-4 w-4", isFavorite ? "fill-accent text-accent" : "text-white")}
          />
        </button>

        <button
          onClick={handleAdd}
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-[#1a1408] opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 sm:opacity-100 sm:h-10 sm:w-10 active:scale-90"
          aria-label="Agregar al carrito"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <p className="text-[11px] uppercase tracking-wide text-muted">{product.subcategory}</p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>
        {product.rating && (
          <div className="flex items-center gap-1 text-xs text-muted">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span>{product.rating}</span>
            {product.reviewsCount && <span>({product.reviewsCount})</span>}
          </div>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.previousPrice && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.previousPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

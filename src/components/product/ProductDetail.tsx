"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, Truck, ShieldCheck, PackageCheck, Star } from "lucide-react";
import { Product } from "@/types";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useFavoritesStore } from "@/lib/store/favorites";
import { useRouter } from "next/navigation";

// Muchas descripciones se pegan como un solo párrafo largo con frases
// separadas por puntos (típico de descripciones copiadas de proveedores).
// Si el vendedor ya escribió saltos de línea propios, se respetan tal cual;
// si no, se separa automáticamente por oración para que no se vea como un
// bloque de texto ilegible.
function formatDescription(text: string): string[] {
  if (!text) return [];
  if (text.includes("\n")) {
    return text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  }
  return text
    .split(/(?<=[.!?])\s+(?=\S)/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const router = useRouter();

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const discount = discountPercent(product.price, product.previousPrice);
  const variantLabel = Object.values(selectedVariants).join(" / ") || undefined;

  function buildCartItem() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      previousPrice: product.previousPrice,
      quantity,
      variant: variantLabel,
      stock: product.stock,
    };
  }

  function handleAddToCart() {
    addItem(buildCartItem());
    openCart();
  }

  function handleBuyNow() {
    addItem(buildCartItem());
    router.push("/checkout");
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-2">
          <Image
            src={product.images[activeImage]}
            alt={product.name}
            fill
            priority
            className="object-cover"
          />
          {discount && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white">
              -{discount}%
            </span>
          )}
        </div>
        <div className="mt-3 flex gap-3">
          {product.images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveImage(i)}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-xl border",
                activeImage === i ? "border-accent" : "border-border"
              )}
            >
              <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-accent">{product.subcategory}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{product.name}</h1>

        {product.rating && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span>{product.rating}</span>
            {product.reviewsCount && <span>· {product.reviewsCount} reseñas</span>}
          </div>
        )}

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
          {product.previousPrice && (
            <span className="text-lg text-muted line-through">
              {formatPrice(product.previousPrice)}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-muted">
          {formatDescription(product.description).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {product.variants?.map((variant) => (
          <div key={variant.type} className="mt-6">
            <p className="mb-2 text-sm font-medium capitalize">{variant.type}</p>
            <div className="flex flex-wrap gap-2">
              {variant.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setSelectedVariants((prev) => ({ ...prev, [variant.type]: opt }))
                  }
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm",
                    selectedVariants[variant.type] === opt
                      ? "border-accent bg-accent text-[#1a1408]"
                      : "border-border text-foreground hover:border-accent/50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-border px-3 py-2">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Restar">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-5 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              aria-label="Sumar"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => toggleFavorite(product.id)}
            aria-label="Favoritos"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
          >
            <Heart className={cn("h-5 w-5", isFavorite ? "fill-accent text-accent" : "")} />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-full border border-accent px-6 py-3.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            Agregar al carrito
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-[#1a1408] transition-transform hover:scale-[1.01]"
          >
            Comprar ahora
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Truck className="h-4 w-4 text-accent" /> Envío gratis
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <PackageCheck className="h-4 w-4 text-accent" /> Pago contra entrega
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-accent" /> Envíos a toda Colombia
          </div>
        </div>

        {product.features && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Características</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted">
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

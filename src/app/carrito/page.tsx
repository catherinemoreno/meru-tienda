"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Tu carrito está vacío</h1>
        <p className="text-muted">Descubre productos que te van a encantar.</p>
        <Link
          href="/tienda"
          className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#1a1408]"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold">Tu carrito</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <li key={`${item.productId}-${item.variant ?? ""}`} className="flex gap-4 py-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <Link href={`/producto/${item.slug}`} className="text-sm font-medium hover:text-accent">
                    {item.name}
                  </Link>
                  {item.variant && <p className="text-xs text-muted">{item.variant}</p>}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1.5">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}>
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}>
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.variant)}
                  className="self-start text-muted hover:text-red-400"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>

          <Link href="/tienda" className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Continuar comprando
          </Link>
        </div>

        <div className="h-fit rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold">Resumen</h2>
          <div className="mt-4 flex justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal())}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-muted">
            <span>Envío</span>
            <span className="text-accent">Gratis</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(subtotal())}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-accent py-3.5 text-center text-sm font-semibold text-[#1a1408] transition-transform hover:scale-[1.01]"
          >
            Finalizar pedido
          </Link>
        </div>
      </div>
    </div>
  );
}

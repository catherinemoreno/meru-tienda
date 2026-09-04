"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={closeCart} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-lg font-semibold">Tu carrito</h2>
          <button onClick={closeCart} aria-label="Cerrar carrito">
            <X className="h-6 w-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-muted">Tu carrito está vacío.</p>
            <Link
              href="/tienda"
              onClick={closeCart}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#1a1408]"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variant ?? ""}`} className="flex gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                      {item.variant && <p className="text-xs text-muted">{item.variant}</p>}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, item.variant)
                            }
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-4 text-center text-xs">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, item.variant)
                            }
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variant)}
                      aria-label="Eliminar"
                      className="self-start text-muted hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="text-lg font-semibold">{formatPrice(subtotal())}</span>
              </div>
              <Link
                href="/carrito"
                onClick={closeCart}
                className="mb-2 block rounded-full border border-border py-3 text-center text-sm font-medium hover:bg-surface-2"
              >
                Ver carrito
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block rounded-full bg-accent py-3 text-center text-sm font-semibold text-[#1a1408] transition-transform hover:scale-[1.01]"
              >
                Finalizar pedido
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

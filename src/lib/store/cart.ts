"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

// Identificador anónimo de esta sesión de navegador (no personal, no es un
// dato del cliente). Se usa solo para saber, de forma agregada, cuántos
// carritos se abandonan sin completar la compra. Vive en localStorage.
export function getCartSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const key = "meru_cart_session";
    let id = localStorage.getItem(key);
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "";
  }
}

function trackCartEvent(productSlug: string, productName: string) {
  const sessionId = getCartSessionId();
  if (!sessionId) return;
  fetch("/api/track-cart-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, productSlug, productName }),
  }).catch(() => {});
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        trackCartEvent(item.slug, item.name);
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variant === item.variant
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (productId, variant) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variant === variant)
          ),
        })),
      updateQuantity: (productId, quantity, variant) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variant === variant
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "meru-cart" }
  )
);

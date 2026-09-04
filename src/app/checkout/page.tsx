"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore, getCartSessionId } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { checkoutSchema, CheckoutFormValues } from "@/lib/validation/checkout";
import { departamentosColombia } from "@/lib/colombia";
import { storeConfig } from "@/config/store";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { confirm: undefined as unknown as true },
  });

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: values.fullName,
            phone: values.phone,
            email: values.email,
            department: values.department,
            city: values.city,
            address: values.address,
            neighborhood: values.neighborhood,
            reference: values.reference,
            notes: values.notes,
          },
          items: items.map((i) => ({
            productId: i.productId,
            slug: i.slug,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            variant: i.variant,
          })),
          subtotal: subtotal(),
          shipping: 0,
          total: subtotal(),
          sessionId: getCartSessionId(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No pudimos procesar tu pedido");
      }

      const order = await res.json();
      clear();
      router.push(`/confirmacion/${order.number}`);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Ocurrió un error");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">No tienes productos en tu carrito</h1>
        <Link href="/tienda" className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#1a1408]">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-accent";
  const errorClass = "mt-1 text-xs text-red-400";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold">Finalizar pedido</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Datos de envío</h2>

          <div>
            <input placeholder="Nombre completo" className={inputClass} {...register("fullName")} />
            {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input placeholder="Celular" className={inputClass} {...register("phone")} />
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>
            <div>
              <input placeholder="Correo electrónico" className={inputClass} {...register("email")} />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <select className={inputClass} {...register("department")} defaultValue="">
                <option value="" disabled>
                  Departamento
                </option>
                {departamentosColombia.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.department && <p className={errorClass}>{errors.department.message}</p>}
            </div>
            <div>
              <input placeholder="Ciudad" className={inputClass} {...register("city")} />
              {errors.city && <p className={errorClass}>{errors.city.message}</p>}
            </div>
          </div>

          <div>
            <input placeholder="Dirección" className={inputClass} {...register("address")} />
            {errors.address && <p className={errorClass}>{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input placeholder="Barrio" className={inputClass} {...register("neighborhood")} />
              {errors.neighborhood && <p className={errorClass}>{errors.neighborhood.message}</p>}
            </div>
            <div>
              <input placeholder="Punto de referencia (opcional)" className={inputClass} {...register("reference")} />
            </div>
          </div>

          <div>
            <textarea
              placeholder="Observaciones para la entrega (opcional)"
              rows={3}
              className={inputClass}
              {...register("notes")}
            />
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm font-semibold">{storeConfig.checkout.paymentMethodLabel}</p>
            <p className="mt-1 text-xs text-muted">
              Pagas en efectivo o datáfono directamente al mensajero cuando recibas tu pedido.
            </p>
          </div>

          <label className="flex items-start gap-2 text-sm text-muted">
            <input type="checkbox" className="mt-1" {...register("confirm")} />
            Confirmo que los datos son correctos y deseo realizar este pedido con pago contra entrega.
          </label>
          {errors.confirm && <p className={errorClass}>{errors.confirm.message}</p>}

          {serverError && <p className="text-sm text-red-400">{serverError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-[#1a1408] transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {submitting ? "Procesando..." : "Confirmar pedido"}
          </button>
        </div>

        <div className="h-fit rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold">Resumen del pedido</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <li key={`${item.productId}-${item.variant ?? ""}`} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm">{item.name}</p>
                  <p className="text-xs text-muted">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal())}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-muted">
            <span>Envío</span>
            <span className="text-accent">Gratis</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(subtotal())}</span>
          </div>
        </div>
      </form>
    </div>
  );
}

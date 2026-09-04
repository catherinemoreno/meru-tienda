import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getOrderByNumber } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ConfirmacionPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const order = await getOrderByNumber(numero);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-accent" />
      <h1 className="mt-4 font-display text-3xl font-semibold">¡Pedido recibido!</h1>
      <p className="mt-2 text-muted">
        Gracias por tu compra, {order.customer.fullName.split(" ")[0]}. Te contactaremos pronto para
        confirmar la entrega.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-left">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Número de pedido</p>
            <p className="font-display text-xl font-semibold text-accent">{order.number}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted">Fecha</p>
            <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("es-CO")}</p>
          </div>
        </div>

        <ul className="mt-5 flex flex-col divide-y divide-border">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.variant ?? ""}`} className="flex items-center gap-3 py-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 text-sm">
                <p className="line-clamp-1">{item.name}</p>
                <p className="text-xs text-muted">{item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        <div className="mt-4 rounded-xl bg-surface-2 p-4 text-sm text-muted">
          <p><strong className="text-foreground">Ciudad de entrega:</strong> {order.customer.city}, {order.customer.department}</p>
          <p className="mt-1"><strong className="text-foreground">Forma de pago:</strong> {order.paymentMethod}</p>
          <p className="mt-2 text-xs">Pagas en efectivo o datáfono al recibir tu pedido. Ningún cobro se hace por anticipado.</p>
        </div>
      </div>

      <Link
        href="/tienda"
        className="mt-8 inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-[#1a1408]"
      >
        Seguir comprando
      </Link>
    </div>
  );
}

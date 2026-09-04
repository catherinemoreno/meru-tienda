import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getOrderByNumber } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPedidoDetallePage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const order = await getOrderByNumber(numero);
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/pedidos" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Volver a pedidos
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Pedido {order.number}</h1>
        <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-accent">{order.status}</span>
      </div>
      <p className="mt-1 text-sm text-muted">
        {new Date(order.createdAt).toLocaleString("es-CO")}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Productos</h2>
          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.variant ?? ""}`} className="flex gap-3 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.variant && <p className="text-xs text-muted">{item.variant}</p>}
                  <p className="text-xs text-muted">{item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
            <div className="flex justify-between text-sm text-muted"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-sm text-muted"><span>Envío</span><span>{order.shipping === 0 ? "Gratis" : formatPrice(order.shipping)}</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Cliente</h2>
          <div className="rounded-2xl border border-border bg-surface p-4 text-sm">
            <p className="font-medium">{order.customer.fullName}</p>
            <p className="mt-1 text-muted">{order.customer.phone}</p>
            <p className="text-muted">{order.customer.email}</p>
            <p className="mt-3 text-muted">{order.customer.address}</p>
            <p className="text-muted">{order.customer.neighborhood}</p>
            <p className="text-muted">{order.customer.city}, {order.customer.department}</p>
            {order.customer.reference && <p className="mt-2 text-muted">Referencia: {order.customer.reference}</p>}
            {order.customer.notes && <p className="mt-2 text-muted">Notas: {order.customer.notes}</p>}
            <p className="mt-3 font-medium text-accent">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

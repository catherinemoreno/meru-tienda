"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

const statuses: OrderStatus[] = [
  "Nuevo",
  "Confirmando",
  "Confirmado",
  "En preparación",
  "Enviado",
  "Entregado",
  "Cancelado",
];

const statusColor: Record<OrderStatus, string> = {
  Nuevo: "bg-blue-500/15 text-blue-400",
  Confirmando: "bg-amber-500/15 text-amber-400",
  Confirmado: "bg-accent/15 text-accent",
  "En preparación": "bg-purple-500/15 text-purple-400",
  Enviado: "bg-cyan-500/15 text-cyan-400",
  Entregado: "bg-emerald-500/15 text-emerald-400",
  Cancelado: "bg-red-500/15 text-red-400",
};

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/orders");
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleStatusChange(number: string, status: OrderStatus) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, status }),
    });
    load();
  }

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.number.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.city.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Pedidos</h1>

      <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por número, cliente o ciudad..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-4 py-3">Número</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Ciudad</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="px-4 py-6 text-muted" colSpan={6}>Cargando...</td></tr>}
            {!loading && filtered.length === 0 && (
              <tr><td className="px-4 py-6 text-muted" colSpan={6}>Sin datos todavía.</td></tr>
            )}
            {filtered.map((o) => (
              <tr key={o.number} className="border-t border-border">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/pedidos/${o.number}`} className="hover:text-accent">
                    {o.number}
                  </Link>
                </td>
                <td className="px-4 py-3">{o.customer.fullName}</td>
                <td className="px-4 py-3">{o.customer.city}</td>
                <td className="px-4 py-3">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.number, e.target.value as OrderStatus)}
                    className={cn("rounded-full border-none px-2.5 py-1 text-xs font-medium", statusColor[o.status])}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s} className="bg-surface text-foreground">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/pedidos/${o.number}`} className="text-xs text-accent hover:underline">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

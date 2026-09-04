import { Package, ShoppingCart, DollarSign, Sparkles, Eye, ShoppingBag } from "lucide-react";
import { listOrders } from "@/lib/orders";
import { listAllProducts } from "@/lib/data/productsStore";
import { getVisitCount, getVisitsByCountry, getTopViewedProducts } from "@/lib/data/visitsStore";
import { getAbandonedCartsCount } from "@/lib/data/cartEventsStore";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const orders = await listOrders();
  const products = await listAllProducts();
  const visits = await getVisitCount();
  const countries = await getVisitsByCountry();
  const topViewed = await getTopViewedProducts();
  const abandonedCarts = await getAbandonedCartsCount();

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const newOrders = orders.filter((o) => o.status === "Nuevo").length;

  const topViewedWithNames = topViewed.map((v) => {
    const product = products.find((p) => p.slug === v.slug);
    return { name: product?.name ?? v.slug, count: v.count };
  });

  const cards = [
    {
      label: "Visitas a la tienda",
      value: visits.toString(),
      icon: Eye,
    },
    {
      label: "Carritos abandonados",
      value: abandonedCarts.toString(),
      icon: ShoppingBag,
    },
    {
      label: "Pedidos totales",
      value: orders.length > 0 ? orders.length.toString() : "0",
      icon: ShoppingCart,
    },
    {
      label: "Pedidos nuevos",
      value: newOrders > 0 ? newOrders.toString() : "0",
      icon: Sparkles,
    },
    {
      label: "Productos totales",
      value: products.length.toString(),
      icon: Package,
    },
    {
      label: "Ventas totales",
      value: orders.length > 0 ? formatPrice(totalSales) : "Sin datos todavía",
      icon: DollarSign,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-muted">Resumen general de tu tienda.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-surface p-5">
            <c.icon className="h-5 w-5 text-accent" />
            <p className="mt-3 text-2xl font-semibold">{c.value}</p>
            <p className="mt-1 text-sm text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Visitas por país</h2>
          {countries.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
              Todavía no hay suficientes visitas para mostrar un desglose por país.
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {countries.map((c) => (
                    <tr key={c.country} className="border-t border-border first:border-t-0">
                      <td className="px-4 py-3">{c.country}</td>
                      <td className="px-4 py-3 text-right font-medium">{c.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Productos más vistos</h2>
          {topViewedWithNames.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
              Todavía no hay suficientes visitas a productos para mostrar un ranking.
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {topViewedWithNames.map((p) => (
                    <tr key={p.name} className="border-t border-border first:border-t-0">
                      <td className="px-4 py-3">{p.name}</td>
                      <td className="px-4 py-3 text-right font-medium">{p.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Últimos pedidos</h2>
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
            Todavía no hay pedidos reales. Aparecerán aquí cuando un cliente confirme una compra en el checkout.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-muted">
                <tr>
                  <th className="px-4 py-3">Número</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Ciudad</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.number} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{o.number}</td>
                    <td className="px-4 py-3">{o.customer.fullName}</td>
                    <td className="px-4 py-3">{o.customer.city}</td>
                    <td className="px-4 py-3">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

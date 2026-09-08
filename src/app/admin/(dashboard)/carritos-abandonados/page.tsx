import { Phone, Mail, MessageCircle } from "lucide-react";
import { getAbandonedCarts } from "@/lib/data/cartEventsStore";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("57") && digits.length > 10) return digits;
  return "57" + digits;
}

function whatsappLink(phone: string): string {
  const base = "https://wa.me/" + whatsappNumber(phone);
  const message = "Hola! Vimos que dejaste unos productos en tu carrito en Meru, te ayudamos a completar tu pedido?";
  return base + "?text=" + encodeURIComponent(message);
}

export default async function CarritosAbandonadosPage() {
  const carts = await getAbandonedCarts();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Carritos abandonados</h1>
      <p className="mt-1 text-muted">
        Personas que agregaron productos al carrito pero no terminaron el pedido. Los datos de
        contacto solo aparecen si alcanzaron a escribirlos en el checkout.
      </p>

      {carts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          Todavia no hay carritos abandonados registrados.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {carts.map((cart) => (
            <div key={cart.sessionId} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">
                  {cart.fullName ?? "Sin nombre (no alcanzo a escribirlo)"}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                  {cart.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {cart.phone}
                    </span>
                  )}
                  {cart.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {cart.email}
                    </span>
                  )}
                  {!cart.phone && !cart.email && <span>Sin datos de contacto</span>}
                </div>
                <p className="mt-2 text-sm">
                  <span className="text-muted">Productos: </span>
                  {cart.products.join(", ")}
                </p>
                <p className="mt-1 text-xs text-muted">Ultima actividad: {formatDate(cart.lastActivity)}</p>
              </div>

              {cart.phone && (
                <a href={whatsappLink(cart.phone)} target="_blank" rel="noreferrer" className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4" /> Escribir por WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

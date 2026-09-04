// Registro de "agregar al carrito" para poder calcular carritos abandonados:
// una sesión de navegador que agregó productos al carrito pero nunca terminó
// un pedido (orders.session_id no coincide con ningún cart_events.session_id).
import { isSupabaseAdminConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function logCartEvent(
  sessionId: string,
  productSlug: string,
  productName: string
): Promise<void> {
  if (!isSupabaseAdminConfigured()) return;
  const db = getSupabaseAdmin();
  await db.from("cart_events").insert({
    session_id: sessionId,
    product_slug: productSlug,
    product_name: productName,
  });
}

export async function getAbandonedCartsCount(): Promise<number> {
  if (!isSupabaseAdminConfigured()) return 0;
  const db = getSupabaseAdmin();

  const { data: cartRows, error: cartError } = await db
    .from("cart_events")
    .select("session_id");
  if (cartError || !cartRows) return 0;

  const { data: orderRows, error: orderError } = await db
    .from("orders")
    .select("session_id");
  if (orderError) return 0;

  const purchasedSessions = new Set(
    (orderRows ?? [])
      .map((r) => (r as { session_id: string | null }).session_id)
      .filter((s): s is string => !!s)
  );

  const cartSessions = new Set(
    (cartRows as { session_id: string }[]).map((r) => r.session_id)
  );

  let abandoned = 0;
  for (const session of cartSessions) {
    if (!purchasedSessions.has(session)) abandoned++;
  }
  return abandoned;
}

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

// Guarda (o actualiza) los datos de contacto que la persona alcanzó a
// escribir en el checkout, aunque nunca haya terminado el pedido. Se llama
// desde el checkout cada vez que sale de un campo (onBlur), así que se va
// completando poco a poco. Es "best effort": si falla, no rompe el
// checkout.
export async function saveCheckoutContact(
  sessionId: string,
  contact: { fullName?: string; phone?: string; email?: string }
): Promise<void> {
  if (!isSupabaseAdminConfigured()) return;
  const db = getSupabaseAdmin();
  const patch: Record<string, string> = {};
  if (contact.fullName) patch.full_name = contact.fullName;
  if (contact.phone) patch.phone = contact.phone;
  if (contact.email) patch.email = contact.email;
  if (Object.keys(patch).length === 0) return;
  await db
    .from("checkout_contacts")
    .upsert(
      { session_id: sessionId, ...patch, updated_at: new Date().toISOString() },
      { onConflict: "session_id" }
    );
}

export type AbandonedCart = {
  sessionId: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  products: string[];
  lastActivity: string | null;
};

// Lista completa de carritos abandonados: sesiones que agregaron productos
// pero nunca completaron un pedido, con los datos de contacto que hayan
// alcanzado a escribir (si los escribieron) y los productos que dejaron en
// el carrito.
export async function getAbandonedCarts(): Promise<AbandonedCart[]> {
  if (!isSupabaseAdminConfigured()) return [];
  const db = getSupabaseAdmin();

  const { data: cartRows, error: cartError } = await db
    .from("cart_events")
    .select("session_id, product_name, created_at")
    .order("created_at", { ascending: false });
  if (cartError || !cartRows) return [];

  const { data: orderRows } = await db.from("orders").select("session_id");
  const purchasedSessions = new Set(
    (orderRows ?? [])
      .map((r) => (r as { session_id: string | null }).session_id)
      .filter((s): s is string => !!s)
  );

  const { data: contactRows } = await db
    .from("checkout_contacts")
    .select("session_id, full_name, phone, email");
  const contactBySession = new Map(
    (contactRows ?? []).map((c) => [
      (c as { session_id: string }).session_id,
      c as { full_name: string | null; phone: string | null; email: string | null },
    ])
  );

  const bySession = new Map
    string,
    { products: Set<string>; lastActivity: string }
  >();
  for (const row of cartRows as { session_id: string; product_name: string; created_at: string }[]) {
    if (purchasedSessions.has(row.session_id)) continue;
    const existing = bySession.get(row.session_id);
    if (existing) {
      existing.products.add(row.product_name);
    } else {
      bySession.set(row.session_id, {
        products: new Set([row.product_name]),
        lastActivity: row.created_at,
      });
    }
  }

  return Array.from(bySession.entries()).map(([sessionId, info]) => {
    const contact = contactBySession.get(sessionId);
    return {
      sessionId,
      fullName: contact?.full_name ?? null,
      phone: contact?.phone ?? null,
      email: contact?.email ?? null,
      products: Array.from(info.products),
      lastActivity: info.lastActivity,
    };
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

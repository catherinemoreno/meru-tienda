// Almacén de pedidos del lado servidor.
//
// Si Supabase está configurado (ver src/lib/supabase/admin.ts), lee/escribe
// en la tabla "orders" usando la service_role key (solo se ejecuta en
// servidor: API routes y Server Components, nunca en el navegador).
//
// Si NO está configurado, usa un array en memoria (singleton vía globalThis
// para sobrevivir al hot-reload de Next en desarrollo) — comportamiento
// idéntico al actual, cero regresión.
import { Order, OrderItem, OrderStatus } from "@/types";
import { isSupabaseAdminConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

type GlobalWithOrders = typeof globalThis & {
  __orders?: Order[];
  __orderSeq?: number;
};
const g = globalThis as GlobalWithOrders;

if (!g.__orders) g.__orders = [];
if (!g.__orderSeq) g.__orderSeq = 1000;

type OrderRow = {
  order_number: string;
  created_at: string;
  status: OrderStatus;
  customer_name: string;
  phone: string;
  email: string;
  department: string;
  city: string;
  address: string;
  neighborhood: string;
  reference: string | null;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  session_id: string | null;
};

function rowToOrder(row: OrderRow): Order {
  return {
    number: row.order_number,
    createdAt: row.created_at,
    status: row.status,
    customer: {
      fullName: row.customer_name,
      phone: row.phone,
      email: row.email,
      department: row.department,
      city: row.city,
      address: row.address,
      neighborhood: row.neighborhood,
      reference: row.reference ?? undefined,
      notes: row.notes ?? undefined,
    },
    items: row.items,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    paymentMethod: "Pago contra entrega",
  };
}

export async function createOrder(input: {
  customer: Order["customer"];
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  sessionId?: string;
}): Promise<Order> {
  if (isSupabaseAdminConfigured()) {
    const db = getSupabaseAdmin();
    const orderNumber = `MERU-${Date.now().toString().slice(-6)}`;
    const { data, error } = await db
      .from("orders")
      .insert({
        order_number: orderNumber,
        status: "Nuevo",
        customer_name: input.customer.fullName,
        phone: input.customer.phone,
        email: input.customer.email,
        department: input.customer.department,
        city: input.customer.city,
        address: input.customer.address,
        neighborhood: input.customer.neighborhood,
        reference: input.customer.reference ?? null,
        notes: input.customer.notes ?? null,
        items: input.items,
        subtotal: input.subtotal,
        shipping: input.shipping,
        total: input.total,
        session_id: input.sessionId ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToOrder(data as OrderRow);
  }

  g.__orderSeq = (g.__orderSeq ?? 1000) + 1;
  const order: Order = {
    number: `MERU-${g.__orderSeq}`,
    createdAt: new Date().toISOString(),
    status: "Nuevo",
    paymentMethod: "Pago contra entrega",
    ...input,
  };
  g.__orders!.unshift(order);
  return order;
}

export async function listOrders(): Promise<Order[]> {
  if (isSupabaseAdminConfigured()) {
    const db = getSupabaseAdmin();
    const { data, error } = await db.from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as OrderRow[]).map(rowToOrder);
  }
  return g.__orders!;
}

export async function getOrderByNumber(number: string): Promise<Order | undefined> {
  if (isSupabaseAdminConfigured()) {
    const db = getSupabaseAdmin();
    const { data, error } = await db.from("orders").select("*").eq("order_number", number).maybeSingle();
    if (error) throw error;
    return data ? rowToOrder(data as OrderRow) : undefined;
  }
  return g.__orders!.find((o) => o.number === number);
}

export async function updateOrderStatus(number: string, status: OrderStatus): Promise<Order | undefined> {
  if (isSupabaseAdminConfigured()) {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("orders")
      .update({ status })
      .eq("order_number", number)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data ? rowToOrder(data as OrderRow) : undefined;
  }
  const order = g.__orders!.find((o) => o.number === number);
  if (order) order.status = status;
  return order;
}

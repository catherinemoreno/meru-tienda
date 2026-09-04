import { NextRequest, NextResponse } from "next/server";
import { createOrder, listOrders, updateOrderStatus } from "@/lib/orders";
import { sendNewOrderEmail } from "@/lib/email";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.customer || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Datos de pedido incompletos" }, { status: 400 });
    }

    const order = await createOrder({
      customer: body.customer,
      items: body.items,
      subtotal: body.subtotal ?? 0,
      shipping: body.shipping ?? 0,
      total: body.total ?? body.subtotal ?? 0,
      sessionId: typeof body.sessionId === "string" ? body.sessionId : undefined,
    });

    await sendNewOrderEmail(order);

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No pudimos procesar el pedido" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json(await listOrders());
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { number, status } = await req.json();
  const order = await updateOrderStatus(number, status);
  if (!order) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  return NextResponse.json(order);
}

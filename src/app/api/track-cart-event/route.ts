import { NextRequest, NextResponse } from "next/server";
import { logCartEvent } from "@/lib/data/cartEventsStore";

// Endpoint público (sin autenticación) que registra cuando alguien agrega un
// producto al carrito. Lo llama el store del carrito (src/lib/store/cart.ts).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 100) : "";
    const productSlug = typeof body.productSlug === "string" ? body.productSlug.slice(0, 200) : "";
    const productName = typeof body.productName === "string" ? body.productName.slice(0, 200) : "";
    if (sessionId && productSlug) {
      await logCartEvent(sessionId, productSlug, productName);
    }
  } catch {
    // Nunca romper la experiencia de compra por un fallo al registrar el evento.
  }
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { saveCheckoutContact } from "@/lib/data/cartEventsStore";

// Endpoint público (sin sesión de admin) llamado desde el checkout mientras
// la persona escribe sus datos, para poder identificarla si abandona el
// carrito antes de terminar el pedido. No expone nada sensible: solo
// escribe, nunca lee ni devuelve datos de otras sesiones.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
    if (!sessionId) {
      return NextResponse.json({ error: "Falta sessionId" }, { status: 400 });
    }
    await saveCheckoutContact(sessionId, {
      fullName: typeof body.fullName === "string" ? body.fullName : undefined,
      phone: typeof body.phone === "string" ? body.phone : undefined,
      email: typeof body.email === "string" ? body.email : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Silencioso a propósito: esto nunca debe romper el checkout del cliente.
    return NextResponse.json({ ok: true });
  }
}

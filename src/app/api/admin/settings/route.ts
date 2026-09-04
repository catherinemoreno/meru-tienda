import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getStoreSettings, updateStoreSettings } from "@/lib/data/settingsStore";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await getStoreSettings());
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const partial: Record<string, string> = {};
  if (typeof body.whatsappNumber === "string") partial.whatsappNumber = body.whatsappNumber.trim();
  if (typeof body.tiktok === "string") partial.tiktok = body.tiktok.trim();
  if (typeof body.instagram === "string") partial.instagram = body.instagram.trim();
  if (typeof body.facebook === "string") partial.facebook = body.facebook.trim();
  if (typeof body.city === "string") partial.city = body.city.trim();

  try {
    const settings = await updateStoreSettings(partial);
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo guardar la configuración" },
      { status: 500 }
    );
  }
}

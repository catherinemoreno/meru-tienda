import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const BUCKET = "review-photos";
const MAX_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "No disponible" }, { status: 501 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No se recibio ningun archivo" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ error: "Formato no soportado. Usa una imagen JPG, PNG o WEBP." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "La imagen es demasiado grande (maximo 4MB)." }, { status: 400 });
  }

  const uniqueName = Date.now() + "-" + Math.random().toString(36).slice(2, 10) + "." + extension;

  const db = getSupabaseAdmin();
  const arrayBuffer = await file.arrayBuffer();

  const uploadResult = await db.storage.from(BUCKET).upload(uniqueName, arrayBuffer, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadResult.error) {
    return NextResponse.json({ error: "No se pudo subir la imagen" }, { status: 500 });
  }

  const publicUrlResult = db.storage.from(BUCKET).getPublicUrl(uniqueName);

  return NextResponse.json({ url: publicUrlResult.data.publicUrl }, { status: 201 });
}

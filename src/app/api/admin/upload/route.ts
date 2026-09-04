import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const BUCKET = "product-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "La carga de imágenes requiere Supabase conectado (faltan las variables de entorno de Supabase en este entorno). Configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para poder subir fotos.",
      },
      { status: 501 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Formato no soportado. Usa una imagen JPG, PNG, WEBP o GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "La imagen es demasiado grande (máximo 5MB)." },
      { status: 400 }
    );
  }

  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

  const supabase = getSupabaseAdmin();
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(uniqueName, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `No se pudo subir la imagen: ${uploadError.message}` },
      { status: 500 }
    );
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(uniqueName);

  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}

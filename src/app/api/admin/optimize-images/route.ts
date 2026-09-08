import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getAdminSession } from "@/lib/auth";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export const maxDuration = 60;

const BUCKET = "product-images";
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 82;
const SKIP_IF_UNDER_BYTES = 350 * 1024;
const BATCH_SIZE = 3;

type ProductRow = {
  id: string;
  images: string[] | null;
};

function extractStoragePath(url: string): string | null {
  const marker = "/object/public/" + BUCKET + "/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 501 });
  }

  const body = await req.json().catch(() => ({}));
  const offset = typeof body.offset === "number" ? body.offset : 0;

  const db = getSupabaseAdmin();

  const countResult = await db.from("products").select("id", { count: "exact", head: true });
  const total = countResult.count ?? 0;

  const pageResult = await db
    .from("products")
    .select("id, images")
    .order("id", { ascending: true })
    .range(offset, offset + BATCH_SIZE - 1);

  if (pageResult.error) {
    return NextResponse.json({ error: pageResult.error.message }, { status: 500 });
  }

  const rows = (pageResult.data ?? []) as ProductRow[];

  let optimized = 0;
  let skipped = 0;
  let failed = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;
  const log: string[] = [];

  for (const product of rows) {
    const images = product.images ?? [];
    for (const url of images) {
      const path = extractStoragePath(url);
      if (!path) {
        skipped++;
        continue;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) {
          failed++;
          log.push("No se pudo descargar: " + path);
          continue;
        }
        const originalBuffer = Buffer.from(await res.arrayBuffer());
        if (originalBuffer.byteLength <= SKIP_IF_UNDER_BYTES) {
          skipped++;
          continue;
        }
        const optimizedBuffer = await sharp(originalBuffer)
          .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: JPEG_QUALITY })
          .toBuffer();

        if (optimizedBuffer.byteLength >= originalBuffer.byteLength) {
          skipped++;
          continue;
        }

        const uploadResult = await db.storage.from(BUCKET).upload(path, optimizedBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

        if (uploadResult.error) {
          failed++;
          log.push("Error al subir " + path + ": " + uploadResult.error.message);
          continue;
        }

        optimized++;
        bytesBefore += originalBuffer.byteLength;
        bytesAfter += optimizedBuffer.byteLength;
      } catch (err) {
        failed++;
        const message = err instanceof Error ? err.message : "Error desconocido";
        log.push("Error con " + path + ": " + message);
      }
    }
  }

  const nextOffset = offset + BATCH_SIZE;
  const done = nextOffset >= total;

  return NextResponse.json({
    processedProducts: rows.length,
    optimized,
    skipped,
    failed,
    bytesBefore,
    bytesAfter,
    log,
    nextOffset,
    total,
    done,
  });
}

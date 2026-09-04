// Cliente de Supabase con la service_role key — SOLO para uso del lado
// servidor (API routes bajo src/app/api/**). NUNCA importar este archivo
// desde un componente cliente ("use client") ni desde código que pueda
// terminar en el bundle del navegador: la service_role key se salta RLS.
//
// SUPABASE_SERVICE_ROLE_KEY (sin prefijo NEXT_PUBLIC_) solo existe en el
// entorno del servidor, así que nunca llega al navegador.
import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(supabaseUrl && serviceRoleKey);
}

let cached: SupabaseClient | null = null;

// Se crea de forma perezosa: si aún no hay Supabase configurado, no falla al
// importar el módulo, solo al intentar usarlo sin credenciales.
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      "Supabase no está configurado (faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
  if (!cached) {
    cached = createClient(supabaseUrl as string, serviceRoleKey as string, {
      auth: { persistSession: false },
    });
  }
  return cached;
}

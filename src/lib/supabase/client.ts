// Cliente de Supabase para el navegador / componentes de servidor de lectura.
//
// Usa SOLO las variables públicas (NEXT_PUBLIC_*), que están pensadas para
// ir en el bundle del navegador y depender de RLS (Row Level Security) para
// la seguridad — es el patrón estándar de Supabase.
//
// Si las variables no están definidas (fase actual, sin Supabase conectado),
// `supabase` queda en null y NO se rompe el build ni `next dev`: el resto de
// la app debe usar `isSupabaseConfigured()` para decidir si consulta
// Supabase o cae de nuevo a los datos mock. Nunca importes la service_role
// key aquí — esta pieza de código se puede ejecutar en el cliente.
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Cliente singleton (o null si no está configurado). Úsalo solo para
// lecturas públicas (categories, products activos). Para escrituras
// sensibles (pedidos, admin) usa src/lib/supabase/admin.ts desde una API
// route, nunca este cliente.
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

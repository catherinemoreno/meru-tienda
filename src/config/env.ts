// Configuración de entorno / integraciones externas.
// Hoy no se usa realmente (la capa de datos es mock), pero queda lista para
// que al conectar Supabase / Resend solo haya que definir variables de
// entorno, sin tocar código de negocio.

export const env = {
  supabase: {
    // Variables públicas: van al bundle del navegador, protegidas por RLS.
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    // Secreta: solo se lee en servidor (API routes / Server Components), ver
    // src/lib/supabase/admin.ts. Nunca referenciar esto desde un componente
    // cliente.
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY ?? "",
    fromEmail: process.env.RESEND_FROM_EMAIL ?? "pedidos@meru.co",
  },
  admin: {
    user: process.env.ADMIN_USER ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "meru2024",
    sessionSecret: process.env.ADMIN_SESSION_SECRET ?? "meru-dev-secret-cambiar-en-prod",
  },
  // Ver también src/lib/supabase/client.ts (isSupabaseConfigured) y
  // src/lib/supabase/admin.ts (isSupabaseAdminConfigured), que son las
  // fuentes de verdad usadas realmente por la capa de datos.
  isSupabaseConfigured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
};

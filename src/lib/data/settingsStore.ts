// Configuración de contacto/redes que la dueña puede editar ella misma desde
// el admin (antes vivía fija en src/config/store.ts). Si Supabase no está
// configurado, se usan los valores de src/config/store.ts como respaldo.
import { isSupabaseAdminConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { storeConfig } from "@/config/store";

export type StoreSettings = {
  whatsappNumber: string;
  tiktok: string;
  instagram: string;
  facebook: string;
  city: string;
};

const defaults: StoreSettings = {
  whatsappNumber: storeConfig.whatsapp.number,
  tiktok: storeConfig.social.tiktok,
  instagram: storeConfig.social.instagram,
  facebook: storeConfig.social.facebook,
  city: storeConfig.contact.city,
};

type SettingsRow = {
  whatsapp_number: string | null;
  tiktok: string | null;
  instagram: string | null;
  facebook: string | null;
  city: string | null;
};

function rowToSettings(row: SettingsRow | null): StoreSettings {
  if (!row) return defaults;
  return {
    whatsappNumber: row.whatsapp_number || defaults.whatsappNumber,
    tiktok: row.tiktok || defaults.tiktok,
    instagram: row.instagram || defaults.instagram,
    facebook: row.facebook || defaults.facebook,
    city: row.city || defaults.city,
  };
}

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!isSupabaseAdminConfigured()) return defaults;
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("store_settings")
    .select("whatsapp_number, tiktok, instagram, facebook, city")
    .eq("id", "default")
    .maybeSingle();
  if (error || !data) return defaults;
  return rowToSettings(data as SettingsRow);
}

export async function updateStoreSettings(
  partial: Partial<StoreSettings>
): Promise<StoreSettings> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      "Supabase no está configurado en este entorno, así que no se puede guardar la configuración."
    );
  }
  const current = await getStoreSettings();
  const merged = { ...current, ...partial };

  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("store_settings")
    .upsert({
      id: "default",
      whatsapp_number: merged.whatsappNumber,
      tiktok: merged.tiktok,
      instagram: merged.instagram,
      facebook: merged.facebook,
      city: merged.city,
    })
    .select("whatsapp_number, tiktok, instagram, facebook, city")
    .single();
  if (error) throw error;
  return rowToSettings(data as SettingsRow);
}

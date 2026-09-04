import type { Metadata } from "next";
import "./globals.css";
import { storeConfig } from "@/config/store";
import StoreChrome from "@/components/layout/StoreChrome";
import { getStoreSettings } from "@/lib/data/settingsStore";

// Nota: next/font/google requiere acceso a fonts.googleapis.com en tiempo de
// build, bloqueado en este entorno. Se usan pilas de fuentes del sistema que
// imitan Manrope (sans) y Space Grotesk (display); en un entorno con acceso a
// internet se pueden restaurar con next/font/google sin tocar el resto del
// código (las variables CSS --font-manrope / --font-space-grotesk ya están
// referenciadas en globals.css).

export const metadata: Metadata = {
  title: {
    default: `${storeConfig.name} — ${storeConfig.tagline}`,
    template: `%s | ${storeConfig.name}`,
  },
  description: storeConfig.description,
  openGraph: {
    title: storeConfig.name,
    description: storeConfig.description,
    type: "website",
    locale: "es_CO",
  },
};

export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getStoreSettings();
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <StoreChrome settings={settings}>{children}</StoreChrome>
      </body>
    </html>
  );
}

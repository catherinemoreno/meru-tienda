import Link from "next/link";
import { AtSign, Globe, Music2, Phone } from "lucide-react";
import { storeConfig } from "@/config/store";
import { categories } from "@/lib/data/categories";
import { StoreSettings } from "@/lib/data/settingsStore";

export default function Footer({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="font-display text-2xl font-bold">
            {storeConfig.name}
            <span className="text-accent">.</span>
          </Link>
          <p className="mt-3 text-sm text-muted">{storeConfig.description}</p>
          <div className="mt-4 flex items-center gap-3">
            <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <AtSign className="h-5 w-5 text-muted transition-colors hover:text-accent" />
            </a>
            <a href={settings.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
              <Music2 className="h-5 w-5 text-muted transition-colors hover:text-accent" />
            </a>
            <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Globe className="h-5 w-5 text-muted transition-colors hover:text-accent" />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Categorías</p>
          <ul className="flex flex-col gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categoria/${c.slug}`}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Atención al cliente</p>
          <ul className="flex flex-col gap-2 text-sm text-muted">
            <li><Link href="/politicas/envios" className="hover:text-accent">Envíos</Link></li>
            <li><Link href="/politicas/cambios-devoluciones" className="hover:text-accent">Cambios y devoluciones</Link></li>
            <li><Link href="/politicas/terminos" className="hover:text-accent">Términos y condiciones</Link></li>
            <li><Link href="/politicas/privacidad" className="hover:text-accent">Política de privacidad</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Contacto</p>
          <ul className="flex flex-col gap-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +{settings.whatsappNumber}
            </li>
            <li>{settings.city}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {storeConfig.legalName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}

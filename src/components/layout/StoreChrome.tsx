"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { StoreSettings } from "@/lib/data/settingsStore";

export default function StoreChrome({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: StoreSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    try {
      if (sessionStorage.getItem("meru_visit_logged")) return;
      sessionStorage.setItem("meru_visit_logged", "1");
    } catch {
      // Si sessionStorage no está disponible, seguimos sin registrar (no rompe nada).
      return;
    }
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <TopBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton whatsappNumber={settings.whatsappNumber} />
    </>
  );
}

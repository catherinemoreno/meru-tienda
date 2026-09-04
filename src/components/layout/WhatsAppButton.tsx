"use client";

import { storeConfig } from "@/config/store";

// Ícono oficial de WhatsApp (en lugar del globo de chat genérico).
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor" aria-hidden="true">
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.24.617 4.435 1.787 6.35L4 29l7.84-1.746A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.356l-.355-.21-4.653 1.036 1.02-4.53-.232-.372A9.66 9.66 0 0 1 5.25 15c0-5.93 4.823-10.75 10.754-10.75S26.75 9.07 26.75 15 21.935 24.75 16.004 24.75Zm5.61-7.31c-.307-.154-1.816-.897-2.098-.998-.281-.103-.487-.154-.692.153-.205.308-.795.998-.975 1.204-.179.205-.36.23-.667.077-.307-.154-1.296-.478-2.469-1.524-.913-.814-1.53-1.82-1.709-2.128-.179-.307-.02-.473.135-.626.138-.138.307-.36.46-.54.154-.18.205-.308.307-.513.103-.205.052-.385-.026-.539-.077-.153-.692-1.667-.949-2.284-.25-.6-.505-.519-.692-.529-.179-.009-.384-.011-.59-.011-.205 0-.538.077-.82.385-.281.307-1.075 1.05-1.075 2.563 0 1.512 1.101 2.973 1.255 3.179.154.205 2.166 3.31 5.248 4.64.733.316 1.305.505 1.751.647.735.234 1.404.201 1.933.122.59-.088 1.816-.742 2.072-1.46.256-.717.256-1.332.179-1.46-.077-.128-.282-.205-.59-.36Z" />
    </svg>
  );
}

export default function WhatsAppButton({ whatsappNumber }: { whatsappNumber: string }) {
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    storeConfig.whatsapp.defaultMessage
  )}`;

  return (
    <a href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform hover:scale-105 active:scale-95"
    >
      <WhatsAppIcon />
    </a>
  );
}

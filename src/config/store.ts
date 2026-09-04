// Configuración central de la tienda.
// FASE ACTUAL: valores estáticos en código.
// FASE FUTURA: este objeto vendrá de una tabla "store_settings" en Supabase,
// editable desde un panel admin de configuración. Mientras tanto, para cambiar
// cualquier dato de marca (nombre, colores, textos del hero, whatsapp, etc.)
// basta con editar este archivo — nada de esto está hardcodeado en componentes.

export const storeConfig = {
  name: "Meru",
  legalName: "Meru Store Colombia",
  tagline: "Descubre cosas que no sabías que necesitabas",
  slogan: "Hogar, estilo y hallazgos virales, con pago contra entrega",
  description:
    "Meru es una tienda en línea colombiana con productos de hogar, herramientas, moda, decoración, bienestar, tecnología y los hallazgos más virales de redes sociales. Paga contra entrega en toda Colombia.",

  whatsapp: {
    number: "573106165441", // formato internacional sin '+', usado en wa.me
    defaultMessage:
      "¡Hola! Vengo desde la página de Meru y tengo una pregunta 🙂",
  },

  contact: {
    adminEmail: "katerineanlly@gmail.com",
    supportEmail: "katerineanlly@gmail.com",
    city: "Bogotá, Colombia",
  },

  social: {
    instagram: "https://instagram.com/meru.co",
    tiktok: "https://tiktok.com/@meru.co",
    facebook: "https://facebook.com/meru.co",
  },

  // Acento premium: ámbar/dorado cálido
  colors: {
    accent: "#D9A857",
    accentSoft: "#EBC98A",
    accentDark: "#B8863A",
  },

  topBanner: {
    enabled: true,
    text: "Envíos a todo Colombia · Pago contra entrega",
  },

  hero: {
    eyebrow: "Nueva colección",
    title: "Encuentra lo que no sabías que necesitabas",
    subtitle:
      "Productos curados de hogar, tecnología, moda y los hallazgos más virales del momento, con pago contra entrega en toda Colombia.",
    ctaPrimary: { label: "Explorar tienda", href: "/tienda" },
    ctaSecondary: { label: "Ver Hallazgos", href: "/categoria/hallazgos" },
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
  },

  trust: [
    { title: "Pago contra entrega", desc: "Paga cuando recibas tu pedido, sin adelantos." },
    { title: "Envíos a toda Colombia", desc: "Llegamos a la mayoría de ciudades y municipios." },
    { title: "Cambios sencillos", desc: "Hasta 8 días para cambios si algo no te queda bien." },
    { title: "Atención por WhatsApp", desc: "Resolvemos tus dudas antes y después de comprar." },
  ],

  checkout: {
    freeShipping: true,
    shippingLabel: "Envío gratis",
    paymentMethodLabel: "Pago contra entrega",
  },

  admin: {
    // Solo para autenticación básica de esta fase. En producción usar
    // ADMIN_USER / ADMIN_PASSWORD reales vía variables de entorno.
    defaultUser: "admin",
    defaultPassword: "meru2024",
  },
} as const;

export type StoreConfig = typeof storeConfig;

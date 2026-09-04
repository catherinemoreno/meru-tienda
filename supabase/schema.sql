-- =============================================================================
-- Meru — esquema de base de datos para Supabase
-- =============================================================================
-- Cómo usar este archivo:
--   1. Entra a tu proyecto en https://supabase.com/dashboard
--   2. En el menú lateral, abre "SQL Editor" (es una página web, no una
--      terminal).
--   3. Pega TODO el contenido de este archivo y dale a "Run".
--   4. Después corre supabase/seed.sql de la misma forma (opcional, son
--      datos de demostración).
--
-- Este script es seguro de re-ejecutar (usa "if not exists" / "or replace"
-- donde aplica), pero está pensado para correrse UNA sola vez sobre un
-- proyecto nuevo.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  tagline      text,
  parent_id    uuid references public.categories (id) on delete set null,
  image_url    text,
  subcategories text[] not null default '{}',
  sort_order   integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

comment on table public.categories is
  'Categorías y subcategorías de la tienda. Una fila con parent_id = null es una categoría raíz (ej. "Hogar"); '
  'el campo subcategories guarda los nombres de subcategoría como texto simple (igual que el mock original), '
  'lo que basta para filtrar productos por subcategoría sin modelar una tabla aparte.';

create index if not exists categories_parent_id_idx on public.categories (parent_id);

-- -----------------------------------------------------------------------------
-- products
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id                 text primary key,
  slug               text not null unique,
  name               text not null,
  short_description  text,
  description        text,
  category_id        uuid references public.categories (id) on delete set null,
  -- Denormalizado a propósito: guardar el slug de la categoría directamente
  -- simplifica muchísimo las consultas de la tienda (filtrar por categoría,
  -- por sección de home, etc.) sin necesitar un join en cada lectura pública.
  category_slug      text not null references public.categories (slug),
  subcategory_id     uuid,
  subcategory        text,
  price              numeric(12, 2) not null,
  compare_at_price   numeric(12, 2),
  sku                text,
  images             jsonb not null default '[]'::jsonb,
  is_new             boolean not null default false,
  is_bestseller      boolean not null default false,
  is_offer           boolean not null default false,
  variants           jsonb,
  rating             numeric(2, 1),
  reviews_count      integer,
  stock              integer not null default 0,
  active             boolean not null default true,
  features           text[],
  created_at         timestamptz not null default now()
);

comment on table public.products is
  'Catálogo de productos. is_new / is_bestseller / is_offer reemplazan el array "tags" del mock '
  'original (más fácil de indexar y filtrar en SQL que un array de strings).';

create index if not exists products_category_slug_idx on public.products (category_slug);
create index if not exists products_active_idx on public.products (active);
create index if not exists products_is_new_idx on public.products (is_new) where is_new;
create index if not exists products_is_bestseller_idx on public.products (is_bestseller) where is_bestseller;
create index if not exists products_is_offer_idx on public.products (is_offer) where is_offer;

-- -----------------------------------------------------------------------------
-- orders
-- -----------------------------------------------------------------------------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique,
  customer_name  text not null,
  phone          text not null,
  email          text not null,
  department     text not null,
  city           text not null,
  address        text not null,
  neighborhood   text not null,
  reference      text,
  notes          text,
  -- Snapshot de los productos comprados en el momento del pedido (nombre,
  -- imagen y precio en ese instante), igual que hoy en memoria — así el
  -- pedido no cambia si el producto se edita o se borra después.
  items          jsonb not null,
  subtotal       numeric(12, 2) not null default 0,
  shipping       numeric(12, 2) not null default 0,
  total          numeric(12, 2) not null default 0,
  status         text not null default 'Nuevo'
                 check (status in ('Nuevo', 'Confirmando', 'Confirmado', 'En preparación', 'Enviado', 'Entregado', 'Cancelado')),
  created_at     timestamptz not null default now()
);

comment on table public.orders is
  'Pedidos del checkout. Se insertan sin autenticación (pago contra entrega) pero SOLO a través de '
  'la API route server-side /api/orders (usa la service_role key) — no directo desde el cliente con '
  'la anon key, por eso RLS no tiene una política de INSERT público sobre esta tabla.';

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- -----------------------------------------------------------------------------
-- customers (opcional, derivada de orders)
-- -----------------------------------------------------------------------------
-- No es estrictamente necesaria hoy (la app no tiene login de clientes), pero
-- se deja como tabla simple por si en el futuro quieres deduplicar clientes
-- por email/teléfono. Ninguna función de la app la usa todavía.
create table if not exists public.customers (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  phone        text not null,
  email        text not null unique,
  created_at   timestamptz not null default now()
);

-- =============================================================================
-- Row Level Security (RLS)
-- =============================================================================
-- Regla general de este proyecto:
--   - Lectura pública (anon) de categories y products ACTIVOS: sí.
--   - Cualquier escritura desde el navegador con la anon key: no.
--   - orders: ni siquiera lectura pública (contiene datos personales del
--     cliente). Todas las operaciones sobre orders (insertar desde el
--     checkout, leer/actualizar desde el admin) pasan por API routes que
--     usan la service_role key, la cual IGNORA RLS por completo. Por eso
--     "orders" no necesita (ni debe tener) políticas públicas de INSERT.
-- =============================================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.customers enable row level security;

-- categories: lectura pública de categorías activas.
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories
  for select
  to anon, authenticated
  using (active = true);

-- products: lectura pública de productos activos.
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products
  for select
  to anon, authenticated
  using (active = true);

-- orders: SIN políticas públicas. Ni anon ni authenticated pueden hacer
-- select/insert/update/delete directo — todo pasa por la service_role key
-- desde src/lib/supabase/admin.ts (API routes). No se crea ninguna policy
-- a propósito: con RLS habilitado y cero policies, el acceso con la anon
-- key queda completamente bloqueado.

-- customers: igual que orders, sin acceso público.

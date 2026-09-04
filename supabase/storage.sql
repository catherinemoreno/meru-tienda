-- =============================================================================
-- Meru — Supabase Storage para imágenes de productos
-- =============================================================================
-- Cómo usar este archivo:
--   1. Entra a tu proyecto en https://supabase.com/dashboard
--   2. En el menú lateral, abre "SQL Editor" (es una página web, no una
--      terminal).
--   3. Pega TODO el contenido de este archivo y dale a "Run".
--
-- Esto crea (si no existe) un bucket de Storage público llamado
-- "product-images" donde el panel de administración sube las fotos de los
-- productos, y las políticas de RLS necesarias para que esas imágenes se
-- puedan VER desde el navegador de la tienda.
--
-- Este script es seguro de re-ejecutar (usa "on conflict do nothing" y
-- "drop policy if exists" antes de crear cada policy).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Bucket "product-images"
-- -----------------------------------------------------------------------------
-- public = true: cualquier persona con el link puede ver/descargar una imagen
-- (necesario para que las fotos se muestren en la tienda). Esto NO permite
-- subir ni borrar archivos, solo leerlos.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Políticas de RLS sobre storage.objects para este bucket
-- -----------------------------------------------------------------------------
-- storage.objects viene con RLS habilitado por defecto en Supabase.

-- Lectura pública: cualquiera (incluso sin iniciar sesión) puede leer los
-- objetos del bucket "product-images". Esto es lo que permite que las
-- imágenes se vean en <img src="..."> desde el navegador de un cliente.
drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- IMPORTANTE — no hay políticas de insert/update/delete para anon ni
-- authenticated, y eso es intencional: todas las subidas de imágenes pasan
-- por la API route del servidor (src/app/api/admin/upload/route.ts), que
-- usa la SUPABASE_SERVICE_ROLE_KEY (src/lib/supabase/admin.ts). Esa clave
-- se salta RLS por completo, igual que ya ocurre con las escrituras de
-- products/orders. Así que nadie puede subir ni borrar imágenes
-- directamente desde el navegador, solo a través del panel de admin
-- (protegido con sesión de administrador).
-- =============================================================================

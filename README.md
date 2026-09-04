# Meru

Tienda online construida con Next.js. Hoy funciona con datos de demostración
(mock, en `src/lib/data/`); está lista para conectarse a una base de datos
real en Supabase y desplegarse en Vercel sin usar terminal.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Sin ninguna variable de
entorno de Supabase configurada, la tienda funciona igual que siempre con los
datos de demostración.

## Despliegue en producción (Vercel + Supabase)

Esta guía asume que NO usas terminal ni tienes Node.js instalado — todo se
hace desde el navegador.

### 1. Crea (o abre) tu proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) e inicia sesión.
2. Si no tienes un proyecto todavía: **New project**, ponle un nombre (ej.
   "meru"), elige una contraseña de base de datos (guárdala, no la
   necesitarás para esto pero es buena práctica) y espera a que se cree
   (~2 minutos).
3. Si ya tienes uno, simplemente ábrelo.

### 2. Crea las tablas (schema.sql)

1. En el menú lateral de tu proyecto de Supabase, abre **SQL Editor** (es
   una página web dentro del panel, no una terminal).
2. Click en **New query**.
3. Abre el archivo [`supabase/schema.sql`](./supabase/schema.sql) de este
   repositorio, copia todo su contenido y pégalo en el editor.
4. Click en **Run**. Deberías ver "Success. No rows returned".

Esto crea las tablas `categories`, `products`, `orders` y `customers`, y
configura los permisos de seguridad (RLS): cualquiera puede ver el catálogo,
pero solo el checkout (protegido) puede crear pedidos, y nadie puede leer o
modificar pedidos sin pasar por el panel admin.

### 3. Carga los datos de ejemplo (seed.sql) — opcional

1. Repite el paso anterior con **New query**.
2. Copia y pega el contenido de
   [`supabase/seed.sql`](./supabase/seed.sql).
3. Click en **Run**.

Esto inserta las categorías reales del negocio y 20 productos de
demostración, para que la tienda no se vea vacía. Son datos de
demostración — bórralos o reemplázalos por tu catálogo real cuando tengas
tus productos definitivos (el propio archivo `seed.sql` incluye las
instrucciones de borrado en un comentario al inicio).

### 4. Obtén tus credenciales de Supabase

1. En el panel de Supabase, ve a **Project Settings** (ícono de engranaje) →
   **API**.
2. Copia estos tres valores, los necesitarás en el paso 6:
   - **Project URL** → variable `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (sección "Project API keys", marcada como
     secreta) → variable `SUPABASE_SERVICE_ROLE_KEY`

La `service_role` key es secreta: nunca la compartas públicamente ni la
pongas en un repositorio de código. Solo se configura en Vercel (paso 6),
nunca en el código.

### 5. Sube el código a GitHub

Si el código todavía no está en GitHub:

- **Sin usar git/terminal**: entra a [github.com](https://github.com), crea
  un repositorio nuevo (**New repository**), y en la página del repositorio
  vacío usa la opción **uploading an existing file** para arrastrar los
  archivos del proyecto (puedes arrastrar la carpeta completa en la mayoría
  de navegadores modernos).
- **Si ya tienes el repositorio conectado**: simplemente sube/sincroniza tus
  cambios como ya lo vienes haciendo.

No subas ningún archivo `.env.local` ni el contenido real de tus llaves —
`.gitignore` ya está configurado para excluirlos automáticamente.

### 6. Importa el proyecto en Vercel

1. Entra a [vercel.com](https://vercel.com) e inicia sesión (puedes
   hacerlo con tu cuenta de GitHub).
2. Click en **Add New... → Project**.
3. Selecciona el repositorio de GitHub que acabas de crear/actualizar e
   importa.
4. Antes de darle a **Deploy**, abre la sección **Environment Variables** y
   agrega las tres variables del paso 4:

   | Name                            | Value                                  |
   |----------------------------------|-----------------------------------------|
   | `NEXT_PUBLIC_SUPABASE_URL`       | tu Project URL de Supabase              |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | tu anon public key de Supabase          |
   | `SUPABASE_SERVICE_ROLE_KEY`      | tu service_role key de Supabase         |

   Opcionalmente agrega también `ADMIN_USER`, `ADMIN_PASSWORD` y
   `ADMIN_SESSION_SECRET` con valores propios para el panel admin (si no las
   defines, se usan valores por defecto — cámbialos antes de ir a
   producción real). Ver [`.env.example`](./.env.example) para la lista
   completa de variables disponibles.

5. Click en **Deploy**. En un par de minutos tu tienda queda publicada con
   una URL de Vercel, ya conectada a tu base de datos real de Supabase.

Cada vez que subas cambios a la rama principal del repositorio en GitHub,
Vercel vuelve a desplegar automáticamente — sin terminal, sin comandos.

### Notas técnicas (para quien mantenga el código)

- Sin las variables `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  definidas, toda la capa de datos (`src/lib/repository.ts`) sigue leyendo de
  los mocks — es el comportamiento actual, sin cambios.
- Con esas variables definidas, `src/lib/repository.ts` consulta Supabase
  directamente (lecturas públicas, protegidas por RLS).
- Los pedidos y las operaciones del panel admin (`src/lib/orders.ts`,
  `src/lib/data/productsStore.ts`) usan la `service_role` key
  (`src/lib/supabase/admin.ts`), y solo se invocan desde API routes en
  `src/app/api/**` — nunca directamente desde el navegador.

## Aprender más sobre Next.js

- [Documentación de Next.js](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

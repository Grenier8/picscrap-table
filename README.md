# Picscrap Table

Dashboard web para comparar precios de productos de fotografia entre multiples tiendas, con autenticacion, vista de productos base vs competencia y disparo de procesos de scraping externos.

## Overview

`picscrap-table` es una aplicacion hecha con Next.js (App Router) que:

- muestra un resumen de precios comparando una tienda base contra tiendas competidoras.
- renderiza una tabla de productos base con precios relacionados por sitio.
- permite iniciar procesos de scraping en un servicio externo y revisar su historial.
- guarda y consulta datos en PostgreSQL via Prisma.

## Stack Tecnologico

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS + componentes UI basados en Radix/shadcn
- Prisma ORM 6 + `@prisma/extension-accelerate`
- PostgreSQL
- NextAuth v4 (Credentials provider)
- TanStack React Table

## Modulos Principales

- `app/page.tsx`: dashboard con resumen de precios por pagina.
- `app/products/*`: tabla principal de productos base y comparacion por sitio.
- `app/scraping/*`: historial de scraping y modal para iniciar ejecuciones.
- `app/login/page.tsx`: autenticacion de usuarios.
- `app/api/*`: endpoints internos para resumen, productos, paginas y logs.
- `auth.ts`: configuracion de NextAuth y validacion de credenciales.
- `lib/services/scrapper.ts`: cliente HTTP hacia el scraper externo.
- `prisma/schema.prisma`: modelo de datos.
- `prisma/seed.ts`: datos semilla (roles, usuario admin, paginas, marcas, productos).

## Requisitos

- Node.js 20+ recomendado
- npm
- Base de datos PostgreSQL accesible por `DATABASE_URL`

## Variables de Entorno

Crea un archivo `.env` en la raiz del proyecto:

```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="RANDOM_32_CHARACTER_STRING"
NEXT_PUBLIC_SCRAPER_URL="https://your-scraper-service.com"
NEXT_PUBLIC_SCRAPER_API_KEY="your-scraper-api-key"
```

Notas importantes:

- `NEXTAUTH_SECRET` es requerido en produccion.
- `NEXT_PUBLIC_*` se expone al cliente; no uses secretos sensibles reales.
- Existe `AUTH_SECRET` en `.env.example` por herencia de plantilla, pero el codigo usa `NEXTAUTH_SECRET`.

## Instalacion y Ejecucion Local

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar migraciones:

```bash
npx prisma migrate dev --name init
```

3. (Opcional) Cargar datos semilla:

```bash
npx prisma db seed
```

4. Levantar entorno de desarrollo:

```bash
npm run dev
```

5. Abrir en navegador:

`http://localhost:3000`

## Credenciales Iniciales (Seed)

Si ejecutaste `prisma db seed`, se crea:

- usuario: `admin`
- password: `admin123`

Se recomienda cambiar estas credenciales para cualquier entorno no local.

## Scripts Disponibles

- `npm run dev`: inicia Next.js en modo desarrollo con Turbopack.
- `npm run build`: ejecuta migraciones de despliegue y build de Next.
- `npm run start`: levanta el servidor en modo produccion.
- `npm run lint`: corre lint con `next lint`.

Nota: el script de `build` actual usa una expresion de shell tipo bash, que puede comportarse distinto fuera de entornos compatibles.

## Flujo Funcional

1. Usuario inicia sesion en `/login`.
2. Dashboard (`/`) consulta `/api/price-summary`.
3. Productos (`/products`) consulta:
   - `/api/base-products`
   - `/api/webpages`
4. Scraping (`/scraping`) consulta `/api/logs` y permite disparar scraping externo.
5. El servicio externo debe registrar eventos/logs en la base de datos para que aparezcan en el historial.

## API Interna (App Router)

- `GET /api/price-summary`: resumen por pagina (precios mayor/igual/menor vs base).
- `GET /api/base-products`: productos base con marca y relaciones.
- `GET /api/webpages`: listado de paginas configuradas.
- `GET /api/logs`: ultimos 50 logs de scraping.
- `/api/auth/[...nextauth]`: autenticacion NextAuth.

## Integracion de Scraping Externo

El frontend envia `POST` a:

- `${NEXT_PUBLIC_SCRAPER_URL}/api/scrape`

Headers:

- `Content-Type: application/json`
- `x-api-key: ${NEXT_PUBLIC_SCRAPER_API_KEY}`

Body:

```json
{
  "webpageIds": [1, 2, 3],
  "scrapType": "FULL | LITE | PRICE",
  "filteringType": "SKU | SIMILARITY | OPENAI | NONE"
}
```

Este repositorio no implementa el crawler/scraper en si; solo consume su API y muestra resultados.

## Modelo de Datos (Resumen)

- `Role` y `User` para autenticacion/autorizacion.
- `Webpage` para sitios monitoreados (`isBasePage` marca la pagina base).
- `BaseProduct` como producto canonico de referencia.
- `Product` como producto encontrado en cada pagina y enlazado a un `BaseProduct`.
- `Brand` para normalizacion de marcas.
- `Log` para traza de ejecuciones de scraping.

## Limitaciones y Consideraciones

- No hay script de tests automatizados en `package.json`.
- El modulo de scraping depende de un servicio externo y su disponibilidad.
- El registro automatico en auth crea usuarios nuevos si no existen; revisa esta logica para produccion.
- Hay diferencias heredadas de plantilla (por ejemplo nombres de variables de entorno) que conviene estandarizar.

## Estructura Rapida

```text
app/
  api/
  login/
  products/
  scraping/
auth.ts
lib/
  prisma.ts
  services/scrapper.ts
prisma/
  schema.prisma
  seed.ts
```

## Recomendaciones para Produccion

- Mover el trigger de scraping a un endpoint server-side para proteger credenciales.
- Definir politicas de usuarios (evitar registro implicito en login si no es deseado).
- Alinear `build` script para CI/CD objetivo (Linux/Windows).
- Agregar pruebas (unitarias y de integracion de API).

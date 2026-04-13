# picscrap-table — Frontend Dashboard

Dashboard web para comparar precios entre tiendas, con autenticación, tabla de productos y disparo de scraping externo.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- Prisma ORM 6 + `@prisma/extension-accelerate` + PostgreSQL
- NextAuth v4 (Credentials provider)
- TanStack React Table

## Estructura

```
app/
  page.tsx              # Dashboard: resumen de precios por tienda
  products/             # Tabla principal de productos base con comparación
  scraping/             # Historial de scraping + modal para disparar
  login/page.tsx        # Login
  api/
    price-summary/      # GET: resumen mayor/igual/menor vs base
    base-products/      # GET: productos base con marcas y relaciones
    webpages/           # GET: tiendas configuradas
    logs/               # GET: últimos 50 logs de scraping
    auth/[...nextauth]/ # NextAuth handlers
auth.ts                 # Config NextAuth + validación de credenciales
lib/
  prisma.ts             # Prisma client singleton
  services/scrapper.ts  # Cliente HTTP hacia picscrap backend
prisma/
  schema.prisma         # Schema DB (debe estar sincronizado con picscrap/)
  seed.ts               # Datos semilla: roles, admin, páginas, marcas, productos
```

## Comandos

```bash
npm run dev             # Dev con Turbopack (http://localhost:3000)
npm run build           # Migraciones de deploy + build Next.js
npm run start           # Producción
npm run lint            # ESLint
npx prisma migrate dev --name <nombre>  # Nueva migración
npx prisma db seed      # Cargar datos semilla
npx prisma generate     # Regenerar cliente tras cambios de schema
```

## Variables de entorno (`.env`)

```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="string-aleatoria-32-chars"
NEXT_PUBLIC_SCRAPER_URL="https://picscrap-service.com"
NEXT_PUBLIC_SCRAPER_API_KEY="api-key-del-scraper"
```

**Advertencia:** `NEXT_PUBLIC_*` se expone al cliente (browser). La API key del scraper es visible en el bundle. Pendiente mover el trigger de scraping a un endpoint server-side.

## Rutas principales

| Ruta | Descripción |
|---|---|
| `/` | Dashboard con resumen de precios por tienda |
| `/products` | Tabla de productos base con precios por tienda |
| `/scraping` | Historial de ejecuciones + botón para iniciar scraping |
| `/login` | Autenticación |

## Flujo de scraping desde UI

`picscrap-table` llama directamente a la API de `picscrap`:
```
POST ${NEXT_PUBLIC_SCRAPER_URL}/api/scrape
Headers: x-api-key, Content-Type: application/json
Body: { webpageIds, scrapType, filteringType }
```

## API interna

- `GET /api/price-summary` — por tienda: cuántos productos tienen precio mayor/igual/menor que la base
- `GET /api/base-products` — productos base con marca y productos relacionados por tienda
- `GET /api/webpages` — tiendas configuradas en DB
- `GET /api/logs` — últimos 50 logs de scraping

## Autenticación

NextAuth v4 con Credentials provider. El seed crea:
- usuario: `admin` / password: `admin123` (cambiar en producción)

**Nota:** La lógica actual puede crear usuarios nuevos implícitamente en login — revisar para producción.

## Modelo de datos (resumen)

Mismo schema que `picscrap/`. Ver `prisma/schema.prisma`.

## Componentes UI

Basados en shadcn/ui. Configuración en `components.json`. Agregar componentes con:
```bash
npx shadcn@latest add <component>
```

## Notas importantes

- No hay tests automatizados.
- `build` script usa sintaxis bash — puede fallar en entornos no-Unix.
- Los schemas Prisma de ambos proyectos deben mantenerse sincronizados.

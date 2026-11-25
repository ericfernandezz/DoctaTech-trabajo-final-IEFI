# DoctaTech

Tienda online de hardware y periféricos gamer. Proyecto de **Aplicaciones Web 1** (IES Siglo 21) — HTML, CSS y JavaScript puro (ES Modules), sin frameworks.

## Funcionalidades

- Catálogo cargado con `fetch` desde `src/resources/data/productos.json`, con búsqueda, filtros (categoría, marca, rango de precio) y ordenamiento.
- Ficha de producto con especificaciones técnicas, stock y productos relacionados.
- Carrito lateral con cantidades, eliminación, total y **persistencia en `localStorage`** (se mantiene entre páginas y recargas).
- Checkout con validaciones HTML + JavaScript, número de pedido, notificaciones en la interfaz y **envío del pedido por Gmail** (con copia al cliente).
- Formulario de contacto con validación y envío por Gmail.
- Diseño responsive y accesible (navegación por teclado, `aria-live`, enlace "saltar al contenido", `prefers-reduced-motion`).

## Estructura

```
src/
  index.html · producto.html · contacto.html · checkout.html
  resources/
    css/estilos.css
    data/productos.json          # catálogo (JSON)
    imagenes/ · fuentes/
    js/
      config.js                  # mail de la tienda, claves de localStorage, etc.
      modules/                   # lógica reutilizable (ES Modules)
        utils · catalogo · carrito · carrito-estado · carrito-ui
        validaciones · pedidos · formularios · vistas · notificaciones · comun
      pages/                     # un punto de entrada por página
tests/                           # tests unitarios con node:test
.github/workflows/ci-cd.yml      # CI (tests) + CD (deploy a Vercel)
vercel.json
```

## Cómo ejecutarlo

```bash
pnpm install     # instala five-server
pnpm dev         # servidor de desarrollo
```

Los módulos ES y `fetch` requieren servirlo por HTTP (no abrir los HTML con doble clic). Alternativa sin instalar nada: `python3 -m http.server --directory src`.

## Tests

```bash
node --test
```

Usa el runner nativo de Node (sin dependencias): 40 tests sobre filtros, carrito, persistencia, validaciones, armado de pedidos y enlaces de Gmail e integridad del JSON.

## Configuración pendiente antes de publicar

En `src/resources/js/config.js` reemplazar `emailTienda` por la casilla de Gmail real del negocio.
Revisar también teléfono/mail del pie y de `contacto.html`.

## Despliegue (Vercel + GitHub Actions)

1. Subir el repositorio a GitHub e importarlo en Vercel (`vercel.json` ya define `src` como carpeta pública).
2. Para el deploy automático desde Actions, crear los *secrets* `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`.
3. Cada `push` a `main` ejecuta los tests y, si pasan, despliega a producción. Los Pull Requests solo ejecutan los tests.

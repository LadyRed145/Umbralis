# UMBRALIS · Semana 4

**«No abras un libro. Cruza el umbral».**

Umbralis es una tienda de libros ficticia desarrollada para la **evaluación formativa de Desarrollo Frontend II (PFY2202), Semana 4**. Utiliza HTML, CSS, JavaScript, React y React Router; consume una **API REST mock HTTP** que sirve categorías y libros en JSON. La identidad visual representa cada género como un portal a otro universo. Incluye **carrito lateral y comprobante imprimible de pedido simulado**, sin pasarela de pago, cobros ni envíos reales: los precios son referenciales.

## Requisitos y ejecución (terminal Fish)

- Node.js 20.19+ y npm.
- Puertos locales 5173 (Vite) y 4174 (REST mock) disponibles.

Desde la carpeta raíz `Umbralis`:

```fish
npm ci
npm run dev
```

Abrir **http://127.0.0.1:5173/**. El comando `npm run dev` inicia **ambos servidores** automáticamente. Detener con `Ctrl+C`. No se debe abrir `index.html` directamente; el proyecto requiere Vite y el servidor REST.

También se pueden usar dos terminales Fish: en una ejecutar `npm run mock` y en otra `npm run dev:frontend`.

## Estructura

```text
Umbralis/
├── public/favicon.svg          # Favicon de Umbralis
├── scripts/dev.mjs             # Inicia Vite y mock REST
├── server/
│   ├── data.mjs                # Datos ficticios: 6 categorías y 18 libros
│   ├── handler.mjs             # Endpoints HTTP, validación y errores
│   ├── orders.mjs              # Validación y comprobante de pedidos ficticios
│   └── mock-api.mjs            # Servidor Node.js local
├── src/
│   ├── components/             # Logo, portal, tarjetas, carrito lateral, voucher, navegación, estados
│   ├── context/CartContext.jsx # Estado y persistencia del carrito
│   ├── hooks/useApiResource.js # Carga, éxito, fallo y reintentos
│   ├── lib/api.js              # Cliente REST, caché y deduplicación
│   ├── lib/cart.js             # Operaciones puras, límites y subtotal
│   ├── lib/orders.js           # Cliente POST de pedido simulado
│   ├── lib/voucher.js          # Normalización y formato del último comprobante
│   ├── pages/                  # Inicio, catálogo, detalle, carrito, acerca y 404
│   ├── App.jsx                 # React Router
│   ├── main.jsx                # Entrada de React
│   ├── styles.css              # Composición responsive
│   └── umbralis-theme.css      # Identidad oscura y portal animado
├── tests/                      # Pruebas de REST, cliente HTTP y carrito
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

La ilustración del portal y las portadas estilizadas están creadas con CSS; el logotipo y favicon son SVG propios, sin imágenes ni servicios gráficos externos.

## API REST mock

| Endpoint | Función |
|---|---|
| `GET /api/health` | Estado del servidor. |
| `GET /api/categories` | Categorías, descripción y cantidad de libros. |
| `GET /api/books` | Lista completa. |
| `GET /api/books?category=terror` | Filtra por categoría. |
| `GET /api/books?q=dracula` | Busca por título o autor. |
| `GET /api/books/dracula` | Detalle de un libro. |
| `POST /api/orders` | Valida y confirma un pedido **ficticio**, sin pago ni persistencia. |

Todas las respuestas son JSON. El catálogo es de solo lectura mediante GET; el endpoint POST solo **simula** un pedido y devuelve un comprobante con número, cantidades y total calculado desde el catálogo del servidor. No se almacenan nombre, correo ni historial de pedidos; no se cobra dinero. Se validan cantidades y títulos, con respuestas HTTP 200, 201, 400, 404, 405, 415 y 500, según corresponda. Vite redirige las solicitudes `/api` al mock en `127.0.0.1:4174`.

## Navegación React Router

- `/` — Inicio, portal, categorías REST y destacados.
- `/catalogo` — Todos los libros con búsqueda y ordenamiento local.
- `/categoria/:category` — Filtro por categoría mediante REST.
- `/libro/:id` — Ficha individual consultada al mock.
- `/nosotros` — Explicación del proyecto.
- `/carrito` — Revisión detallada, cantidades, subtotal y confirmación del pedido de prueba.
- **Panel lateral del carrito** — Disponible desde la cabecera, sobre cualquier página, sin salir del catálogo.
- **Voucher modal** — Último comprobante, accesible desde el carrito, imprimible o guardable como PDF con el navegador.
- Rutas no reconocidas — Página 404 con identidad Umbralis.

## Carrito, compra y voucher de archivo (inspiración NatGamez)

Se revisó el proyecto propio **NatGamez (Semana 9)** y se recuperó su flujo de experiencia: **carrito lateral, contador, controles de cantidad, eliminación, resumen, última compra, voucher en ventana y opción de guardar/imprimir**. Todos los elementos se rediseñaron para Umbralis, sin copiar Bootstrap ni la identidad NatGamez.

1. Desde el catálogo o ficha pulsa **Agregar al carrito**. El acceso «Mi carrito» abre un **panel lateral** con el detalle de los libros y el resumen, sin salir de la página. Puede cerrarse con `Esc`, el botón × o el fondo oscuro.
2. Ajusta cantidades, elimina títulos o vacía la selección. El panel muestra los precios obtenidos mediante REST y enlaza a la página de finalización `/carrito`.
3. En `/carrito`, completa un nombre y correo **de prueba**, y confirma. El frontend envía `POST /api/orders`; el servidor valida cantidades, títulos y precios desde sus propios datos, y genera el folio `UMB-XXXXXXXX`.
4. Al confirmar correctamente, aparece un **voucher** con identidad Umbralis (pergamino, marco dorado, símbolos de portadas), folio, fecha y hora, estado, cada libro con autor, cantidad, precio unitario y subtotal, unidades y total referencial.
5. En el modal pulsa **Guardar como PDF / Imprimir**. El navegador abre la impresión: elige impresora o «Guardar como PDF». Se usa CSS para impresión A4; no necesitas una librería PDF.
6. Puedes **volver a abrir el último comprobante** desde el panel lateral o `/carrito`, incluso después de recargar la página.

El carrito se guarda en `localStorage` **solo como ID de libro y cantidad**. El **último comprobante** también se conserva localmente, pero contiene únicamente folio, fecha, libros, cantidades y precios: el nombre y correo del formulario no se almacenan en el historial ni se devuelven en el voucher. La API no almacena ni procesa pagos. El registro local corresponde **solamente al último comprobante del navegador actual**: borrar datos del navegador lo elimina. **No es una boleta tributaria ni un documento válido de pago.**

Esta característica continúa siendo una **mejora voluntaria**, sin sustituir los cuatro criterios de la rúbrica.

## Manejo de errores, cargas y eficiencia

- Indicadores spinner y skeleton mientras llegan los datos; estados vacíos.
- Errores HTTP 404/500, fallo de red, timeout y respuesta JSON inválida con mensajes comprensibles.
- Botón de **Reintentar**, alternativas de navegación y limpieza de filtros.
- Caché por URL durante **60 segundos** y deduplicación de solicitudes simultáneas.
- La búsqueda y el ordenamiento no generan peticiones nuevas por cada cambio.
- Reintentos explícitos que evitan resultados cacheados; fallos no retenidos en caché.
- Timeout de solicitudes de **8 segundos**.

Para demostrar errores con la aplicación ejecutándose, abre:

- `http://127.0.0.1:5173/catalogo?demoError=500` — Error simulado 500.
- `http://127.0.0.1:5173/catalogo?demoError=404` — Error simulado 404.
- `http://127.0.0.1:5173/libro/no-existe` — Libro no encontrado.

Para demostrar resultados vacíos, busca un título inexistente en `/catalogo`. Para volver a los datos normales, abre `/catalogo` sin `demoError`. Ese parámetro existe solo como herramienta académica de verificación.

## Pruebas y compilación

```fish
npm run test
npm run build
```

O ambos en una sola operación:

```fish
npm run check
```

El build genera `dist/`, excluido de GitHub mediante `.gitignore`.

**Verificación completada en CachyOS (16 de noviembre de 2026):**

| Comprobación | Resultado |
|---|---|
| `npm ci` | Instalación correcta; auditoría npm con **0 vulnerabilidades detectadas**. |
| `npm run test` (mediante `npm run check`) | **21 pruebas aprobadas**, 0 fallidas y 0 omitidas. |
| `npm run build` (mediante `npm run check`) | **Compilación exitosa** con Vite 7.3.7; 60 módulos transformados. |
| `npm run dev` | Frontend en `127.0.0.1:5173` y API mock en `127.0.0.1:4174` iniciados correctamente. |
| Prueba manual de la aplicación | **Funcionamiento confirmado** en el navegador, incluido el flujo de carrito y comprobante. |

Durante la instalación, npm advirtió que bloqueó el script `postinstall` de `esbuild@0.28.2`; **la compilación y las pruebas finalizaron correctamente** pese a esa advertencia.

## Ajustes de presentación responsive

La vista móvil del catálogo incorpora tarjetas con **zonas independientes de información y acciones**, manteniendo precios y botones alineados en cada fila. Las categorías se muestran en una **cuadrícula de dos columnas** en móvil, con nombres adaptativos. El selector nativo de ordenamiento fue sustituido por `src/components/SortControl.jsx`: un **menú desplegable propio de Umbralis** que permanece dentro de la pantalla incluso al abrirse en la emulación móvil de Brave/Chromium. Permite ordenar por título, fecha y precio, y se cierra al seleccionar una opción, pulsar `Esc` o hacer clic fuera. El pie de página contiene navegación en tarjetas, remates decorativos y separación editorial.

**Verificación visual de esta versión:** se renderizó la interfaz con Chromium en **320, 375, 390, 768 y 1024 px** usando datos de muestra del catálogo. En esos anchos se comprobó que no hubiera desbordamiento horizontal, que las categorías permanecieran en pantalla y que los botones de los libros de cada fila estuvieran alineados. Además, se **abrió el menú personalizado** para verificar sus límites, se comprobó el ordenamiento por precio y el cierre con `Esc`. Se conservan las 21 pruebas aprobadas y la compilación de producción exitosa. Los ajustes son de interfaz: no alteran el backend REST, los pedidos simulados ni los vouchers.

### Si todavía ves la versión anterior

1. Detén el servidor Vite anterior con **`Ctrl+C`** en la terminal donde está funcionando.
2. Guarda cualquier cambio local que quieras conservar; reemplaza **la carpeta del proyecto que realmente estás ejecutando** por la carpeta `Umbralis` de este ZIP, evitando tener dos carpetas `Umbralis` anidadas.
3. Entra en esa carpeta nueva y ejecuta `npm ci`, `npm run check` y `npm run dev`.
4. Fuerza la recarga del navegador con **`Ctrl+Shift+R`**. El footer nuevo contiene la frase **«Un archivo, infinitos destinos.»**: úsala para comprobar que cargaste esta versión, no la anterior.

El servidor local y las rutas de la aplicación se mantienen iguales.

## Correspondencia con la rúbrica

| Criterio | Evidencia |
|---|---|
| 1. Creación e integración de Mock REST (50 puntos) | `server/handler.mjs`, `src/lib/api.js`, páginas Inicio y Catálogo. |
| 2. Manejo de errores en peticiones | `ApiError`, `ResourceStatus.jsx`, estados 404/500, mensajes y reintentos. |
| 3. Control de carga y estados | `useApiResource.js`, spinner, skeletons y estado vacío. |
| 4. Optimización de consultas | Caché TTL, deduplicación y búsqueda/ordenamiento local. |
| Navegación requerida | `App.jsx` con React Router y `SiteLayout.jsx`. |
| Extra opcional: carrito / pedidos demo | `CartContext.jsx`, `CartDrawer.jsx`, `VoucherModal.jsx`, `VoucherDocument.jsx`, `voucher.js`, `Cart.jsx`, `orders.mjs`; GET de precios y POST de pedidos demo. |

## Repositorio y entrega

Umbralis cuenta con su **propio repositorio público**, independiente de `Valkora_Supermercado`. Las entregas anteriores no forman parte de este proyecto.

**Repositorio:** [LadyRed145/Umbralis](https://github.com/LadyRed145/Umbralis)

El repositorio ya está creado. Para subir el código fuente desde la carpeta raíz `Umbralis`, puedes ejecutar estos comandos compatibles con Fish:

```fish
git init
git branch -M main
if git remote get-url origin >/dev/null 2>&1
    git remote set-url origin https://github.com/LadyRed145/Umbralis.git
else
    git remote add origin https://github.com/LadyRed145/Umbralis.git
end
git add .
git commit -m "feat: entrega Umbralis Semana 4"
git push -u origin main
```

El archivo `.gitignore` excluye dependencias y archivos generados (`node_modules/` y `dist/`). La actividad solicita compartir la URL del repositorio con el docente; **no exige GitHub Pages**, desplegar el mock en producción ni adjuntar un informe Word.

> Nota sobre la pauta: el documento de instrucciones indica `hospital-nombre-apellido-siglaCurso` como convención del repositorio, aunque el caso de uso es una librería. Se conserva el nombre real del repositorio elegido, **Umbralis**, sin afirmar que el docente haya aclarado esa inconsistencia.

## Checklist de funcionalidades verificadas

- [x] Librería digital con 18 libros, 6 categorías y navegación con React Router.
- [x] API REST mock HTTP integrada y respuestas JSON.
- [x] Manejo de errores, reintentos y estados de carga.
- [x] Consultas optimizadas mediante caché y deduplicación.
- [x] Identidad visual Umbralis y diseño adaptable.
- [x] Carrito lateral persistente, pedido simulado y voucher imprimible, sin cobros reales.
- [x] Pruebas automatizadas: **21/21 aprobadas**.
- [x] Compilación de producción con Vite: **exitosa**.
- [x] Instalación de dependencias y arranque local: **correctos**.
- [x] Funcionamiento de la interfaz y flujo de compra: **confirmado manualmente**.
- [x] Repositorio independiente de Umbralis: **creado**.

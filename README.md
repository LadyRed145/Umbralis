<div align="center">

![Umbralis — El archivo de los mundos](./Semana%204/public/umbralis-banner.svg)

### 📖 Una biblioteca. Infinitos universos.

**«No abras un libro. Cruza el umbral».**

Una librería digital de estética gótica donde cada género abre un portal hacia otra realidad.

![React](https://img.shields.io/badge/React-19-7D5BA6?style=flat-square&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-C49A6C?style=flat-square&logo=javascript&logoColor=white)
![REST](https://img.shields.io/badge/API-REST%20Mock-6E426B?style=flat-square)
![Pruebas](https://img.shields.io/badge/Pruebas-21%2F21-29795F?style=flat-square)
![Estado](https://img.shields.io/badge/Semana%204-Verificada-645282?style=flat-square)

</div>

---

## 🗝️ Sobre Umbralis

**Umbralis** es una tienda de libros ficticia desarrollada para la evaluación formativa de **Desarrollo Frontend II (PFY2202) · Semana 4**. Construida con HTML, CSS, JavaScript, **React y React Router**, obtiene categorías y libros desde un **servidor REST mock HTTP** con respuestas JSON.

El proyecto prioriza la integración frontend/backend, el tratamiento de errores, los indicadores de carga y la eficiencia de las consultas. Como extensión voluntaria, incorpora un carrito y un flujo de compra simulado.

> **Aviso académico:** los libros y precios son referenciales. No se realizan cobros, pagos, despachos ni facturación; el voucher **no es una boleta tributaria**.

### ✨ Funcionalidades

| Experiencia | Implementación |
| :--- | :--- |
| 📚 **Archivo literario** | 18 libros ficticios de demostración y 6 categorías |
| 🔮 **Identidad** | Portales, detalles dorados, portadas ilustradas con CSS y diseño adaptable |
| 🧭 **Exploración** | React Router, fichas, categorías, búsqueda y ordenamiento |
| 🛒 **Carrito** | Panel lateral, cantidades, subtotales y persistencia local |
| 🧾 **Voucher** | Confirmación REST, folio de pedido e impresión o guardado como PDF |
| 🛡️ **Resiliencia** | Errores explicados, reintentos, estados de carga y vacíos |
| ⚡ **Eficiencia** | Caché temporal y deduplicación de solicitudes simultáneas |

## 🗂️ Estructura y versionado

Cada semana se conserva en su propia carpeta, sin sobrescribir entregas anteriores. **Hay un solo README y un solo `.gitignore`**, ambos en la raíz del repositorio.

```text
Umbralis/
├── README.md                  # Presentación y documentación del proyecto
├── .gitignore                 # Exclusiones para todo el repositorio
└── Semana 4/
    ├── public/
    │   ├── favicon.svg
    │   └── umbralis-banner.svg
    ├── scripts/               # Arranque conjunto del frontend y API
    ├── server/                # Datos, endpoints REST y pedidos ficticios
    ├── src/
    │   ├── components/        # Tarjetas, portal, carrito, voucher y ordenamiento
    │   ├── context/           # Estado del carrito
    │   ├── hooks/             # Gestión de peticiones
    │   ├── lib/               # REST, caché, carrito y comprobante
    │   ├── pages/             # Vistas y páginas 404
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── styles.css
    │   └── umbralis-theme.css
    ├── tests/                 # Pruebas automáticas
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

| Entrega | Estado | Código |
| :--- | :--- | :--- |
| **Semana 4 · Integración frontend/backend** | ✅ Completada y verificada | [📂 Abrir Semana 4](./Semana%204/) |

Las futuras entregas podrán añadirse como `Semana 5/`, `Semana 6/`, etc., manteniendo su código y configuración independientes.

## 🚀 Instalación y ejecución

**Requisitos:** Node.js 20.19+ y npm, con los puertos locales **5173** (Vite) y **4174** (REST mock) disponibles.

Desde la **raíz de Umbralis**, en terminal **Fish**:

```fish
cd 'Semana 4'
npm ci
npm run check
npm run dev
```

Abre **http://127.0.0.1:5173/**. `npm run dev` inicia ambos servidores automáticamente; detén la ejecución con `Ctrl+C`. No abras `index.html` directamente: el proyecto necesita Vite y el servidor REST.

También puedes iniciarlos por separado, con `npm run mock` y `npm run dev:frontend` en dos terminales.

## 🔗 API REST mock

El frontend utiliza las siguientes rutas HTTP:

| Endpoint | Función |
| :--- | :--- |
| `GET /api/health` | Estado del servidor |
| `GET /api/categories` | Categorías, descripción y número de libros |
| `GET /api/books` | Catálogo completo |
| `GET /api/books?category=terror` | Filtrado por categoría |
| `GET /api/books?q=dracula` | Búsqueda por título o autor |
| `GET /api/books/dracula` | Detalle de un libro |
| `POST /api/orders` | Confirmación de un pedido ficticio, sin persistencia ni cobro |

Las respuestas son JSON. La API contempla, según el caso, códigos HTTP **200, 201, 400, 404, 405, 415 y 500**; valida el método, el cuerpo, las cantidades y la existencia de títulos. En pedidos, el servidor **recalcula el total según su catálogo**, sin confiar en precios recibidos desde el navegador. Vite redirige `/api` a `127.0.0.1:4174`.

## 🧭 Navegación con React Router

| Ruta | Vista |
| :--- | :--- |
| `/` | Inicio, portal y libros destacados |
| `/catalogo` | Catálogo, búsqueda y ordenamiento |
| `/categoria/:category` | Libros de la categoría indicada |
| `/libro/:id` | Ficha individual del libro |
| `/nosotros` | Información del universo Umbralis |
| `/carrito` | Resumen y confirmación de pedido simulado |
| Ruta desconocida | Página 404 con identidad visual Umbralis |

El carrito lateral puede abrirse desde la cabecera sin abandonar la página actual.

## 🛒 Carrito y comprobante de compra simulada

El flujo retoma ideas de experiencia de usuario del proyecto propio **NatGamez**, pero con componentes, contenido e identidad visual adaptados a Umbralis:

1. **Seleccionar libros.** Desde las tarjetas o las fichas, agrega títulos al carrito lateral.
2. **Revisar la selección.** Cambia cantidades, elimina títulos, vacía el carrito y consulta subtotales obtenidos de los datos REST.
3. **Confirmar un pedido de demostración.** En `/carrito`, utiliza un nombre y correo ficticios. El cliente envía `POST /api/orders`; el servidor valida los datos y devuelve un folio `UMB-XXXXXXXX`.
4. **Consultar el voucher.** El comprobante muestra fecha, folio, autores, unidades, precios y total; puede imprimirse o guardarse en PDF mediante el navegador.
5. **Reabrir la última compra.** Se conserva el último comprobante en el navegador para consultarlo tras recargar.

**Privacidad y límites:** `localStorage` guarda el carrito como ID y cantidad, y conserva solamente el último voucher con datos del pedido. **No se guardan el nombre ni el correo** del formulario en el comprobante local. El servidor mock no almacena pedidos ni procesa pagos. Borrar los datos del navegador elimina ese comprobante.

> El carrito y el voucher son **mejoras voluntarias**. No sustituyen ninguno de los criterios de la pauta académica.

## 🛡️ Errores, estados y eficiencia

- Indicadores *spinner* y *skeleton* durante las peticiones, y estados vacíos cuando corresponde.
- Mensajes claros ante fallos HTTP 404/500, desconexión, *timeout* o respuesta JSON inválida.
- Botones de **Reintentar**, alternativas de navegación y limpieza de filtros.
- Caché por URL durante **60 segundos** y deduplicación de solicitudes concurrentes.
- Búsqueda y ordenamiento locales, sin solicitudes nuevas innecesarias.
- No se conservan respuestas fallidas en caché; el reintento explícito obtiene datos nuevos.
- Tiempo de espera de peticiones de **8 segundos**.

**Escenarios demostrables con la aplicación iniciada:**

| URL local | Resultado |
| :--- | :--- |
| `/catalogo?demoError=500` | Error 500 simulado |
| `/catalogo?demoError=404` | Error 404 simulado |
| `/libro/no-existe` | Libro no encontrado |
| Buscar un título inexistente en el catálogo | Estado sin resultados |

## 📱 Presentación responsive

La interfaz incluye tarjetas cuyos precios y botones permanecen alineados, categorías en cuadrícula móvil y un **selector personalizado** (`src/components/SortControl.jsx`) para evitar que el menú nativo se dibuje fuera de los límites de la pantalla. Puede cerrarse al seleccionar, pulsar `Esc` o hacer clic fuera. El pie de página integra navegación en tarjetas y detalles editoriales de Umbralis.

La vista se revisó en Chromium a **320, 375, 390, 768 y 1024 px**; se comprobó el menú abierto, el ordenamiento, la alineación de botones y la ausencia de desbordamiento horizontal en esas pruebas.

## 🧪 Pruebas y compilación

```fish
# Dentro de Semana 4
npm run test
npm run build

# O ambas comprobaciones juntas
npm run check
```

**Resultados comprobados durante la preparación de la entrega (16 de noviembre de 2026):**

| Comprobación | Resultado |
| :--- | :--- |
| Instalación `npm ci` | Exitosa; **0 vulnerabilidades detectadas** |
| Pruebas automatizadas | **21/21 aprobadas**, ninguna fallida |
| Compilación de producción | **Vite 7.3.7: 60 módulos transformados** |
| Frontend y servidor REST | Arrancan en sus respectivos puertos |
| Revisión manual | Navegación, carrito, comprobante y presentación funcionales |

La instalación avisó de un `postinstall` de `esbuild@0.28.2` bloqueado, sin impedir las pruebas ni la compilación. La carpeta `dist/` resultante está excluida de Git.

## 🎯 Correspondencia con la rúbrica

| Criterio | Evidencia |
| :--- | :--- |
| **1. Creación e integración de mock REST** (50 puntos) | `server/handler.mjs`, `src/lib/api.js`, Inicio y Catálogo |
| **2. Manejo de errores** | `ApiError`, `ResourceStatus.jsx`, respuestas 404/500 y reintentos |
| **3. Control de carga y estados** | `useApiResource.js`, *spinners*, *skeletons* y estados vacíos |
| **4. Optimización de consultas** | Caché TTL, deduplicación, búsqueda y ordenamiento local |
| **React Router** | `App.jsx` y `SiteLayout.jsx` |
| **Mejora adicional: compras simuladas** | `CartContext.jsx`, `CartDrawer.jsx`, `VoucherModal.jsx`, `orders.mjs` |

La entrega requiere compartir la URL del repositorio; **no exige GitHub Pages, pagos reales ni informe Word**.

## ✅ Checklist de Semana 4

- [x] Catálogo con 18 libros y 6 categorías, consultados por REST.
- [x] React Router, búsqueda, fichas y navegación.
- [x] Errores, estados de carga, reintentos y consultas optimizadas.
- [x] Diseño Umbralis adaptable, con menú móvil verificado.
- [x] Carrito persistente y comprobante de pedido ficticio imprimible.
- [x] **21/21** pruebas automatizadas aprobadas y compilación exitosa.
- [x] Funcionamiento manual confirmado en navegador.
- [x] Proyecto publicado y organizado bajo `Semana 4/` en GitHub.

---

<div align="center">

**✦ U M B R A L I S ✦**

*Un archivo, infinitos destinos.*

**Desarrollo Frontend II · PFY2202 · Semana 4**

</div>

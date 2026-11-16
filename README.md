<div align="center">

![Umbralis: No abras un libro. Cruza el umbral.](./Semana%204/public/umbralis-banner.svg)

### 📖 Una biblioteca. Infinitos universos.

**«No abras un libro. Cruza el umbral».**

Una experiencia literaria de estética gótica, donde cada género es un portal a otra realidad.

![React](https://img.shields.io/badge/React-19-7D5BA6?style=flat-square&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-C49A6C?style=flat-square&logo=javascript&logoColor=white)
![REST](https://img.shields.io/badge/API-REST%20mock-6E426B?style=flat-square)
![Pruebas](https://img.shields.io/badge/Pruebas-21%2F21-29795F?style=flat-square)
![Estado](https://img.shields.io/badge/Semana%204-Verificada-645282?style=flat-square)

</div>

---

## 🗝️ El proyecto

**Umbralis** es una librería digital ficticia creada para **Desarrollo Frontend II (PFY2202)**. Su diseño combina portales, literatura y una experiencia de compra simulada. El catálogo se alimenta de una **API REST mock HTTP**, mientras React Router organiza la navegación.

> **Proyecto académico:** los pedidos y comprobantes son demostrativos. No hay pagos, despachos ni boletas tributarias reales.

### ✨ Qué encontrarás

| Experiencia | Implementación |
| :--- | :--- |
| 📚 **Archivo literario** | 18 libros de demostración y 6 categorías temáticas |
| 🔮 **Portales** | Identidad visual oscura, arte CSS y diseño adaptable |
| 🧭 **Exploración** | React Router, fichas, filtros y ordenamiento |
| 🛒 **Carrito lateral** | Cantidades, subtotales y persistencia local |
| 🧾 **Voucher** | Pedido simulado por REST, comprobante imprimible o PDF |
| 🛡️ **Robustez** | Estados de carga, mensajes de error, reintentos, caché y deduplicación |

## 🗂️ Organización por semanas

Cada entrega tiene su propia carpeta, con su código, configuración, pruebas y documentación. Así podemos evolucionar la biblioteca **sin sobrescribir lo entregado anteriormente**.

```text
Umbralis/
├── README.md                 # Portada general del repositorio
├── .gitignore                # Exclusiones generales
└── Semana 4/
    ├── README.md             # Documentación técnica de la entrega
    ├── public/               # Recursos visuales
    ├── src/                  # React, componentes y estilos
    ├── server/               # API REST mock
    ├── tests/                # Pruebas automatizadas
    ├── scripts/              # Arranque de servidores
    ├── package.json
    └── vite.config.js
```

| Entrega | Estado | Acceso |
| :--- | :--- | :--- |
| **Semana 4 — Integración frontend/backend** | ✅ Funcional y verificada | [📂 Abrir Semana 4](./Semana%204/) · [📄 README técnico](./Semana%204/README.md) |

Las próximas entregas podrán incorporarse como carpetas nuevas, conservando la historia de cada semana.

## 🚀 Ejecutar Semana 4

Con **Node.js 20.19+** y npm, abre una terminal **Fish** desde la raíz del repositorio:

```fish
cd 'Semana 4'
npm ci
npm run check
npm run dev
```

Luego abre **http://127.0.0.1:5173/**. El comando `npm run dev` levanta el frontend y el servidor REST mock local. Necesita tener disponibles los puertos **5173** y **4174**.

## 🧪 Calidad verificada

| Comprobación | Resultado |
| :--- | :--- |
| Pruebas de Node.js | **21/21 aprobadas** ✅ |
| Build de producción con Vite | **Exitoso** ✅ |
| Navegación y compra simulada | **Verificadas manualmente** ✅ |
| Maquetación adaptable | Revisada a 320, 375, 390, 768 y 1024 px ✅ |
| Auditoría npm durante la entrega | **0 vulnerabilidades detectadas** ✅ |

*Resultados comprobados durante la preparación de la Semana 4, el 16 de noviembre de 2026. No equivalen a monitoreo continuo.*

Para ver endpoints, estructura detallada, comprobantes, privacidad y correspondencia con la rúbrica, consulta el **[README de Semana 4](./Semana%204/README.md)**.

---

<div align="center">

**✦ U M B R A L I S ✦**

*Un archivo, infinitos destinos.*

**Desarrollo Frontend II · PFY2202 · Semana 4**

</div>

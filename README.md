# JC Cars Getafe

Web del taller JC Cars (especialista Renault, Getafe): servicios, reserva de cita en 3 pasos,
stock de vehículos nuevos y de ocasión, opiniones, contacto y un panel de administración de demo.

Implementada a partir del diseño `JC Cars Getafe v4` de Claude Design.

## Uso

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/
```

## Stack

- **Vite** sin framework: JavaScript con módulos ES.
- **Sass** (sintaxis SCSS con `@use`/`@forward`) en arquitectura **7-1** y nomenclatura **BEM**.
- **Lucide** para iconos (se importan solo los que se usan) y **Geist** vía Fontsource.
- Fotos de **Unsplash** enlazadas a su CDN; los autores aparecen en `#/creditos`.

## Estructura

```
src/
├─ main.js                 punto de entrada (fuentes, estilos, app)
├─ assets/                 logo
├─ js/
│  ├─ app.js               render, delegación de eventos y gestión del foco
│  ├─ state.js             estado inicial y selectores
│  ├─ core/                plantilla html con escapado, store, router por hash, iconos, localStorage
│  ├─ data/                contenido fijo, datos de ejemplo y fotos
│  ├─ utils/               formato, validación y horarios
│  ├─ components/          piezas reutilizables (cabecera, tarjeta de vehículo, campos, modal…)
│  └─ pages/               una página por ruta, cada una exporta title, render y actions
└─ styles/                 7-1
   ├─ abstracts/           variables, funciones y mixins (no generan CSS)
   ├─ vendors/             ajustes de librerías de terceros
   ├─ base/                reset, tipografía, animaciones y utilidades
   ├─ layout/              contenedor, cabecera y pie
   ├─ components/          un bloque BEM por parcial
   ├─ pages/               estilos específicos de cada página
   ├─ themes/              custom properties de color
   └─ main.scss
```

### Cómo funciona la interfaz

- Las páginas devuelven HTML con la etiqueta de plantilla `` html`...` ``, que escapa todo lo interpolado salvo otros
  fragmentos creados con ella. Los datos de formularios y de `localStorage` nunca se inyectan como HTML.
- Los eventos se delegan en `#app` con atributos de datos:
  - `data-action="pagina:accion"` en clics,
  - `data-submit="..."` en formularios,
  - `data-model="slice.campo"` para enlazar campos al estado (sin repintar mientras se escribe),
  - `data-change="..."` para cambios que disparan una acción.
- Cada cambio de estado repinta la vista; el foco y la posición del cursor se restauran.

## Rutas

| Ruta | Página |
| --- | --- |
| `#/` | Inicio |
| `#/servicios` | Servicios del taller |
| `#/reservar` | Reserva de cita (servicio → día y hora → datos) |
| `#/vehiculos` | Stock con filtros |
| `#/vehiculo/:id` | Ficha de vehículo con solicitudes (prueba, presupuesto, información) |
| `#/nosotros` | Historia, equipo e instalaciones |
| `#/opiniones` | Opiniones y formulario |
| `#/contacto` | Formulario, WhatsApp, horarios y mapa |
| `#/admin` | Panel de demo: citas, vehículos, servicios y solicitudes |
| `#/creditos` | Créditos de las fotos |

## Demo

Precios, vehículos, citas y opiniones son de ejemplo. Lo que se crea o edita (reservas, solicitudes,
opiniones, cambios del panel) se guarda en el `localStorage` del navegador; "Restablecer datos de
ejemplo" en el panel lo devuelve al estado inicial. No hay backend ni envío real de emails.

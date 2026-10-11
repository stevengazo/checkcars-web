<div align="center">

# 🚗 CheckCars Dashboard

**Panel de administración web para la gestión de flotas vehiculares**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

</div>

---

## 📋 Descripción

CheckCars Dashboard es la interfaz web del ecosistema **CheckCars**. Permite a las empresas gestionar y visualizar en tiempo real el estado de su flota: vehículos, salidas y entradas, averías, accidentes, reservas, servicios de mantenimiento, usuarios y analítica. Se conecta con la [CheckCars API](https://github.com/stevengazo/CheckCarsAPI).

## ✨ Características

- 🔐 **Autenticación JWT** con contexto de sesión y rutas protegidas.
- 🚙 **Vehículos** con vista de tabla y de tarjetas, filtros, imágenes y detalle con pestañas.
- 📝 **Formularios dinámicos** de salidas/entradas: configura los campos y las fotos requeridas desde la propia app.
- 📅 **Reservas** con calendario estilo Google Calendar (mes/semana/día/agenda).
- 🔧 **Servicios** de mantenimiento por vehículo con historial y alertas de vencimiento.
- ⚠️ **Averías y accidentes** con búsqueda y detalle fotográfico + mapa.
- 📊 **Dashboard analítico** (KPIs + gráficas) con filtro por rango de fechas.
- 👥 **Configuración**: usuarios, roles, formularios e integración MCP.
- 🔔 **Notificaciones en tiempo real** vía SignalR.

## 🏗️ Arquitectura

El código sigue **Atomic Design** + **capa de servicios** + **Context API**:

```
src/
├── services/      # Capa de servicios: httpClient central + un servicio por dominio
├── Context/       # AuthContext, SettingsContext, NotificationsContext
├── Hook/          # useApi, useFetch
├── Components/
│   ├── atoms/       # Button, Input, Badge, Card, Spinner, Alert…
│   ├── molecules/   # FormField, Modal, OffCanvas, SearchInput, StatCard…
│   ├── organisms/   # Navbar, CarTable, DynamicForm, FormBuilder…
│   └── templates/   # DashboardLayout, AuthLayout, PageHeader
├── Pages/         # Páginas finas que componen organismos
└── routes/        # ProtectedRoute
```

## 🛠️ Tecnologías

**React 19** · **Vite** · **Tailwind CSS 4** · **React Router 7** · **Framer Motion** · **Recharts** · **React Big Calendar** · **Leaflet** · **jsPDF** · **@microsoft/signalr** · **React Toastify**

## 🚀 Puesta en marcha

### Requisitos
- Node.js ≥ 20
- La [CheckCars API](https://github.com/stevengazo/CheckCarsAPI) corriendo (por defecto en `http://localhost:8085`).

### Desarrollo
```bash
npm install
echo "VITE_API_URL=http://localhost:8085" > .env.local   # ajusta a tu API
npm run dev
```

### Producción (Docker)
```bash
docker build --build-arg VITE_API_URL=http://localhost:8085 -t checkcars-web .
docker run -d -p 3001:80 checkcars-web
```
> `VITE_API_URL` se hornea en tiempo de build (Vite). La imagen sirve los estáticos con **nginx**.

## ⚙️ Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la CheckCars API | `http://localhost:8085` |

## 📜 Scripts

| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | ESLint |

## 🔗 Ecosistema CheckCars

- 🌐 **Web Dashboard** — este repositorio
- ⚙️ [CheckCars API](https://github.com/stevengazo/CheckCarsAPI) — backend .NET 9
- 📱 [CheckCar](https://github.com/stevengazo/CheckCar) — app móvil .NET MAUI (offline-first)

## 📄 Licencia

Proyecto de **Steven Gazo** · [stevengazo.co.cr](https://stevengazo.co.cr)

import { Outlet } from "react-router-dom";
import Navbar from "../organisms/Navbar";
import NotificationBell from "../organisms/NotificationBell";
import { NotificationsProvider } from "../../Context/NotificationsContext";

/** Layout principal autenticado: sidebar + barra superior (notificaciones) + contenido. */
const DashboardLayout = () => (
  <NotificationsProvider>
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100 md:flex-row">
      <Navbar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-200 bg-white/90 px-4 py-2.5 backdrop-blur md:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Panel de control
          </h2>
          <NotificationBell />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  </NotificationsProvider>
);

export default DashboardLayout;

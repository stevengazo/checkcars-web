import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Booking = () => {
  const [events, setEvents] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    plate: "",
    reason: "",
  });

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({
      title: "",
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
      plate: "",
      reason: "",
    });
    setSidebarOpen(true);
  };

  const handleAddEvent = () => {
    const { title, start, end, plate, reason } = newEvent;
    if (!title || !start || !end || !plate || !reason) {
      alert("Todos los campos son obligatorios");
      return;
    }
    setEvents([
      ...events,
      {
        title,
        start: new Date(start),
        end: new Date(end),
        plate,
        reason,
      },
    ]);
    setSidebarOpen(false);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventDetailsOpen(true);
  };

  return (
    <div className="w-full h-full flex">
      {/* Sidebar de creación */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-30 p-4 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-lg font-bold mb-4">Agregar Cita</h2>
        <label className="block mb-2">
          Título:
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            className="w-full border rounded p-2 mt-1"
          />
        </label>
        <label className="block mb-2">
          Inicio:
          <input
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) =>
              setNewEvent({ ...newEvent, start: e.target.value })
            }
            className="w-full border rounded p-2 mt-1"
          />
        </label>
        <label className="block mb-2">
          Fin:
          <input
            type="datetime-local"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            className="w-full border rounded p-2 mt-1"
          />
        </label>
        <label className="block mb-2">
          Placa del vehículo:
          <input
            type="text"
            value={newEvent.plate}
            onChange={(e) =>
              setNewEvent({ ...newEvent, plate: e.target.value })
            }
            className="w-full border rounded p-2 mt-1"
          />
        </label>
        <label className="block mb-4">
          Motivo de uso:
          <textarea
            value={newEvent.reason}
            onChange={(e) =>
              setNewEvent({ ...newEvent, reason: e.target.value })
            }
            className="w-full border rounded p-2 mt-1"
          />
        </label>
        <div className="flex justify-between">
          <button
            onClick={handleAddEvent}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 underline"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Sidebar de detalles */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-20 p-6 transition-transform duration-300 ease-in-out rounded-l-2xl border-l ${
          eventDetailsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Detalles del Evento
          </h2>
          <button
            onClick={() => setEventDetailsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {selectedEvent ? (
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Título:</span> {selectedEvent.title}
            </div>
            <div>
              <span className="font-medium">Inicio:</span>{" "}
              {selectedEvent.start.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Fin:</span>{" "}
              {selectedEvent.end.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Placa:</span> {selectedEvent.plate}
            </div>
            <div>
              <span className="font-medium">Motivo:</span>{" "}
              {selectedEvent.reason}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay evento seleccionado.</p>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-2">Booking</h1>
        <p className="mb-4">Reserva tu cita aquí.</p>
        <div style={{ height: 500 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            culture="es"
            messages={{
              next: "Sig.",
              previous: "Ant.",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              date: "Fecha",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "No hay eventos en este rango.",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;

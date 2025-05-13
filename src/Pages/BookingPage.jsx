import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";
import AddBookingSidebar from "../Components/AddBookingSidebar";
import ViewBookingSidebar from "../Components/ViewBookingSidebar";

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const BookingPage = () => {
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
      <AddBookingSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        onAddEvent={handleAddEvent}
      />

      <ViewBookingSidebar
        isOpen={eventDetailsOpen}
        onClose={() => setEventDetailsOpen(false)}
        event={selectedEvent}
      />

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

export default BookingPage;

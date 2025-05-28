import { useState, useContext, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion, AnimatePresence } from "framer-motion";

import AddBookingSidebar from "../Components/Booking/AddBookingSidebar.jsx";
import ViewBookingSidebar from "../Components/Booking/ViewBookingSidebar";
import useFetch from "../Hook/useFetch";
import SettingsContext from "../Context/SettingsContext.jsx";

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const sidebarVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const BookingPage = () => {
  const { API_URL } = useContext(SettingsContext);
  const URL = `${API_URL}/api/Bookings`;

  const { data, loading, error, refetch } = useFetch(URL, {
    autoFetch: true,
  });

  const [events, setEvents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    plate: "",
    reason: "",
  });

  // Convertir los bookings en eventos de calendario
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const formattedEvents = data.map((booking) => ({
        title: booking.reason || "Sin motivo",
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
        reason: booking.reason,
        province: booking.province,
        carId: booking.carId,
        userId: booking.userId,
        bookingId: booking.bookingId,
      }));
      setEvents(formattedEvents);
    }
  }, [data]);

  // Buscar información del vehículo cuando se selecciona un evento
  useEffect(() => {
    const fetchCar = async () => {
      if (selectedEvent?.carId) {
        try {
          const response = await fetch(`${API_URL}/api/Cars/${selectedEvent.carId}`,{
            autoFetch:false,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.ok) {
            const carData = await response.json();
            setSelectedCar(carData);
          } else {
            console.error("No se pudo obtener el vehículo");
            setSelectedCar(null);
          }
        } catch (error) {
          console.error("Error al obtener el vehículo:", error);
          setSelectedCar(null);
        }
      }
    };

    fetchCar();
  }, [selectedEvent, API_URL]);

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
    <div className="w-full h-full flex relative overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="addSidebar"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute top-0 right-0 z-50"
          >
            <AddBookingSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              onAddEvent={handleAddEvent}
            />
          </motion.div>
        )}

        {eventDetailsOpen && selectedEvent && (
          <motion.div
            key="viewSidebar"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute top-0 right-0 z-50"
          >
            <ViewBookingSidebar
              isOpen={eventDetailsOpen}
              onClose={() => setEventDetailsOpen(false)}
              event={selectedEvent}
              car={selectedCar} // 👈 nuevo prop con la info del vehículo
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex-1 p-4"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
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
      </motion.div>
    </div>
  );
};

export default BookingPage;

import { useState, useContext, useEffect } from "react";
// Importa el calendario y localizador de react-big-calendar
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// Funciones de date-fns para manejo de fechas
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
// Configuración de idioma español para fechas
import { es } from "date-fns/locale";
// Estilos CSS del calendario
import "react-big-calendar/lib/css/react-big-calendar.css";
// Animaciones con Framer Motion
import { motion, AnimatePresence } from "framer-motion";

// Componentes para agregar/ver reservas en sidebar
import AddBookingSidebar from "../Components/Booking/AddBookingSidebar.jsx";
import ViewBookingSidebar from "../Components/Booking/ViewBookingSidebar";
// Hook personalizado para hacer fetch de datos
import useFetch from "../Hook/useFetch";
// Contexto para obtener configuraciones globales, como la URL base
import SettingsContext from "../Context/SettingsContext.jsx";

// Locales para el localizador de fechas
const locales = { es };

// Configura el localizador para el calendario con date-fns y locales
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Variantes para animar la apertura/cierre del sidebar (framer-motion)
const sidebarVariants = {
  hidden: { x: "100%", opacity: 0 },  // Sidebar fuera de pantalla a la derecha
  visible: { x: 0, opacity: 1 },      // Sidebar visible en posición normal
  exit: { x: "100%", opacity: 0 },    // Sidebar saliendo a la derecha
};

// Variantes para animar el contenido principal (fade y movimiento vertical)
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const BookingPage = () => {
  // Extrae la URL base de la API del contexto de configuración global
  const { API_URL } = useContext(SettingsContext);
  const URL = `${API_URL}/api/Bookings`; // Endpoint para obtener reservas

  // Hook para traer datos de reservas desde la API
  const { data, loading, error, refetch } = useFetch(URL, {
    autoFetch: true, // Realiza la petición automáticamente al montar
  });

  // Estado para almacenar los eventos formateados para el calendario
  const [events, setEvents] = useState([]);
  // Estado para controlar si el sidebar para agregar reserva está abierto
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Estado para controlar si el sidebar para ver detalles está abierto
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  // Estado para almacenar el evento seleccionado para mostrar detalles
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Estado para almacenar la información del coche relacionado al evento seleccionado
  const [selectedCar, setSelectedCar] = useState(null);
  // Estado para crear un nuevo evento (reserva) con campos iniciales vacíos
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    carId: "",
    reason: "",
    province: "",
  });

  // useEffect para transformar los datos crudos de la API en eventos para el calendario
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const formattedEvents = data.map((booking) => ({
        title: booking.reason || "Sin motivo",  // Título visible en el evento
        start: new Date(booking.startDate),     // Fecha inicio como objeto Date
        end: new Date(booking.endDate),         // Fecha fin como objeto Date
        reason: booking.reason,
        province: booking.province,
        carId: booking.carId,
        userId: booking.userId,
        bookingId: booking.bookingId,
        status: booking.status, // Estado (Confirmado, Pendiente, Cancelado)
      }));
      setEvents(formattedEvents); // Actualiza el estado con los eventos formateados
    }
  }, [data]);

  // useEffect para obtener información del coche cuando se selecciona un evento
  useEffect(() => {
    const fetchCar = async () => {
      if (selectedEvent?.carId) {
        try {
          const response = await fetch(
            `${API_URL}/api/Cars/${selectedEvent.carId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Token para autenticación
              },
            }
          );
          if (response.ok) {
            const carData = await response.json();
            setSelectedCar(carData); // Guarda los datos del coche en estado
          } else {
            console.error("No se pudo obtener el vehículo");
            setSelectedCar(null); // Limpia el estado si falla la petición
          }
        } catch (error) {
          console.error("Error al obtener el vehículo:", error);
          setSelectedCar(null); // Limpia el estado si hay error
        }
      }
    };

    fetchCar();
  }, [selectedEvent, API_URL]);

  // Manejador cuando el usuario selecciona un rango de fechas en el calendario
  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({
      title: "",
      start: start.toISOString().slice(0, 16), // Formatea fecha a string para inputs
      end: end.toISOString().slice(0, 16),
      plate: "",
      reason: "",
    });
    setSidebarOpen(true); // Abre el sidebar para agregar nueva reserva
  };

  // Manejador para agregar un nuevo evento a la lista de eventos
  const handleAddEvent = () => {
    const { title, start, end, plate, reason } = newEvent;
    // Validación: todos los campos son obligatorios
    if (!title || !start || !end || !plate || !reason) {
      alert("Todos los campos son obligatorios");
      return;
    }
    // Agrega el nuevo evento al estado de eventos, convirtiendo fechas a objetos Date
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
    setSidebarOpen(false); // Cierra el sidebar al agregar
  };

  // Manejador para cuando se selecciona un evento del calendario
  const handleSelectEvent = (event) => {
    setSelectedEvent(event); // Guarda el evento seleccionado
    setEventDetailsOpen(true); // Abre el sidebar con detalles del evento
  };

  // Función para asignar colores a los eventos según su estado
  const eventPropGetter = (event) => {
    let backgroundColor = "#2196F3"; // Azul por defecto

    if (event.status === "Confirmado") {
      backgroundColor = "#4CAF50"; // Verde para confirmados
    } else if (event.status === "Pendiente") {
      backgroundColor = "#FFC107"; // Amarillo para pendientes
    } else if (event.status === "Cancelado") {
      backgroundColor = "#F44336"; // Rojo para cancelados
    }

    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        border: "none",
      },
    };
  };

  return (
    <div className="w-full h-full flex relative overflow-hidden">
      {/* Contenedor para mostrar los sidebars con animación */}
      <AnimatePresence>
        {/* Sidebar para agregar nueva reserva */}
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

        {/* Sidebar para ver detalles de una reserva seleccionada */}
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
              car={selectedCar}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido principal con animación */}
      <motion.div
        className="flex-1 p-4"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        <h1 className="text-2xl font-bold mb-2">Booking</h1>
        <p className="mb-4">Reserva tu cita aquí.</p>
        <div style={{ height: 500 }}>
          {/* Calendario interactivo */}
          <Calendar
            localizer={localizer} // Configuración regional y de fechas
            events={events} // Eventos a mostrar
            startAccessor="start" // Propiedad que indica inicio evento
            endAccessor="end" // Propiedad que indica fin evento
            selectable // Permite seleccionar fechas para crear evento
            onSelectSlot={handleSelectSlot} // Manejador al seleccionar un rango
            onSelectEvent={handleSelectEvent} // Manejador al seleccionar un evento
            culture="es" // Idioma español
            eventPropGetter={eventPropGetter} // Función para colorear eventos
            messages={{
              // Traducción de textos del calendario
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

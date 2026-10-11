import { useState, useEffect, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa6";

import bookingService from "../services/bookingService";
import carsService from "../services/carsService";
import useApi from "../Hook/useApi";
import PageHeader from "../Components/templates/PageHeader";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";

import AddBookingSidebar from "../Components/Booking/AddBookingSidebar.jsx";
import ViewBookingSidebar from "../Components/Booking/ViewBookingSidebar";

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: { es } });

const sidebarVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

// Paleta tipo Google Calendar por estado.
const STATUS_COLORS = {
  Confirmado: "#34a853",
  Pendiente: "#f9ab00",
  Cancelado: "#ea4335",
};
const DEFAULT_COLOR = "#1a73e8";

const LEGEND = [
  { label: "Confirmado", color: STATUS_COLORS.Confirmado },
  { label: "Pendiente", color: STATUS_COLORS.Pendiente },
  { label: "Cancelado", color: STATUS_COLORS.Cancelado },
  { label: "Otros", color: DEFAULT_COLOR },
];

const messages = {
  next: "Sig.", previous: "Ant.", today: "Hoy", month: "Mes", week: "Semana",
  day: "Día", agenda: "Agenda", date: "Fecha", time: "Hora", event: "Reserva",
  noEventsInRange: "No hay reservas en este rango.", showMore: (t) => `+${t} más`,
};

const BookingPage = () => {
  const { data, loading, refetch } = useApi(() => bookingService.list());

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", carId: "", reason: "", province: "" });

  const events = useMemo(
    () =>
      (data || []).map((b) => ({
        title: b.reason || "Sin motivo",
        start: new Date(b.startDate),
        end: new Date(b.endDate),
        reason: b.reason,
        province: b.province,
        carId: b.carId,
        userId: b.userId,
        bookingId: b.bookingId,
        status: b.status,
      })),
    [data]
  );

  useEffect(() => {
    let active = true;
    if (selectedEvent?.carId) {
      carsService
        .get(selectedEvent.carId)
        .then((c) => active && setSelectedCar(c))
        .catch(() => active && setSelectedCar(null));
    }
    return () => { active = false; };
  }, [selectedEvent]);

  const openAdd = (start = new Date(), end = new Date(Date.now() + 2 * 3600 * 1000)) => {
    setNewEvent({
      title: "",
      start: new Date(start).toISOString().slice(0, 16),
      end: new Date(end).toISOString().slice(0, 16),
      carId: "",
      reason: "",
      province: "",
    });
    setSidebarOpen(true);
  };

  const handleSelectSlot = ({ start, end }) => openAdd(start, end);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventDetailsOpen(true);
  };

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: STATUS_COLORS[event.status] || DEFAULT_COLOR,
      color: "#fff",
    },
  });

  const closeAndRefresh = (setter) => () => {
    setter(false);
    refetch();
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div key="addSidebar" initial="hidden" animate="visible" exit="exit" variants={sidebarVariants} transition={{ type: "tween", duration: 0.3 }} className="absolute right-0 top-0 z-50">
            <AddBookingSidebar isOpen={sidebarOpen} onClose={closeAndRefresh(setSidebarOpen)} newEvent={newEvent} setNewEvent={setNewEvent} onAddEvent={closeAndRefresh(setSidebarOpen)} />
          </motion.div>
        )}
      </AnimatePresence>

      <ViewBookingSidebar isOpen={eventDetailsOpen && !!selectedEvent} onClose={closeAndRefresh(setEventDetailsOpen)} event={selectedEvent} car={selectedCar} />

      <motion.div className="flex flex-1 flex-col" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <PageHeader
          title="Reservas"
          action={
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden flex-wrap items-center gap-3 sm:flex">
                {LEGEND.map((l) => (
                  <span key={l.label} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.label}
                  </span>
                ))}
              </div>
              <Button onClick={() => openAdd()}>
                <FaPlus size={13} /> Nueva reserva
              </Button>
            </div>
          }
        />
        <p className="mb-4 text-sm text-gray-500">
          Selecciona un rango de días para crear una reserva, o haz clic en una existente para ver el detalle.
        </p>

        <Card className="gcal flex-1" padding="p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            popup
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            culture="es"
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            eventPropGetter={eventPropGetter}
            messages={messages}
            style={{ height: "72vh" }}
            className={loading ? "opacity-60" : ""}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default BookingPage;

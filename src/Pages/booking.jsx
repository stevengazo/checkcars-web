// Booking.js
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { es } from 'date-fns/locale';

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: 'Cita con el doctor',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
  },
];

const Booking = () => {
  return (
    <div className='flex flex-col items-center'>
      <h1>Booking</h1>
      <p>Book your appointment here.</p>
      <div style={{ height: 500, marginTop: '2rem' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
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
  );
};

export default Booking;

import {
  Calendar,
  dateFnsLocalizer,
  Views,
  momentLocalizer,
} from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import moment from "moment";

// Configuración del localizador
const locales = { es };
const localizer = momentLocalizer(moment); // O dateFnsLocalizer si prefieres usar date-fns



const Demo = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Demo Page</h1>
      <p className="text-lg text-gray-700 mb-6">
        Este es un calendario de ejemplo.
      </p>

      <div className="w-full max-w-5xl h-[600px] bg-white shadow-md rounded-md p-4">
        <Calendar
          localizer={localizer}

        defaultView={Views.WEEK}
          events={[
            {
              title: "Evento 1",
              start: new Date(2025, 9, 1, 10, 0),
              end: new Date(2025, 9, 1, 12, 0),
            },
            {
              title: "Evento 2",
              start: new Date(2023, 9, 2, 14, 0),
              end: new Date(2023, 9, 2, 16, 0),
            },
          ]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          culture="es"
        />
      </div>
    </div>
  );
};

export default Demo;

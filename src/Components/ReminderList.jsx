import { useState } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    weekday: "long",     // lunes, martes, etc.
    day: "2-digit",
    month: "long",       // enero, febrero, etc.
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false        // Formato 24 horas
  });
};

export const ReminderList = ({ items }) => {
  const [reminders, setReminders] = useState(items);

  const handleComplete = (index) => {
    const updated = [...reminders];
    updated[index].isComplete = true;
    setReminders(updated);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {reminders.map((item, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all"
        >
          <h3 className="text-2xl font-bold mb-3 text-gray-800">{item.title}</h3>

          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Fecha y Hora:</span> {formatDate(item.reminderDate)}
          </p>

          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Descripción:</span> {item.description}
          </p>

          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Estado:</span>{" "}
            <span className={item.sendIt ? "text-green-600" : "text-red-500"}>
              {item.sendIt ? "Enviado" : "Sin Finalizar"}
            </span>
          </p>

          <p className="text-sm text-gray-700 mb-4">
            <span className="font-semibold">Finalizado:</span>{" "}
            <span className={item.isComplete ? "text-green-600" : "text-red-500"}>
              {item.isComplete ? "Completado" : "Sin Finalizar"}
            </span>
          </p>

          {!item.isComplete && (
            <button
              onClick={() => handleComplete(index)}
              className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Marcar como finalizado
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

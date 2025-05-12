import { useState } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
          className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition-all"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Fecha y Hora:</span> {formatDate(item.reminderDate)}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Estado:</span>{" "}
            <span className={item.sendIt ? "text-green-600" : "text-red-600"}>
              {item.sendIt ? "Enviado" : "Sin Finalizar"}
            </span>
          </p>
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Finalizado:</span>{" "}
            <span className={item.isComplete ? "text-green-600" : "text-red-600"}>
              {item.isComplete ? "Completado" : "Sin Finalizar"}
            </span>
          </p>

          {!item.isComplete && (
            <button
              onClick={() => handleComplete(index)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Marcar como finalizado
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

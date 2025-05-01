import { IoIosCloseCircle } from "react-icons/io";
import { useState, useContext } from "react";
import SettingsContext from "../Context/SettingsContext.jsx";

export const AddReminder = ({ onClose }) => {
  const { API_URL } = useContext(SettingsContext);
  const [reminderData, setReminderData] = useState({
    title: "",
    description: "",
    email: "",
    dateTime: "",
    author: "",
    carId: "",
    recipients: [],  // Lista para almacenar destinatarios
    isCompleted: false,
    sendIt: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReminderData({
      ...reminderData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleAddRecipient = () => {
    if (reminderData.email && !reminderData.recipients.includes(reminderData.email)) {
      setReminderData({
        ...reminderData,
        recipients: [...reminderData.recipients, reminderData.email],
        email: ""  // Limpiar campo después de agregar
      });
    }
  };

  const handleRemoveRecipient = (email) => {
    setReminderData({
      ...reminderData,
      recipients: reminderData.recipients.filter((recipient) => recipient !== email)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí va la lógica para enviar el formulario o realizar alguna acción con los datos
    console.log(reminderData);
  };

  return (
    <div className="fixed top-0 right-0 z-50 w-full md:w-[50vw] lg:w-[40vw] h-full bg-white border-l border-gray-200 shadow-lg overflow-y-auto transition-all duration-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Nuevo Recordatorio</h2>
        <button
          onClick={() => onClose()}
          className="text-red-600 hover:text-red-800 transition"
          title="Cerrar"
        >
          <IoIosCloseCircle size={32} />
        </button>
      </div>

      {/* Formulario de recordatorio */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={reminderData.title}
          onChange={handleChange}
          placeholder="Título"
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        />

        <textarea
          name="description"
          value={reminderData.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full border p-2 rounded-lg resize-none focus:outline-none focus:ring focus:border-blue-500"
          rows={3}
        />

        <input
          type="email"
          name="email"
          value={reminderData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAddRecipient}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Añadir Destinatario
          </button>
          <div className="w-full pl-4">
            {reminderData.recipients.length > 0 && (
              <ul className="list-none space-y-2">
                {reminderData.recipients.map((recipient, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{recipient}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(recipient)}
                      className="text-red-600 hover:text-red-800"
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <input
          type="datetime-local"
          name="dateTime"
          value={reminderData.dateTime}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        />

        <input
          type="text"
          name="author"
          value={reminderData.author}
          onChange={handleChange}
          placeholder="Autor"
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        />

        <input
          type="number"
          name="carId"
          value={reminderData.carId}
          onChange={handleChange}
          placeholder="ID del auto"
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isCompleted"
            name="isCompleted"
            checked={reminderData.isCompleted}
            onChange={handleChange}
            className="accent-blue-600"
          />
          <label htmlFor="isCompleted" className="text-sm">¿Completado?</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sendIt"
            name="sendIt"
            checked={reminderData.sendIt}
            onChange={handleChange}
            className="accent-blue-600"
          />
          <label htmlFor="sendIt" className="text-sm">¿Enviar recordatorio?</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Crear
        </button>
      </form>
    </div>
  );
};

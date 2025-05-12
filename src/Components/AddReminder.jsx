import { IoIosCloseCircle } from "react-icons/io";
import { useState, useContext, useEffect } from "react";
import useFetch from "../Hook/useFetch.js";
import SettingsContext from "../Context/SettingsContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

export const AddReminder = ({ onClose, CarId }) => {
  const [reminderData, setReminderData] = useState({
    reminderId: 0,
    title: "",
    description: "",
    email: "",
    dateTime: "",
    author: "",
    carId: CarId ,
    reminderDests: [],
    isCompleted: false,
    sendIt: false,
  });

  const { API_URL } = useContext(SettingsContext);

  const { data: Users, loading } = useFetch(`${API_URL}/api/users`, {
    autoFetch: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReminderData({
      ...reminderData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleReminderDestChange = (e) => {
    const email = e.target.value;
    const id = Users?.find((user) => user.email === email)?.id;

    if (id === undefined) {
      console.log("No se encontró el ID del usuario con ese email.");
      return;
    }

    setReminderData((prev) => ({
      ...prev,
      reminderDests: [
        ...prev.reminderDests,
        {
          reminderDestId: 0,
          userId: id,
          reminderId: 0,
          reminder: null,
        },
      ],
    }));
  };

  const GetUserInfo = (idUser) => {
    const user = Users?.find((user) => user.id === idUser);

    if (!user) {
      console.warn("No se encontró el usuario con el id:", idUser);
      return null;
    }

    console.log("Usuario encontrado:", user);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };

  const handleRemoveRecipient = (email) => {
    setReminderData({
      ...reminderData,
      reminderDests: reminderData.reminderDests.filter(
        (recipient) => recipient !== email
      ),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí va la lógica para enviar el formulario o realizar alguna acción con los datos
    console.log(reminderData);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 right-0 z-50 w-full md:w-[50vw] lg:w-[40vw] h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto p-6 space-y-6"
      >
        <div className="fixed top-0 right-0 z-50 w-full md:w-[50vw] lg:w-[40vw] h-full bg-white border-l border-gray-200 shadow-lg overflow-y-auto p-6 space-y-6 rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-gray-800">
              Nuevo Recordatorio
            </h2>
            <button
              onClick={() => onClose()}
              className="text-red-600 hover:text-red-800 transition-transform transform hover:rotate-180"
              title="Cerrar"
            >
              <IoIosCloseCircle size={32} />
            </button>
          </div>

          {/* Formulario de recordatorio */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="title"
              value={reminderData.title}
              onChange={handleChange}
              placeholder="Título"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />

            <textarea
              name="description"
              value={reminderData.description}
              onChange={handleChange}
              placeholder="Descripción"
              className="w-full p-3 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              rows={4}
            />

            <input
              list="usersEmails"
              onChange={handleReminderDestChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            ></input>
            <datalist id="usersEmails">
              {Users?.map((user) => {
                return (
                  <option key={user.id} value={user.email}>
                    {user.email}
                  </option>
                );
              })}
            </datalist>

            <div className="flex flex-col justify-between items-center space-x-2">
              <div className="w-full pl-4">
                {reminderData.reminderDests.length > 0 && (
                  <ul className="list-none space-y-2">
                    {reminderData.reminderDests.map((DestInfo, index) => (
                      <li
                        key={index}
                        className="flex justify-between border rounded-md border-gray-300 p-2 items-center text-sm text-gray-700"
                      >
                        {GetUserInfo(DestInfo.userId)?.email}
                        <IoIosCloseCircle
                          size={24}
                          className="text-red-500 hover:rotate-180 cursor-pointer transition"
                         
                        />
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
              min={new Date().toISOString().slice(0, 16)}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />

            <input
              type="text"
              name="author"
              value={reminderData.author}
              onChange={handleChange}
              placeholder="Autor"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />

            <input
              type="number"
              name="carId"
              value={reminderData.carId}
              onChange={handleChange}
              placeholder="ID del auto"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />

            <button
              type="submit"
              className="w-full py-3 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              Crear
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

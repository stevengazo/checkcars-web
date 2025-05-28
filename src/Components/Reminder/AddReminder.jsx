import { IoIosCloseCircle } from "react-icons/io";
import { useState, useContext, useEffect } from "react";
import useFetch from "../../Hook/useFetch.js";
import SettingsContext from "../../Context/SettingsContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

export const AddReminder = ({ onClose, CarId ,OnAdded}) => {
  const [reminderData, setReminderData] = useState({
    reminderId: 0,
    title: "",
    description: "",
    email: "",
    ReminderDate: "",
    author: "",
    carId: CarId,
    reminderDests: [],
    isCompleted: false,
    sendIt: false,
  });

  const [added, setAdded] = useState(false);

  const { API_URL } = useContext(SettingsContext);

  const { data: Users } = useFetch(`${API_URL}/api/users`, {
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
    if (!user) return null;
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
        (recipient) => GetUserInfo(recipient.userId)?.email !== email
      ),
    });
  };

  const {
    data: Result,
    loading: Sending,
    error: SendingError,
    status,
    refetch,
  } = useFetch(`${API_URL}/api/Reminder`, {
    method: "POST",
    body: JSON.stringify(reminderData),
    headers: { "Content-Type": "application/json" },
    autoFetch: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Sending) return; // Previene múltiples envíos
    refetch();
    console.log(reminderData);
    OnAdded(); // Llama a la función para indicar que se ha añadido un recordatorio
  };

  useEffect(() => {
    if (status === 201) {
      setAdded(true);
    }
  }, [status]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 right-0 z-50 w-full md:w-[50vw] lg:w-[40vw] h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto p-6 space-y-6"
      >
        <div className="space-y-6">
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

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="title"
              value={reminderData.title}
              onChange={handleChange}
              placeholder="Título"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="description"
              value={reminderData.description}
              onChange={handleChange}
              placeholder="Descripción"
              className="w-full p-3 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />

            <input
              list="usersEmails"
              onChange={handleReminderDestChange}
              placeholder="Agregar destinatario"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="usersEmails">
              {Users?.map((user) => (
                <option key={user.id} value={user.email}>
                  {user.email}
                </option>
              ))}
            </datalist>

            {reminderData.reminderDests.length > 0 && (
              <ul className="list-none space-y-2 pl-4">
                {reminderData.reminderDests.map((dest, index) => {
                  const userInfo = GetUserInfo(dest.userId);
                  return (
                    <li
                      key={index}
                      className="flex justify-between border rounded-md border-gray-300 p-2 items-center text-sm text-gray-700"
                    >
                      {userInfo?.email}
                      <IoIosCloseCircle
                        size={24}
                        className="text-red-500 hover:rotate-180 cursor-pointer transition"
                        onClick={() => handleRemoveRecipient(userInfo?.email)}
                      />
                    </li>
                  );
                })}
              </ul>
            )}

            <input
              type="datetime-local"
              name="ReminderDate"
              value={reminderData.ReminderDate}
              min={new Date().toISOString().slice(0, 16)}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="author"
              value={reminderData.author}
              onChange={handleChange}
              placeholder="Autor"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              readOnly
              name="carId"
              value={reminderData.carId}
              className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-100"
            />

            {!added && (
              <button
                type="submit"
                disabled={Sending}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {Sending ? "Enviando..." : "Enviar Recordatorio"}
              </button>
            )}
          </form>

          {added && (
            <div className="z-50 bg-green-500 text-white rounded-lg p-3 text-center">
              Recordatorio creado con éxito
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

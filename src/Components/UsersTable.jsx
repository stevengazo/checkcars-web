import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import useFetch from "../Hook/useFetch";
import SettingsContext from "../Context/SettingsContext.jsx";

const UsersTable = () => {
  const { API_URL } = useContext(SettingsContext);
  const URL = `${API_URL}/api/Users`;
  const { data, loading, error } = useFetch(URL, { autoFetch: true });

  useEffect(() => {
    console.table(data);
  }, [data]);

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center py-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, yoyo: Infinity }}
      >
        <motion.div
          className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error al cargar los datos.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3  text-left">Email</th>
            <th className="px-6 py-3  text-left">Confirmado</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">
                  {user.emailConfirmed ? "Sí" : "No"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="2"
                className="px-6 py-4 text-center text-gray-500 italic"
              >
                No hay usuarios disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

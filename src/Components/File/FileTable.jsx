import { useState, useContext } from "react";
import SettingsContext from "../../Context/SettingsContext.jsx";
import useFetch from "../../Hook/useFetch.js";

const FileTable = ({ items }) => {
  const { API_URL } = useContext(SettingsContext);
  const [fileItems, setFileItems] = useState(items);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDownload = (filePath) => {
    window.open(filePath, "_blank");
  };

  const handleDelete = async (id) => {
    const URL = `${API_URL}/api/VehicleAttachments/${id}`;

    try {
      const response = await fetch(URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el archivo");
      }

      // Filtramos el archivo eliminado del estado
      setFileItems((prevItems) =>
        prevItems.filter((item) => item.attachmentId !== id)
      );
      console.log(`Archivo con ID ${id} eliminado correctamente.`);
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
    }
  };

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nombre</th>
            <th className="py-3 px-6 text-left">Fecha</th>
            <th colSpan={2} className="py-3 px-6 text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {fileItems.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6">{item.fileName}</td>
              <td className="py-3 px-6">{formatDate(item.uploadedAt)}</td>
              <td className="py-3 px-6">
                <button
                  data-filepath={item.filePath}
                  className="text-blue-500 hover:underline"
                  onClick={() => handleDownload(item.filePath)}
                >
                  Descargar
                </button>
              </td>
              <td>
                <button
                  data-filepath={item.filePath}
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(item.attachmentId)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;

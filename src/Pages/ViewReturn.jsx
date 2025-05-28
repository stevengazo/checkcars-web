import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import useFetch from "../../Hook/useFetch.js";
import MapLocation from "../Maps/MapLocation";
import { BeatLoader } from "react-spinners";
import SettingsContext from "../../Context/SettingsContext.jsx";
import generatePDFReport from "../../utils/generatePDFReport.js";
import { motion, AnimatePresence } from "framer-motion";

const ViewReturn = () => {
  const { id } = useParams();
  const { API_URL } = useContext(SettingsContext);
  const { data: entry, loading: loadingEntry } = useFetch(`${API_URL}/api/Returns/${id}`, { autoFetch: true });
  const { data: photos, loading: loadingPhotos } = useFetch(`${API_URL}/api/Photos/return/${id}`, { autoFetch: true });

  const HandlePDF = () => {
    const pdfData = {
      entry: {
        ...entry,
        created: new Date(entry.created).toLocaleString("es-ES"),
      },
      photos,
    };
    generatePDFReport(pdfData, photos);
  };

  const InfoItem = ({ label, value, important = false }) => (
    <div className="flex flex-col text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className={`text-gray-800 ${important ? "font-semibold" : ""}`}>
        {value || "—"}
      </span>
    </div>
  );

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

  if (loadingEntry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BeatLoader size={14} />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No se encontró la información del retorno.</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 right-0 z-40 w-full md:w-[50vw] lg:w-[40vw] h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto p-6 space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Resumen de Retorno</h2>
          <div className="flex items-center gap-3">
            <Link
              to={`/car/${entry.carId}`}
              className="px-4 py-2 text-blue-600 bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-700 transition duration-200"
            >
              Vehículo
            </Link>
            <button
              onClick={HandlePDF}
              title="Generar PDF"
              className="p-2 text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-800 transition duration-200"
            >
              <FaRegFilePdf size={20} />
            </button>
            <Link
              to="/returns"
              title="Cerrar"
              className="p-2 text-red-600 border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-800 hover:rotate-180 transition duration-200"
            >
              <IoIosCloseCircle size={24} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Fecha" value={formatDate(entry.created)} />
          <InfoItem label="Autor" value={entry.author} />
          <InfoItem label="Placa" value={entry.carPlate} />
          <InfoItem label="Kilometraje" value={entry.mileage} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Ubicación GPS</h3>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <InfoItem label="Latitud" value={entry.latitude} />
            <InfoItem label="Longitud" value={entry.longitude} />
          </div>
          <MapLocation latitude={entry.latitude} longitude={entry.longitude} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Fotos del Retorno</h3>
          {loadingPhotos ? (
            <div className="flex justify-center py-4">
              <BeatLoader size={14} />
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.filePath}
                  alt={photo.name || "Imagen"}
                  className="w-full rounded-xl border"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No hay imágenes disponibles.</p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewReturn;

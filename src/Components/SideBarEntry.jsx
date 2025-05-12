import { useContext } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import useFetch from "../Hook/useFetch";
import MapLocation from "./MapLocation";
import { BeatLoader } from "react-spinners";
import SettingsContext from "../Context/SettingsContext.jsx";
import generatePDFReport from "../utils/generatePDFReport.js";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SideBarEntry({ entry, onClose }) {
  const { API_URL } = useContext(SettingsContext);
  const { data, loading } = useFetch(
    `${API_URL}/api/Photos/report/${entry.reportId}`,
    { autoFetch: true }
  );

  const HandlePDF = () => {
    const pdfData = {
      entry: {
        ...entry,
        created: new Date(entry.created).toLocaleString("es-ES"),
      },
      photos: data,
    };
    generatePDFReport(pdfData, data);
  };

  const InfoItem = ({ label, value, important = false }) => (
    <div className="flex flex-col text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className={`text-gray-800 ${important ? "font-semibold" : ""}`}>
        {value || "—"}
      </span>
    </div>
  );

  const YesNo = ({ label, value }) => (
    <InfoItem label={label} value={value ? "Sí" : "No"} important={!value} />
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 right-0 z-50 w-full md:w-[50vw] lg:w-[40vw] h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto p-6 space-y-6"
      >
        <div className="fixed top-0 right-0 z-50 w-full md:w-[50vw] lg:w-[40vw] h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto transition-all duration-300 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Resumen de Salida
            </h2>
            <div className="flex items-center gap-3">
              <Link
                to={`/car/${entry.carId}`}
                className="flex items-center justify-center px-4 py-2 text-blue-600 bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-700 transition duration-200"
              >
                Ver Vehículo
              </Link>

              <button
                onClick={HandlePDF}
                title="Generar PDF"
                className="flex items-center justify-center p-2 text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-800 transition duration-200"
              >
                <FaRegFilePdf size={20} />
              </button>

              <button
                onClick={() => onClose(null)}
                title="Cerrar"
                className="flex items-center justify-center p-2 text-red-600 border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-800 hover:rotate-180 transition duration-200"
              >
                <IoIosCloseCircle size={24} />
              </button>
            </div>
          </div>

          {/* Información resumida y presentación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="Fecha" value={formatDate(entry.created)} />
            <InfoItem label="Autor" value={entry.author} />
            <InfoItem label="Placa" value={entry.carPlate} />
            <InfoItem label="Kilometraje" value={entry.mileage} />
            <InfoItem label="Pintura" value={entry.paintState} />
            <InfoItem label="Mecánica" value={entry.mecanicState} />
            <InfoItem label="Aceite" value={entry.oilLevel} />
            <InfoItem label="Interiores" value={entry.interiorsState} />
            <InfoItem label="Motivo" value={entry.notes} />
          </div>

          {/* Ubicación GPS */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Ubicación GPS
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <InfoItem label="Latitud" value={entry.latitude} />
              <InfoItem label="Longitud" value={entry.longitude} />
            </div>
            <MapLocation
              longitude={entry.longitude}
              latitude={entry.latitude}
            />
          </div>

          {/* Condiciones y accesorios */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Condiciones y Accesorios
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                label="Combustible"
                value={
                  <progress
                    value={entry.fuelLevel}
                    max={100}
                    className="w-full h-2"
                  />
                }
              />
              <InfoItem label="Neumáticos" value={entry.tiresState} />
              <YesNo label="Llanta de repuesto" value={entry.hasSpareTire} />
              <YesNo label="Cargador USB" value={entry.hasChargerUSB} />
              <YesNo label="Quick Pass" value={entry.hasQuickPass} />
              <YesNo label="Soporte Teléfono" value={entry.hasPhoneSupport} />
              <YesNo label="Kit Emergencia" value={entry.hasEmergencyKit} />
            </div>
          </div>

          {/* Galería de fotos */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Fotos del Reporte
            </h3>
            {loading ? (
              <div className="flex justify-center py-4">
                <BeatLoader size={14} />
              </div>
            ) : data && data.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {data.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.filePath}
                    alt={photo.name || "Imagen"}
                    className="w-full rounded-xl border"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No hay imágenes disponibles.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

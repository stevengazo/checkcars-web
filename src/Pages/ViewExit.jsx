import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import { BeatLoader } from "react-spinners";
import { usestate } from "react";
import useFetch from "../Hook/useFetch.js";
import MapLocation from "../Components/Maps/MapLocation.jsx";
import SettingsContext from "../Context/SettingsContext.jsx";
import { Link } from "react-router-dom";
import generatePDFReport from "../utils/generatePDFReport.js";

const InfoItem = ({ label, value, important = false }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span
      className={`text-base ${
        important ? "font-semibold text-gray-800" : "text-gray-700"
      }`}
    >
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

const ViewExit = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { id } = useParams();
  const { API_URL } = useContext(SettingsContext);

  const { data: entry, loading } = useFetch(
    `${API_URL}/api/EntryExitReports/${id}`,
    { autoFetch: true }
  );
  const { data: photos } = useFetch(`${API_URL}/api/Photos/report/${id}`, {
    autoFetch: true,
  });

  const handlePDF = () => {
    const pdfData = {
      entry: {
        ...entry,
        created: new Date(entry.created).toLocaleString("es-ES"),
      },
      photos,
    };
    generatePDFReport(pdfData, photos);
  };

  if (loading || !entry) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BeatLoader />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Reporte de Salida</h1>
        <button
          onClick={handlePDF}
          title="Generar PDF"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <FaRegFilePdf size={20} />
          <span className="text-sm font-medium">Descargar PDF</span>
        </button>
      </div>

      {/* Información general */}
      <section className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <InfoItem label="Fecha" value={formatDate(entry.created)} />
        <InfoItem label="Autor" value={entry.author} />
        <Link to={`/car/${entry.carId}`} className="inline-block px-3 py-1 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition">
          <InfoItem label="Placa" value={entry.carPlate} />
        </Link>
        <InfoItem label="Kilometraje" value={entry.mileage} />
        <InfoItem label="Pintura" value={entry.paintState} />
        <InfoItem label="Mecánica" value={entry.mecanicState} />
        <InfoItem label="Aceite" value={entry.oilLevel} />
        <InfoItem label="Interiores" value={entry.interiorsState} />
        <InfoItem label="Motivo" value={entry.notes} />
      </section>

      {/* Ubicación GPS */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4 z-40">
        <h2 className="text-xl font-semibold text-gray-800">Ubicación GPS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoItem label="Latitud" value={entry.latitude} />
          <InfoItem label="Longitud" value={entry.longitude} />
        </div>
        <div className="overflow-hidden rounded-xl border">
          <MapLocation latitude={entry.latitude} longitude={entry.longitude} />
        </div>
      </section>

      {/* Condiciones */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Condiciones y Accesorios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <InfoItem
            label="Combustible"
            value={
              <progress
                value={entry.fuelLevel}
                max={100}
                className="w-full h-2 appearance-none [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-green-500 rounded"
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
      </section>

      {/* Galería de Fotos */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Fotos del Reporte
        </h2>
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <img
                key={index}
                src={photo.filePath}
                alt={photo.name || "Imagen"}
                className="w-full h-52 object-cover rounded-xl border cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedImage(photo.filePath)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No hay imágenes disponibles.
          </p>
        )}
      </section>

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()} // evita cerrar si clic en la imagen
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-1.5"
              aria-label="Cerrar"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Vista ampliada"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewExit;

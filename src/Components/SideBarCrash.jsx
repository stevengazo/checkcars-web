import { IoIosCloseCircle } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import useFetch from "../Hook/useFetch";
import { BeatLoader } from "react-spinners";
import Map from "../Components/MapLocation";
import { Link } from "react-router-dom";
import useGeneratePDF from "../Hook/useGeneratePdf";
import SettingsContext from "../Context/SettingsContext.jsx";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SideBarCrash({ crash, onClose }) {
  const { API_URL } = useContext(SettingsContext);
  const { data, loading } = useFetch(
    `${API_URL}/api/Photos/report/${crash.reportId}`,
    { autoFetch: true }
  );
  const { generatePDF } = useGeneratePDF();

  const generateName = () => {
    const date = new Date();
    return `Reporte-Accidente-${date.toISOString().split("T")[0]}.pdf`;
  };
  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const HandleGenerate = () => {
    generatePDF((doc) => {
      const marginX = 15;
      let y = 20;

      const line = () => {
        doc.setDrawColor(200);
        doc.line(marginX, y, 200, y);
        y += 6;
      };

      const header = () => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("CheckCars", marginX, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
          `Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`,
          150,
          y
        );
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Reporte de Accidente de Vehículo", marginX, y);
        y += 10;
        line();
      };

      const addField = (label, value) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, marginX, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(value ?? "—"), marginX + 55, y);
        y += 8;
      };

      const addSection = (title) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(title, marginX, y);
        y += 8;
        line();
      };

      header();

      // 📌 Información del reporte
      addSection("Información general");
      addField("Fecha", formatDate(crash.created));
      addField("Autor", crash.author);
      addField("Placa", crash.carPlate);
      addField("Daños", crash.crashedParts);
      addField("Detalles", crash.crashDetails);
      addField("Ubicación", crash.location);

      // 📍 Coordenadas GPS
      addSection("Ubicación GPS");
      addField("Latitud", crash.latitude);
      addField("Longitud", crash.longitude);
      addField(
        "Google Maps",
        `https://maps.google.com/?q=${crash.latitude},${crash.longitude}`
      );

      // 🖼 Imágenes
      if (data && data.length > 0) {
        addSection("Imágenes");
        const imgWidth = 60;
        const spacing = 10;

        data.forEach((photo, index) => {
          const img = new Image();
          img.src = photo.filePath;
          img.onload = () => {
            const imgHeight = (img.height * imgWidth) / img.width;

            if (y + imgHeight > 260) {
              doc.addPage();
              y = 20;
            }

            doc.addImage(img, "JPEG", marginX, y, imgWidth, imgHeight);
            y += imgHeight + spacing;

            if (index === data.length - 1) doc.save();
          };
        });
      } else {
        doc.save();
      }
    }, generateName());
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
        <div className="fixed top-0 right-0 z-50 w-full md:w-[50vw] lg:w-[40vw] h-full bg-white border-l border-gray-200 shadow-lg overflow-y-auto transition-all duration-300 p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Registro de Accidente
            </h2>
            <div className="flex items-center gap-3">
              <Link
                to={`/car/${crash.carId}`}
                className="flex items-center justify-center px-4 py-2 text-blue-600 bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-700 transition duration-200"
              >
                Ver Vehículo
              </Link>

              <button
                onClick={HandleGenerate}
                className="flex items-center justify-center p-2 text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-800 transition duration-200"
                title="Generar PDF"
              >
                <FaRegFilePdf size={20} />
              </button>

              <button
                onClick={() => onClose(null)}
                className="flex items-center justify-center p-2 text-red-600 border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-800 transition duration-200"
                title="Cerrar"
              >
                <IoIosCloseCircle size={24} />
              </button>
            </div>
          </div>

          {/* Información */}
          <div className="space-y-3">
            <InfoRow label="Creación" value={crash.created} />
            <InfoRow label="Autor" value={crash.author} />
            <InfoRow label="Placa" value={crash.carPlate} />
            <InfoRow label="Localización" value={crash.location} />
            <InfoRow label="Detalles" value={crash.crashDetails} />
            <InfoRow label="Daños" value={crash.crashedParts} />
          </div>

          {/* Ubicación */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Ubicación GPS
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <InfoRow label="Latitud" value={crash.latitude} />
              <InfoRow label="Longitud" value={crash.longitude} />
            </div>
            <Map longitude={crash.longitude} latitude={crash.latitude} />
          </div>

          {/* Imágenes */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Fotos del Accidente
            </h3>
            {loading && <BeatLoader size={12} />}
            {!loading && data && data.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {data.map((photo) => (
                  <img
                    key={photo.name}
                    src={photo.filePath}
                    alt={photo.name}
                    className="w-full rounded-xl border"
                  />
                ))}
              </div>
            ) : (
              !loading && (
                <p className="text-sm text-gray-500 italic">
                  No hay imágenes disponibles.
                </p>
              )
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col text-sm">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-800">{value || "—"}</span>
  </div>
);

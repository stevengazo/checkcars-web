import { IoIosCloseCircle } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import { BeatLoader } from "react-spinners";
import { useContext } from "react";
import useFetch from "../Hook/useFetch";
import Map from "../Components/MapLocation";
import SettingsContext from "../Context/SettingsContext.jsx";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SideBarIssue({ issue, onClose }) {
  const { API_URL, generatePDF } = useContext(SettingsContext);

  const { data, loading } = useFetch(
    `${API_URL}/api/Photos/report/${issue.reportId}`,
    { autoFetch: true }
  );

  const HandleGenerate = () => {
    generatePDF((doc) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Reporte Problema Vehículo", 10, 10);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      let yOffset = 25;

      Object.entries(issue).forEach(([key, value]) => {
        const formattedKey = `${key.charAt(0).toUpperCase() + key.slice(1)}:`;
        if (typeof value === "string" && value.length > 50) {
          const lines = doc.splitTextToSize(value, 180);
          doc.text(formattedKey, 10, yOffset);
          yOffset += 8;
          lines.forEach((line) => {
            doc.text(line, 10, yOffset);
            yOffset += 8;
          });
        } else {
          doc.text(`${formattedKey} ${value}`, 10, yOffset);
          yOffset += 10;
        }

        if (yOffset > 260) {
          doc.addPage();
          yOffset = 10;
        }
      });

      if (data && data.length > 0) {
        data.forEach((photo, index) => {
          const img = new Image();
          img.src = photo.filePath;
          img.onload = () => {
            const imgWidth = 50;
            const imgHeight = (img.height * imgWidth) / img.width;

            if (yOffset + imgHeight > 260) {
              doc.addPage();
              yOffset = 10;
            }

            doc.addImage(img, "JPEG", 10, yOffset, imgWidth, imgHeight);
            yOffset += imgHeight + 10;

            if (index === data.length - 1) {
              doc.save();
            }
          };
        });
      } else {
        doc.save();
      }
    }, generateName());
  };

  const generateName = () => {
    const date = new Date();
    const formattedDate = date
      .toLocaleString("en-GB", {
        year: "2-digit",
        month: "short",
        day: "2-digit",
      })
      .replace(/ /g, "-");
    return `Report-Issue-${formattedDate}.pdf`;
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
        <div className="fixed top-0 right-0 w-screen md:w-[50vw] lg:w-[40vw] h-full z-50 bg-white border-l border-gray-300 shadow-2xl rounded-l-2xl overflow-y-auto p-6 transition-transform">
          {/* Botones flotantes */}
          <div className="absolute top-4 right-4 flex gap-3 z-50">
          <Link
                to={`/car/${issue.carId}`}
                className="flex bg-white border rounded items-center w-full p-1  text-blue-300 hover:text-blue-500"
              >
                {" "}
                Ver Vehiculo
              </Link>
            <FaRegFilePdf
              size={26}
              className="text-blue-600 hover:scale-110 cursor-pointer transition"
              title="Generar PDF"
              onClick={HandleGenerate}
            />
            <IoIosCloseCircle
              size={36}
              className="text-red-500 hover:rotate-180 cursor-pointer transition"
              onClick={() => onClose(null)}
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Reporte de Avería
          </h2>

          <Link
            to={`/car/${issue.carId}`}
            className="flex items-center w-full p-3 hover:text-blue-300"
            onClick={() => toggleSidebar()}
          />

          <div className="space-y-2">
            <InfoRow label="Creación" value={issue.created} />
            <InfoRow label="Autor" value={issue.author} />
            <InfoRow label="Placa" value={issue.carPlate} />
            <InfoRow label="Tipo" value={issue.type} />
            <InfoRow label="Detalles" value={issue.details} />
            <InfoRow label="Prioridad" value={issue.priority} />
          </div>

          {/* Ubicación */}
          <div className="mt-4 border rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-2">Ubicación</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Latitud" value={issue.latitude} />
              <InfoRow label="Longitud" value={issue.longitude} />
            </div>
            <div className="mt-4">
              <Map longitude={issue.longitude} latitude={issue.latitude} />
            </div>
          </div>

          {/* Fotos */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Fotos</h3>
            {loading ? (
              <div className="flex justify-center py-6">
                <BeatLoader size={24} />
              </div>
            ) : data && data.length > 0 ? (
              <div className="grid gap-3">
                {data.map((photo) => (
                  <img
                    key={photo.name}
                    src={photo.filePath}
                    alt={photo.name}
                    className="rounded-lg border shadow-sm"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay fotos disponibles.</p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm text-gray-700">
      <span className="font-medium">{label}</span>
      <span className="text-right">{value || "—"}</span>
    </div>
  );
}

import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegFilePdf } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

import useFetch from "../Hook/useFetch.js";
import SettingsContext from "../Context/SettingsContext.jsx";
import useGeneratePDF from "../Hook/useGeneratePdf.js";
import Map from "../Components/Maps/MapLocation.jsx";


const InfoRow = ({ label, value }) => (
  <div className="flex flex-col text-sm">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-800">{value || "—"}</span>
  </div>
);


const ViewCrash = () => {
  const { id } = useParams();
  const { API_URL } = useContext(SettingsContext);

  const { data: crash, loading: crashLoading } = useFetch(
    `${API_URL}/api/CrashReports/${id}`,
    { autoFetch: true }
  );

  const { data: photos, loading: photosLoading } = useFetch(
    `${API_URL}/api/Photos/report/${id}`,
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

      if (!crash) return;

      addSection("Información general");
      addField("Fecha", formatDate(crash.created));
      addField("Autor", crash.author);
      addField("Placa", crash.carPlate);
      addField("Daños", crash.crashedParts);
      addField("Detalles", crash.crashDetails);
      addField("Ubicación", crash.location);

      addSection("Ubicación GPS");
      addField("Latitud", crash.latitude);
      addField("Longitud", crash.longitude);
      addField(
        "Google Maps",
        `https://maps.google.com/?q=${crash.latitude},${crash.longitude}`
      );

      if (photos && photos.length > 0) {
        addSection("Imágenes");
        const imgWidth = 60;
        const spacing = 10;

        let loaded = 0;

        photos.forEach((photo) => {
          const img = new Image();
          img.crossOrigin = "Anonymous"; // Importante si las imágenes están en otro dominio
          img.src = photo.filePath;
          img.onload = () => {
            const imgHeight = (img.height * imgWidth) / img.width;
            if (y + imgHeight > 260) {
              doc.addPage();
              y = 20;
            }
            doc.addImage(img, "JPEG", marginX, y, imgWidth, imgHeight);
            y += imgHeight + spacing;

            loaded++;
            if (loaded === photos.length) doc.save(generateName());
          };
          img.onerror = () => {
            loaded++;
            if (loaded === photos.length) doc.save(generateName());
          };
        });
      } else {
        doc.save(generateName());
      }
    });
  };

  if (crashLoading || !crash) {
    return (
      <div className="p-8 text-center text-gray-600">
        <BeatLoader />
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
        className="max-w-6xl mx-auto px-6 py-10 space-y-10"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Registro de Accidente
          </h2>
          <div className="flex items-center gap-3">
            <Link
              to={`/car/${crash.carId}`}
              className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 transition"
            >
              Ver Vehículo
            </Link>
            <button
              onClick={HandleGenerate}
              className="p-2 text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 transition"
              title="Generar PDF"
            >
              <FaRegFilePdf size={20} />
            </button>
          </div>
        </div>

        {/* Información */}
        <div className="mt-6 border-gray-400 rounded shadow-sm p-4">
          <InfoRow label="Creación" value={formatDate(crash.created)} />
          <InfoRow label="Autor" value={crash.author} />
          <InfoRow label="Placa" value={crash.carPlate} />
          <InfoRow label="Localización" value={crash.location} />
          <InfoRow label="Detalles" value={crash.crashDetails} />
          <InfoRow label="Daños" value={crash.crashedParts} />
        </div>

        {/* Ubicación */}
        <div className="mt-6 border-gray-400 rounded shadow-sm p-4">
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
        <div className="mt-6 border-gray-400 rounded shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Fotos del Accidente
          </h3>
          {photosLoading && <BeatLoader size={12} />}
          {!photosLoading && photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {photos.map((photo) => (
                <img
                  key={photo.name}
                  src={photo.filePath}
                  alt={photo.name}
                  className="w-full rounded-xl border"
                />
              ))}
            </div>
          ) : (
            !photosLoading && (
              <p className="text-sm text-gray-500 italic">
                No hay imágenes disponibles.
              </p>
            )
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewCrash;

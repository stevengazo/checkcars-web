import { IoIosCloseCircle } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import useFetch from "../Hook/useFetch";
import MapLocation from "./MapLocation";
import { BeatLoader } from "react-spinners";
import useGeneratePDF from "../Hook/useGeneratePdf";
import SettingsContext from "../Context/SettingsContext.jsx";
import { useContext } from "react";

export default function SideBarEntry({ entry, onClose }) {
  const { API_URL } = useContext(SettingsContext);
  const { data, loading } = useFetch(
    `${API_URL}/api/Photos/report/${entry.reportId}`,
    { autoFetch: true }
  );
  const { generatePDF } = useGeneratePDF();

  const generateName = () => {
    const date = new Date();
    return `CheckCars-Resumen-Salida-${date.toISOString().split("T")[0]}.pdf`;
  };

  const HandleGenerate = () => {
    generatePDF((doc) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Portada
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("CheckCars", pageWidth / 2, y, { align: "center" });
      y += 10;
      doc.setFontSize(16);
      doc.text("Resumen de Salida de Vehículo", pageWidth / 2, y, {
        align: "center",
      });
      y += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, pageWidth / 2, y, {
        align: "center",
      });

      doc.addPage();

      const drawSectionTitle = (title) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(30, 30, 30);
        doc.text(title, 10, y);
        y += 6;
        doc.setDrawColor(200);
        doc.line(10, y, pageWidth - 10, y);
        y += 10;
      };

      const drawField = (label, value) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const text = `${label}: ${value || "—"}`;
        const lines = doc.splitTextToSize(text, pageWidth - 20);
        lines.forEach((line) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 12, y);
          y += 6;
        });
      };

      // Sección: Información general
      drawSectionTitle("1. Información del Vehículo");
      drawField("Autor", entry.author);
      drawField("Fecha de creación", new Date(entry.created).toLocaleString("es-ES"));
      drawField("Placa", entry.carPlate);
      drawField("Kilometraje", entry.mileage);
      drawField("Estado de pintura", entry.paintState);
      drawField("Estado mecánico", entry.mecanicState);
      drawField("Nivel de aceite", entry.oilLevel);
      drawField("Estado interiores", entry.interiorsState);
      drawField("Motivo / Observaciones", entry.notes);

      // Sección: Condiciones
      drawSectionTitle("2. Condiciones y Accesorios");
      drawField("Estado neumáticos", entry.tiresState);
      drawField("Nivel de combustible", `${entry.fuelLevel}%`);
      drawField("Llanta de repuesto", entry.hasSpareTire ? "Sí" : "No");
      drawField("Cargador USB", entry.hasChargerUSB ? "Sí" : "No");
      drawField("Quick Pass", entry.hasQuickPass ? "Sí" : "No");
      drawField("Soporte telefónico", entry.hasPhoneSupport ? "Sí" : "No");
      drawField("Kit de emergencia", entry.hasEmergencyKit ? "Sí" : "No");

      // Sección: Ubicación GPS
      drawSectionTitle("3. Ubicación GPS");
      drawField("Latitud", entry.latitude);
      drawField("Longitud", entry.longitude);

      // Sección: Imágenes
      if (data && data.length > 0) {
        drawSectionTitle("4. Galería de Fotos");

        const imagePromises = data.map((photo) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = photo.filePath;

            img.onload = () => {
              const imgW = 80;
              const imgH = (img.height * imgW) / img.width;

              if (y + imgH > 270) {
                doc.addPage();
                y = 20;
              }

              doc.addImage(img, "JPEG", 10, y, imgW, imgH);
              y += imgH + 10;
              resolve();
            };

            img.onerror = () => {
              console.warn(`No se pudo cargar la imagen: ${photo.filePath}`);
              resolve();
            };
          });
        });

        Promise.all(imagePromises).then(() => {
          doc.save();
        });
      } else {
        doc.save();
      }
    }, generateName());
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
    <div className="fixed top-0 right-0 z-50 w-full md:w-[50vw] lg:w-[40vw] h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto transition-all duration-300 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Resumen de Salida</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={HandleGenerate}
            title="Generar PDF"
            className="text-blue-600 hover:text-blue-800 transition"
          >
            <FaRegFilePdf size={24} />
          </button>
          <button
            onClick={() => onClose(null)}
            title="Cerrar"
            className="text-red-600 hover:rotate-45 hover:text-red-800 transition"
          >
            <IoIosCloseCircle size={32} />
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
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Ubicación GPS</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <InfoItem label="Latitud" value={entry.latitude} />
          <InfoItem label="Longitud" value={entry.longitude} />
        </div>
        <MapLocation longitude={entry.longitude} latitude={entry.latitude} />
      </div>

      {/* Condiciones y accesorios */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Condiciones y Accesorios</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem
            label="Combustible"
            value={<progress value={entry.fuelLevel} max={100} className="w-full h-2" />}
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
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Fotos del Reporte</h3>
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
          <p className="text-sm text-gray-500 italic">No hay imágenes disponibles.</p>
        )}
      </div>
    </div>
  );
}

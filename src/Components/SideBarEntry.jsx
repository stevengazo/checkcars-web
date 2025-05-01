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

  console.log("Datos cargados:", data); // Imprimir datos recibidos

  const generateName = () => {
    const date = new Date();
    return `Reporte-Salida-${date.toISOString().split("T")[0]}.pdf`;
  };

  const HandleGenerate = () => {
    console.log("Generando PDF...");

    generatePDF((doc) => {
      console.log("Inicio de generación de PDF");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Reporte de Salida", 10, 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      let yOffset = 25;

      Object.entries(entry).forEach(([key, value]) => {
        const formattedKey = `${key.charAt(0).toUpperCase() + key.slice(1)}:`;
        const text =
          typeof value === "string" && value.length > 50
            ? doc.splitTextToSize(value, 180)
            : [`${formattedKey} ${value}`];

        text.forEach((line) => {
          doc.text(line, 10, yOffset);
          yOffset += 10;
          if (yOffset > 260) {
            doc.addPage();
            yOffset = 10;
          }
        });
      });

      if (data && data.length > 0) {
        // Hacer la carga de imágenes asíncrona y esperar antes de guardar el PDF
        const imagePromises = data.map((photo) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = photo.filePath;

            img.onload = () => {
              console.log(`Imagen cargada: ${photo.filePath}`); // Imprimir cuando una imagen se haya cargado
              const imgWidth = 50;
              const imgHeight = (img.height * imgWidth) / img.width;
              if (yOffset + imgHeight > 260) {
                doc.addPage();
                yOffset = 10;
              }
              doc.addImage(img, "JPEG", 10, yOffset, imgWidth, imgHeight);
              yOffset += imgHeight + 10;
              resolve();
            };

            img.onerror = () => {
              console.error(`Error al cargar la imagen: ${photo.filePath}`); // Imprimir error si la imagen no carga
              reject(new Error(`Error al cargar la imagen: ${photo.filePath}`));
            };
          });
        });

        // Esperamos que todas las imágenes se hayan cargado antes de guardar el PDF
        Promise.all(imagePromises)
          .then(() => {
            console.log("Todas las imágenes cargadas. Guardando PDF.");
            doc.save();
          })
          .catch((err) => {
            console.error("Error generando el PDF:", err);
            alert("Hubo un error al generar el PDF.");
          });
      } else {
        console.log("No se encontraron imágenes. Guardando PDF.");
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
      {/* Header */}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Salida</h2>
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

      {/* Info General */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoItem label="Creación" value={formatDate(entry.created)} />
        <InfoItem label="Autor" value={entry.author} />
        <InfoItem label="Placa" value={entry.carPlate} />
        <InfoItem label="Kilometraje" value={entry.mileage} />
        <InfoItem label="Estado de pintura" value={entry.paintState} />
        <InfoItem label="Estado mecánico" value={entry.mecanicState} />
        <InfoItem label="Nivel de aceite" value={entry.oilLevel} />
        <InfoItem label="Estado de interiores" value={entry.interiorsState} />
        <InfoItem label="Motivo" value={entry.notes} />
      </div>

      {/* Ubicación */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Ubicación GPS</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <InfoItem label="Latitud" value={entry.latitude} />
          <InfoItem label="Longitud" value={entry.longitude} />
        </div>
        <MapLocation longitude={entry.longitude} latitude={entry.latitude} />
      </div>

      {/* Estado del vehículo */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Condiciones y Accesorios</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem
            label="Nivel de combustible"
            value={<progress value={entry.fuelLevel} max={100} className="w-full h-2" />}
          />
          <InfoItem label="Estado neumáticos" value={entry.tiresState} />
          <YesNo label="Llanta de repuesto" value={entry.hasSpareTire} />
          <YesNo label="Cargador USB" value={entry.hasChargerUSB} />
          <YesNo label="Quick Pass" value={entry.hasQuickPass} />
          <YesNo label="Soporte telefónico" value={entry.hasPhoneSupport} />
          <YesNo label="Kit de emergencia" value={entry.hasEmergencyKit} />
        </div>
      </div>

      {/* Imágenes */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Fotos del Reporte</h3>
        {loading && (
          <div className="flex justify-center py-4">
            <BeatLoader size={14} />
          </div>
        )}
        {!loading && data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {data.map((photo, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                
                  src={photo.filePath}
                  alt={photo.name || "Imagen"}
                  className="w-full rounded-xl border"
                />
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-sm text-gray-500 italic">No hay imágenes disponibles.</p>
          )
        )}
      </div>
    </div>
  );
}

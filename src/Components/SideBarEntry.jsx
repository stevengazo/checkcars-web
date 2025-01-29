import { IoIosCloseCircle } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import useFetch from "../Hook/useFetch";
import MapLocation from "./MapLocation";
import { BeatLoader } from "react-spinners";
import useGeneratePDF from "../Hook/useGeneratePdf";

export default function SideBarEntry({ entry, onClose }) {
  const { data, loading, error, refetch } = useFetch(
    `https://mecsacars.stevengazo.co.cr/api/Photos/report/${entry.reportId}`,
    { autoFetch: true }
  );
  const { generatePDF } = useGeneratePDF();

  const HandleGenerate = () => {
    generatePDF((doc) => {
      // Establecer fuente para el título
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Reporte Problema Vehiculo", 10, 10);

      // Establecer fuente para el contenido
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      let yOffset = 25; // Margen inicial después del título

      // Recorrer las entradas del objeto 'issue'
      Object.entries(entry).forEach(([key, value]) => {
        const formattedKey = `${key.charAt(0).toUpperCase() + key.slice(1)}:`;

        if (typeof value === "string" && value.length > 50) {
          // Dividir texto largo en líneas que se ajusten al ancho del PDF
          const lines = doc.splitTextToSize(value, 180); // Ajusta el ancho (180 mm para márgenes)

          // Escribir solo la primera línea y el resto de las líneas debajo
          doc.text(formattedKey, 10, yOffset);
          yOffset += 8; // Espacio entre el título y el contenido

          lines.forEach((line) => {
            doc.text(line, 10, yOffset);
            yOffset += 8; // Espacio entre líneas
          });
        } else {
          // Manejar campos normales (cadenas cortas o números)
          doc.text(`${formattedKey} ${value}`, 10, yOffset);
          yOffset += 10;
        }

        // Mover a una nueva página si el contenido supera el límite
        if (yOffset > 260) {
          doc.addPage();
          yOffset = 10; // Reiniciar margen superior en la nueva página
        }
      });

      // Agregar imágenes del array 'data' (si existe)
      if (data && data.length > 0) {
        console.log(data);
        data.forEach((photo, index) => {
          const img = new Image();
          img.src = photo.filePath; // Asume que `filePath` contiene la URL de la imagen

          img.onload = () => {
            const imgWidth = 50; // Ancho de la imagen
            const imgHeight = (img.height * imgWidth) / img.width; // Mantener proporción

            // Si el espacio restante no es suficiente, agregar una nueva página
            if (yOffset + imgHeight > 260) {
              doc.addPage();
              yOffset = 10;
            }

            // Agregar imagen al PDF
            doc.addImage(img, "JPEG", 10, yOffset, imgWidth, imgHeight);
            yOffset += imgHeight + 10; // Ajustar posición para la siguiente imagen
            // Descargar el PDF cuando sea la última imagen
            if (index === data.length - 1) {
              doc.save();
            }
          };
        });
      } else {
        // Si no hay imágenes, descargar el PDF de inmediato
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
    return `Reporte Salida-${formattedDate}.pdf`;
  };

  const handleOnClose = () => {
    onClose(null);
  };
  return (
    <>
      <div
        className="
        bg-slate-200 
        shadow-xl hover:shadow-2xl 
        border border-gray-100 hover:border-gray-400  
        duration-1000 
        p-3
        absolute md:top-5 md:right-5 top-0 right-0
        w-screen md:w-2/4 lg:w-2/6
        md:h-[90vh] md:rounded-2xl overflow-auto 
        transition-all ease-in-out translate-y-0 
      "
      >
        <div className=" absolute top-2 right-2  flex flex-row justify-end items-center ">
          <FaRegFilePdf
            size={28}
            className="hover:scale-110 hover:bg-gray-200 hover:border-white duration-100 transition border p-1 rounded mx-3"
            onClick={HandleGenerate}
          />

          <IoIosCloseCircle
            size={40}
            color="red"
            className="hover:rotate-180 transition duration-700"
            onClick={() => handleOnClose()}
          />
        </div>

        <h2 className="text-2xl">Registro de Salida</h2>
        <div className="border p-2 my-1 border-slate-200 rounded-e-2xl ">
          {/* Created */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Creación</label>
            <label className="font-light">{entry.created}</label>
          </div>

          {/* Author */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Autor</label>
            <label>{entry.author}</label>
          </div>

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Placa</label>
            <label>{entry.carPlate}</label>
          </div>

          {/* Location */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Ubicación</label>
            <div className="flex flex-col">
              <label className="font-medium">Latitud</label>
              <label>{entry.latitude}</label>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Longitud</label>
              <label>{entry.longitude}</label>
            </div>
          </div>

          <MapLocation longitude={entry.longitude} latitude={entry.latitude} />

          {/* Mileage */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Kilometraje</label>
            <label>{entry.mileage}</label>
          </div>

          {/* Fuel Level */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Nivel de combustible</label>
            <progress value={entry.fuelLevel} max={100} />
          </div>

          {/* Tires State */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Estado de los neumáticos</label>
            <label>{entry.tiresState}</label>
          </div>

          {/* Spare Tire */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Llanta de repuesto</label>
            <label
              className={entry.hasSpareTire ? "text-black" : "text-red-500"}
            >
              {entry.hasSpareTire ? "Sí" : "No"}
            </label>
          </div>

          {/* Charger USB */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Cargador USB</label>
            <label
              className={entry.hasChargerUSB ? "text-black" : "text-red-500"}
            >
              {entry.hasChargerUSB ? "Sí" : "No"}
            </label>
          </div>

          {/* Quick Pass */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Quick Pass</label>
            <label
              className={entry.hasQuickPass ? "text-black" : "text-red-500"}
            >
              {entry.hasQuickPass ? "Sí" : "No"}
            </label>
          </div>

          {/* Phone Support */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Soporte telefónico</label>
            <label
              className={entry.hasPhoneSupport ? "text-black" : "text-red-500"}
            >
              {entry.hasPhoneSupport ? "Sí" : "No"}
            </label>
          </div>

          {/* Emergency Kit */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Kit de emergencia</label>
            <label
              className={entry.hasEmergencyKit ? "text-black" : "text-red-500"}
            >
              {entry.hasEmergencyKit ? "Sí" : "No"}
            </label>
          </div>

          {/* Paint State */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Estado de la pintura</label>
            <label>{entry.paintState}</label>
          </div>

          {/* Mechanical State */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Estado mecánico</label>
            <label>{entry.mecanicState}</label>
          </div>

          {/* Oil Level */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Nivel de aceite</label>
            <label>{entry.oilLevel}</label>
          </div>

          {/* Interiors State */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Estado de los interiores</label>
            <label>{entry.interiorsState}</label>
          </div>

          {/* Notes */}
          <div className="flex flex-row justify-between my-2">
            <label className="font-medium">Motivo</label>
            <label>{entry.notes}</label>
          </div>
        </div>
        {loading && (
          <div className="flex flex-row justify-items-center">
            <BeatLoader size={20} className="mx-auto" />
          </div>
        )}
        {data !== null && (
          <>
            <h3 className="text-2xl font-light mx-auto">Fotos</h3>
            <div className="flex flex-col gap-3 justify-center align-middle my-2 border rounded-2xl p-2">
              {data !== null &&
                data.map((photo) => (
                  <img
                    src={photo.filePath}
                    alt={photo.name}
                    className=" w-full rounded-2xl"
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

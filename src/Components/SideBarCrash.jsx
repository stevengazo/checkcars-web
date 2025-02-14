import { IoIosCloseCircle } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import useFetch from "../Hook/useFetch";
import { BeatLoader } from "react-spinners";
import Map from "../Components/MapLocation";
import useGeneratePDF from "../Hook/useGeneratePdf";
import SettingsContext from '../Context/SettingsContext.jsx'
import { useContext } from "react";


export default function SideBarCrash({ crash, onClose }) {
  const { API_URL } = useContext(SettingsContext);
  const { data, loading, error, refetch } = useFetch(
    `${API_URL}/api/Photos/report/${crash.reportId}`,
    { autoFetch: true }
  );
  const { generatePDF } = useGeneratePDF();
  
  const HandleGenerate = () => {
    generatePDF((doc) => {
      // Establecer fuente para el título
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Reporte Accidente Vehiculo", 10, 10);

      // Establecer fuente para el contenido
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      let yOffset = 25; // Margen inicial después del título

      // Recorrer las entradas del objeto 'issue'
      Object.entries(crash).forEach(([key, value]) => {
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
    return `Reporte Accidente-${formattedDate}.pdf`;
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
                w-screen md:w-2/4 lg:w-3/6
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

        <h2 className="text-3xl">Registro de Accidente</h2>
        <div className="border p-2 my-1 border-slate-200 rounded-e-2xl ">
          {/* Created */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Creación</label>
            <label className=" font-light">{crash.created}</label>
          </div>

          {/* Author */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Autor</label>
            <label>{crash.author}</label>
          </div>

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Placa</label>
            <label>{crash.carPlate}</label>
          </div>

          {/* Location */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Ubicación</label>
            <div className="flex flex-col">
              <label className=" font-medium">Latitud</label>
              <label>{crash.latitude}</label>
            </div>
            <div className="flex flex-col">
              <label className=" font-medium">Longitud</label>
              <label>{crash.longitude}</label>
            </div>
          </div>
          <Map longitude={crash.longitude} latitude={crash.latitude} />

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Daños</label>
            <label>{crash.crashedParts}</label>
          </div>
          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Detalles</label>
            <label>{crash.crashDetails}</label>
          </div>
          {/*  location */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Localización</label>
            <label>{crash.location}</label>
          </div>

          {/*Images */}
          <h3 className="text-3xl ">Fotos</h3>
        </div>
        {data != null && (
          <div className="flex flex-col gap-3 justify-center align-middle my-2 border rounded-2xl p-2">
            {loading && <BeatLoader size={24} />}
            {data !== null &&
              data.map((photo) => (
                <img
                  src={photo.filePath}
                  alt={photo.name}
                  className=" w-full rounded-2xl"
                />
              ))}
          </div>
        )}
      </div>
    </>
  );
}

import { IoIosCloseCircle } from "react-icons/io";
import useFetch from "../Hook/useFetch";
import { BeatLoader } from "react-spinners";
import Map from "../Components/MapLocation";
import useGeneratePDF from "../Hook/useGeneratePdf";

export default function SideBarIssue({ issue, onClose }) {
  const { generatePDF } = useGeneratePDF();

  const { data, loading, error, refetch } = useFetch(
    `https://mecsacars.stevengazo.co.cr/api/Photos/report/${issue.reportId}`,
    { autoFetch: true }
  );

  const HandleGenerate = () => {
    generatePDF((doc) => {
      // Agregar título
      doc.setFontSize(18);
      doc.text("Mi Reporte PDF Genérico", 10, 10);
  
      // Agregar contenido dinámico del objeto issue
      doc.setFontSize(12);
      let yOffset = 20; // Margen inicial
  
      Object.entries(issue).forEach(([key, value]) => {
        if (typeof value === "string" && value.length > 50) {
          // Dividir texto largo en líneas que se ajusten al ancho del PDF
          const lines = doc.splitTextToSize(value, 180); // Ajusta el ancho (180 mm para márgenes)
          lines.forEach((line) => {
            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${line}`, 10, yOffset);
            yOffset += 10; // Espacio entre líneas
          });
        } else {
          // Manejar campos normales (cadenas cortas o números)
          doc.text(
            `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
            10,
            yOffset
          );
          yOffset += 10;
        }
  
        // Mover a una nueva página si el contenido supera el límite
        if (yOffset > 280) {
          doc.addPage();
          yOffset = 10; // Reiniciar margen superior en la nueva página
        }
      });
  
      // Agregar imágenes del array data
      if (data && data.length > 0) {
        console.log(data)
        data.forEach((photo, index) => {
          const img = new Image();
          img.src = photo.filePath; // Asume que `filePath` contiene la URL de la imagen
  
          img.onload = () => {
            const imgWidth = 50; // Ancho de la imagen
            const imgHeight = (img.height * imgWidth) / img.width; // Mantener proporción
  
            // Si el espacio restante no es suficiente, agregar una nueva página
            if (yOffset + imgHeight > 280) {
              doc.addPage();
              yOffset = 10;
            }
  
            // Agregar imagen al PDF
            doc.addImage(img, "JPEG", 10, yOffset, imgWidth, imgHeight);
            yOffset += imgHeight + 10; // Ajustar posición para la siguiente imagen
  
            // Descargar el PDF cuando sea la última imagen
            if (index === data.length - 1) {
              doc.save("reporte-issue.pdf");
            }
          };
        });
      } else {
        // Si no hay imágenes, descargar el PDF de inmediato
        doc.save("reporte-issue.pdf");
      }
    });
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
                w-screen md:w-2/4 lg:w-1/4
                md:h-[90vh] md:rounded-2xl overflow-auto 
                transition-all ease-in-out translate-y-0 
              "
      >

        <IoIosCloseCircle
          size={40}
          color="red"
          className=" absolute top-2 right-2  hover:rotate-180 transition duration-700"
          onClick={() => handleOnClose()}
        />

        <h2 className="text-3xl font-semibold">Registro de Avería</h2>
        <div className="border p-2 my-1 border-slate-200 rounded-e-2xl ">
          {/* Created */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium mr-3">Creación</label>
            <label className=" font-light">{issue.created}</label>
          </div>

          {/* Author */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium mr-3">Autor</label>
            <label>{issue.author}</label>
          </div>

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium mr-3">Placa</label>
            <label>{issue.carPlate}</label>
          </div>

          {/* Location */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium mr-3">Ubicación</label>
            <div className="flex flex-col">
              <label className=" font-medium mr-3">Latitud</label>
              <label>{issue.latitude}</label>
            </div>
            <div className="flex flex-col">
              <label className=" font-medium mr-3">Longitud</label>
              <label>{issue.longitude}</label>
            </div>
          </div>
          <Map longitude={issue.longitude} latitude={issue.latitude} />
          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium mr-3">Tipo</label>
            <label>{issue.type}</label>
          </div>

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium mr-3">Detalles</label>
            <label>{issue.details}</label>
          </div>

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium mr-3">Prioridad</label>
            <label>{issue.priority}</label>
          </div>

          {/*Images */}
          <h3 className="text-3xl">Fotos</h3>
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

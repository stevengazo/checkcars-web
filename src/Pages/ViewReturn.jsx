import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import useFetch from "../Hook/useFetch.js";
import MapLocation from "../Components/Maps/MapLocation.jsx";
import { BeatLoader } from "react-spinners";
import SettingsContext from "../Context/SettingsContext.jsx";
import generatePDFReport from "../utils/generatePDFReport.js";
import { motion, AnimatePresence } from "framer-motion";
import CommentaryAdd from "../Components/Commentary/CommentaryAdd.jsx";
import CommentaryList from "../Components/Commentary/CommentaryList.jsx";

const ViewReturn = () => {
  const { id } = useParams();
  const { API_URL } = useContext(SettingsContext);
  const [changeCommentary, setChangeCommentary] = useState(false);

  const { data: returnObj, loading: loadingEntry } = useFetch(
    `${API_URL}/api/VehicleReturns/${id}`,
    { autoFetch: true }
  );

  const [photosUrl, setPhotosUrl] = useState(null);
  const { data: photos, loading: loadingPhotos } = useFetch(photosUrl, {
    autoFetch: !!photosUrl,
  });

  // Set correct photo URL once returnObj is available
  useEffect(() => {
    if (returnObj?.reportId) {
      setPhotosUrl(`${API_URL}/api/Photos/report/${returnObj.reportId}`);
    }
  }, [returnObj, API_URL]);

  console.log("Entry Data:", returnObj);
  console.log("Photos Data:", photos);

  const HandlePDF = () => {
    const pdfData = {
      returnObj: {
        ...returnObj,
        created: new Date(returnObj.created).toLocaleString("es-ES"),
      },
      photos,
    };
    generatePDFReport(pdfData, photos);
  };

  const InfoItem = ({ label, value, important = false }) => (
    <div className="flex flex-col text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className={`text-gray-800 ${important ? "font-semibold" : ""}`}>
        {value || "—"}
      </span>
    </div>
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

  if (loadingEntry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BeatLoader size={14} />
      </div>
    );
  }

  if (!returnObj) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">
          No se encontró la información del retorno.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Resumen de Retorno
          </h2>
          <div className="flex items-center gap-3">
            <Link
              to={`/car/${returnObj.carId}`}
              className="px-4 py-2 text-blue-600 bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-700 transition duration-200"
            >
              Vehículo
            </Link>
            <button
              onClick={HandlePDF}
              title="Generar PDF"
              className="p-2 text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-800 transition duration-200"
            >
              <FaRegFilePdf size={20} />
            </button>
            <Link
              to="/returns"
              title="Cerrar"
              className="p-2 text-red-600 border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-800 hover:rotate-180 transition duration-200"
            >
              <IoIosCloseCircle size={24} />
            </Link>
          </div>
        </div>

        <div className=" border rounded-2xl p-4  border-gray-300 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Fecha" value={formatDate(returnObj.created)} />
          <InfoItem label="Autor" value={returnObj.author} />
          <InfoItem label="Placa" value={returnObj.carPlate} />
          <InfoItem label="Kilometraje" value={returnObj.mileage} />
        </div>

        <div className="border rounded-2xl p-4  border-gray-300 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Ubicación GPS
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <InfoItem label="Latitud" value={returnObj.latitude} />
            <InfoItem label="Longitud" value={returnObj.longitude} />
          </div>
          <MapLocation
            latitude={returnObj.latitude}
            longitude={returnObj.longitude}
          />
        </div>

        {/* Photos List */}
        <div className="border rounded-2xl p-4  border-gray-300 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Fotos del Retorno
          </h3>
          {loadingPhotos ? (
            <div className="flex justify-center py-4">
              <BeatLoader size={14} />
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {photos.map((photo, index) => (
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

        {/* Commentary List */}
        <div className="border rounded-2xl p-4  border-gray-300 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Comentarios
          </h3>
          <CommentaryAdd ReportId={returnObj.reportId} onCommentAdded={()=> setChangeCommentary(!changeCommentary)} />
          <CommentaryList ReportId={returnObj.reportId} refresh={changeCommentary} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewReturn;

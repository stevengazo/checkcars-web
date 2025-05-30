import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { FaRegFilePdf } from "react-icons/fa6";
import { BeatLoader } from "react-spinners";
import useFetch from "../Hook/useFetch.js";
import SettingsContext from "../Context/SettingsContext.jsx";
import Map from "../Components/Maps/MapLocation.jsx";
import CommentaryAdd from "../Components/Commentary/CommentaryAdd.jsx";
import CommentaryList from "../Components/Commentary/CommentaryList.jsx";
import ScoreStatus from "../Components/Score/ScoreStatus.jsx";

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-base text-gray-700">{value || "—"}</span>
  </div>
);

export default function ViewIssue() {
  const [refreshCommentary, setRefreshCommentary] = React.useState(false);
  const { id } = useParams();
  const { API_URL, generatePDF } = useContext(SettingsContext);

  const { data: issue, loading: issueLoading } = useFetch(
    `${API_URL}/api/IssueReports/${id}`,
    { autoFetch: true }
  );
  const { data: photos, loading: photosLoading } = useFetch(
    issue ? `${API_URL}/api/Photos/report/${issue.reportId}` : null,
    { autoFetch: !!issue }
  );

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

  const handleGenerate = () => {
    if (!issue) return;
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

      if (photos && photos.length > 0) {
        photos.forEach((photo, index) => {
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

            if (index === photos.length - 1) {
              doc.save(generateName());
            }
          };
        });
      } else {
        doc.save(generateName());
      }
    }, generateName());
  };

  if (issueLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BeatLoader size={24} />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center mt-10">
        <p>No se encontró información para este reporte.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Reporte de Avería</h1>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <FaRegFilePdf size={20} />
          <span className="text-sm font-medium">Descargar PDF</span>
        </button>
      </div>

      {/* Información general */}
      <section className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <InfoItem
          label="Creación"
          value={new Date(issue.created).toLocaleString("es-ES")}
        />
        <InfoItem label="Autor" value={issue.author} />
        <InfoItem label="Placa" value={issue.carPlate} />
        <InfoItem label="Tipo" value={issue.type} />
        <InfoItem label="Prioridad" value={issue.priority} />
        <InfoItem label="Detalles" value={issue.details} />
      </section>

      {/* Ubicación */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Ubicación</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoItem label="Latitud" value={issue.latitude} />
          <InfoItem label="Longitud" value={issue.longitude} />
        </div>
        <div className="overflow-hidden rounded-xl border">
          <Map latitude={issue.latitude} longitude={issue.longitude} />
        </div>
      </section>

      {/* Galería de Fotos */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Fotos del Reporte
        </h2>
        {photosLoading ? (
          <div className="flex justify-center py-6">
            <BeatLoader size={24} />
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <img
                key={photo.name}
                src={photo.filePath}
                alt={photo.name}
                className="w-full h-52 object-cover rounded-xl border cursor-pointer hover:scale-105 transition-transform"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No hay imágenes disponibles.
          </p>
        )}
      </section>

      {/* Calificación */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Calificación</h2>
        <ScoreStatus Report={issue} type={"IssueReports"} />
      </section>
      {/* Galería de Fotos */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Comentarios</h2>
        <CommentaryAdd
          ReportId={issue.reportId}
          onCommentAdded={() => setRefreshCommentary(!refreshCommentary)}
        />
        <CommentaryList ReportId={issue.reportId} refresh={refreshCommentary} />
      </section>
    </div>
  );
}

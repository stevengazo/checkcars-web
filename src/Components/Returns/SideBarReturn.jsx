import { useContext } from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import useFetch from "../../Hook/useFetch.js";
import MapLocation from "../Maps/MapLocation.jsx";
import SettingsContext from "../../Context/SettingsContext.jsx";
import generatePDFReport from "../../utils/generatePDFReport.js";
import OffCanvas from "../molecules/OffCanvas.jsx";
import Button from "../atoms/Button.jsx";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }) : "—";

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-gray-100 py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium text-gray-800">{value ?? "—"}</span>
  </div>
);

export default function SideBarReturn({ entry, onClose }) {
  const { API_URL } = useContext(SettingsContext);
  const { data, loading } = useFetch(`${API_URL}/api/Photos/report/${entry.reportId}`, { autoFetch: true });

  const handlePDF = () => {
    generatePDFReport({ entry: { ...entry, created: fmtDate(entry.created) }, photos: data }, data);
  };

  return (
    <OffCanvas
      open={Boolean(entry)}
      onClose={onClose}
      title="Resumen de Entrega"
      subtitle={entry.carPlate}
      width="max-w-xl"
      footer={
        <div className="flex flex-wrap gap-2">
          <Link to={`/viewreturn/${entry.reportId}`} className="flex-1 rounded-md border border-blue-200 bg-white px-3 py-2 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
            Ver reporte
          </Link>
          <Link to={`/car/${entry.carId}`} className="flex-1 rounded-md border border-blue-200 bg-white px-3 py-2 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
            Vehículo
          </Link>
          <Button variant="primary" onClick={handlePDF}>
            <FaRegFilePdf size={16} /> PDF
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">Detalle</h3>
          <Row label="Fecha" value={fmtDate(entry.created)} />
          <Row label="Autor" value={entry.author} />
          <Row label="Placa" value={entry.carPlate} />
          <Row label="Kilometraje" value={entry.mileage?.toLocaleString?.("es-ES")} />
          {entry.notes && <Row label="Notas" value={entry.notes} />}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">Ubicación GPS</h3>
          <div className="mb-3 grid grid-cols-2 gap-4 text-sm">
            <Row label="Latitud" value={entry.latitude} />
            <Row label="Longitud" value={entry.longitude} />
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <MapLocation longitude={entry.longitude} latitude={entry.latitude} />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">Fotos</h3>
          {loading ? (
            <div className="flex justify-center py-4"><BeatLoader size={12} color="#2563EB" /></div>
          ) : data && data.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {data.map((photo, i) => (
                <img key={i} src={photo.filePath} alt={photo.name || "Imagen"} className="w-full rounded-lg border border-gray-200 object-cover" />
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-gray-400">No hay imágenes disponibles.</p>
          )}
        </div>
      </div>
    </OffCanvas>
  );
}

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { carImageUrl } from "../../services/carsService";
import OffCanvas from "../molecules/OffCanvas";

const fmt = (d) => (d ? new Date(d).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }) : "—");

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-gray-100 py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium text-gray-800">{String(value ?? "—")}</span>
  </div>
);

const pretty = (v) => (typeof v === "boolean" ? (v ? "Sí" : "No") : v);

/** Detalle de un reporte dinámico: campos del JSON + fotos agrupadas por slot. */
const DynamicReportSidebar = ({ report, onClose }) => {
  const data = useMemo(() => {
    try { return JSON.parse(report?.dataJson || "{}"); } catch { return {}; }
  }, [report]);

  const photosBySlot = useMemo(() => {
    const groups = {};
    (report?.photos || []).forEach((p) => {
      const k = p.slotKey || "otras";
      (groups[k] ??= []).push(p);
    });
    return groups;
  }, [report]);

  if (!report) return null;

  return (
    <OffCanvas open={Boolean(report)} onClose={onClose} title="Detalle del reporte" subtitle={report.carPlate} width="max-w-xl">
      <div className="space-y-6">
        <div>
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">General</h3>
          <Row label="Fecha" value={fmt(report.created)} />
          <Row label="Autor" value={report.author} />
          <Row label="Placa" value={report.carPlate} />
          {report.carId && (
            <div className="pt-2">
              <Link to={`/car/${report.carId}`} className="text-sm font-semibold text-blue-600 hover:underline">Ver vehículo →</Link>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">Campos</h3>
          {Object.keys(data).length ? (
            Object.entries(data).map(([k, v]) => <Row key={k} label={k} value={pretty(v)} />)
          ) : (
            <p className="text-sm text-gray-400">Sin datos.</p>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">Fotos</h3>
          {Object.keys(photosBySlot).length ? (
            <div className="space-y-3">
              {Object.entries(photosBySlot).map(([slot, photos]) => (
                <div key={slot}>
                  <p className="mb-1 text-xs font-medium capitalize text-gray-500">{slot}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((p, i) => (
                      <img key={i} src={carImageUrl(p.filePath)} alt={slot} className="h-20 w-full rounded-lg border border-gray-200 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Sin fotos.</p>
          )}
        </div>
      </div>
    </OffCanvas>
  );
};

export default DynamicReportSidebar;

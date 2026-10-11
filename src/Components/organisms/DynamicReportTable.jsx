import { FaCamera } from "react-icons/fa6";

const fmt = (d) => (d ? new Date(d).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : "—");

/** Tabla de reportes dinámicos: columnas núcleo (fecha, autor, placa, fotos). */
const DynamicReportTable = ({ reports, onSelected }) => (
  <div className="overflow-x-auto">
    <table className="w-full table-auto border-collapse text-left text-sm">
      <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500">
        <tr>
          <th className="px-4 py-2 font-semibold">Fecha</th>
          <th className="px-4 py-2 font-semibold">Autor</th>
          <th className="px-4 py-2 font-semibold">Placa</th>
          <th className="px-4 py-2 font-semibold">Fotos</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((r) => (
          <tr key={r.reportId} onClick={() => onSelected(r)} className="cursor-pointer border-t border-gray-100 transition hover:bg-blue-50">
            <td className="px-4 py-2">{fmt(r.created)}</td>
            <td className="px-4 py-2">{r.author || "—"}</td>
            <td className="px-4 py-2">{r.carPlate || "—"}</td>
            <td className="px-4 py-2">
              <span className="inline-flex items-center gap-1 text-gray-500">
                <FaCamera size={13} /> {r.photos?.length || 0}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DynamicReportTable;

import { useMemo, useState, useImperativeHandle, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaTableList, FaTableCells, FaCar } from "react-icons/fa6";
import carsService, { carImageUrl } from "../../services/carsService";
import useApi from "../../Hook/useApi";
import Card from "../atoms/Card";
import Badge from "../atoms/Badge";
import Spinner from "../atoms/Spinner";
import Alert from "../atoms/Alert";
import SearchInput from "../molecules/SearchInput";
import SortableTh from "../molecules/SortableTh";
import EmptyState from "../molecules/EmptyState";
import CarCard from "./CarCard";

/** Estado visual del vehículo como badge. */
const CarStatus = ({ car }) => {
  if (car.deleted) return <Badge tone="red">Borrado</Badge>;
  if (!car.isAvailable) return <Badge tone="purple">En mantenimiento</Badge>;
  return <Badge tone="green">Disponible</Badge>;
};

/**
 * Tabla de vehículos con búsqueda y ordenamiento.
 * Expone `refresh()` vía ref para recargar tras crear/editar.
 */
const CarTable = forwardRef((_props, ref) => {
  const nav = useNavigate();
  const { data, loading, error, refetch } = useApi(() => carsService.list());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [query, setQuery] = useState("");
  const [view, setView] = useState("table"); // "table" | "cards"
  const [statusFilter, setStatusFilter] = useState("all"); // all | available | maintenance | deleted
  const [typeFilter, setTypeFilter] = useState("all");

  useImperativeHandle(ref, () => ({ refresh: refetch }), [refetch]);

  const typeOptions = useMemo(
    () => [...new Set((data || []).map((c) => c.type).filter(Boolean))].sort(),
    [data]
  );

  const matchesStatus = (car) => {
    if (statusFilter === "available") return car.isAvailable && !car.deleted;
    if (statusFilter === "maintenance") return !car.isAvailable && !car.deleted;
    if (statusFilter === "deleted") return car.deleted;
    return true;
  };

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const rows = useMemo(() => {
    let items = [...(data || [])];
    if (sortConfig.key) {
      items.sort((a, b) => {
        const av = a[sortConfig.key] ?? "";
        const bv = b[sortConfig.key] ?? "";
        if (av < bv) return sortConfig.direction === "ascending" ? -1 : 1;
        if (av > bv) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    const q = query.toLowerCase();
    return items.filter(
      (car) =>
        [car.brand, car.model, car.plate, car.type].some((f) => f?.toLowerCase().includes(q)) &&
        matchesStatus(car) &&
        (typeFilter === "all" || car.type === typeFilter)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sortConfig, query, statusFilter, typeFilter]);

  const toggleBtn = (value, label, icon) => (
    <button
      type="button"
      onClick={() => setView(value)}
      title={label}
      aria-label={label}
      className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm transition ${
        view === value ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <Card className="bg-gray-50" padding="p-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por marca, modelo, placa o tipo..."
          className="flex-1"
        />
        <div className="flex shrink-0 items-center gap-1 self-end rounded-lg border border-gray-200 bg-white p-1 sm:self-auto">
          {toggleBtn("table", "Vista de tabla", <FaTableList size={16} />)}
          {toggleBtn("cards", "Vista de tarjetas", <FaTableCells size={16} />)}
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los estados</option>
          <option value="available">Disponible</option>
          <option value="maintenance">En mantenimiento</option>
          <option value="deleted">Borrado</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm capitalize text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los tipos</option>
          {typeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {(statusFilter !== "all" || typeFilter !== "all" || query) && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setTypeFilter("all");
              setQuery("");
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Limpiar filtros
          </button>
        )}
        <span className="ml-auto text-sm text-gray-400">{rows.length} resultado(s)</span>
      </div>

      {error && <Alert tone="error" className="mb-3">{error}</Alert>}

      {view === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="w-14 border-b border-gray-300 px-4 py-2" />
                <SortableTh label="Marca" sortKey="brand" sortConfig={sortConfig} onSort={requestSort} />
                <SortableTh label="Modelo" sortKey="model" sortConfig={sortConfig} onSort={requestSort} />
                <SortableTh label="Placa" sortKey="plate" sortConfig={sortConfig} onSort={requestSort} />
                <SortableTh label="Tipo" sortKey="type" sortConfig={sortConfig} onSort={requestSort} />
                <th className="border-b border-gray-300 px-4 py-2 font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((car) => {
                const img = carImageUrl(car.imagePath);
                return (
                  <tr
                    key={car.carId}
                    onClick={() => nav(`/car/${car.carId}`)}
                    className="cursor-pointer transition hover:bg-blue-50"
                  >
                    <td className="border-b border-gray-200 px-4 py-2">
                      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded bg-gray-100 text-gray-300">
                        {img ? (
                          <img src={img} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                        ) : (
                          <FaCar size={16} />
                        )}
                      </div>
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2">{car.brand}</td>
                    <td className="border-b border-gray-200 px-4 py-2">{car.model}</td>
                    <td className="border-b border-gray-200 px-4 py-2">{car.plate}</td>
                    <td className="border-b border-gray-200 px-4 py-2">{car.type}</td>
                    <td className="border-b border-gray-200 px-4 py-2"><CarStatus car={car} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((car, i) => (
            <CarCard key={car.carId} car={car} index={i} onClick={() => nav(`/car/${car.carId}`)} />
          ))}
        </div>
      )}

      {loading && <Spinner label="Cargando vehículos..." />}
      {!loading && !error && rows.length === 0 && (
        <EmptyState
          title="Sin vehículos"
          description={query ? "Ningún vehículo coincide con la búsqueda." : "Agrega tu primer vehículo."}
        />
      )}
    </Card>
  );
});

CarTable.displayName = "CarTable";
export default CarTable;

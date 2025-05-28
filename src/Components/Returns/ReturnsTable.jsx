import React, { useState, useMemo } from "react";

const ReturnsTable = ({ returns, onSelected }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = useMemo(() => {
    let sortable = [...(returns || [])];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [returns, sortConfig]);

  const getArrow = (key) => {
    return sortConfig.key === key ? (sortConfig.direction === "ascending" ? " ↑" : " ↓") : "";
  };

  const YesNo = ({ value }) => (
    <span className={value ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
      {value ? "Sí" : "No"}
    </span>
  );

  return (
    <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
      <table className=" table-auto border-collapse text-sm">
        <thead className="bg-gray-50 text-gray-700 font-medium">
          <tr>
            <Th label="Fecha" sortKey="created" requestSort={requestSort} getArrow={getArrow} />
            <Th label="Autor" sortKey="author" requestSort={requestSort} getArrow={getArrow} />
            <Th label="Placa" sortKey="carPlate" requestSort={requestSort} getArrow={getArrow} />
            <Th label="Odómetro" sortKey="mileage" requestSort={requestSort} getArrow={getArrow} extraClasses="hidden md:table-cell" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {sortedEntries.map((entry) => (
            <tr
              key={entry.reportId}
              className="hover:bg-blue-50 cursor-pointer transition"
              onClick={() => onSelected(entry)}
            >
              <td className="px-4 py-3">{formatDate(entry.created)}</td>
              <td className="px-4 py-3">{entry.author}</td>
              <td className="px-4 py-3">{entry.carPlate}</td>
              <td className="px-4 py-3 hidden md:table-cell">
                {Number(entry.mileage).toLocaleString("es-ES")} km
              </td>
            </tr>
          ))}
          {sortedEntries.length === 0 && (
            <tr>
              <td colSpan={14} className="text-center text-gray-400 py-6">
                No hay registros disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Encabezado reutilizable
const Th = ({ label, sortKey, requestSort, getArrow, extraClasses = "" }) => (
  <th
    className={`px-4 py-3 text-left whitespace-nowrap select-none ${sortKey ? "cursor-pointer hover:text-blue-600" : ""} ${extraClasses}`}
    onClick={sortKey ? () => requestSort(sortKey) : undefined}
  >
    {label}
    {sortKey && <span className="ml-1">{getArrow(sortKey)}</span>}
  </th>
);

const FuelBar = ({ value = 0 }) => {
  const rounded = Number(value).toFixed(2); // redondear a 2 decimales
  const color =
    value >= 75
      ? "bg-green-500"
      : value >= 40
        ? "bg-yellow-400"
        : "bg-red-500";

  return (
    <div className="w-full flex items-center">
      <div className="relative w-full bg-gray-200 rounded h-2 overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full ${color}`}
          style={{ width: `${rounded}%` }}
        ></div>
      </div>
      <span className="ml-2 text-xs text-gray-600 w-12 text-right">{rounded}%</span>
    </div>
  );
};


export default ReturnsTable;

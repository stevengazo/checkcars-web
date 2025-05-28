import React, { useState, useMemo } from "react";

const IssueTable = ({ issues, onSelected }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getArrow = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "ascending" ? " ↑" : " ↓") : "";

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

  const sortedIssues = useMemo(() => {
    let sortable = [...(issues || [])];
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
  }, [issues, sortConfig]);

  return (
    <div className="w-full max-w-none overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
      <table className="w-full table-auto border-collapse text-sm">
        <thead className="bg-gray-50 text-gray-700 font-medium">
          <tr>
            <Th label="Fecha" sortKey="created" requestSort={requestSort} getArrow={getArrow} />
            <Th label="Autor" sortKey="author" requestSort={requestSort} getArrow={getArrow} />
            <Th label="Placa" sortKey="carPlate" requestSort={requestSort} getArrow={getArrow} />
            <Th label="Tipo" sortKey="type" requestSort={requestSort} getArrow={getArrow} />
            <Th label="Prioridad" sortKey="priority" requestSort={requestSort} getArrow={getArrow} />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {sortedIssues.length > 0 ? (
            sortedIssues.map((entry) => (
              <tr
                key={entry.reportId}
                className="hover:bg-blue-50 cursor-pointer transition"
                onClick={() => onSelected(entry)}
              >
                <td className="px-4 py-3">{formatDate(entry.created)}</td>
                <td className="px-4 py-3">{entry.author}</td>
                <td className="px-4 py-3">{entry.carPlate}</td>
                <td className="px-4 py-3">{entry.type}</td>
                <td className="px-4 py-3">{entry.priority}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 py-6">
                No hay reportes de problemas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Th = ({ label, sortKey, requestSort, getArrow }) => (
  <th
    className="px-4 py-3 text-left whitespace-nowrap select-none cursor-pointer hover:text-blue-600"
    onClick={() => requestSort(sortKey)}
  >
    {label}
    <span className="ml-1">{getArrow(sortKey)}</span>
  </th>
);

export default IssueTable;

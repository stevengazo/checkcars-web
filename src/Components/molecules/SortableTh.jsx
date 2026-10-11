/** Encabezado de tabla ordenable con indicador de dirección. */
const SortableTh = ({ label, sortKey, sortConfig, onSort }) => {
  const active = sortConfig?.key === sortKey;
  const arrow = active ? (sortConfig.direction === "ascending" ? "↑" : "↓") : "";
  return (
    <th
      scope="col"
      onClick={() => onSort(sortKey)}
      className="cursor-pointer select-none border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="text-blue-600">{arrow}</span>
      </span>
    </th>
  );
};

export default SortableTh;

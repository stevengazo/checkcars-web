import React, { useState } from "react";

const ServiceTable = ({ items }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    if (!sortConfig.key) return items;

    const sorted = [...items].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Si la clave es fecha, convertir a Date
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Si la clave es mileage o nextMileage, aseguramos que sean números para comparar
      if (sortConfig.key === 'mileage' || sortConfig.key === 'nextMileage') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [items, sortConfig]);

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto rounded shadow">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th
              onClick={() => handleSort('title')}
              className="cursor-pointer px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              Servicio {getSortArrow('title')}
            </th>
            <th
              onClick={() => handleSort('type')}
              className="cursor-pointer px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              Tipo {getSortArrow('type')}
            </th>
            <th
              onClick={() => handleSort('date')}
              className="cursor-pointer px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              Fecha {getSortArrow('date')}
            </th>
            <th
              onClick={() => handleSort('mileage')}
              className="cursor-pointer px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              Kilometraje {getSortArrow('mileage')}
            </th>
            <th
              onClick={() => handleSort('nextMileage')}
              className="cursor-pointer px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              Próximo Kilometraje {getSortArrow('nextMileage')}
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedItems.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 text-sm text-gray-700">{item.title}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.type}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.date)}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.mileage.toLocaleString()} KM</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.nextMileage.toLocaleString()} KM</td>
              <td className="px-6 py-4 text-right text-sm">
                <button className="text-blue-600 hover:underline mr-2">Ver</button>
                <button className="text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;

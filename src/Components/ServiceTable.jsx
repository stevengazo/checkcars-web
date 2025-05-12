import React from "react";

const ServiceTable = () => {
  return (
    <div className="overflow-x-auto rounded shadow">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Servicio
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {/* Aquí van las filas dinámicas */}
          <tr>
            <td className="px-6 py-4 text-sm text-gray-700">Cambio de aceite</td>
            <td className="px-6 py-4 text-sm text-gray-500">Mantenimiento</td>
            <td className="px-6 py-4 text-sm text-gray-500">2025-05-12</td>
            <td className="px-6 py-4 text-sm text-gray-500">Aceite sintético</td>
            <td className="px-6 py-4 text-right text-sm">
              <button className="text-blue-600 hover:underline mr-2">Ver</button>
              <button className="text-red-600 hover:underline">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DotLoader } from "react-spinners";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useFetch from "../Hook/useFetch";
import SettingsContext from "../Context/SettingsContext.jsx";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

const ReportCarsByBrand = () => {
  const { API_URL } = useContext(SettingsContext);
  const URL = `${API_URL}/api/Charts/CarsByBrand`;
  const { data, loading, error } = useFetch(URL, { autoFetch: true });

  const formattedData = data?.map((item) => ({
    name: item.brand,
    value: item.count,
  })) || [];

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <div className="flex justify-center py-10">
          <DotLoader color="#4F46E5" />
        </div>
      ) : error ? (
        <p className="text-red-600">Error al cargar los datos.</p>
      ) : (
        <>
          <div className="w-full h-[400px] bg-white rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-4">Vehículos por Marca</h2>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {formattedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl  p-4">
            <h2 className="text-xl font-semibold mb-4">Detalle por Marca</h2>
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Marca</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Cantidad</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Vehículos</th>
                </tr>
              </thead>
              <tbody>
                {data?.map(({ brand, count, cars }) => (
                  <tr key={brand} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">{brand}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{count}</td>
                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                      {cars.map(({ carId, model, plate }) => (
                        <Link
                          key={carId}
                          to={`/car/${carId}`}
                          className="inline-block px-3 py-1 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
                          title={`${model} - ${plate}`}
                        >
                          {model} ({plate})
                        </Link>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportCarsByBrand;

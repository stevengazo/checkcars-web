import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DotLoader } from "react-spinners";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import useFetch from "../Hook/useFetch";
import SettingsContext from "../Context/SettingsContext.jsx";

const ReportByYear = ({ year = 2025 }) => {
  const { API_URL } = useContext(SettingsContext);
  const URL = `${API_URL}/api/Charts/ReportsByYear?year=${year}`;
  const { data, loading, error } = useFetch(URL, { autoFetch: true });

  const [chartData, setChartData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("exits");

  React.useEffect(() => {
    if (!data) return;

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const formatCategory = (cat) => {
      const info = data[cat]?.info || [];
      return months.map((m) => {
        const found = info.find((i) => i.month === m);
        return found ? found.count : 0;
      });
    };

    const exitsCounts = formatCategory("exits");
    const issuesCounts = formatCategory("issues");
    const crashesCounts = formatCategory("crashes");

    const formatted = months.map((m, i) => ({
      month: m,
      Exits: exitsCounts[i],
      Issues: issuesCounts[i],
      Crashes: crashesCounts[i],
    }));

    setChartData(formatted);
  }, [data]);

  const reportList = data?.[selectedCategory]?.list || [];

  const monthName = (m) =>
    [
      "",
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ][m];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Reportes Año {year}
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <DotLoader color="#4F46E5" />
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">Error al cargar los datos.</p>
      ) : (
        <>
          <div className="w-full h-[400px] bg-white rounded-2xl p-4 
        ">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={monthName}
                  label={{
                    value: "Mes",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis />
                <Tooltip formatter={(value) => [value, "Cantidad"]} />
                <Legend
                  onClick={(e) => {
                    if (e && e.dataKey)
                      setSelectedCategory(e.dataKey.toLowerCase());
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Exits"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Issues"
                  stroke="#F59E0B"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Crashes"
                  stroke="#EF4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-4  overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 capitalize">
              {selectedCategory} - Lista de reportes
            </h3>
            {reportList.length === 0 ? (
              <p className="text-gray-600">No hay reportes disponibles.</p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-gray-300 px-4 py-2">
                      Vehiculo{" "}
                    </th>
                    <th className="border-b border-gray-300 px-4 py-2">
                      Fecha Creación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportList.map(({ reportId, carId, created }) => (
                    <tr key={reportId} className="hover:bg-gray-50">
                      <td className="border-b border-gray-200 px-4 py-2 break-all">
                        <Link
                          to={`/car/${carId}`}
                          className="flex items-center justify-center px-4 py-2 text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition duration-200"
                        >
                          Ver Vehículo
                        </Link>
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2">
                        {new Date(created).toLocaleString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportByYear;

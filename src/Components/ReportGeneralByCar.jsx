import React, { useContext } from "react";
import { DotLoader } from "react-spinners";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import useFetch from "../Hook/useFetch";
import SettingsContext from "../Context/SettingsContext.jsx";

const ReportGeneralByCar = () => {
  const { API_URL } = useContext(SettingsContext);
  const URL = `${API_URL}/api/Charts/ReportsByCars`;
  const { data, loading, error } = useFetch(URL, { autoFetch: true });

  // Transformar los datos para el gráfico
  const formattedData = data?.map((car) => ({
    name: `${car.brand} ${car.model}`,
    Exits: car.exits,
    Issues: car.issues,
    Crashes: car.crashes,
    Returns: car.returns,
    Bookings: car.bookings,
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
        <div className="w-full h-[400px] bg-white rounded-2xl p-4 shadow">
          <h2 className="text-xl font-semibold mb-4">Reporte por Vehículo</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Exits" stackId="a" fill="#4F46E5" />
              <Bar dataKey="Issues" stackId="a" fill="#F59E0B" />
              <Bar dataKey="Crashes" stackId="a" fill="#EF4444" />
              <Bar dataKey="Returns" stackId="a" fill="#10B981" />
              <Bar dataKey="Bookings" stackId="a" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ReportGeneralByCar;

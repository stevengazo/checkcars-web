import React, { useContext } from "react";
import { DotLoader } from "react-spinners";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useFetch from "../../Hook/useFetch.js";
import SettingsContext from "../../Context/SettingsContext.jsx";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

const ReportCarByType = () => {
  const { API_URL } = useContext(SettingsContext);
  const URL = `${API_URL}/api/Charts/GetCarByType`;
  const { data, loading, error } = useFetch(URL, { autoFetch: true });

  const formattedData = data?.map((item) => ({
    name: item.type,
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
        <div className="w-full h-[400px] bg-white rounded-2xl p-4 ">
          <h2 className="text-xl font-semibold mb-4">Vehículos por Tipo</h2>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ReportCarByType;

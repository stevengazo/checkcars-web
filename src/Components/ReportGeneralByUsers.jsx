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

const ReportGeneralByUsers = () => {
  const { API_URL } = useContext(SettingsContext);
  const URL = `${API_URL}/api/Charts/ReportsByUser`;
  const { data, loading, error } = useFetch(URL, { autoFetch: true });

  // Formatear datos combinando los counts por autor
  const formattedData = [];

  if (data) {
    const authors = new Set();

    data.existsByAuthor.forEach((item) => authors.add(item.author));
    data.issuesByAuthor.forEach((item) => authors.add(item.author));
    data.crashesByAuthor.forEach((item) => authors.add(item.author));

    authors.forEach((author) => {
      formattedData.push({
        author,
        Exits:
          data.existsByAuthor.find((item) => item.author === author)?.count ||
          0,
        Issues:
          data.issuesByAuthor.find((item) => item.author === author)?.count ||
          0,
        Crashes:
          data.crashesByAuthor.find((item) => item.author === author)?.count ||
          0,
      });
    });
  }

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
          <h2 className="text-xl font-semibold mb-4">
            Actividades por Usuario
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="author" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Exits" fill="#4F46E5" />
              <Bar dataKey="Issues" fill="#F59E0B" />
              <Bar dataKey="Crashes" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ReportGeneralByUsers;

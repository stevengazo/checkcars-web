import { useState, useContext, useEffect } from "react";
import { DotLoader } from "react-spinners";

import ReturnsTable from "../Components/ReturnsTable.jsx";
import SideBarReturn from "../Components/SideBarReturn.jsx";
import useFetch from "../Hook/useFetch.js";
import SettingsContext from "../Context/SettingsContext.jsx";

export default function ReturnsSearch() {
  const { API_URL } = useContext(SettingsContext);

  const [selectedReport, setSelectedReport] = useState(null);
  const [useDate, setUseDate] = useState(false);
  const [date, setDate] = useState("");
  const [plate, setPlate] = useState("");
  const [author, setAuthor] = useState("");
  const [searchUrl, setSearchUrl] = useState(null);

  const { data, loading, error, refetch } = useFetch(searchUrl, {
    autoFetch: false,
  });

  // Construye la URL de búsqueda basada en los filtros activos
  const buildSearchUrl = () => {
    const base = `${API_URL}/api/VehicleReturns`;
    const search = `${API_URL}/api/VehicleReturns/search`;
    const params = [];

    if (useDate && date) params.push(`date=${encodeURIComponent(date)}`);
    if (plate) params.push(`plate=${encodeURIComponent(plate)}`);
    if (author) params.push(`author=${encodeURIComponent(author)}`);

    return params.length > 0 ? `${search}?${params.join("&")}` : base;
  };

  // Ejecuta búsqueda al presionar el botón
  const handleSearch = () => {
    const url = buildSearchUrl();
    setSearchUrl(url); // Esto dispara el efecto y la búsqueda
  };

  // Al montar, cargar todos los registros por defecto
  useEffect(() => {
    setSearchUrl(`${API_URL}/api/VehicleReturns`);
  }, []);

  // Ejecuta refetch cada vez que se actualiza la URL
  useEffect(() => {
    if (searchUrl) {
      refetch();
    }
  }, [searchUrl]);

  return (
    <>
      <div className="flex flex-col gap-4 p-4 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {!useDate ? (
            <label
              className="bg-green-700 text-white rounded text-center p-2 cursor-pointer"
              onClick={() => setUseDate(true)}
            >
              Fecha
            </label>
          ) : (
            <>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <label
                className="text-red-400 p-2 cursor-pointer"
                onClick={() => setUseDate(false)}
              >
                x
              </label>
            </>
          )}

          <input
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="Plate"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center align-top">
        {loading && <DotLoader color="#2563EB" />}
        {!loading && data && (
          <ReturnsTable returns ={data} onSelected={setSelectedReport} />
        )}
        {selectedReport && (
          <SideBarReturn entry={selectedReport} onClose={setSelectedReport} />
        )}
      </div>
    </>
  );
}

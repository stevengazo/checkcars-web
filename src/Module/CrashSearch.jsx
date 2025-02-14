import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { DotLoader } from "react-spinners";
import SettingsContext from '../Context/SettingsContext.jsx'
import useFetch from "../Hook/useFetch";
import SideBarCrash from "../Components/SideBarCrash";
import CrashTable from "../Components/CrashTable";

const CrashSearch = () => {
  const { API_URL } = useContext(SettingsContext);
  const [selectedReport, setSelectedReport] = useState(null);
  const [crashes, setCrashes] = useState([]);
  const [useDate, setUseDate] = useState(false);
  // Estados para almacenar los valores de los campos de búsqueda
  const [date, setDate] = useState("");
  const [plate, setPlate] = useState("");
  const [author, setAuthor] = useState("");
  const [isFirstExecution, setIsFirstExecution] = useState(true); // Controla la primera ejecución

  // Construir la URL de búsqueda con los parámetros si están presentes
  const buildSearchUrl = () => {
    let urlbase = `${API_URL}/api/CrashReports`;

    let urlSearch =
      `${API_URL}/api/CrashReports/search`;

    if (!isFirstExecution) {
      let params = [];
      if (useDate) params.push(`date=${encodeURIComponent(date)}`);
      if (plate) params.push(`plate=${encodeURIComponent(plate)}`);
      if (author) params.push(`author=${encodeURIComponent(author)}`);

      // Si hay parámetros, añadirlos a la URL
      if (params.length > 0) {
        urlSearch += `?${params.join("&")}`;
        return urlSearch;
      } else if (params.length == 0) {
        return urlbase;
      }
    }
    return urlbase;
  };

  // Hacemos la petición usando la URL construida
  const { data, loading, status, error, refetch } = useFetch(buildSearchUrl(), {
    autoFetch: true,
  });

  // Función para manejar el clic en el botón de búsqueda
  const handleSearch = () => {
    setIsFirstExecution(false); // Después de la primera búsqueda, dejamos de usar la URL base
    refetch()
      .then(() => {
        console.table(data);
        console.log(error);
      })
      .catch(() => {
        if (status == 404) {
          toast.warn("No hay coincidencias", {
            position: "bottom-right",
          });
        }
      }); // Vuelve a hacer la petición con la nueva URL
  };

  useEffect(() => {
    setCrashes(data);
  }, [data]);

  return (
    <>
      <div className="flex flex-col gap-4 p-4 bg-white shadow-lg rounded-lg">
        <ToastContainer />
        <div className="flex flex-col md:flex-row gap-4">
          {!useDate && (
            <label
              className="bg-green-700 text-white rounded  justify-center text-center p-2"
              onClick={() => setUseDate(true)}
            >
              Fecha
            </label>
          )}

          {useDate && (
            <>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <label
                className="text-red-400 p-2"
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
        {!loading && (
          <CrashTable crashes={crashes} onSelected={setSelectedReport} />
        )}

        {selectedReport != null && (
          <SideBarCrash crash={selectedReport} onClose={setSelectedReport} />
        )}
      </div>
    </>
  );
};

export default CrashSearch;

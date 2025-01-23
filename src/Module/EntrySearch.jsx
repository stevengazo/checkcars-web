import EntryTable from "../Components/EntryTable.jsx";
import { DotLoader } from "react-spinners";
import useFetch from "../Hook/useFetch";

export default function EntrySearch() {
  // Hacemos la petición solo cuando el componente se monta
  const { data, loading, error, refetch } = useFetch(
    "https://mecsacars.stevengazo.co.cr/api/EntryExitReports",
    { autoFetch: true } // Se asegura de que la llamada se haga al montar el componente
  );
  return (
    <>
      <div className="flex flex-col gap-4 p-4 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Plate"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Author"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Search
          </button>
        </div>
      </div>
      <div className="mt-6 flex justify-center align-top">
        {loading && <DotLoader color="#2563EB" />}
        {!loading && <EntryTable entries={data} />}
      </div>
    </>
  );
}

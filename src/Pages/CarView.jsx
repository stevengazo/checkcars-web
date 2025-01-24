import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DotLoader } from "react-spinners";
import useFetch from "../Hook/useFetch";
import EntriesTable from "../Components/EntryTable";
import IssuesTable from "../Components/IssueTable.jsx"
import SideBarEntry from "../Components/SideBarEntry.jsx";
import SidebarIssue from "../Components/SidebarIssue.jsx"
import CarInfo from "../Components/CarInfo";
import IssueTable from "../Components/IssueTable.jsx";
import SideBarIssue from "../Components/SidebarIssue.jsx";

const CarView = () => {
  const [selectedEntry, setselectedEntry] = useState(null);
  const [selectedIssue, setselectedIssue] = useState(null);
  const { id } = useParams();
  const URLInfo = `https://mecsacars.stevengazo.co.cr/api/Cars/${id}`;
  const URLEntries = ` https://mecsacars.stevengazo.co.cr/api/EntryExitReports/search?carId=${id}`;
  const URLIssues = ` https://mecsacars.stevengazo.co.cr/api/IssueReports/search?carId=${id}`;

  // Primera petición para obtener información del vehículo
  const {
    data: carData,
    loading: carLoading,
    error: carError,
  } = useFetch(URLInfo, {
    autoFetch: true,
  });

  // Segunda petición para obtener historial de mantenimiento
  const {
    data: EntriesData,
    loading: EntriesLoading,
    error: EntriesError,
  } = useFetch(URLEntries, {
    autoFetch: true,
  });

    // Segunda petición para obtener historial de mantenimiento
    const {
      data: IssuesData,
      loading: IssuesLoading,
      error: IssuesError,
    } = useFetch(URLIssues, {
      autoFetch: true,
    });

    console.log(IssuesData);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Detalles Vehículo</h1>
      {carLoading && (
        <div className="flex justify-center items-center w-full mx-auto">
          <label> Cargando Detalles...</label>
          <DotLoader color="#2563EB" />
        </div>
      )}

      {carData ? (
        <div className="overflow-x-auto mb-6">
          <CarInfo car={carData}></CarInfo>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No data available for this car.
        </p>
      )}

      {/* Salidas */}
      <div className="shadow rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-4">
          Historial de Salidas
        </h2>

        {EntriesLoading && (
          <div className="flex justify-center items-center w-full mx-auto">
            <label> Cargando Salidas...</label>
            <DotLoader color="#2563EB" />
          </div>
        )}

        {!EntriesLoading && EntriesData && EntriesData.length > 0 ? (
          <div className="overflow-x-auto">
            <EntriesTable
              entries={EntriesData}
              onSelected={setselectedEntry}
            />
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No Entries records available.
          </p>
        )}

        {selectedEntry && (
          <SideBarEntry entry={selectedEntry} onClose={setselectedEntry} />
        )}
      </div>

     {/* Problemas */}
     <div className="shadow rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-4">
          Historial de Problemas
        </h2>

        {IssuesLoading && (
          <div className="flex justify-center items-center w-full mx-auto">
            <label> Cargando Problemas...</label>
            <DotLoader color="#2563EB" />
          </div>
        )}

        {!IssuesLoading && IssuesData && IssuesData.length > 0 ? (
          <div className="overflow-x-auto">
            <IssueTable
            issues={IssuesData}
              onSelected={setselectedIssue}
            />
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No Issues records available.
          </p>
        )}

        {selectedIssue && (
          <SideBarIssue issue={selectedIssue} onClose={setselectedIssue} />
        )}
      </div>

    </div>
  );
};

export default CarView;

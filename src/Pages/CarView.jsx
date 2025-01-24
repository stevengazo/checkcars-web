import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../Hook/useFetch";
import EntriesTable from "../Components/EntryTable";
import SideBarEntry from "../Components/SideBarEntry.jsx";
import CarInfo from "../Components/CarInfo";

const CarView = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const { id } = useParams();
  const URLInfo = `https://mecsacars.stevengazo.co.cr/api/Cars/${id}`;
  const URLEntries = ` https://mecsacars.stevengazo.co.cr/api/EntryExitReports/search?carId=${id}`;

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

  useEffect(() => {
    if (carData) {
      console.log("Car data fetched:", carData);
    }
    if (EntriesData) {
      console.log("Entries data fetched:", EntriesData);
    }
  }, [carData, EntriesData]);

  if (carLoading || EntriesLoading)
    return <p className="text-center text-gray-500">Loading...</p>;

  if (carError)
    return (
      <p className="text-center text-red-500">
        Error loading data Car. Please try again later.
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Detalles Vehículo</h1>
      {carData ? (
        <div className="overflow-x-auto mb-6">
          <CarInfo car={carData}></CarInfo>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No data available for this car.
        </p>
      )}

      <h2 className="text-2xl font-bold text-center mb-4">
        Historial de Salidas
      </h2>
      {EntriesData && EntriesData.length > 0 ? (
        <div className="overflow-x-auto">
          <EntriesTable entries={EntriesData} onSelected={setSelectedReport} />
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No Entries records available.
        </p>
      )}

      {selectedReport && (
        <SideBarEntry entry={selectedReport} onClose={setSelectedReport} />
      )}
    </div>
  );
};

export default CarView;

// Importing necessary libraries and components
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DotLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// Importing custom components and hooks
import useFetch from "../Hook/useFetch";
import CarInfo from "../Components/Car/CarInfo";
import CarEdit from "../Components/Car/CarEdit";
import EntriesTable from "../Components/Entry/EntryTable";
import CrashTable from "../Components/Crash/CrashTable";
import IssueTable from "../Components/Issue/IssueTable";
import SideBarEntry from "../Components/Entry/SideBarEntry";
import SideBarIssue from "../Components/Issue/SidebarIssue";
import { ReminderList } from "../Components/Reminder/ReminderList";
import SettingsContext from "../Context/SettingsContext";
import { AddReminder } from "../Components/Reminder/AddReminder";
import FileTable from "../Components/File/FileTable";
import FileUpload from "../Components/File/FileUpload";
import AddService from "../Components/Service/AddService";
import ServiceTable from "../Components/Service/ServiceTable";
import { da } from "date-fns/locale";

const LoadingState = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-6">
    <label className="mb-2">{message}</label>
    <DotLoader color="#2563EB" />
  </div>
);

const EmptyState = ({ message }) => (
  <p className="text-center text-gray-500 p-4">{message}</p>
);

// Motion wrapper for each TabPanel
const AnimatedTabPanel = ({ children }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key="panel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="mt-4"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

const CarView = () => {
  // Use context to get API URL
  const { API_URL } = useContext(SettingsContext);
  const { id } = useParams();
  // Use state hooks for managing local state
  const [refreshFiles, setRefreshFiles] = useState(false);
  const [refreshServices, setRefreshServices] = useState(false);
  const [refreshReminders, setRefreshReminders] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  // API URLs
  const URLInfo = `${API_URL}/api/Cars/${id}`;
  const URLEntries = `${API_URL}/api/EntryExitReports/search?carId=${id}`;
  const URLIssues = `${API_URL}/api/IssueReports/search?carId=${id}`;
  const URLReminders = `${API_URL}/api/Reminder/remindersbycar/${id}`;
  const URLCrashes = `${API_URL}/api/CrashReports/search?carId=${id}`;
  const URLFiles = `${API_URL}/api/VehicleAttachments/ByCar/${id}`;
  const URLServices = `${API_URL}/api/CarServices/bycar/${id}`;
  // Fetch data using custom hook
  const {
    data: carData,
    loading: carLoading,
    error: carError,
  } = useFetch(URLInfo, { autoFetch: true });
  const { data: EntriesData, loading: EntriesLoading } = useFetch(URLEntries, {
    autoFetch: true,
  });
  const { data: IssuesData, loading: IssuesLoading } = useFetch(URLIssues, {
    autoFetch: true,
  });
  const { data: RemindersData, loading: RemindersLoading } = useFetch(
    URLReminders,
    { autoFetch: true, dependencies: [refreshReminders] }
  );
  const { data: CrashesData, loading: CrashesLoading } = useFetch(URLCrashes, {
    autoFetch: true,
  });
  const {
    data: FilesData,
    loading: FilesLoading,
    error: FilesError,
  } = useFetch(URLFiles, { autoFetch: true, dependencies: [refreshFiles] });

  const {
    data: ServicesData,
    loading: ServicesLoading,
    error: ServiceErrors,
  } = useFetch(URLServices, {
    autoFetch: true,
    dependencies: [refreshServices],
  });

  const DeleteCar = async () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este vehículo?")
    ) {
      try {
        const response = await fetch(`${API_URL}/api/Cars/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al eliminar el vehículo");
        }
        alert("Vehículo eliminado correctamente");
        window.location.href = "/cars"; // Redirect to cars list
      } catch (error) {
        console.error("Error al eliminar el vehículo:", error);
        alert("No se pudo eliminar el vehículo. Inténtalo de nuevo más tarde.");
      }
    }
  };

  const AvariableSet = async (value) => {
    const dat = !value;
    console.log("AvariableSet called with value:", dat);
    if (!carData) return;

    try {
      console.log("Setting Avariable to:", dat);

      // Crear una copia del objeto en lugar de modificar directamente
      const updatedCar = { ...carData, IsAvailable: dat };
      console.log("Payload enviado:", updatedCar);
      const response = await fetch(`${API_URL}/api/Cars/${carData.carId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedCar),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Response body:", await response.text());
      if (!response.ok) {
        throw new Error("Error al actualizar el vehículo");
      } else if (response.status === 204) {
        console.log("No content returned, update successful");
      }

      alert("Estado de mantenimiento actualizado correctamente");
      window.location.reload(); // Recarga para reflejar cambios
    } catch (error) {
      console.error("Error al establecer el valor:", error);
      alert("No se pudo actualizar el estado. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <motion.div
      className="p-6 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold">Detalles del Vehículo</h1>
        {carData && (
          <div className=" flex gap-1">
            {!editMode && (
              <button
                className="text-white px-4 py-2 rounded transition bg-red-500"
                onClick={DeleteCar}
              >
                Borrar Vehículo
              </button>
            )}
            {!editMode && (
              <button
                className={`text-white px-4 py-2 rounded transition ${
                  carData.IsAvailable
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
                onClick={() => AvariableSet(carData.IsAvailable)}
              >
                {carData.IsAvailable ? "En Mantenimiento" : "Disponible"}
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded transition text-white ${
                editMode
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editMode ? "Cancelar" : "Editar Vehículo"}
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Vehicle Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={editMode ? "edit" : "info"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {carLoading ? (
            <LoadingState message="Cargando Detalles..." />
          ) : carError ? (
            <EmptyState message="Error al cargar los datos del vehículo." />
          ) : carData ? (
            editMode ? (
              <CarEdit car={carData} />
            ) : (
              <CarInfo car={carData} />
            )
          ) : (
            <EmptyState message="No hay datos disponibles para este vehículo." />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Tabs */}
      <Tabs selectedIndex={activeTabIndex} onSelect={setActiveTabIndex}>
        <TabList>
          <Tab>Salidas</Tab>
          <Tab>Problemas</Tab>
          <Tab>Accidentes</Tab>
          <Tab>Recordatorios</Tab>
          <Tab>Archivos</Tab>
          <Tab>Servicios</Tab>
        </TabList>

        {/* Exists */}
        <TabPanel>
          <AnimatedTabPanel>
            {EntriesLoading ? (
              <LoadingState message="Cargando Salidas..." />
            ) : EntriesData?.length ? (
              <EntriesTable
                entries={EntriesData}
                onSelected={setSelectedEntry}
              />
            ) : (
              <EmptyState message="No hay registros de salidas." />
            )}
          </AnimatedTabPanel>
        </TabPanel>
        {/* Issues */}
        <TabPanel>
          <AnimatedTabPanel>
            {IssuesLoading ? (
              <LoadingState message="Cargando Problemas..." />
            ) : IssuesData?.length ? (
              <IssueTable issues={IssuesData} onSelected={setSelectedIssue} />
            ) : (
              <EmptyState message="No hay registros de problemas." />
            )}
          </AnimatedTabPanel>
        </TabPanel>
        {/* Crash */}

        <TabPanel>
          <AnimatedTabPanel>
            {CrashesLoading ? (
              <LoadingState message="Cargando accidentes..." />
            ) : CrashesData?.length ? (
              <CrashTable crashes={CrashesData} onSelected={setSelectedIssue} />
            ) : (
              <EmptyState message="No hay reportes de accidentes." />
            )}
          </AnimatedTabPanel>
        </TabPanel>
        {/* Reminders */}
        <TabPanel>
          <AnimatedTabPanel>
            {RemindersLoading ? (
              <LoadingState message="Cargando Recordatorios..." />
            ) : (
              <>
                <button
                  onClick={() => setShowAddReminder(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  {" "}
                  Añadir Recordatorio
                </button>
                {showAddReminder && (
                  <AddReminder
                    onClose={() => setShowAddReminder(false)}
                    CarId={id}
                    OnAdded={() => setRefreshReminders(!refreshReminders)}
                  />
                )}

                {RemindersData?.length ? (
                  <ReminderList items={RemindersData} />
                ) : (
                  <EmptyState message="No hay recordatorios para este vehículo." />
                )}
              </>
            )}
          </AnimatedTabPanel>
        </TabPanel>
        {/* Files */}
        <TabPanel>
          <AnimatedTabPanel>
            {FilesLoading ? (
              <LoadingState message="Cargando archivos..." />
            ) : FilesData?.length ? (
              <>
                <FileUpload
                  CarId={id}
                  OnUploaded={() => setRefreshFiles(!refreshFiles)}
                />
                <br />
                <FileTable items={FilesData} />
              </>
            ) : (
              <>
                <FileUpload CarId={id} />
                <br />
                <EmptyState message="No hay archivos asociados al vehículo." />
              </>
            )}
          </AnimatedTabPanel>
        </TabPanel>
        {/* Services */}
        <TabPanel>
          <AnimatedTabPanel>
            <button
              onClick={() => setShowAddService(true)}
              className="bg-blue-600 text-white  my-2 px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Agregar Servicio
            </button>
            <br />
            {showAddService && (
              <AddService
                OnCloseForm={setShowAddService}
                carId={id}
                OnAdded={() => setRefreshServices(!refreshServices)}
              />
            )}
            <ServiceTable items={ServicesData} />
          </AnimatedTabPanel>
        </TabPanel>
      </Tabs>

      {/* Sidebars */}
      {selectedEntry && (
        <SideBarEntry
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
      {selectedIssue && (
        <SideBarIssue
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </motion.div>
  );
};

export default CarView;

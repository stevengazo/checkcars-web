// Importing necessary libraries and components
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DotLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// Importing custom components and hooks
import useFetch from "../Hook/useFetch";
import CarInfo from "../Components/CarInfo";
import CarEdit from "../Components/CarEdit";
import EntriesTable from "../Components/EntryTable";
import CrashTable from "../Components/CrashTable";
import IssueTable from "../Components/IssueTable";
import SideBarEntry from "../Components/SideBarEntry";
import SideBarIssue from "../Components/SidebarIssue";
import { ReminderList } from "../Components/ReminderList";
import SettingsContext from "../Context/SettingsContext";
import { AddReminder } from "../Components/AddReminder";
import FileTable from "../Components/FileTable";
import FileUpload from "../Components/FileUpload";
import AddService from "../Components/AddService";
import ServiceTable from "../Components/ServiceTable";

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
  const URLFiles = `${API_URL}/attachmentsbyCar/${id}`;
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
    { autoFetch: true }
  );
  const { data: CrashesData, loading: CrashesLoading } = useFetch(URLCrashes, {
    autoFetch: true,
  });
  const { data: FilesData, loading: FilesLoading } = useFetch(URLFiles, {
    autoFetch: true,
  });
  const {
    data: ServicesData,
    loading: ServicesLoading,
    error: ServiceErrors,
  } = useFetch(URLServices, { autoFetch: true });

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
              <button className="text-white px-4 py-2 rounded transition bg-red-500">
                Borrar Vehículo
              </button>
            )}
            {!editMode && (
              <button className="text-white px-4 py-2 rounded transition bg-purple-500">
                Mantenimiento
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
                <FileUpload CarId={id} />
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
              <AddService OnCloseForm={setShowAddService} carId={id} />
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

import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { DotLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "../Hook/useFetch";
import CarInfo from "../Components/CarInfo";
import CarEdit from "../Components/CarEdit";
import EntriesTable from "../Components/EntryTable";
import IssueTable from "../Components/IssueTable";
import SideBarEntry from "../Components/SideBarEntry";
import SideBarIssue from "../Components/SidebarIssue";
import SettingsContext from "../Context/SettingsContext";
import { AddReminder } from "../Components/AddReminder";
import { ReminderList } from "../Components/ReminderList";

const LoadingState = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-6">
    <label className="mb-2">{message}</label>
    <DotLoader color="#2563EB" />
  </div>
);

const EmptyState = ({ message }) => (
  <p className="text-center text-gray-500 p-4">{message}</p>
);

const CarView = () => {
  const { API_URL } = useContext(SettingsContext);
  const { id } = useParams();

  const [showAddReminder, setShowAddReminder] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("entries");

  const URLInfo = `${API_URL}/api/Cars/${id}`;
  const URLEntries = `${API_URL}/api/EntryExitReports/search?carId=${id}`;
  const URLIssues = `${API_URL}/api/IssueReports/search?carId=${id}`;
  const URLReminders = `${API_URL}/api/Reminders/search?carId=${id}`;
  const URLCrashes = `${API_URL}/api/CrashReports/search?carId=${id}`;
  const URLFiles = `${API_URL}/api/Files/search?carId=${id}`;

  const {
    data: carData,
    loading: carLoading,
    error: carError,
  } = useFetch(URLInfo, { autoFetch: true });
  const { data: EntriesData, loading: EntriesLoading } = useFetch(URLEntries, { autoFetch: true });
  const { data: IssuesData, loading: IssuesLoading } = useFetch(URLIssues, { autoFetch: true });
  const { data: RemindersData, loading: RemindersLoading } = useFetch(URLReminders, { autoFetch: true });
  const { data: CrashesData, loading: CrashesLoading } = useFetch(URLCrashes, { autoFetch: true });
  const { data: FilesData, loading: FilesLoading } = useFetch(URLFiles, { autoFetch: true });

  const tabs = [
    { key: "entries", label: "Salidas" },
    { key: "issues", label: "Problemas" },
    { key: "reminders", label: "Recordatorios" },
    { key: "crashes", label: "Accidentes" },
    { key: "files", label: "Archivos" },
  ];

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
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded transition text-white ${
              editMode
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {editMode ? "Cancelar" : "Editar Vehículo"}
          </motion.button>
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
            editMode ? <CarEdit CarEdit={carData} /> : <CarInfo car={carData} />
          ) : (
            <EmptyState message="No hay datos disponibles para este vehículo." />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Tabs */}
      <div className="mt-6">
        <div className="flex gap-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-4"
          >
            {activeTab === "entries" ? (
              EntriesLoading ? (
                <LoadingState message="Cargando Salidas..." />
              ) : EntriesData?.length ? (
                <EntriesTable entries={EntriesData} onSelected={setSelectedEntry} />
              ) : (
                <EmptyState message="No hay registros de salidas." />
              )
            ) : activeTab === "issues" ? (
              IssuesLoading ? (
                <LoadingState message="Cargando Problemas..." />
              ) : IssuesData?.length ? (
                <IssueTable issues={IssuesData} onSelected={setSelectedIssue} />
              ) : (
                <EmptyState message="No hay registros de problemas." />
              )
            ) : activeTab === "reminders" ? (
              RemindersLoading ? (
                <LoadingState message="Cargando Recordatorios..." />
              ) : (
                <>
                  {showAddReminder ? (
                    <AddReminder onClose={() => setShowAddReminder(false)} />
                  ) : (
                    <button
                      onClick={() => setShowAddReminder(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Añadir Recordatorio
                    </button>
                  )}
                  <ReminderList />

                  {RemindersData?.length ? (
                    <ReminderList reminders={RemindersData} />
                  ) : (
                    <EmptyState message="No hay recordatorios para este vehículo." />
                  )}
                </>
              )
            ) : activeTab === "crashes" ? (
              CrashesLoading ? (
                <LoadingState message="Cargando accidentes..." />
              ) : CrashesData?.length ? (
                <ul className="list-disc list-inside bg-white rounded shadow p-4 text-sm">
                  {CrashesData.map((c, i) => (
                    <li key={i}>{c.description || "Accidente registrado"}</li>
                  ))}
                </ul>
              ) : (
                <EmptyState message="No hay reportes de accidentes." />
              )
            ) : FilesLoading ? (
              <LoadingState message="Cargando archivos..." />
            ) : FilesData?.length ? (
              <ul className="list-disc list-inside bg-white rounded shadow p-4 text-sm">
                {FilesData.map((f, i) => (
                  <li key={i}>
                    <a
                      href={f.url || f.filePath}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {f.name || `Archivo ${i + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No hay archivos asociados al vehículo." />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sidebars */}
      {selectedEntry && (
        <SideBarEntry entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
      {selectedIssue && (
        <SideBarIssue issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}
    </motion.div>
  );
};

export default CarView;

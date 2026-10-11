import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { toast } from "react-toastify";
import { FaArrowLeft, FaPen, FaTrash, FaWrench, FaCheck, FaCar, FaPlus } from "react-icons/fa6";

import useFetch from "../Hook/useFetch";
import SettingsContext from "../Context/SettingsContext";
import carsService, { carImageUrl } from "../services/carsService";

import CarInfo from "../Components/Car/CarInfo";
import CarForm from "../Components/organisms/CarForm";
import Card from "../Components/atoms/Card";
import Badge from "../Components/atoms/Badge";
import Button from "../Components/atoms/Button";
import Spinner from "../Components/atoms/Spinner";
import EmptyState from "../Components/molecules/EmptyState";

import EntriesTable from "../Components/Entry/EntryTable";
import CrashTable from "../Components/Crash/CrashTable";
import IssueTable from "../Components/Issue/IssueTable";
import SideBarEntry from "../Components/Entry/SideBarEntry";
import SideBarIssue from "../Components/Issue/SidebarIssue";
import { ReminderList } from "../Components/Reminder/ReminderList";
import { AddReminder } from "../Components/Reminder/AddReminder";
import FileTable from "../Components/File/FileTable";
import FileUpload from "../Components/File/FileUpload";
import AddService from "../Components/Service/AddService";
import ServiceTable from "../Components/Service/ServiceTable";

const AnimatedTabPanel = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="mt-4"
  >
    {children}
  </motion.div>
);

const tabClass =
  "cursor-pointer rounded-t-lg px-4 py-2 text-sm font-medium text-gray-500 outline-none transition hover:text-blue-600";
const tabSelected = "!text-blue-700 border-b-2 border-blue-600 bg-blue-50/50";

const CarView = () => {
  const { API_URL } = useContext(SettingsContext);
  const { id } = useParams();
  const nav = useNavigate();

  const [refreshFiles, setRefreshFiles] = useState(false);
  const [refreshServices, setRefreshServices] = useState(false);
  const [refreshReminders, setRefreshReminders] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [car, setCar] = useState(null);

  const URLInfo = `${API_URL}/api/Cars/${id}`;
  const URLEntries = `${API_URL}/api/EntryExitReports/search?carId=${id}`;
  const URLIssues = `${API_URL}/api/IssueReports/search?carId=${id}`;
  const URLReminders = `${API_URL}/api/Reminder/remindersbycar/${id}`;
  const URLCrashes = `${API_URL}/api/CrashReports/search?carId=${id}`;
  const URLFiles = `${API_URL}/api/VehicleAttachments/ByCar/${id}`;
  const URLServices = `${API_URL}/api/CarServices/bycar/${id}`;

  const { data: carData, loading: carLoading, error: carError, refetch: refetchCar } = useFetch(URLInfo, { autoFetch: true });
  const { data: EntriesData, loading: EntriesLoading } = useFetch(URLEntries, { autoFetch: true });
  const { data: IssuesData, loading: IssuesLoading } = useFetch(URLIssues, { autoFetch: true });
  const { data: RemindersData, loading: RemindersLoading } = useFetch(URLReminders, { autoFetch: true, dependencies: [refreshReminders] });
  const { data: CrashesData, loading: CrashesLoading } = useFetch(URLCrashes, { autoFetch: true });
  const { data: FilesData, loading: FilesLoading } = useFetch(URLFiles, { autoFetch: true, dependencies: [refreshFiles] });
  const { data: ServicesData } = useFetch(URLServices, { autoFetch: true, dependencies: [refreshServices] });

  useEffect(() => {
    if (carData) setCar(carData);
  }, [carData]);

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este vehículo?")) return;
    setBusy(true);
    try {
      await carsService.remove(id);
      toast.success("Vehículo eliminado correctamente.");
      nav("/carlist");
    } catch {
      toast.error("No se pudo eliminar el vehículo.");
    } finally {
      setBusy(false);
    }
  };

  const toggleAvailability = async () => {
    if (!car) return;
    setBusy(true);
    const updated = { ...car, isAvailable: !car.isAvailable };
    try {
      await carsService.update(car.carId, updated);
      setCar(updated);
      toast.success(updated.isAvailable ? "Vehículo marcado como disponible." : "Vehículo en mantenimiento.");
    } catch {
      toast.error("No se pudo actualizar el estado.");
    } finally {
      setBusy(false);
    }
  };

  const status = car?.deleted
    ? { tone: "red", label: "Borrado" }
    : car?.isAvailable
    ? { tone: "green", label: "Disponible" }
    : { tone: "purple", label: "En mantenimiento" };

  const img = carImageUrl(car?.imagePath);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Link to="/carlist" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600">
        <FaArrowLeft size={13} /> Volver a vehículos
      </Link>

      {carLoading ? (
        <Spinner label="Cargando detalles..." />
      ) : carError ? (
        <EmptyState title="Error" description="No se pudieron cargar los datos del vehículo." />
      ) : car ? (
        <>
          {/* Hero */}
          <Card padding="p-0" className="overflow-hidden">
            <div className="flex flex-col gap-0 md:flex-row">
              <div className="h-48 w-full shrink-0 bg-gray-100 md:h-auto md:w-72">
                {img ? (
                  <img src={img} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                    <FaCar size={64} />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {car.brand} {car.model}
                    </h1>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-gray-600">{car.plate || "—"}</span>
                    {car.type && <span className="rounded bg-gray-100 px-2 py-0.5 capitalize text-gray-600">{car.type}</span>}
                    {car.year && <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">{car.year}</span>}
                    {car.fuelType && <span className="rounded bg-gray-100 px-2 py-0.5 capitalize text-gray-600">{car.fuelType}</span>}
                  </div>
                </div>

                {!editMode && (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="primary" onClick={() => setEditMode(true)}>
                      <FaPen size={13} /> Editar
                    </Button>
                    <Button variant={car.isAvailable ? "secondary" : "primary"} onClick={toggleAvailability} loading={busy}>
                      {car.isAvailable ? <><FaWrench size={13} /> Mantenimiento</> : <><FaCheck size={13} /> Disponible</>}
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={busy}>
                      <FaTrash size={13} /> Borrar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Specs o edición */}
          <Card>
            <AnimatePresence mode="wait">
              <motion.div
                key={editMode ? "edit" : "info"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {editMode ? (
                  <CarForm
                    car={car}
                    onSuccess={() => {
                      setEditMode(false);
                      refetchCar();
                    }}
                    onCancel={() => setEditMode(false)}
                  />
                ) : (
                  <CarInfo car={car} />
                )}
              </motion.div>
            </AnimatePresence>
          </Card>
        </>
      ) : (
        <EmptyState title="Sin datos" description="No hay información para este vehículo." />
      )}

      {/* Pestañas de actividad */}
      {car && (
        <Card>
          <Tabs>
            <TabList className="mb-0 flex flex-wrap gap-1 border-b border-gray-200 p-0">
              <Tab className={tabClass} selectedClassName={tabSelected}>Salidas {EntriesData?.length ? <Badge tone="blue">{EntriesData.length}</Badge> : null}</Tab>
              <Tab className={tabClass} selectedClassName={tabSelected}>Problemas {IssuesData?.length ? <Badge tone="amber">{IssuesData.length}</Badge> : null}</Tab>
              <Tab className={tabClass} selectedClassName={tabSelected}>Accidentes {CrashesData?.length ? <Badge tone="red">{CrashesData.length}</Badge> : null}</Tab>
              <Tab className={tabClass} selectedClassName={tabSelected}>Recordatorios {RemindersData?.length ? <Badge tone="purple">{RemindersData.length}</Badge> : null}</Tab>
              <Tab className={tabClass} selectedClassName={tabSelected}>Archivos {FilesData?.length ? <Badge tone="gray">{FilesData.length}</Badge> : null}</Tab>
              <Tab className={tabClass} selectedClassName={tabSelected}>Servicios {ServicesData?.length ? <Badge tone="green">{ServicesData.length}</Badge> : null}</Tab>
            </TabList>

            <TabPanel>
              <AnimatedTabPanel>
                {EntriesLoading ? <Spinner label="Cargando salidas..." /> : EntriesData?.length ? (
                  <EntriesTable entries={EntriesData} onSelected={setSelectedEntry} />
                ) : <EmptyState title="Sin salidas" description="No hay registros de salidas." />}
              </AnimatedTabPanel>
            </TabPanel>

            <TabPanel>
              <AnimatedTabPanel>
                {IssuesLoading ? <Spinner label="Cargando problemas..." /> : IssuesData?.length ? (
                  <IssueTable issues={IssuesData} onSelected={setSelectedIssue} />
                ) : <EmptyState title="Sin problemas" description="No hay registros de problemas." />}
              </AnimatedTabPanel>
            </TabPanel>

            <TabPanel>
              <AnimatedTabPanel>
                {CrashesLoading ? <Spinner label="Cargando accidentes..." /> : CrashesData?.length ? (
                  <CrashTable crashes={CrashesData} onSelected={setSelectedIssue} />
                ) : <EmptyState title="Sin accidentes" description="No hay reportes de accidentes." />}
              </AnimatedTabPanel>
            </TabPanel>

            <TabPanel>
              <AnimatedTabPanel>
                {RemindersLoading ? <Spinner label="Cargando recordatorios..." /> : (
                  <>
                    <Button size="sm" onClick={() => setShowAddReminder(true)} className="mb-3">
                      <FaPlus size={12} /> Añadir recordatorio
                    </Button>
                    {showAddReminder && (
                      <AddReminder onClose={() => setShowAddReminder(false)} CarId={id} OnAdded={() => setRefreshReminders((v) => !v)} />
                    )}
                    {RemindersData?.length ? <ReminderList items={RemindersData} /> : <EmptyState title="Sin recordatorios" description="No hay recordatorios para este vehículo." />}
                  </>
                )}
              </AnimatedTabPanel>
            </TabPanel>

            <TabPanel>
              <AnimatedTabPanel>
                {FilesLoading ? <Spinner label="Cargando archivos..." /> : (
                  <>
                    <FileUpload CarId={id} OnUploaded={() => setRefreshFiles((v) => !v)} />
                    <div className="mt-3">
                      {FilesData?.length ? <FileTable items={FilesData} /> : <EmptyState title="Sin archivos" description="No hay archivos asociados al vehículo." />}
                    </div>
                  </>
                )}
              </AnimatedTabPanel>
            </TabPanel>

            <TabPanel>
              <AnimatedTabPanel>
                <Button size="sm" onClick={() => setShowAddService(true)} className="mb-3">
                  <FaPlus size={12} /> Agregar servicio
                </Button>
                {showAddService && (
                  <AddService OnCloseForm={setShowAddService} carId={id} OnAdded={() => setRefreshServices((v) => !v)} />
                )}
                <div className="mt-3">
                  {ServicesData?.length ? <ServiceTable items={ServicesData} /> : <EmptyState title="Sin servicios" description="No hay servicios registrados." />}
                </div>
              </AnimatedTabPanel>
            </TabPanel>
          </Tabs>
        </Card>
      )}

      {selectedEntry && <SideBarEntry entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
      {selectedIssue && <SideBarIssue issue={selectedIssue} onClose={() => setSelectedIssue(null)} />}
    </motion.div>
  );
};

export default CarView;

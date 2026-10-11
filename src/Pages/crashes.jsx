import ReportSearchPage from "../Components/organisms/ReportSearchPage";
import { crashesService } from "../services/reportServices";
import CrashTable from "../Components/Crash/CrashTable";
import SideBarCrash from "../Components/Crash/SideBarCrash";

const Crashes = () => (
  <ReportSearchPage
    title="Reporte de Accidentes"
    description="Colisiones e incidentes registrados en los vehículos. Usa los filtros para acotar la búsqueda."
    service={crashesService}
    noun="accidente"
    renderTable={(rows, setSelected) => <CrashTable crashes={rows} onSelected={setSelected} />}
    renderSidebar={(selected, clear) => <SideBarCrash crash={selected} onClose={clear} />}
  />
);

export default Crashes;

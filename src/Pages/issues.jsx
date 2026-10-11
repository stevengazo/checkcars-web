import ReportSearchPage from "../Components/organisms/ReportSearchPage";
import { issuesService } from "../services/reportServices";
import IssueTable from "../Components/Issue/IssueTable";
import SideBarIssue from "../Components/Issue/SidebarIssue";

const Issues = () => (
  <ReportSearchPage
    title="Reporte de Averías"
    description="Averías e incidencias reportadas en los vehículos. Usa los filtros para acotar la búsqueda."
    service={issuesService}
    noun="avería"
    renderTable={(rows, setSelected) => <IssueTable issues={rows} onSelected={setSelected} />}
    renderSidebar={(selected, clear) => <SideBarIssue issue={selected} onClose={clear} />}
  />
);

export default Issues;

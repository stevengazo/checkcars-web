import DynamicReportPage from "../Components/organisms/DynamicReportPage";

const Returns = () => (
  <DynamicReportPage
    type="Entry"
    title="Reporte de Entregas"
    description="Registros de entrada/entrega de vehículos. El formulario se configura en Configuración → Formularios."
    noun="entrega"
  />
);

export default Returns;

import DynamicReportPage from "../Components/organisms/DynamicReportPage";

const Exits = () => (
  <DynamicReportPage
    type="Exit"
    title="Reporte de Salidas"
    description="Registros de salida de vehículos. El formulario se configura en Configuración → Formularios."
    noun="salida"
  />
);

export default Exits;

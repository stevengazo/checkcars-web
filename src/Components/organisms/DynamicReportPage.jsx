import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { FiSearch, FiX } from "react-icons/fi";

import dynamicReportsService from "../../services/dynamicReportsService";
import useApi from "../../Hook/useApi";
import PageHeader from "../templates/PageHeader";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";
import Alert from "../atoms/Alert";
import FormField from "../molecules/FormField";
import EmptyState from "../molecules/EmptyState";
import Modal from "../molecules/Modal";
import DynamicForm from "./DynamicForm";
import DynamicReportTable from "./DynamicReportTable";
import DynamicReportSidebar from "./DynamicReportSidebar";

/** Página de reportes dinámicos para un tipo ("Exit"|"Entry"). */
const DynamicReportPage = ({ type, title, description, noun = "registro" }) => {
  const { data, loading, error, refetch } = useApi(() => dynamicReportsService.search({ type }), { deps: [type] });
  const [filters, setFilters] = useState({ plate: "", author: "", date: "" });
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const list = data || [];
  const hasFilters = filters.plate || filters.author || filters.date;
  const onChange = (e) => setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  const [override, setOverride] = useState(null);
  const rows = override ?? list;
  const applyFilters = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      setOverride(await dynamicReportsService.search({ type, ...filters }));
    } catch {
      toast.error("No se pudo buscar.");
    } finally {
      setSearching(false);
    }
  };
  const clear = () => { setFilters({ plate: "", author: "", date: "" }); setOverride(null); };

  const onAdded = () => { setAddOpen(false); setOverride(null); refetch(); };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PageHeader title={title} action={<Button onClick={() => setAddOpen(true)}><FaPlus size={13} /> Nuevo</Button>} />
      {description && <p className="text-sm text-gray-500">{description}</p>}

      <Card padding="p-4">
        <form onSubmit={applyFilters} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <FormField id="plate" label="Placa" name="plate" value={filters.plate} onChange={onChange} placeholder="Ej. CRC-1001" />
          <FormField id="author" label="Autor" name="author" value={filters.author} onChange={onChange} placeholder="Nombre" />
          <FormField id="date" label="Fecha" name="date" type="date" value={filters.date} onChange={onChange} />
          <div className="flex items-end gap-2">
            <Button type="submit" loading={searching} className="flex-1"><FiSearch /> Buscar</Button>
            {(hasFilters || override) && <Button type="button" variant="secondary" onClick={clear}><FiX /></Button>}
          </div>
        </form>
      </Card>

      {error && <Alert tone="error">No se pudieron cargar los registros: {error}</Alert>}

      {loading ? (
        <Spinner label="Cargando..." />
      ) : rows.length > 0 ? (
        <Card padding="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Registros</h3>
            <span className="text-sm text-gray-400">{rows.length} {noun}(s)</span>
          </div>
          <DynamicReportTable reports={rows} onSelected={setSelected} />
        </Card>
      ) : (
        !error && <EmptyState title="Sin registros" description={hasFilters ? "Nada coincide con los filtros." : `Aún no hay ${noun}s.`} />
      )}

      {selected && <DynamicReportSidebar report={selected} onClose={() => setSelected(null)} />}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`Nuevo — ${title}`} maxWidth="max-w-2xl">
        <DynamicForm type={type} onSuccess={onAdded} onCancel={() => setAddOpen(false)} />
      </Modal>
    </motion.div>
  );
};

export default DynamicReportPage;

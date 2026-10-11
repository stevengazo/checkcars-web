import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiSearch, FiX } from "react-icons/fi";

import useApi from "../../Hook/useApi";
import PageHeader from "../templates/PageHeader";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";
import Alert from "../atoms/Alert";
import FormField from "../molecules/FormField";
import EmptyState from "../molecules/EmptyState";

/**
 * Página genérica de reportes con filtros (placa/autor/fecha) + tabla + sidebar de detalle.
 *
 * @param {string}   title         Título de la página.
 * @param {string}   description   Texto descriptivo.
 * @param {object}   service       Servicio con all() y search(filters).
 * @param {Function} renderTable   (rows, setSelected) => JSX de la tabla.
 * @param {Function} renderSidebar (selected, clear) => JSX del sidebar (o null).
 * @param {string}   noun          Palabra para el conteo (p. ej. "avería").
 * @param {ReactNode} action       Acción opcional a la derecha del header.
 */
const ReportSearchPage = ({ title, description, service, renderTable, renderSidebar, noun = "registro", action }) => {
  const { data, loading, error } = useApi(() => service.all());
  const [overrideData, setOverrideData] = useState(null);
  const [filters, setFilters] = useState({ plate: "", author: "", date: "" });
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);

  const list = overrideData ?? (data || []);
  const hasFilters = filters.plate || filters.author || filters.date;

  const handleChange = (e) => setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSearch = async (e) => {
    e?.preventDefault();
    setSearching(true);
    try {
      setOverrideData(await service.search(filters));
    } catch {
      toast.error("No se pudo realizar la búsqueda.");
    } finally {
      setSearching(false);
    }
  };

  const clearFilters = () => {
    setFilters({ plate: "", author: "", date: "" });
    setOverrideData(null);
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PageHeader title={title} action={action} />
      {description && <p className="text-sm text-gray-500">{description}</p>}

      <Card padding="p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <FormField id="plate" label="Placa" name="plate" value={filters.plate} onChange={handleChange} placeholder="Ej. CRC-1001" />
          <FormField id="author" label="Autor" name="author" value={filters.author} onChange={handleChange} placeholder="Nombre" />
          <FormField id="date" label="Fecha" name="date" type="date" value={filters.date} onChange={handleChange} />
          <div className="flex items-end gap-2">
            <Button type="submit" loading={searching} className="flex-1">
              <FiSearch /> Buscar
            </Button>
            {(hasFilters || overrideData) && (
              <Button type="button" variant="secondary" onClick={clearFilters} title="Limpiar">
                <FiX />
              </Button>
            )}
          </div>
        </form>
      </Card>

      {error && <Alert tone="error">No se pudieron cargar los registros: {error}</Alert>}

      {loading ? (
        <Spinner label="Cargando..." />
      ) : list.length > 0 ? (
        <Card padding="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Registros</h3>
            <span className="text-sm text-gray-400">{list.length} {noun}(s)</span>
          </div>
          {renderTable(list, setSelected)}
        </Card>
      ) : (
        !error && <EmptyState title="Sin registros" description={hasFilters ? "Nada coincide con los filtros." : `Aún no hay ${noun}s registrados.`} />
      )}

      {selected && renderSidebar?.(selected, () => setSelected(null))}
    </motion.div>
  );
};

export default ReportSearchPage;

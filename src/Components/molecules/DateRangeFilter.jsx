import { useState } from "react";
import { FiCalendar, FiX } from "react-icons/fi";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

/**
 * Filtro de rango de fechas. Llama onApply(start, end) al aplicar y onClear() al limpiar.
 * @param {boolean} active  Si hay un rango aplicado (muestra el botón limpiar).
 * @param {boolean} loading Estado de carga del consumidor.
 */
const DateRangeFilter = ({ onApply, onClear, active = false, loading = false }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const canApply = start && end && start <= end;

  const handleApply = (e) => {
    e.preventDefault();
    if (canApply) onApply(start, end);
  };

  const handleClear = () => {
    setStart("");
    setEnd("");
    onClear();
  };

  return (
    <form
      onSubmit={handleApply}
      className="flex flex-wrap items-end gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
    >
      <div className="flex items-center gap-1 text-gray-500">
        <FiCalendar />
        <span className="text-sm font-medium">Rango</span>
      </div>
      <div className="flex flex-col">
        <label htmlFor="range-start" className="mb-0.5 text-xs text-gray-500">Desde</label>
        <Input id="range-start" type="date" value={start} max={end || undefined} onChange={(e) => setStart(e.target.value)} className="py-1.5" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="range-end" className="mb-0.5 text-xs text-gray-500">Hasta</label>
        <Input id="range-end" type="date" value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} className="py-1.5" />
      </div>
      <Button type="submit" size="sm" disabled={!canApply} loading={loading}>
        Filtrar
      </Button>
      {active && (
        <Button type="button" variant="secondary" size="sm" onClick={handleClear}>
          <FiX /> Limpiar
        </Button>
      )}
    </form>
  );
};

export default DateRangeFilter;

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FiUploadCloud } from "react-icons/fi";
import formDefinitionsService from "../../services/formDefinitionsService";
import dynamicReportsService from "../../services/dynamicReportsService";
import useApi from "../../Hook/useApi";
import Spinner from "../atoms/Spinner";
import Alert from "../atoms/Alert";
import Button from "../atoms/Button";
import Label from "../atoms/Label";
import FormField from "../molecules/FormField";

const inputClass =
  "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500";

const defaultValue = (f) => (f.type === "checkbox" ? false : f.type === "range" ? f.min ?? 0 : "");

/**
 * Renderiza y envía un formulario dinámico según la definición activa del tipo.
 * @param {"Exit"|"Entry"} type
 */
const DynamicForm = ({ type, carId, onSuccess, onCancel }) => {
  const { data: def, loading, error } = useApi(() => formDefinitionsService.getByType(type), { deps: [type] });

  const fields = useMemo(() => [...(def?.fields || [])].sort((a, b) => (a.order || 0) - (b.order || 0)), [def]);
  const slots = useMemo(() => [...(def?.photoSlots || [])].sort((a, b) => (a.order || 0) - (b.order || 0)), [def]);

  const [values, setValues] = useState({});
  const [photos, setPhotos] = useState({}); // { slotKey: File[] }
  const [saving, setSaving] = useState(false);
  const [serverErr, setServerErr] = useState(null);

  // Inicializa valores cuando llega la definición.
  const initialized = useMemo(() => {
    if (def && Object.keys(values).length === 0 && fields.length) {
      const init = {};
      fields.forEach((f) => (init[f.key] = defaultValue(f)));
      setValues(init);
    }
    return true;
  }, [def]); // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (key, v) => setValues((prev) => ({ ...prev, [key]: v }));
  const setSlotFiles = (key, files) => setPhotos((prev) => ({ ...prev, [key]: Array.from(files) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErr(null);
    // Validación cliente de requeridos.
    const missing = fields.filter((f) => f.required && (values[f.key] === "" || values[f.key] == null));
    const missingPhotos = slots.filter((s) => s.required && !(photos[s.key]?.length));
    if (missing.length || missingPhotos.length) {
      toast.error("Faltan campos o fotos obligatorios.");
      setServerErr({ missingFields: missing.map((f) => f.label), missingPhotos: missingPhotos.map((s) => s.label) });
      return;
    }
    setSaving(true);
    try {
      await dynamicReportsService.create(type, values, photos, carId);
      toast.success("Reporte guardado correctamente.");
      onSuccess?.();
    } catch (err) {
      const d = err?.data;
      if (d?.missingFields || d?.missingPhotos) setServerErr(d);
      toast.error(err?.message || "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Cargando formulario..." />;
  if (error || !def)
    return <Alert tone="warning">No hay un formulario configurado para este tipo. Créalo en Configuración → Formularios.</Alert>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const common = { id: f.key, label: f.label, required: f.required, value: values[f.key] ?? "", onChange: (e) => setField(f.key, e.target.value) };
          if (f.type === "select") {
            return (
              <div key={f.key}>
                <Label htmlFor={f.key} required={f.required} className="mb-1">{f.label}</Label>
                <select id={f.key} className={inputClass} value={values[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)}>
                  <option value="">Seleccione…</option>
                  {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            );
          }
          if (f.type === "checkbox") {
            return (
              <label key={f.key} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${values[f.key] ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                <input type="checkbox" checked={!!values[f.key]} onChange={(e) => setField(f.key, e.target.checked)} className="h-4 w-4 rounded accent-blue-600" />
                {f.label}
              </label>
            );
          }
          if (f.type === "range") {
            return (
              <div key={f.key} className="sm:col-span-2">
                <Label htmlFor={f.key} className="mb-1">{f.label} — <span className="font-semibold text-blue-600">{values[f.key] ?? f.min ?? 0}</span></Label>
                <input type="range" min={f.min ?? 0} max={f.max ?? 100} value={values[f.key] ?? f.min ?? 0} onChange={(e) => setField(f.key, e.target.value)} className="w-full accent-blue-600" />
              </div>
            );
          }
          if (f.type === "textarea") {
            return (
              <div key={f.key} className="sm:col-span-2">
                <Label htmlFor={f.key} required={f.required} className="mb-1">{f.label}</Label>
                <textarea id={f.key} rows={3} className={inputClass} value={values[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} />
              </div>
            );
          }
          // text | number | date
          return <FormField key={f.key} type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} {...common} />;
        })}
      </div>

      {slots.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">Fotos</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {slots.map((s) => (
              <div key={s.key}>
                <Label className="mb-1" required={s.required}>{s.label}</Label>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-center text-xs text-gray-500 transition hover:bg-gray-100">
                  <FiUploadCloud size={20} />
                  <span>{photos[s.key]?.length ? `${photos[s.key].length} archivo(s)` : "Elegir imagen"}</span>
                  <input type="file" accept="image/*" multiple={s.multiple} className="hidden" onChange={(e) => setSlotFiles(s.key, e.target.files)} />
                </label>
                {photos[s.key]?.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto">
                    {photos[s.key].map((file, i) => (
                      <img key={i} src={URL.createObjectURL(file)} alt="" className="h-16 w-16 shrink-0 rounded border border-gray-200 object-cover" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {serverErr && (
        <Alert tone="error">
          Faltan: {[...(serverErr.missingFields || []), ...(serverErr.missingPhotos || [])].join(", ")}
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && <Button variant="secondary" onClick={onCancel} disabled={saving}>Cancelar</Button>}
        <Button type="submit" loading={saving}>Guardar</Button>
      </div>
    </form>
  );
};

export default DynamicForm;

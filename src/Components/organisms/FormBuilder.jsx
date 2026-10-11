import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa6";
import formDefinitionsService from "../../services/formDefinitionsService";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";

const FIELD_TYPES = [
  ["text", "Texto"], ["number", "Número"], ["textarea", "Texto largo"],
  ["select", "Selección"], ["checkbox", "Sí/No"], ["range", "Rango"], ["date", "Fecha"],
];

const slug = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
const inputClass = "rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500";

const move = (arr, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy.map((x, idx) => ({ ...x, order: idx + 1 }));
};

const FormBuilder = () => {
  const [type, setType] = useState("Exit");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [fields, setFields] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    setLoading(true);
    formDefinitionsService
      .getByType(type)
      .then((def) => {
        setName(def?.name || (type === "Exit" ? "Salida" : "Entrada"));
        setFields([...(def?.fields || [])].sort((a, b) => (a.order || 0) - (b.order || 0)));
        setSlots([...(def?.photoSlots || [])].sort((a, b) => (a.order || 0) - (b.order || 0)));
      })
      .catch(() => { setFields([]); setSlots([]); })
      .finally(() => setLoading(false));
  }, [type]);

  const addField = () => setFields((f) => [...f, { key: "", label: "", type: "text", required: false, order: f.length + 1, options: [] }]);
  const updateField = (i, patch) => setFields((f) => f.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const removeField = (i) => setFields((f) => f.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, order: idx + 1 })));

  const addSlot = () => setSlots((s) => [...s, { key: "", label: "", required: false, multiple: false, order: s.length + 1 }]);
  const updateSlot = (i, patch) => setSlots((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const removeSlot = (i) => setSlots((s) => s.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, order: idx + 1 })));

  const handleSave = async () => {
    // Normaliza claves vacías a partir de la etiqueta.
    const fx = fields.map((f, i) => ({ ...f, key: f.key || slug(f.label) || `field_${i + 1}`, order: i + 1, options: f.type === "select" ? (f.options || []) : null }));
    const sx = slots.map((s, i) => ({ ...s, key: s.key || slug(s.label) || `photo_${i + 1}`, order: i + 1 }));
    if (fx.some((f) => !f.label)) { toast.error("Cada campo necesita una etiqueta."); return; }
    setSaving(true);
    try {
      await formDefinitionsService.save({ type, name, fields: fx, photoSlots: sx });
      toast.success("Formulario guardado.");
      setFields(fx);
      setSlots(sx);
    } catch (err) {
      toast.error(err?.message || "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Selector de tipo */}
      <div className="flex items-center gap-2">
        {[["Exit", "Salidas"], ["Entry", "Entradas"]].map(([val, lbl]) => (
          <button key={val} onClick={() => setType(val)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${type === val ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {lbl}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">Configura los campos y fotos del formulario de {type === "Exit" ? "salida" : "entrada"}.</span>
      </div>

      {loading ? (
        <Spinner label="Cargando definición..." />
      ) : (
        <>
          {/* Campos */}
          <Card padding="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Campos</h4>
              <Button size="sm" variant="outline" onClick={addField}><FaPlus size={11} /> Campo</Button>
            </div>
            <div className="space-y-2">
              {fields.length === 0 && <p className="text-sm text-gray-400">Sin campos. Agrega el primero.</p>}
              {fields.map((f, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2">
                  <input className={`${inputClass} flex-1 min-w-[140px]`} placeholder="Etiqueta" value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} />
                  <select className={inputClass} value={f.type} onChange={(e) => updateField(i, { type: e.target.value })}>
                    {FIELD_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  {f.type === "select" && (
                    <input className={`${inputClass} flex-1 min-w-[160px]`} placeholder="Opciones (coma)" value={(f.options || []).join(", ")} onChange={(e) => updateField(i, { options: e.target.value.split(",").map((o) => o.trim()).filter(Boolean) })} />
                  )}
                  <label className="flex items-center gap-1 text-xs text-gray-600">
                    <input type="checkbox" checked={f.required} onChange={(e) => updateField(i, { required: e.target.checked })} className="accent-blue-600" /> Obligatorio
                  </label>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setFields(move(fields, i, -1))} className="rounded p-1 text-gray-400 hover:bg-gray-200"><FaArrowUp size={11} /></button>
                    <button onClick={() => setFields(move(fields, i, 1))} className="rounded p-1 text-gray-400 hover:bg-gray-200"><FaArrowDown size={11} /></button>
                    <button onClick={() => removeField(i)} className="rounded p-1 text-red-400 hover:bg-red-50"><FaTrash size={11} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Slots de foto */}
          <Card padding="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Fotos requeridas</h4>
              <Button size="sm" variant="outline" onClick={addSlot}><FaPlus size={11} /> Foto</Button>
            </div>
            <div className="space-y-2">
              {slots.length === 0 && <p className="text-sm text-gray-400">Sin fotos configuradas.</p>}
              {slots.map((s, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2">
                  <input className={`${inputClass} flex-1 min-w-[140px]`} placeholder="Etiqueta (ej. Frontal)" value={s.label} onChange={(e) => updateSlot(i, { label: e.target.value })} />
                  <label className="flex items-center gap-1 text-xs text-gray-600">
                    <input type="checkbox" checked={s.required} onChange={(e) => updateSlot(i, { required: e.target.checked })} className="accent-blue-600" /> Obligatoria
                  </label>
                  <label className="flex items-center gap-1 text-xs text-gray-600">
                    <input type="checkbox" checked={s.multiple} onChange={(e) => updateSlot(i, { multiple: e.target.checked })} className="accent-blue-600" /> Múltiples
                  </label>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSlots(move(slots, i, -1))} className="rounded p-1 text-gray-400 hover:bg-gray-200"><FaArrowUp size={11} /></button>
                    <button onClick={() => setSlots(move(slots, i, 1))} className="rounded p-1 text-gray-400 hover:bg-gray-200"><FaArrowDown size={11} /></button>
                    <button onClick={() => removeSlot(i)} className="rounded p-1 text-red-400 hover:bg-red-50"><FaTrash size={11} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} loading={saving}>Guardar formulario</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FormBuilder;

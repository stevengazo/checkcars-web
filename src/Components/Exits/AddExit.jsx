import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi";

const AddExit = ({ OnHandleClose }) => {
  const [form, setForm] = useState({
    carPlate: "",
    author: "",
    mileage: "",
    exitDate: new Date().toISOString().slice(0, 16),
    fuelLevel: 50,
    oilLevel: "Lleno",
    paintState: "Bueno",
    tiresState: "Bueno",
    mecanicState: "Bueno",
    interiorsState: "Bueno",
    hasSpareTire: false,
    hasChargerUSB: false,
    hasQuickPass: false,
    hasPhoneSupport: false,
    hasEmergencyKit: false,
    notes: "",
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => OnHandleClose(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => payload.append(k, v));
      images.forEach((img) => payload.append("photos", img));
      // NOTA: envío simulado — pendiente de conectar al endpoint real de EntryExitReports.
      setTimeout(() => {
        setSubmitting(false);
        setMessage("Salida registrada correctamente.");
        setImages([]);
      }, 800);
    } catch {
      setMessage("Error al registrar salida.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Registrar Salida</h2>
            <p className="text-xs text-gray-400">Inspección del vehículo al momento de la salida</p>
          </div>
          <button onClick={handleClose} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100" aria-label="Cerrar">
            <IoClose size={20} />
          </button>
        </header>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <Section title="Identificación">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Placa" name="carPlate" value={form.carPlate} onChange={handleChange} required />
              <Input label="Autor" name="author" value={form.author} onChange={handleChange} required />
              <Input label="Kilometraje" name="mileage" type="number" value={form.mileage} onChange={handleChange} required />
              <Input label="Fecha de salida" name="exitDate" type="datetime-local" value={form.exitDate} onChange={handleChange} />
            </div>
          </Section>

          <Section title="Estado del vehículo">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nivel de combustible — <span className="font-semibold text-blue-600">{form.fuelLevel}%</span>
                </label>
                <input type="range" name="fuelLevel" min={0} max={100} value={form.fuelLevel} onChange={handleChange} className="w-full accent-blue-600" />
              </div>
              <Select label="Nivel de aceite" name="oilLevel" value={form.oilLevel} onChange={handleChange} options={["Lleno", "Medio", "Bajo", "Vacío"]} />
              <Select label="Estado de pintura" name="paintState" value={form.paintState} onChange={handleChange} />
              <Select label="Estado neumáticos" name="tiresState" value={form.tiresState} onChange={handleChange} />
              <Select label="Estado mecánico" name="mecanicState" value={form.mecanicState} onChange={handleChange} />
              <Select label="Estado interiores" name="interiorsState" value={form.interiorsState} onChange={handleChange} />
            </div>
          </Section>

          <Section title="Equipamiento">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Toggle label="Llanta de repuesto" name="hasSpareTire" checked={form.hasSpareTire} onChange={handleChange} />
              <Toggle label="Cargador USB" name="hasChargerUSB" checked={form.hasChargerUSB} onChange={handleChange} />
              <Toggle label="Quick Pass" name="hasQuickPass" checked={form.hasQuickPass} onChange={handleChange} />
              <Toggle label="Soporte para teléfono" name="hasPhoneSupport" checked={form.hasPhoneSupport} onChange={handleChange} />
              <Toggle label="Kit de emergencia" name="hasEmergencyKit" checked={form.hasEmergencyKit} onChange={handleChange} />
            </div>
          </Section>

          <Section title="Observaciones">
            <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder="Notas adicionales sobre la salida"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
          </Section>

          <Section title="Fotos (opcional)">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 transition hover:bg-gray-100">
              <FiUploadCloud size={24} />
              <span>Arrastra o haz clic para elegir imágenes</span>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((img, idx) => (
                  <img key={idx} src={URL.createObjectURL(img)} alt={`preview-${idx}`} className="h-24 w-full rounded-lg border border-gray-200 object-cover" />
                ))}
              </div>
            )}
          </Section>
        </form>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-6 py-3">
          {message ? <p className="text-sm text-green-600">{message}</p> : <span className="text-xs text-gray-400">Los campos con * son obligatorios</span>}
          <div className="flex gap-2">
            <button type="button" onClick={handleClose} className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} onClick={handleSubmit}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60">
              {submitting ? "Guardando..." : "Guardar salida"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

/* ---- Subcomponentes de UI ---- */
const Section = ({ title, children }) => (
  <section>
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">{title}</h3>
    {children}
  </section>
);

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500";

const Input = ({ label, name, type = "text", ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input type={type} id={name} name={name} className={inputClass} {...props} />
  </div>
);

const Select = ({ label, name, value, onChange, options = ["Bueno", "Regular", "Malo"] }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <select id={name} name={name} value={value} onChange={onChange} className={inputClass}>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label, name, checked, onChange }) => (
  <label className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${checked ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600" />
    {label}
  </label>
);

export default AddExit;

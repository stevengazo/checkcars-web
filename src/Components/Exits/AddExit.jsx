import { useState } from "react";

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

  const handleClose = () => {
    OnHandleClose(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value);
      });

      images.forEach((img) => {
        payload.append("photos", img);
      });

      // Simula envío (reemplaza por llamada real con fetch/axios)
      console.log("Formulario:", form);
      console.log("Fotos:", images);

      setTimeout(() => {
        setSubmitting(false);
        setMessage("Salida registrada correctamente.");
        setImages([]);
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage("Error al registrar salida.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Registrar Salida</h2>
        <button
          onClick={handleClose}
          className="text-red-600 font-medium hover:underline text-sm"
        >
          Cerrar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl w-full mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Placa" name="carPlate" value={form.carPlate} onChange={handleChange} required />
          <Input label="Autor" name="author" value={form.author} onChange={handleChange} required />
          <Input label="Kilometraje" name="mileage" type="number" value={form.mileage} onChange={handleChange} required />
          <Input label="Fecha de salida" name="exitDate" type="datetime-local" value={form.exitDate} onChange={handleChange} />

          <div>
            <label className="block font-medium text-sm text-gray-700">Nivel de combustible (%)</label>
            <input
              type="range"
              name="fuelLevel"
              min={0}
              max={100}
              value={form.fuelLevel}
              onChange={handleChange}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{form.fuelLevel}%</span>
          </div>

          <Select label="Nivel de aceite" name="oilLevel" value={form.oilLevel} onChange={handleChange} options={["Lleno", "Medio", "Bajo", "Vacío"]} />
          <Select label="Estado de pintura" name="paintState" value={form.paintState} onChange={handleChange} />
          <Select label="Estado neumáticos" name="tiresState" value={form.tiresState} onChange={handleChange} />
          <Select label="Estado mecánico" name="mecanicState" value={form.mecanicState} onChange={handleChange} />
          <Select label="Estado interiores" name="interiorsState" value={form.interiorsState} onChange={handleChange} />

          <Checkbox label="¿Llanta de repuesto?" name="hasSpareTire" checked={form.hasSpareTire} onChange={handleChange} />
          <Checkbox label="¿Cargador USB?" name="hasChargerUSB" checked={form.hasChargerUSB} onChange={handleChange} />
          <Checkbox label="¿Quick Pass?" name="hasQuickPass" checked={form.hasQuickPass} onChange={handleChange} />
          <Checkbox label="¿Soporte para teléfono?" name="hasPhoneSupport" checked={form.hasPhoneSupport} onChange={handleChange} />
          <Checkbox label="¿Kit de emergencia?" name="hasEmergencyKit" checked={form.hasEmergencyKit} onChange={handleChange} />
        </div>

        <Textarea label="Observaciones" name="notes" value={form.notes} onChange={handleChange} />

        {/* Campo de fotos */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">Fotos (opcional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${idx}`}
                  className="w-full h-32 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            {submitting ? "Guardando..." : "Guardar salida"}
          </button>
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>
      </form>
    </div>
  );
};

// Subcomponentes
const Input = ({ label, name, type = "text", ...props }) => (
  <div>
    <label htmlFor={name} className="block font-medium text-sm text-gray-700">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  </div>
);

const Textarea = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block font-medium text-sm text-gray-700">{label}</label>
    <textarea
      id={name}
      name={name}
      rows={3}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  </div>
);

const Select = ({ label, name, value, onChange, options = ["Bueno", "Regular", "Malo"] }) => (
  <div>
    <label htmlFor={name} className="block font-medium text-sm text-gray-700">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const Checkbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center space-x-2">
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
    />
    <label htmlFor={name} className="text-sm text-gray-700">{label}</label>
  </div>
);

export default AddExit;

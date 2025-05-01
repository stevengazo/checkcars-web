import { useState, useContext } from "react";
import SettingsContext from "../Context/SettingsContext";

const CarEdit = ({ CarEdit }) => {
  const car = CarEdit;
  const { API_URL } = useContext(SettingsContext);

  const [formData, setFormData] = useState({ ...car });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/Cars/${car.carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar el vehículo");

      setMessage("✅ Vehículo actualizado correctamente.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Hubo un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, type = "text" }) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Editar Vehículo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Marca" name="brand" />
        <Field label="Modelo" name="model" />
        <Field label="Tipo" name="type" />
        <Field label="Placa" name="plate" />
        <Field label="Color" name="color" />
        <Field label="Combustible" name="fueltype" />
        <Field label="VIN" name="vin" />
        <div className="md:col-span-2">
          <Field label="Notas" name="notes" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Actualizar Vehículo"}
        </button>
        {message && (
          <span className="text-sm text-gray-600">{message}</span>
        )}
      </div>
    </div>
  );
};

export default CarEdit;

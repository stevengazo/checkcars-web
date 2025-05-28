import { useState, useContext } from "react";
import SettingsContext from "../../Context/SettingsContext";

const CarEdit = ({ car }) => {
  const { API_URL } = useContext(SettingsContext);

  console.log("CarEdit component rendered with car:", car);
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

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Editar Vehículo</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="brand" className="font-medium text-gray-700">
                Marca:
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="model" className="font-medium text-gray-700">
                Modelo:
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="type" className="font-medium text-gray-700">
                Tipo de Vehículo:
              </label>
              <select
                id="type"
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Seleccione un tipo</option>
                <option value="sedan">Sedán</option>
                <option value="suv">SUV</option>
                <option value="pickup">Pickup</option>
                <option value="coupe">Coupé</option>
                <option value="hatchback">Hatchback</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="plate" className="font-medium text-gray-700">
                Placa:
              </label>
              <input
                type="text"
                id="plate"
                name="plate"
                value={formData.plate || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="color" className="font-medium text-gray-700">
                Color:
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="fueltype" className="font-medium text-gray-700">
                Tipo de Combustible:
              </label>
              <select
                id="fueltype"
                name="fueltype"
                value={formData.fueltype || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Seleccione un tipo de combustible</option>
                <option value="gasolina">Gasolina</option>
                <option value="diesel">Diésel</option>
                <option value="electric">Eléctrico</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="vin" className="font-medium text-gray-700">
                VIN:
              </label>
              <input
                type="text"
                id="vin"
                name="vin"
                value={formData.vin || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="width" className="font-medium text-gray-700">
                Width:
              </label>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.width || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="weight" className="font-medium text-gray-700">
                Weight:
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="height" className="font-medium text-gray-700">
                Height:
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="lenght" className="font-medium text-gray-700">
                Length:
              </label>
              <input
                type="number"
                id="lenght"
                name="lenght"
                value={formData.lenght || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="notes" className="font-medium text-gray-700">
                Notas:
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                rows="4"
                className="border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="submit"
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
      </form>
    </div>
  );
};

export default CarEdit;

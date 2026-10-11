import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { FiUploadCloud } from "react-icons/fi";
import carsService, { carImageUrl } from "../../services/carsService";
import FormField from "../molecules/FormField";
import Label from "../atoms/Label";
import Button from "../atoms/Button";
import { ApiError } from "../../services/httpClient";

const TYPE_OPTIONS = [
  { value: "sedan", label: "Sedán" },
  { value: "suv", label: "SUV" },
  { value: "pickup", label: "Pickup" },
  { value: "coupe", label: "Coupé" },
  { value: "hatchback", label: "Hatchback" },
];

const FUEL_OPTIONS = [
  { value: "gasolina", label: "Gasolina" },
  { value: "diesel", label: "Diésel" },
  { value: "electric", label: "Eléctrico" },
  { value: "hibrido", label: "Híbrido" },
];

const selectClass =
  "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500";

const emptyCar = () => ({
  carId: uuidv4(),
  brand: "",
  model: "",
  type: "",
  plate: "",
  color: "",
  fuelType: "",
  vin: "",
  year: "",
  adquisitionDate: "",
  width: "",
  height: "",
  lenght: "",
  weight: "",
  notes: "",
});

/**
 * Formulario unificado de vehículo (crear/editar).
 * @param {object|null} car       Vehículo a editar; null para crear.
 * @param {Function}    onSuccess Callback tras guardar correctamente.
 * @param {Function}    onCancel  Callback para cerrar sin guardar.
 */
const CarForm = ({ car = null, onSuccess, onCancel }) => {
  const isEdit = Boolean(car);
  const [form, setForm] = useState(() => (isEdit ? { ...emptyCar(), ...car } : emptyCar()));
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(() => (isEdit ? carImageUrl(car?.imagePath) : null));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      if (isEdit) {
        await carsService.update(form.carId, form);
      } else {
        await carsService.create(form);
      }
      // Sube la imagen (si se seleccionó) una vez el vehículo existe.
      if (imageFile) {
        try {
          await carsService.uploadImage(form.carId, imageFile);
        } catch {
          toast.warn("El vehículo se guardó, pero la imagen no se pudo subir.");
        }
      }
      toast.success(isEdit ? "Vehículo actualizado correctamente." : "Vehículo agregado correctamente.");
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "No se pudo guardar el vehículo.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Imagen del vehículo */}
      <div>
        <Label className="mb-1">Imagen del vehículo</Label>
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
            {preview ? (
              <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-gray-400">Sin imagen</span>
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
            <FiUploadCloud />
            {preview ? "Cambiar imagen" : "Subir imagen"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="brand" label="Marca" value={form.brand} onChange={handleChange} required placeholder="Marca" />
        <FormField id="model" label="Modelo" value={form.model} onChange={handleChange} required placeholder="Modelo" />

        <div>
          <Label htmlFor="type" className="mb-1">Tipo de Vehículo</Label>
          <select id="type" name="type" value={form.type} onChange={handleChange} className={selectClass}>
            <option value="">Seleccione un tipo</option>
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="fuelType" className="mb-1">Tipo de Combustible</Label>
          <select id="fuelType" name="fuelType" value={form.fuelType} onChange={handleChange} className={selectClass}>
            <option value="">Seleccione un combustible</option>
            {FUEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <FormField id="plate" label="Placa" value={form.plate} onChange={handleChange} placeholder="Número de placa" />
        <FormField id="color" label="Color" value={form.color} onChange={handleChange} placeholder="Color" />
        <FormField id="vin" label="VIN" value={form.vin} onChange={handleChange} placeholder="VIN" />
        <FormField id="year" label="Año" type="number" value={form.year} onChange={handleChange} placeholder="Año" />
        <FormField id="adquisitionDate" label="Fecha de Adquisición" type="date" value={form.adquisitionDate?.slice?.(0, 10) || ""} onChange={handleChange} />
        <FormField id="width" label="Ancho" type="number" value={form.width} onChange={handleChange} />
        <FormField id="height" label="Alto" type="number" value={form.height} onChange={handleChange} />
        <FormField id="lenght" label="Largo" type="number" value={form.lenght} onChange={handleChange} />
        <FormField id="weight" label="Peso" type="number" value={form.weight} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="notes" className="mb-1">Notas</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          className={selectClass + " resize-none"}
          placeholder="Observaciones del vehículo"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={saving}>
          {isEdit ? "Actualizar Vehículo" : "Agregar Vehículo"}
        </Button>
      </div>
    </form>
  );
};

export default CarForm;

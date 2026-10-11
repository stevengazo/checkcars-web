const CarInfo = ({ car }) => {
  const formatDate = (rawDate) => {
    if (!rawDate) return null;
    return new Date(rawDate).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  const clean = (val) => (val && val !== "NULL" && val !== 0 ? val : null);

  const dims = [clean(car.lenght), clean(car.width), clean(car.height)].filter(Boolean).length
    ? `${clean(car.lenght) ?? "—"} × ${clean(car.width) ?? "—"} × ${clean(car.height) ?? "—"} cm`
    : null;

  // Solo se muestran los campos con valor.
  const rows = [
    ["Marca", clean(car.brand)],
    ["Modelo", clean(car.model)],
    ["Tipo", clean(car.type)],
    ["Placa", clean(car.plate)],
    ["Color", clean(car.color)],
    ["Año", clean(car.year)],
    ["VIN", clean(car.vin)],
    ["Combustible", clean(car.fuelType)],
    ["Peso", clean(car.weight) ? `${car.weight} kg` : null],
    ["Dimensiones", dims],
    ["Adquisición", formatDate(car.adquisitionDate)],
    ["Notas", clean(car.notes)],
  ].filter(([, v]) => v);

  return (
    <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 border-b border-gray-100 py-2.5">
          <dt className="text-sm text-gray-500">{label}</dt>
          <dd className="text-right text-sm font-medium text-gray-800">{value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default CarInfo;

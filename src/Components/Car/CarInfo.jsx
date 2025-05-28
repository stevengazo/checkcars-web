const CarInfo = ({ car }) => {
  const formatDate = (rawDate) => {
    if (!rawDate) return "—";
    const date = new Date(rawDate);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const safeValue = (val) => {
    return val && val !== "NULL" && val !== 0 ? val : "—";
  };

  const InfoItem = ({ label, value }) => (
    <div className="bg-gray-50  p-4 shadow-sm">
      <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-base text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="rounded-xl bg-white shadow p-6 space-y-6">
      {car.imagePath && car.imagePath !== "NULL" && (
        <div className="flex justify-center">
          <img
            src={car.imagePath}
            alt={`Imagen del vehículo ${car.plate}`}
            className="w-full max-w-md rounded-lg border"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoItem label="Marca" value={safeValue(car.brand)} />
        <InfoItem label="Modelo" value={safeValue(car.model)} />
        <InfoItem label="Tipo" value={safeValue(car.type)} />
        <InfoItem label="Placa" value={safeValue(car.plate)} />
        <InfoItem label="Color" value={safeValue(car.color)} />
        <InfoItem label="Año" value={safeValue(car.year)} />
        <InfoItem label="Fecha de Adquisición" value={formatDate(car.adquisitionDate)} />
        <InfoItem label="VIN" value={safeValue(car.vin)} />
        <InfoItem label="Combustible" value={safeValue(car.fueltype)} />
        <InfoItem label="Peso (kg)" value={safeValue(car.weight)} />
        <InfoItem
          label="Dimensiones (L x A x H)"
          value={`${safeValue(car.lenght)} x ${safeValue(car.width)} x ${safeValue(car.height)} cm`}
        />
        <InfoItem label="Notas" value={safeValue(car.notes)} />
      </div>
    </div>
  );
};

export default CarInfo;

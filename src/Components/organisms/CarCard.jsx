import { motion } from "framer-motion";
import { FaCar } from "react-icons/fa";
import { carImageUrl } from "../../services/carsService";
import Badge from "../atoms/Badge";

const statusOf = (car) => {
  if (car.deleted) return { tone: "red", label: "Borrado" };
  if (!car.isAvailable) return { tone: "purple", label: "En mantenimiento" };
  return { tone: "green", label: "Disponible" };
};

/** Tarjeta de vehículo con imagen, datos clave y estado. */
const CarCard = ({ car, onClick, index = 0 }) => {
  const img = carImageUrl(car.imagePath);
  const status = statusOf(car);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="relative h-36 w-full overflow-hidden bg-gray-100">
        {img ? (
          <img
            src={img}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <FaCar size={44} />
          </div>
        )}
        <span className="absolute right-2 top-2">
          <Badge tone={status.tone}>{status.label}</Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="truncate font-semibold text-gray-800">
          {car.brand} {car.model}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs tracking-wide text-gray-600">
            {car.plate || "—"}
          </span>
          <span className="capitalize">{car.type || ""}</span>
        </div>
      </div>
    </motion.button>
  );
};

export default CarCard;

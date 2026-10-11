import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiTool, FiExternalLink } from "react-icons/fi";
import Card from "../atoms/Card";
import Badge from "../atoms/Badge";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("es-ES") : "—");
const fmtKm = (n) => (typeof n === "number" ? `${n.toLocaleString("es-ES")} km` : "—");

/** Tarjeta de resumen de servicios de un vehículo, con acordeón de servicios recientes. */
const CarServiceResumeCard = ({ item, index = 0 }) => {
  const [open, setOpen] = useState(false);
  const retorno = item.ultimoRetorno;
  const services = item.serviciosRecientes ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Card padding="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-gray-800">
                {item.brand} {item.model}
              </h2>
              <Badge tone="gray">{item.plate || "—"}</Badge>
              <Link
                to={`/car/${item.carId}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Ver auto <FiExternalLink size={14} />
              </Link>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="text-gray-500">Último registro:</span>
              {retorno ? (
                <>
                  <Badge tone="blue">{fmtKm(retorno.mileage)}</Badge>
                  <Badge tone="blue">{retorno.author || "—"}</Badge>
                  <Badge tone="blue">{fmtDate(retorno.created)}</Badge>
                </>
              ) : (
                <Badge tone="red">Sin registros</Badge>
              )}
            </div>
          </div>

          {services.length > 0 && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >
              <FiTool size={15} />
              {open ? "Ocultar" : `Ver servicios (${services.length})`}
              <FiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                {services.map((s) => {
                  const overdue = retorno && typeof s.nextMileage === "number" && retorno.mileage >= s.nextMileage;
                  return (
                    <div key={s.carServiceId} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <h3 className="truncate font-semibold text-gray-800">{s.title || "Servicio"}</h3>
                        {s.type && <Badge tone="purple">{s.type}</Badge>}
                      </div>
                      {s.description && <p className="mb-2 text-sm text-gray-600">{s.description}</p>}
                      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
                        <dt>Fecha</dt>
                        <dd className="text-right text-gray-700">{fmtDate(s.date)}</dd>
                        <dt>Kilometraje</dt>
                        <dd className="text-right text-gray-700">{fmtKm(s.mileage)}</dd>
                        <dt>Próximo servicio</dt>
                        <dd className="text-right">
                          {overdue ? (
                            <span className="font-semibold text-red-600">{fmtKm(s.nextMileage)} · vencido</span>
                          ) : (
                            <span className="text-gray-700">{fmtKm(s.nextMileage)}</span>
                          )}
                        </dd>
                      </dl>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default CarServiceResumeCard;

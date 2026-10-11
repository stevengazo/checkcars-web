import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCheck, FaXmark, FaCar } from "react-icons/fa6";
import bookingService from "../../services/bookingService";
import { carImageUrl } from "../../services/carsService";
import OffCanvas from "../molecules/OffCanvas";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";

const STATUS_TONE = {
  Confirmado: "green", Confirmed: "green",
  Pendiente: "amber", Pending: "amber",
  Cancelado: "red", Cancelled: "red",
};

const fmt = (d) => (d ? new Date(d).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }) : "—");

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-gray-100 py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium text-gray-800">{value || "—"}</span>
  </div>
);

const ViewBookingSidebar = ({ isOpen, onClose, event, car }) => {
  const [processing, setProcessing] = useState(false);

  const act = async (fn, okMsg) => {
    if (!event?.bookingId) return;
    setProcessing(true);
    try {
      await fn(event.bookingId);
      toast.success(okMsg);
      onClose();
    } catch (err) {
      toast.error(err?.message || "Ocurrió un error.");
    } finally {
      setProcessing(false);
    }
  };

  const img = carImageUrl(car?.imagePath);

  return (
    <OffCanvas
      open={Boolean(isOpen && event)}
      onClose={onClose}
      title="Detalles de la reserva"
      subtitle={event?.title}
      footer={
        <div className="flex gap-2">
          <Button variant="primary" className="flex-1 !bg-green-600 hover:!bg-green-700" loading={processing} onClick={() => act(bookingService.confirm, "Reserva confirmada.")}>
            <FaCheck size={13} /> Confirmar
          </Button>
          <Button variant="danger" className="flex-1" disabled={processing} onClick={() => act(bookingService.cancel, "Reserva cancelada.")}>
            <FaXmark size={14} /> Cancelar
          </Button>
        </div>
      }
    >
      {event ? (
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Reserva</h3>
              {event.status && <Badge tone={STATUS_TONE[event.status] || "gray"}>{event.status}</Badge>}
            </div>
            <Row label="Motivo" value={event.reason} />
            <Row label="Inicio" value={fmt(event.start)} />
            <Row label="Fin" value={fmt(event.end)} />
            <Row label="Provincia" value={event.province} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Vehículo</h3>
            {car ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-300">
                    {img ? <img src={img} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} /> : <FaCar size={24} />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{car.brand} {car.model}</p>
                    <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">{car.plate}</span>
                  </div>
                </div>
                <Row label="Año" value={car.year} />
                <Row label="Color" value={car.color} />
                <Link to={`/car/${car.carId}`} className="mt-2 block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                  Ver detalles del vehículo
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Cargando información del vehículo...</p>
            )}
          </div>
        </div>
      ) : null}
    </OffCanvas>
  );
};

export default ViewBookingSidebar;

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import carServicesService from "../services/carServicesService";
import useApi from "../Hook/useApi";
import PageHeader from "../Components/templates/PageHeader";
import SearchInput from "../Components/molecules/SearchInput";
import EmptyState from "../Components/molecules/EmptyState";
import Spinner from "../Components/atoms/Spinner";
import Alert from "../Components/atoms/Alert";
import Badge from "../Components/atoms/Badge";
import CarServiceResumeCard from "../Components/organisms/CarServiceResumeCard";

const CarServices = () => {
  const { data, loading, error } = useApi(() => carServicesService.resume());
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const list = data || [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((i) =>
      [i.brand, i.model, i.plate].some((f) => f?.toLowerCase().includes(q))
    );
  }, [data, query]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Servicios por Vehículo"
        action={data ? <Badge tone="blue">{data.length} vehículos</Badge> : null}
      />

      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por marca, modelo o placa..."
        className="max-w-md"
      />

      {error && <Alert tone="error">No se pudieron cargar los servicios: {error}</Alert>}

      {loading ? (
        <Spinner label="Cargando servicios..." />
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, i) => (
            <CarServiceResumeCard key={item.carId} item={item} index={i} />
          ))}
        </div>
      ) : (
        !error && (
          <EmptyState
            title="Sin servicios"
            description={query ? "Ningún vehículo coincide con la búsqueda." : "Aún no hay servicios registrados."}
          />
        )
      )}
    </motion.div>
  );
};

export default CarServices;

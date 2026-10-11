import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCar, FaCarCrash, FaUsers, FaCheckCircle } from "react-icons/fa";
import { FaWrench } from "react-icons/fa6";
import { IoIosExit } from "react-icons/io";
import { CiWarning } from "react-icons/ci";

import carsService from "../services/carsService";
import chartsService from "../services/chartsService";
import useApi from "../Hook/useApi";
import { useAuth } from "../Context/AuthContext";

import StatCard from "../Components/molecules/StatCard";
import ChartPanel from "../Components/molecules/ChartPanel";
import DateRangeFilter from "../Components/molecules/DateRangeFilter";
import Badge from "../Components/atoms/Badge";

import ReportGeneralByCar from "../Components/Chart/ReportGeneralByCar";
import ReportGeneralByUsers from "../Components/Chart/ReportGeneralByUsers";
import ReportByYear from "../Components/Chart/ReportByYear";
import ReportCarsByBrand from "../Components/Chart/ReportCarsByBrand";
import ReportCarByType from "../Components/Chart/ReportCarByType";

const todayLabel = () =>
  new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .format(new Date())
    .replace(/^\w/, (c) => c.toUpperCase());

const Home = () => {
  const { user } = useAuth();
  const { data: cars, loading: carsLoading } = useApi(() => carsService.list());
  const { data: reports, loading: reportsLoading } = useApi(() => chartsService.reportsByCars());

  // Filtro por rango de fechas (afecta a los KPIs de incidencias).
  const [range, setRange] = useState(null); // { start, end }
  const { data: ranged, loading: rangedLoading, refetch: fetchRanged } = useApi(
    (start, end) => chartsService.reportsByDate(start, end),
    { autoFetch: false }
  );

  const applyRange = async (start, end) => {
    try {
      await fetchRanged(start, end);
      setRange({ start, end });
    } catch {
      toast.error("No se pudo filtrar por el rango seleccionado.");
    }
  };
  const clearRange = () => setRange(null);

  const stats = useMemo(() => {
    const list = cars || [];
    const available = list.filter((c) => c.isAvailable && !c.deleted).length;
    const maintenance = list.filter((c) => !c.isAvailable && !c.deleted).length;
    const totals = (reports || []).reduce(
      (acc, r) => ({
        exits: acc.exits + (r.exits || 0),
        issues: acc.issues + (r.issues || 0),
        crashes: acc.crashes + (r.crashes || 0),
      }),
      { exits: 0, issues: 0, crashes: 0 }
    );
    return { total: list.length, available, maintenance, ...totals };
  }, [cars, reports]);

  // Si hay rango aplicado, los conteos de incidencias usan el resumen del rango.
  const rangedActive = Boolean(range && ranged);
  const exitsVal = rangedActive ? ranged.exits ?? 0 : stats.exits;
  const issuesVal = rangedActive ? ranged.issues ?? 0 : stats.issues;
  const crashesVal = rangedActive ? ranged.crashes ?? 0 : stats.crashes;

  const kpis = [
    { label: "Vehículos", value: stats.total, icon: <FaCar size={22} />, tone: "blue", to: "/carlist", ranged: false },
    { label: "Disponibles", value: stats.available, icon: <FaCheckCircle size={22} />, tone: "green", to: "/carlist", ranged: false },
    { label: "En mantenimiento", value: stats.maintenance, icon: <FaWrench size={20} />, tone: "purple", to: "/carservices", ranged: false },
    { label: "Salidas", value: exitsVal, icon: <IoIosExit size={24} />, tone: "amber", to: "/exits", ranged: true },
    { label: "Problemas", value: issuesVal, icon: <CiWarning size={24} />, tone: "red", to: "/issue", ranged: true },
    { label: "Accidentes", value: crashesVal, icon: <FaCarCrash size={22} />, tone: "gray", to: "/crash", ranged: true },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado de bienvenida */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Hola{user ? `, ${String(user).split("@")[0]}` : ""} 👋
        </h1>
        <p className="text-sm text-gray-500">{todayLabel()} · Resumen de tu flota</p>
      </motion.div>

      {/* Filtro por rango de fechas */}
      <div className="flex flex-wrap items-center gap-3">
        <DateRangeFilter onApply={applyRange} onClear={clearRange} active={rangedActive} loading={rangedLoading} />
        {rangedActive && (
          <Badge tone="blue">
            Incidencias del {range.start} al {range.end}
          </Badge>
        )}
      </div>

      {/* Fila de KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k, i) => (
          <Link key={k.label} to={k.to} className="block focus:outline-none">
            <StatCard
              label={k.label}
              value={k.value}
              icon={k.icon}
              tone={k.tone}
              loading={carsLoading || reportsLoading || (k.ranged && rangedLoading)}
              hint={k.ranged && rangedActive ? "en el rango" : undefined}
              index={i}
            />
          </Link>
        ))}
      </div>

      {/* Gráficas en paneles titulados */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartPanel title="Reportes por vehículo" subtitle="Salidas, problemas, accidentes y reservas por auto" index={0}>
          <ReportGeneralByCar />
        </ChartPanel>
        <ChartPanel title="Actividad por usuario" subtitle="Reportes registrados por cada usuario" index={1}>
          <ReportGeneralByUsers />
        </ChartPanel>
        <ChartPanel title="Vehículos por tipo" subtitle="Distribución de la flota por tipo" index={2}>
          <ReportCarByType />
        </ChartPanel>
        <ChartPanel title="Vehículos por marca" subtitle="Distribución de la flota por marca" index={3}>
          <ReportCarsByBrand />
        </ChartPanel>
      </div>

      <ChartPanel title="Tendencia anual" subtitle="Reportes por mes durante el año" index={4}>
        <ReportByYear />
      </ChartPanel>
    </div>
  );
};

export default Home;

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaUserShield, FaUserGear, FaUser, FaUserLock } from "react-icons/fa6";
import rolesService from "../../services/rolesService";
import usersService from "../../services/usersService";
import useApi from "../../Hook/useApi";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import Label from "../atoms/Label";
import Spinner from "../atoms/Spinner";
import Alert from "../atoms/Alert";

const ROLE_META = {
  Admin: { icon: <FaUserShield size={20} />, tone: "text-red-600 bg-red-50", desc: "Acceso total: gestión de flota, usuarios y configuración." },
  Manager: { icon: <FaUserGear size={20} />, tone: "text-amber-600 bg-amber-50", desc: "Gestiona flota, reportes y usuarios. Sin ajustes críticos." },
  User: { icon: <FaUser size={20} />, tone: "text-blue-600 bg-blue-50", desc: "Registra y consulta reportes de vehículos." },
  Guest: { icon: <FaUserLock size={20} />, tone: "text-gray-500 bg-gray-100", desc: "Solo lectura de la información del sistema." },
};

const selectClass =
  "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500";

const RolesManager = () => {
  const { data: rolesDict, loading: rolesLoading, error: rolesError } = useApi(() => rolesService.getRoles());
  const { data: users, loading: usersLoading } = useApi(() => usersService.list());

  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [saving, setSaving] = useState(false);

  const roleEntries = useMemo(() => Object.entries(rolesDict || {}), [rolesDict]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!userId || !roleId) return;
    setSaving(true);
    try {
      await rolesService.assign(userId, roleId);
      toast.success("Rol asignado correctamente.");
      setUserId("");
      setRoleId("");
    } catch (err) {
      toast.error(err?.message || "No se pudo asignar el rol.");
    } finally {
      setSaving(false);
    }
  };

  if (rolesLoading) return <Spinner label="Cargando roles..." />;

  return (
    <div className="space-y-6">
      {rolesError && <Alert tone="error">No se pudieron cargar los roles: {rolesError}</Alert>}

      {/* Roles del sistema */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Roles del sistema</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {roleEntries.map(([id, name]) => {
            const meta = ROLE_META[name] || { icon: <FaUser size={20} />, tone: "text-gray-500 bg-gray-100", desc: "" };
            return (
              <Card key={id} className="flex items-start gap-3" padding="p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${meta.tone}`}>{meta.icon}</div>
                <div>
                  <p className="font-semibold text-gray-800">{name}</p>
                  <p className="text-sm text-gray-500">{meta.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Asignar rol a usuario */}
      <Card padding="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Asignar rol a un usuario</h3>
        <form onSubmit={handleAssign} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Label htmlFor="roleUser" className="mb-1">Usuario</Label>
            <select id="roleUser" value={userId} onChange={(e) => setUserId(e.target.value)} className={selectClass} disabled={usersLoading}>
              <option value="">{usersLoading ? "Cargando..." : "Selecciona un usuario"}</option>
              {(users || []).map((u) => (
                <option key={u.id} value={u.id}>{u.email || u.userName}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px] flex-1">
            <Label htmlFor="roleSel" className="mb-1">Rol</Label>
            <select id="roleSel" value={roleId} onChange={(e) => setRoleId(e.target.value)} className={selectClass}>
              <option value="">Selecciona un rol</option>
              {roleEntries.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <Button type="submit" loading={saving} disabled={!userId || !roleId}>
            Asignar
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RolesManager;

import { useMemo, useState, forwardRef, useImperativeHandle } from "react";
import usersService from "../../services/usersService";
import useApi from "../../Hook/useApi";
import Badge from "../atoms/Badge";
import Spinner from "../atoms/Spinner";
import Alert from "../atoms/Alert";
import SearchInput from "../molecules/SearchInput";
import EmptyState from "../molecules/EmptyState";
import SideBarUser from "./SideBaruser.jsx";

const UsersTable = forwardRef((_props, ref) => {
  const { data, loading, error, refetch } = useApi(() => usersService.list());
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  useImperativeHandle(ref, () => ({ refresh: refetch }), [refetch]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = data || [];
    if (!q) return list;
    return list.filter((u) => (u.email || u.userName || "").toLowerCase().includes(q));
  }, [data, query]);

  if (loading) return <Spinner label="Cargando usuarios..." />;
  if (error) return <Alert tone="error">Error al cargar los usuarios: {error}</Alert>;

  return (
    <div className="space-y-4">
      {selected && <SideBarUser User={selected} onClose={() => setSelected(null)} />}

      <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por correo..." className="max-w-sm" />

      {rows.length === 0 ? (
        <EmptyState title="Sin usuarios" description={query ? "Ningún usuario coincide." : "Aún no hay usuarios."} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Usuario</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((user) => {
                const name = user.email || user.userName || "—";
                const initial = name.charAt(0).toUpperCase();
                return (
                  <tr key={user.id || name} onClick={() => setSelected(user)} className="cursor-pointer border-t border-gray-100 transition hover:bg-blue-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{initial}</div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-800">{name}</p>
                          {user.userName && user.userName !== user.email && <p className="truncate text-xs text-gray-400">{user.userName}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {user.emailConfirmed ? <Badge tone="green">Confirmado</Badge> : <Badge tone="amber">Pendiente</Badge>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

UsersTable.displayName = "UsersTable";
export default UsersTable;

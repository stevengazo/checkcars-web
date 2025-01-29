import { useEffect } from "react";
import useFetch from "../Hook/useFetch";

const UsersTable = () => {
  const URL = "https://mecsacars.stevengazo.co.cr/api/Users";
  const { data, loading, error, refetch } = useFetch(URL, {
    autoFetch: true,
  });

  useEffect(() => {
    console.table(data);
  }, [data]);

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar datos.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Confirmado</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">
                  {user.emailConfirmed ? "Sí" : "No"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="px-4 py-2 text-center">No hay usuarios disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

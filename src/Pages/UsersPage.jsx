import UsersTable from "../Components/UsersTable";

const UsersPage = () => {
  return (
    <>
      <h2 className="text-xl"> Usuarios Del Sistema</h2>
      <p className="italic text-sm text-gray-300">
        Los registros no requieren usuarios. Solamente la visualización en el
        sistema
      </p>

      <div>
        <UsersTable />
      </div>
    </>
  );
};

export default UsersPage;

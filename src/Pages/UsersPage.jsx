import { useState } from "react";
import UserAdd from "../Components/UserAdd";
import UsersTable from "../Components/UsersTable";

const UsersPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-800">Usuarios del Sistema</h2>
        <p className="text-sm italic text-gray-500">
          Los registros no requieren usuarios, solamente la visualización en el sistema.
        </p>
      </header>

      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-shadow shadow-md hover:shadow-lg"
        >
          Agregar Usuario
        </button>
      </div>

      <UsersTable />

      {showModal && <UserAdd onClose={setShowModal} />}
    </div>
  );
};

export default UsersPage;

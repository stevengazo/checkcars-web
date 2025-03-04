import UserAdd from "../Components/UserAdd";
import UsersTable from "../Components/UsersTable";
import { useState } from "react";

const UsersPage = () => {
  const [showModal, setShowModal] = useState(false);
  


  return (
    <>
      <h2 className="text-xl"> Usuarios Del Sistema</h2>
      <p className="italic text-sm text-gray-300">
        Los registros no requieren usuarios. Solamente la visualización en el
        sistema
      </p>
      <div>
        <button  onClick={()=> setShowModal(true)} className="btn bg-green-600 p-3 text-white border rounded hover:shadow shadow-2xl" >Agregar Usuario</button>
        <UsersTable />
        {
          showModal && <UserAdd onClose={setShowModal} />
        }
      </div>
    </>
  );
};

export default UsersPage;

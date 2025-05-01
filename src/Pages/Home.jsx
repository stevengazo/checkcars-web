import { useState } from "react";
import EntrySearch from "../Module/EntrySearch";
import AddExit from "../Components/AddExit"; // Asegúrate de que la ruta sea correcta

const Home = () => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium">Reporte de Salidas</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Nueva Salida
        </button>
      </div>

      <EntrySearch />

      {showAdd && (
        <div className="mt-6">
          <AddExit  OnHandleClose={setShowAdd} />

        </div>
      )}
    </div>
  );
};

export default Home;

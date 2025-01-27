import { useState } from "react";
import CarTable from "../Components/CarTable";
import CarAdd from "../Components/CarAdd";

const CarList = () => {
  const [addCar, setAddCar] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <div>
      <div className="flex justify-between flex-row">
        <h1 className="text-3xl font-medium">Vehículos</h1>
        {!addCar && (
          <button
            className="border border-green-400 shadow text-green-400 bg-white p-1 m-1 rounded-md"
            onClick={() => setAddCar(true)}
          >
            Agregar Auto
          </button>
        )}
      </div>

      {addCar && <CarAdd OnClose={setAddCar} Added={setAdded} />}
      <div className="flex flex-col">
        <CarTable />
      </div>
    </div>
  );
};

export default CarList;

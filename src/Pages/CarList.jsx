import { useState } from "react";
import CarTable from "../Components/CarTable";
import CarAdd from "../Components/CarAdd";

const CarList = () => {
  const [addCar, setAddCar] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-medium">Vehículos</h1>
      {!addCar && <button className="border border-green-400 text-green-400 bg-white p-2 rounded-md" onClick={() => setAddCar(true)}>Agregar Auto</button>}
   
      {addCar && <CarAdd OnClose={setAddCar} /> }
      <div className="flex flex-col">
        <CarTable />
      </div>
 
    </div>
  );
};

export default CarList;

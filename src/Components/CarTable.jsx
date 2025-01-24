import { useEffect } from "react";
import useFetch from "../Hook/useFetch";

const CarTable = () => {
  const URL = "https://mecsacars.stevengazo.co.cr/api/Cars";
  // Hacemos la petición usando la URL construida
  const { data, loading, error, refetch } = useFetch(URL, {
    autoFetch: true,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <div className="border rounded-xl border-gray-300 p-4 bg-gray-50 shadow-md">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border-b border-gray-300">Marca</th>
              <th className="px-4 py-2 border-b border-gray-300">Modelo</th>
              <th className="px-4 py-2 border-b border-gray-300">Placa</th>
              <th className="px-4 py-2 border-b border-gray-300">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((car) => {
               return <tr key={car.carId} className=" hover:cursor-pointer ">
                  <td className="px-4 py-2 border-b border-gray-300">{car.brand}</td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {car.model}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">{car.plate}</td>
                  <td className="px-4 py-2 border-b border-gray-300">{car.type}</td>
                </tr>;
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CarTable;

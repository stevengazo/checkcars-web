import { useEffect } from "react";
import { DotLoader } from "react-spinners";
import useFetch from "../Hook/useFetch";
import { useNavigate } from "react-router-dom";

const CarTable = () => {
  const Nav = useNavigate();

  const URL = "https://mecsacars.stevengazo.co.cr/api/Cars";
  // Hacemos la petición usando la URL construida
  const { data, loading, error, refetch } = useFetch(URL, {
    autoFetch: true,
  });

  const GoTo = (id) => {
    Nav(`/car/${id}`);
  };

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
                return (
                  <tr
                    key={car.carId}
                    className=" hover:cursor-pointer "
                    onClick={() => GoTo(car.carId)}
                  >
                    <td className="px-4 py-2 border-b border-gray-300">
                      {car.brand}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {car.model}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {car.plate}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {car.type}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {loading && (
          <div className="flex my-2 justify-center items-center w-full mx-auto">
            <DotLoader color="#2563EB" />
          </div>
        )}
      </div>
    </>
  );
};

export default CarTable;

import React, { useContext, useState } from "react";
import { DotLoader } from "react-spinners";
import useFetch from "../Hook/useFetch";
import { useNavigate } from "react-router-dom";
import SettingsContext from '../Context/SettingsContext.jsx';

const CarTable = () => {
  const { API_URL } = useContext(SettingsContext);
  const Nav = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState('');

  const URL = `${API_URL}/api/Cars`;
  const { data, loading, error, refetch } = useFetch(URL, {
    autoFetch: true,
  });

  const GoTo = (id) => {
    Nav(`/car/${id}`);
  };

  const sortedCars = React.useMemo(() => {
    let sortableItems = [...(data || [])];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredCars = sortedCars.filter((car) =>
    [car.brand, car.model, car.plate, car.type]
      .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div className="border rounded-xl border-gray-300 p-4 bg-gray-50 shadow-md">
        <input
          type="text"
          placeholder="Buscar por marca, modelo, placa o tipo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded-lg"
        />
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="px-4 py-2 border-b border-gray-300 cursor-pointer"
                onClick={() => requestSort('brand')}
              >
                Marca {sortConfig.key === 'brand' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th
                className="px-4 py-2 border-b border-gray-300 cursor-pointer"
                onClick={() => requestSort('model')}
              >
                Modelo {sortConfig.key === 'model' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th
                className="px-4 py-2 border-b border-gray-300 cursor-pointer"
                onClick={() => requestSort('plate')}
              >
                Placa {sortConfig.key === 'plate' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th
                className="px-4 py-2 border-b border-gray-300 cursor-pointer"
                onClick={() => requestSort('type')}
              >
                Tipo {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car) => (
              <tr
                key={car.carId}
                className="hover:cursor-pointer"
                onClick={() => GoTo(car.carId)}
              >
                <td className="px-4 py-2 border-b border-gray-300">{car.brand}</td>
                <td className="px-4 py-2 border-b border-gray-300">{car.model}</td>
                <td className="px-4 py-2 border-b border-gray-300">{car.plate}</td>
                <td className="px-4 py-2 border-b border-gray-300">{car.type}</td>
              </tr>
            ))}
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

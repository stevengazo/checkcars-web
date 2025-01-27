import React, { useState } from "react";

const EntryTable = ({ entries, onSelected }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const setSelected = (e) => {
    onSelected(e);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const sortedEntries = React.useMemo(() => {
    let sortableItems = [...(entries || [])];
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
  }, [entries, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <table className="table-auto w-full border-collapse transition-all ease-in-out">
      <thead className="bg-gray-100">
        <tr>
          <th
            className="px-4 text-sm py-2 cursor-pointer"
            onClick={() => requestSort('created')}
          >
            Fecha {sortConfig.key === 'created' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
          </th>
          <th
            className="px-4 text-sm py-2 cursor-pointer"
            onClick={() => requestSort('author')}
          >
            Autor {sortConfig.key === 'author' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
          </th>
          <th
            className="px-4 text-sm py-2 cursor-pointer"
            onClick={() => requestSort('carPlate')}
          >
            Placa {sortConfig.key === 'carPlate' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
          </th>
          <th
            className="px-4 text-sm py-2 cursor-pointer"
            onClick={() => requestSort('notes')}
          >
            Motivo {sortConfig.key === 'notes' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
          </th>
          <th
            className="px-4 text-sm py-2 hidden md:block cursor-pointer"
            onClick={() => requestSort('mileage')}
          >
            Odometro {sortConfig.key === 'mileage' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedEntries &&
          sortedEntries.map((entry) => (
            <tr
              key={entry.reportId}
              className="border-t border-slate-200 hover:bg-slate-200 transition duration-500 cursor-pointer"
              onClick={() => setSelected(entry)}
            >
              <td className="px-4 py-2">{formatDate(entry.created)}</td>
              <td className="px-4 py-2">{entry.author}</td>
              <td className="px-4 py-2">{entry.carPlate}</td>
              <td className="px-4 py-2">{entry.notes}</td>
              <td className="px-4 py-2 hidden md:block">{entry.mileage} KM</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default EntryTable;
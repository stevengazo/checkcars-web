import React, { useState } from 'react';

const CrashTable = ({ crashes, onSelected }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const setSelected = (e) => {
    console.log(e);
    onSelected(e);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const sortedCrashes = React.useMemo(() => {
    let sortableItems = [...crashes];
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
  }, [crashes, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <table className="table-auto w-full border-collapse">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 text-sm py-2 cursor-pointer" onClick={() => requestSort('created')}>
            Fecha {sortConfig.key === 'created' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
          </th>
          <th className="px-4 text-sm py-2 cursor-pointer" onClick={() => requestSort('author')}>
            Autor {sortConfig.key === 'author' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
          </th>
          <th className="px-4 text-sm py-2 cursor-pointer" onClick={() => requestSort('carPlate')}>
            Placa {sortConfig.key === 'carPlate' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedCrashes &&
          sortedCrashes.map((report) => (
            <tr
              key={report.reportId}
              className="border-t border-slate-200 hover:bg-slate-200 transition duration-500 cursor-pointer"
              onClick={() => setSelected(report)}
            >
              <td className="px-4 py-2">{formatDate(report.created)}</td>
              <td className="px-4 py-2">{report.author}</td>
              <td className="px-4 py-2">{report.carPlate}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default CrashTable;
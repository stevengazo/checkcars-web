const EntryTable = ({ entries, onSelected }) => {
  const setSelected = (e) => {
    onSelected(e);
  };

  return (
    <table className="table-auto w-full border-collapse">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 text-sm py-2 border">Fecha</th>
          <th className="px-4 text-sm py-2 border">Autor</th>
          <th className="px-4 text-sm py-2 border">Placa</th>
          <th className="px-4 text-sm py-2 border">Motivo</th>
          <th className="px-4 text-sm py-2 border">Odometro</th>
        </tr>
      </thead>
      <tbody>
        {entries &&
          entries.map((entry) => (
            <tr
              key={entry.reportId}
              className="border-t hover:bg-slate-200 transition duration-500"
              onClick={() => setSelected(entry)}
            >
              <td className="px-4 py-2">{entry.created}</td>
              <td className="px-4 py-2">{entry.author}</td>
              <td className="px-4 py-2">{entry.carPlate}</td>
              <td className="px-4 py-2">{entry.notes}</td>
              <td className="px-4 py-2">{entry.mileage}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default EntryTable;

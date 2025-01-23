const IssueTable = ({ issues, onSelected }) => {
    const setSelected = (e) => {
      console.log(e)
      onSelected(e);
    };
  
    function formatDate(dateString) {
      const date = new Date(dateString); // Crea un objeto Date a partir de la cadena
      const day = String(date.getDate()).padStart(2, '0'); // Agrega ceros al día si es necesario
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
      const year = date.getFullYear(); // Obtén el año
    
      return `${day}/${month}/${year}`; // Devuelve la fecha en formato DD/MM/YYYY
    }
    
  
    return (
      <table className="table-auto w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 text-sm py-2 ">Fecha</th>
            <th className="px-4 text-sm py-2 ">Autor</th>
            <th className="px-4 text-sm py-2 ">Placa</th>
          </tr>
        </thead>
        <tbody>
          {issues &&
            issues.map((entry) => (
              <tr
                key={entry.reportId}
                className="border-t border-slate-200 hover:bg-slate-200 transition duration-500"
                onClick={() => setSelected(entry)}
              >
                <td className="px-4 py-2">{formatDate(entry.created)}</td>
                <td className="px-4 py-2">{entry.author}</td>
                <td className="px-4 py-2">{entry.carPlate}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  };
  
  export default IssueTable;
  
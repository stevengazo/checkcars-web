const FileTable = ({ items }) => {
  console.table("items", items);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const handleDownload = (filePath) => {
    window.open(filePath, "_blank");
  };

  const handleDelete = (id) => {
    // Aquí puedes implementar la lógica para eliminar el archivo
    console.log(`Eliminar archivo con ID: ${id}`);
  };

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nombre</th>
            <th className="py-3 px-6 text-left">Fecha</th>
            <th colSpan={2} className="py-3 px-6 text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {/* Aquí puedes mapear tus archivos */}
          {items.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6">{item.fileName}</td>
              <td className="py-3 px-6">{formatDate(item.uploadedAt)}</td>
              <td className="py-3 px-6">
                <button
                  data-filepath={item.filePath}
                  className="text-blue-500 hover:underline"
                  onClick={() => handleDownload(item.filePath)}
                >
                  Descargar
                </button>
              </td>
              <td>
                <button
                  data-filepath={item.filePath}
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(item.attachmentId)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;

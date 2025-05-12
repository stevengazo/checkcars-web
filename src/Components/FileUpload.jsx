import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(""); // Limpiar errores al seleccionar nuevo archivo
  };

  const handleUpload = () => {
    if (!file) {
      setError("Por favor, selecciona un archivo antes de subirlo.");
      return;
    }
    // Aquí iría la lógica para subir el archivo (e.g. a un servidor)
    alert(`Archivo "${file.name}" listo para subir.`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl shadow-sm">
      <label className="w-full max-w-md text-center py-8 px-4 bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        {file ? (
          <p className="text-gray-700 font-medium">{file.name}</p>
        ) : (
          <p className="text-gray-500">
            Arrastra y suelta un archivo aquí o haz clic para seleccionar uno.
          </p>
        )}
      </label>

      <button
        onClick={handleUpload}
        className="mt-4 px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200"
      >
        Subir Archivo
      </button>

      {error && <p className="mt-2 text-sm text-red-600 italic">{error}</p>}
    </div>
  );
};

export default FileUpload;

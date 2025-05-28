import React, { useContext, useState } from "react";
import useMultipartFetch from "../../Hook/useMultipartFetch";
import SettingsContext from "../../Context/SettingsContext.jsx";
const FileUpload = ({ CarId }) => {
  const { API_URL } = useContext(SettingsContext);

  const { data, loading, error, refetch, status } = useMultipartFetch(
    `${API_URL}/api/VehicleAttachments/${CarId}`
  );

  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrorMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Por favor, selecciona un archivo antes de subirlo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await refetch(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl shadow-sm">
      <label className="w-full max-w-md text-center py-4 px-10 bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition">
        <input type="file" onChange={handleFileChange} className="hidden" />
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
        disabled={loading}
        className="mt-4 px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Subiendo..." : "Subir Archivo"}
      </button>

      {errorMessage && (
        <p className="mt-2 text-sm text-red-600 italic">{errorMessage}</p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 italic">Error: {error}</p>
      )}

      {status >= 200 && status < 300 && data && (
        <p className="mt-2 text-sm text-green-600">Archivo subido con éxito.</p>
      )}
    </div>
  );
};

export default FileUpload;

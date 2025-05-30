import { useContext, useState } from "react";
import SettingsContext from "../../Context/SettingsContext";
import useFetch from "../../Hook/useFetch";
import { set } from "date-fns";

const ScoreStatus = ({ Report, type }) => {
  const { API_URL } = useContext(SettingsContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [newScore, setNewScore] = useState(Report.score);

  const SendScore = async (score) => {
    try {
      setNewScore(score);
      var UpReport = Report;
      UpReport.score = score;
      console.log("Updating score to:", score);
      var url = `${API_URL}/api/${type}/${Report.reportId}`;
      console.log("URL:", url);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(Report),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el vehículo");
      } else if (response.status === 204) {
        console.log("No content returned, update successful");
      }

      console.log("Score updated");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div>
      <p>
        La calificación es un número entre 0 y 10 que refleja la calidad del
        reporte. Realize la calificación de acuerdo a la información que
        contiene el reporte.
        <br />
      </p>
      <div className="flex flex-row justify-between items-center p-4 gap-8">
        {/* Sección de calificación actual */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-1">Calificación Actual</h2>
          <h3 className="text-2xl font-bold">{newScore}</h3>
        </div>

        {/* Sección de edición */}
        <div className="flex flex-col items-center">
          <input
            type="number"
            max={10}
            min={0}
            className="border rounded px-2 py-1 mb-2 w-40 text-center"
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
          />

          <button
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={() => SendScore(newScore)}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Editar"}
          </button>

          {error && (
            <p className="text-red-500 mt-2 text-sm">Error al guardar</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreStatus;

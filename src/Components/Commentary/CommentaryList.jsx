import { useEffect, useContext } from "react";
import CommentaryItem from "./CommentaryItem";
import SettingsContext from "../../Context/SettingsContext";
import useFetch from "../../Hook/useFetch";

const CommentaryList = ({ ReportId }) => {
  const { API_URL } = useContext(SettingsContext);
  const url = `${API_URL}/api/Commentary/ByReport/${ReportId}`;
  const { data: comments, loading, error } = useFetch(url, { autoFetch: true });

console.log("Comentarios:", comments);

  return (
    <div className=" mx-auto space-y-4 p-4">
      {loading && <p>Cargando comentarios...</p>}
      {!loading &&
        comments &&
        Array.isArray(comments) &&
        comments.length > 0 &&
        comments.map((comment) => (
          <CommentaryItem key={comment.id} commentary={comment} />
        ))}
      {!loading &&
        comments &&
        Array.isArray(comments) &&
        comments.length === 0 && <p>No hay comentarios.</p>}
      {error && (
        <p className="text-red-500">Error al cargar los comentarios.</p>
      )}
    </div>
  );
};

export default CommentaryList;

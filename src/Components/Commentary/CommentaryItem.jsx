const CommentaryItem = ({ commentary }) => {
  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(commentary.createdAt));

  return (
    <div className="relative p-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-800">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 text-sm text-gray-600">
          <span className="font-medium">{commentary.author}</span>
          <span className="text-gray-400">• {formattedDate}</span>
        </div>
        <button
          className="text-gray-400 hover:text-red-500 transition-colors text-sm"
          aria-label="Eliminar comentario"
        >
          ✕
        </button>
      </div>
      <p className="text-sm leading-relaxed">{commentary.text}</p>
    </div>
  );
};

export default CommentaryItem;

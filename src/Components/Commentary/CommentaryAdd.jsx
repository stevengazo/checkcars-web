import React from 'react';

const CommentaryAdd = ({ReportId}) => {
  return (
    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-base font-medium text-gray-800 mb-2">Agregar Comentario</h2>
      <form className="space-y-2">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white transition"
          placeholder="Escribe tu comentario..."
          rows="3"
        ></textarea>
        <button
          type="submit"
          className="w-full py-1.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition"
        >
          Agregar
        </button>
      </form>
    </div>
  );
};

export default CommentaryAdd;

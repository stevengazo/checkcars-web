import React, { useState, useContext } from 'react';
import SettingsContext from '../../Context/SettingsContext.jsx';

const CommentaryAdd = ({ ReportId }) => {
  const { API_URL } = useContext(SettingsContext);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    // Objeto base
    const data = {
      id: 0,
      text: text,
      createdAt: new Date().toISOString(),
      author:  localStorage.getItem("user"), // Se puede asignar si tienes esta info
      authorId: "", // Se puede obtener del token o contexto
      reportId: ReportId,
      report: null
    };

    try {
      const response = await fetch(`${API_URL}/api/Commentary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el comentario');
      }

      setText('');
    } catch (err) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-base font-medium text-gray-800 mb-2">Agregar Comentario</h2>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white transition"
          placeholder="Escribe tu comentario..."
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-1.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Agregando...' : 'Agregar'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default CommentaryAdd;

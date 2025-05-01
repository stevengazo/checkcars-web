export const ReminderList = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-6 space-y-2">
            <h2 className="text-xl font-bold text-gray-800">Título del recordatorio</h2>
            <p className="text-gray-600 text-sm">Descripción del recordatorio aquí.</p>
            <div className="text-gray-500 text-sm">📅 2025-05-01 14:00</div>
            <div className="text-sm">📧 correo@ejemplo.com</div>
            <div className="text-sm">Autor: Juan Pérez</div>
            <div className="text-sm">
              Estado: <span className="text-yellow-600 font-semibold">Pendiente</span>
            </div>
            <div className="text-sm">Enviar: Sí</div>
          </div>
        ))}
      </div>
    );
  };
  



export default  ReminderViewCard = ({ reminder }) => {
    return (
        <div  className="bg-white rounded-2xl shadow p-6 space-y-2">
        <h2 className="text-xl font-bold text-gray-800">{reminder.title}</h2>
        <p className="text-gray-600 text-sm">{reminder.description}</p>
        <div className="text-gray-500 text-sm">📅 {reminder.reminderDate}</div>
        <div className="text-sm">📧 correo@ejemplo.com</div>
        <div className="text-sm">Autor: Juan Pérez</div>
        <div className="text-sm">
          Estado: <span className="text-yellow-600 font-semibold">Pendiente</span>
        </div>

      </div>
    );
}
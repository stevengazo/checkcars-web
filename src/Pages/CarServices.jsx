import { useState, useContext, useEffect } from "react";
import useFetch from "../Hook/useFetch";
import SettingsContext from "../Context/SettingsContext.jsx";
import { Link, Links } from "react-router-dom";

const CarServices = () => {
  const { API_URL: baseUrl } = useContext(SettingsContext);

  const {
    data: carServices,
    loading,
    error,
  } = useFetch(`${baseUrl}/api/CarServices/Resume`);

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    console.log("Servicios de vehículos:", carServices);
    if (error) {
      console.error("Error fetching car services:", error);
    }
  }, [carServices, error]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Servicios por Vehículo
      </h1>

      {loading && (
        <p className="text-blue-600 font-medium">Cargando servicios...</p>
      )}
      {error && (
        <p className="text-red-500 font-semibold">
          Error al cargar los servicios: {error.message}
        </p>
      )}

      {carServices && carServices.length > 0 ? (
        <ul className="space-y-6">
          {carServices.map((item, index) => (
            <li
              key={item.carId}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex gap-3 items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-700">
                        Vehículo: {item.brand} {item.model} - {item.plate}
                      </h2>
                    </div>

                    <Link
                      to={`/car/${item.carId}`}
                      className="inline-block text-sm text-center align-middle bg-blue-200 p-1 rounded text-blue-600 hover:underline hover:text-blue-800 font-medium"
                    >
                      Ver Auto →
                    </Link>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Último registro de entrada:{" "}
                    {item.ultimoRetorno ? (
                      <div className="flex space-x-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded">
                          {item.ultimoRetorno.mileage} km
                        </span>
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded">
                          {item.ultimoRetorno.author}
                        </span>
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded">
                          {item.ultimoRetorno.created}
                        </span>
                      </div>
                    ) : (
                      <span className="text-red-500 font-medium">
                        Sin registros
                      </span>
                    )}
                  </p>
                </div>
                {item.serviciosRecientes?.length > 0 && (
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="text-blue-600 font-semibold hover:underline mt-2"
                  >
                    {openIndex === index
                      ? "Ocultar servicios"
                      : "Ver servicios"}
                  </button>
                )}
              </div>

              {openIndex === index && item.serviciosRecientes && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Servicios Recientes
                  </h3>
                  <ul className="space-y-3">
                    {item.serviciosRecientes.map((service) => (
                      <li
                        key={service.carServiceId}
                        className="bg-gray-50 p-4 rounded-md border border-gray-200"
                      >
                        <p>
                          <span className="font-semibold">Título:</span>{" "}
                          {service.title}
                        </p>
                        <p>
                          <span className="font-semibold">Tipo:</span>{" "}
                          {service.type}
                        </p>
                        <p>
                          <span className="font-semibold">Fecha:</span>{" "}
                          {new Date(service.date).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-semibold">Descripción:</span>{" "}
                          {service.description}
                        </p>
                        <p>
                          <span className="font-semibold">Kilometraje:</span>{" "}
                          {service.mileage}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Próximo Servicio:
                          </span>{" "}
                          {item.ultimoRetorno &&
                          service.nextMileage >= item.ultimoRetorno.mileage ? (
                            <span className="text-red-600 font-semibold">
                              {service.nextMileage} km (vencido)
                            </span>
                          ) : (
                            <span>{service.nextMileage} km</span>
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !loading && (
          <p className="text-gray-500">No hay servicios disponibles.</p>
        )
      )}
    </div>
  );
};

export default CarServices;

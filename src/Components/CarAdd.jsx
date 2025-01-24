
import { useState } from "react";
import useFetch from "../Hook/useFetch";

const CarAdd = () => {
    const [car, setCar] = useState({
      carId: "",
      model: "",
      type: "",
      fuelType: "",
      plate: "",
      adquisitionDate: "",
      vin: "",
      brand: "",
      color: "",
      width: "",
      height: "",
      length: "",
      weight: "",
      notes: "",
      year: "",
      services: "",
      entryExitReports: "",
      issueReports: "",
      crashReports: "",
    });
  
    const { data, loading, error, status, refetch } = useFetch(
      `https://mecsacars.stevengazo.co.cr/api/Cars`, // Ruta del backend
      {
        method: "POST",
        body: JSON.stringify(car),
        headers: { "Content-Type": "application/json" },
        autoFetch: false,
      }
    );
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCar((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      refetch();
    };
  
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Agregar Nuevo Vehículo</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-600">
              Modelo
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={car.model}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el modelo del Vehículo"
            />
          </div>
  
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-600">
              Tipo
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={car.type}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tipo de Vehículo (ej. Pickup)"
            />
          </div>
  
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-600">
              Tipo de Combustible
            </label>
            <input
              type="text"
              id="fuelType"
              name="fuelType"
              value={car.fuelType}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tipo de combustible (ej. Diesel)"
            />
          </div>
  
          <div>
            <label htmlFor="plate" className="block text-sm font-medium text-gray-600">
              Placa
            </label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={car.plate}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de placa"
            />
          </div>
  
          <div>
            <label htmlFor="adquisitionDate" className="block text-sm font-medium text-gray-600">
              Fecha de Adquisición
            </label>
            <input
              type="date"
              id="adquisitionDate"
              name="adquisitionDate"
              value={car.adquisitionDate}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label htmlFor="vin" className="block text-sm font-medium text-gray-600">
              VIN
            </label>
            <input
              type="text"
              id="vin"
              name="vin"
              value={car.vin}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VIN del vehículo"
            />
          </div>
  
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-600">
              Marca
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={car.brand}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Marca del Vehículo"
            />
          </div>
  
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-600">
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={car.color}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Color del Vehículo"
            />
          </div>
  
          {/* Puedes agregar más campos aquí si lo deseas */}
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Cargando..." : "Agregar Vehículo"}
            </button>
          </div>
  
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {status === 200 && <div className="mt-4 text-green-500">Vehículo agregado exitosamente</div>}
        </form>
      </div>
    );
  };
  
  export default CarAdd;
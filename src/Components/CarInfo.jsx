

const CarInfo = ({car})=>{

  console.warn(car)
    return (<>
    <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Propiedad
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">Marca</td>
                <td className="border border-gray-300 px-4 py-2">
                  {car.brand}
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">Modelo</td>
                <td className="border border-gray-300 px-4 py-2">
                  {car.model}
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">Tipo</td>
                <td className="border border-gray-300 px-4 py-2">
                  {car.type}
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">Placa</td>
                <td className="border border-gray-300 px-4 py-2">
                  {car.plate}
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">Color</td>
                <td className="border border-gray-300 px-4 py-2">
                  {car.color}
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">Notas</td>
                <td className="border border-gray-300 px-4 py-2">
                  {car.notes}
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">VIN</td>
                <td className="border border-gray-300 px-4 py-2">
                  {car.vin}
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">Combustible</td>
                <td className="border border-gray-300 px-4 py-2">
                  {car.fueltype}
                </td>
              </tr>
            </tbody>
          </table>
    </>)
}
;

export default CarInfo;
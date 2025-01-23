import { IoIosCloseCircle } from "react-icons/io";
import useFetch from "../Hook/useFetch";
import MapLocation from "./MapLocation";
import { BeatLoader } from "react-spinners";

export default function SideBarEntry({ entry, onClose }) {
  const { data, loading, error, refetch } = useFetch(
    `https://mecsacars.stevengazo.co.cr/api/Photos/report/${entry.reportId}`,
    { autoFetch: true }
  );

  console.log(entry);
  console.log(data);

  const handleOnClose = () => {
    onClose(null);
  };
  return (
    <>
      <div className="bg-slate-200 shadow-xl absolute top-5 right-5 sm:w-48  md:w-1/4 p-4  h-[90vh] rounded-lg overflow-auto">
        <div className="relative " onClick={() => handleOnClose()}>
          <IoIosCloseCircle size={24} />
        </div>
        <h2 className="text-3xl">Registro de Salida</h2>
        <div className="border p-2 my-1 border-slate-200 rounded-e-2xl ">

          {/* Created */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Creación</label>
            <label className=" font-light">{entry.created}</label>
          </div>

          {/* Author */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Autor</label>
            <label>{entry.author}</label>
          </div>

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Placa</label>
            <label>{entry.carPlate}</label>
          </div>

          {/* Location */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Ubicación</label>
            <div className="flex flex-col">
              <label className=" font-medium">Latitud</label>
              <label>{entry.latitude}</label>
            </div>
            <div className="flex flex-col">
              <label className=" font-medium">Longitud</label>
              <label>{entry.longitude}</label>
            </div>
          </div>

          <MapLocation />

          {/* Mileage */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Kilometraje</label>
            <label>{entry.mileage}</label>
          </div>

          {/* Fuel Level */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Nivel de combustible</label>
            <label>{entry.fuelLevel === 0 ? "Vacío" : entry.fuelLevel}</label>
          </div>

          {/* Tires State */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Estado de los neumáticos</label>
            <label>{entry.tiresState}</label>
          </div>

          {/* Spare Tire */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Llanta de repuesto</label>
            <label>{entry.hasSpareTire ? "Sí" : "No"}</label>
          </div>

          {/* Charger USB */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Cargador USB</label>
            <label>{entry.hasChargerUSB ? "Sí" : "No"}</label>
          </div>

          {/* Quick Pass */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Quick Pass</label>
            <label>{entry.hasQuickPass ? "Sí" : "No"}</label>
          </div>

          {/* Phone Support */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Soporte telefónico</label>
            <label>{entry.hasPhoneSupport ? "Sí" : "No"}</label>
          </div>

          {/* Emergency Kit */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Kit de emergencia</label>
            <label>{entry.hasEmergencyKit ? "Sí" : "No"}</label>
          </div>

          {/* Paint State */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Estado de la pintura</label>
            <label>{entry.paintState}</label>
          </div>

          {/* Mechanical State */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Estado mecánico</label>
            <label>{entry.mecanicState}</label>
          </div>

          {/* Oil Level */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Nivel de aceite</label>
            <label>{entry.oilLevel}</label>
          </div>

          {/* Interiors State */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Estado de los interiores</label>
            <label>{entry.interiorsState}</label>
          </div>

          {/* Notes */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Motivo</label>
            <label>{entry.notes}</label>
          </div>

          {/*Images */}
          <h3 className="text-3xl">Fotos</h3>
        </div>
        <div className="flex flex-row justify-center align-middle my-2 border rounded-2xl p-2">
         {loading &&  <BeatLoader size={24} />}
          {data !== null &&
            data.map((photo) => (
              <img
                src={photo.filePath}
                alt={photo.name}
                className=" w-full rounded-2xl"
              />
            ))}
        </div>
      </div>
    </>
  );
}

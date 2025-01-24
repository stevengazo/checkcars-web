import { IoIosCloseCircle } from "react-icons/io";
import useFetch from "../Hook/useFetch";
import { BeatLoader } from "react-spinners";
import Map from "../Components/MapLocation";

export default function SideBarCrash({ crash, onClose }) {
  const { data, loading, error, refetch } = useFetch(
    `https://mecsacars.stevengazo.co.cr/api/Photos/report/${crash.reportId}`,
    { autoFetch: true }
  );

  console.log(crash);
  const handleOnClose = () => {
    onClose(null);
  };
  return (
    <>
      <div
        className="
                bg-slate-200 
                shadow-xl hover:shadow-2xl 
                border border-gray-100 hover:border-gray-400  
                duration-1000 
                p-3
                absolute md:top-5 md:right-5 top-0 right-0
                w-screen md:w-2/4 lg:w-1/4
                md:h-[90vh] md:rounded-2xl overflow-auto 
                transition-all ease-in-out translate-y-0 
              "
      >
        <IoIosCloseCircle
          size={40}
          color="red"
          className=" absolute top-2 right-2  hover:rotate-180 transition duration-700"
          onClick={() => handleOnClose()}
        />

        <h2 className="text-3xl">Registro de Accidente</h2>
        <div className="border p-2 my-1 border-slate-200 rounded-e-2xl ">
          {/* Created */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Creación</label>
            <label className=" font-light">{crash.created}</label>
          </div>

          {/* Author */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Autor</label>
            <label>{crash.author}</label>
          </div>

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Placa</label>
            <label>{crash.carPlate}</label>
          </div>

          {/* Location */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Ubicación</label>
            <div className="flex flex-col">
              <label className=" font-medium">Latitud</label>
              <label>{crash.latitude}</label>
            </div>
            <div className="flex flex-col">
              <label className=" font-medium">Longitud</label>
              <label>{crash.longitude}</label>
            </div>
          </div>
          <Map longitude={crash.longitude} latitude={crash.latitude} />

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Daños</label>
            <label>{crash.crashedParts}</label>
          </div>
          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Detalles</label>
            <label>{crash.crashDetails}</label>
          </div>
          {/*  location */}
          <div className="flex flex-row justify-between my-2 gap-1">
            <label className=" font-medium">Localización</label>
            <label>{crash.location}</label>
          </div>

          {/*Images */}
          <h3 className="text-3xl">Fotos</h3>
        </div>
        {data != null && (
          <div className="flex flex-row justify-center align-middle my-2 border rounded-2xl p-2">
            {loading && <BeatLoader size={24} />}
            {data !== null &&
              data.map((photo) => (
                <img
                  src={photo.filePath}
                  alt={photo.name}
                  className=" w-full rounded-2xl"
                />
              ))}
          </div>
        )}
      </div>
    </>
  );
}

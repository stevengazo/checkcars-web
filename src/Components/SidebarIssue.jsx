import { IoIosCloseCircle } from "react-icons/io";
import useFetch from "../Hook/useFetch";
import { BeatLoader } from "react-spinners";
import Map from "../Components/MapLocation";

export default function SideBarIssue({ issue, onClose }) {
  const { data, loading, error, refetch } = useFetch(
    `https://mecsacars.stevengazo.co.cr/api/Photos/report/${issue.reportId}`,
    { autoFetch: true }
  );

  console.log(issue);
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
                p-1
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

        <h2 className="text-3xl">Registro de Avería</h2>
        <div className="border p-2 my-1 border-slate-200 rounded-e-2xl ">
          {/* Created */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Creación</label>
            <label className=" font-light">{issue.created}</label>
          </div>

          {/* Author */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Autor</label>
            <label>{issue.author}</label>
          </div>

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Placa</label>
            <label>{issue.carPlate}</label>
          </div>

          {/* Location */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Ubicación</label>
            <div className="flex flex-col">
              <label className=" font-medium">Latitud</label>
              <label>{issue.latitude}</label>
            </div>
            <div className="flex flex-col">
              <label className=" font-medium">Longitud</label>
              <label>{issue.longitude}</label>
            </div>
          </div>
          <Map longitude={issue.longitude} latitude={issue.latitude} />
          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Tipo</label>
            <label>{issue.type}</label>
          </div>

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Detalles</label>
            <label>{issue.details}</label>
          </div>

          {/* Car Plate */}
          <div className="flex flex-row justify-between my-2">
            <label className=" font-medium">Prioridad</label>
            <label>{issue.priority}</label>
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

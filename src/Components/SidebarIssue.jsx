import { IoIosCloseCircle } from "react-icons/io";
import useFetch from "../Hook/useFetch";
import { BeatLoader } from "react-spinners";

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
      <div className="bg-slate-200 shadow-xl absolute top-5 right-5 sm:w-48  md:w-1/4 p-4  h-[90vh] rounded-lg overflow-auto">
        <div className="relative " onClick={() => handleOnClose()}>
          <IoIosCloseCircle size={24} />
        </div>
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

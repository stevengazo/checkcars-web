import { IoIosWarning } from "react-icons/io";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-blue-400 text-white">
      <div className="text-center">
        <IoIosWarning className="mx-auto" size={120} />
        <h1 className="text-6xl font-bold">Error 404</h1>
        <p className="mt-4 text-xl">
          La página no fue encontrada... andas perdido
        </p>
      </div>
      <Link to="/" className="border border-white rounded-xl p-3 m-4">
        Volvamos a Casa
      </Link>
    </div>
  );
};

export default ErrorPage;

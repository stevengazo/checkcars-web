import ReportGeneralByCar from "../Components/ReportGeneralByCar";
import ReportGeneralByUsers from "../Components/ReportGeneralByUsers";
import ReportByYear from "../Components/ReportByYear";
import ReportCarsByBrand from "../Components/ReportCarsByBrand";
import ReportCarByType from "../Components/ReportCarByType";

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center">
        Bienvenido a la Aplicación
      </h1>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4">
          <ReportGeneralByCar />
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <ReportGeneralByUsers />
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <ReportCarByType />
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <ReportCarsByBrand />
        </div>
        
       
      </div>
      <ReportByYear />
    </div>
  );
};

export default Home;

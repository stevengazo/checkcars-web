
import { useParams } from "react-router-dom";

const ViewCrash = () => {
    const { id } = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Crash Report</h1>
      <p className="text-lg">This page is currently under construction.</p>
      <p className="text-lg">Please check back later for updates.</p>
    </div>
  );
}

export default ViewCrash;
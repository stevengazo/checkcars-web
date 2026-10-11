import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Config from "./Pages/Config";
import Exits from "./Pages/Exits";
import DashboardLayout from "./Components/templates/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import CarList from "./Pages/CarList";
import CarView from "./Pages/CarView";
import Crashes from "./Pages/crashes";
import Issues from "./Pages/issues";
import Home from "./Pages/Home";
import Returns from "./Pages/Returns";
import ErrorPage from "./Pages/Error";
import ForgotPassword from "./Pages/ForgotPassword";
import BookingPage from "./Pages/BookingPage";
import ViewExit from "./Pages/ViewExit";
import ViewCrash from "./Pages/ViewCrash";
import ViewReturn from "./Pages/ViewReturn";
import ViewIssue from "./Pages/ViewIssue";
import CarServices from "./Pages/CarServices";
import Demo from "./Pages/demo";
import Register from "./Pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/exits" element={<Exits />} />
            <Route path="/crash" element={<Crashes />} />
            <Route path="/issue" element={<Issues />} />
            <Route path="/config" element={<Config />} />
            {/* Usuarios se movió a Configuración */}
            <Route path="/users" element={<Navigate to="/config" replace />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/carservices" element={<CarServices />} />
            <Route path="/carlist" element={<CarList />} />
            <Route path="/car/:id" element={<CarView />} />
            <Route path="/viewexit/:id" element={<ViewExit />} />
            <Route path="/viewcrash/:id" element={<ViewCrash />} />
            <Route path="/viewreturn/:id" element={<ViewReturn />} />
            <Route path="/viewissue/:id" element={<ViewIssue />} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;

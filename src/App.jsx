import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Exits from "./Pages/Exits";
import Layout from "./Module/Layout";
import CarList from "./Pages/CarList";
import CarView from "./Pages/CarView";
import Crashes from "./Pages/crashes";
import Issues from "./Pages/issues";
import Users from "./Pages/UsersPage";
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

import { useEffect } from "react";
import {
  startConnection,
  onNotificationReceived,
} from "./service/signalRService";

function App() {
  const [count, setCount] = useState(0);

  const [notifications, setNotifications] = useState([]);
  /*
  useEffect(() => {
    startConnection();

    onNotificationReceived((message) => {
      setNotifications((prev) => [...prev, message]);
    });
  }, []);*/

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/Exits" element={<Exits />} />
          <Route path="/crash" element={<Crashes />} />
          <Route path="/issue" element={<Issues />} />
          <Route path="/users" element={<Users />} />
          <Route path="/returns" element={<Returns />} />
         <Route path="/demo" element={<Demo />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/carservices" element={<CarServices />} />
          <Route path="/CarList" element={<CarList />} />
          <Route path="/car/:id" element={<CarView />} />
          <Route path="/viewexit/:id" element={<ViewExit />} />
          <Route path="/viewcrash/:id" element={<ViewCrash />} />
          <Route path="/viewreturn/:id" element={<ViewReturn />} />
          <Route path="/viewissue/:id" element={<ViewIssue />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;

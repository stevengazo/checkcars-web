import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Layout from "./Module/Layout";
import CarList from "./Pages/CarList";
import CarView from "./Pages/CarView";
import Crashes from "./Pages/crashes";
import Issues from "./Pages/issues";
import Users from "./Pages/UsersPage"
import ErrorPage from "./Pages/Error";
import ForgotPassword from "./Pages/ForgotPassword";
import BookingPage from "./Pages/BookingPage";

import { useEffect } from "react";
import { startConnection, onNotificationReceived } from './service/signalRService'


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
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/crash" element={<Crashes />} />
          <Route path="/issue" element={<Issues />} />
          <Route path="/users" element={<Users/>} />
          <Route path="/booking" element={<BookingPage/>} />
          <Route path="/CarList" element={<CarList />} />
          <Route path="/car/:id" element={<CarView />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;

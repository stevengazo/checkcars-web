import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Navbar from "./Components/NavBar";
import CarList from "./Pages/CarList";
import CarView from "./Pages/CarView";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Navbar />}>
          <Route path="/home" element={<Home />} />
          <Route path="/CarList" element={<CarList />} />
          <Route path="/carview" element={<CarView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Layout from "./Module/Layout";
import Navbar from "./Components/NavBar";
import CarList from "./Pages/CarList";
import CarView from "./Pages/CarView";
import Crashes from "./Pages/crashes";
import Issues from "./Pages/issues";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/crash" element={<Crashes />} />
          <Route path="/issue" element={<Issues />} />
          <Route path="/CarList" element={<CarList />} />
          <Route path="/carview" element={<CarView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

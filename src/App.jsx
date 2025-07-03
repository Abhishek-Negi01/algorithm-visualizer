import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sorting from "./pages/Sorting";
import PathFinding from "./pages/PathFinding";
import Recursion from "./pages/Recursion";
import GraphPage from "./pages/GraphPage";

const App = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden  bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-white ">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sorting" element={<Sorting />} />
          <Route path="/pathfinding" element={<PathFinding />} />
          <Route path="/recursion" element={<Recursion />} />
          <Route path="/graph" element={<GraphPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

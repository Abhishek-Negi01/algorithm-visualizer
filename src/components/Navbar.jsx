import React, { useEffect, useState } from "react";
import logo from "/src/assets/logo.png";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
        <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
          Algorithm Visualizer
        </h1>
      </div>
    </nav>
  );
};

export default Navbar;

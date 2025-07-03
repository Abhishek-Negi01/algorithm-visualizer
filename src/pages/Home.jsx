import React from "react";
import {
  FaMap,
  FaMapMarkedAlt,
  FaReact,
  FaRedo,
  FaSortAlphaDown,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const cards = [
    {
      title: "Sorting",
      description:
        "Visualize sorting algorithms like Bubble, Merge, and Quick Sort.",
      icon: (
        <FaSortAlphaDown className="text-blue-600 dark:text-blue-400 text-5xl" />
      ),
      path: "/sorting",
    },
    {
      title: "Pathfinding",
      description: "Watch pathfinding in action using Dijkstra and A*.",
      icon: (
        <FaMapMarkedAlt className="text-green-600 dark:text-green-400 text-5xl" />
      ),
      path: "/pathfinding",
    },
    {
      title: "Recursion",
      description:
        "Explore recursive algorithms like Tower of Hanoi and Fibonacci.",
      icon: (
        <FaRedo className="text-purple-600 dark:text-purple-400 text-5xl" />
      ),
      path: "/recursion",
    },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-center mb-4 text-gray-800 dark:text-white">
        Algorithm Visualizer
      </h1>
      <p className="text-lg mb-10 text-center text-gray-600 dark:text-gray-300">
        Visualize. Understand. Master.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {cards.map((card) => (
          <Link
            to={card.path}
            key={card.title}
            className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 text-center min-h-[300px] flex flex-col justify-center items-center hover:scale-105 transition-transform duration-200"
          >
            <div className="flex flex-col justify-center items-center flex-grow">
              <div className="mb-4">{card.icon}</div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              {card.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

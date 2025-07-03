import React, { useState } from "react";
import Node from "./Node";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import { useNavigate } from "react-router-dom";

const NUM_ROWS = 20;
const NUM_COLS = 50;

// const createGrid = () => {
//   const grid = [];
//   for (let row = 0; row < NUM_ROWS; row++) {
//     const currentRow = [];
//     for (let col = 0; col < NUM_COLS; col++) {
//       currentRow.push({
//         row,
//         col,
//         isStart: row === 10 && col == 5,
//         isEnd: row === 10 && col === 44,
//         isWall: false,
//         isVisited: false,
//         isPath: false,
//         previousNode: null,
//       });
//     }
//     grid.push(currentRow);
//   }
//   return grid;
// };

const createGrid = () => {
  const grid = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NUM_COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === 10 && col === 5,
        isEnd: row === 10 && col === 44,
        isWall: false,
        isVisited: false,
        isPath: false,
        previousNode: null,
        weight: Math.floor(Math.random() * 90) + 1, // Random weight between 1-90
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

const Grid = () => {
  const [grid, setGrid] = useState(createGrid());
  const [selectedAlgo, setSelectedAlgo] = useState("bfs");

  const toggleWall = (row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return;
    newGrid[row][col] = { ...node, isWall: !node.isWall };
    setGrid(newGrid);
  };

  const handleVisualize = async () => {
    const startNode = grid.flat().find((node) => node.isStart);
    const endNode = grid.flat().find((node) => node.isEnd);
    if (!startNode || !endNode) return;

    switch (selectedAlgo) {
      case "bfs":
        await handleBfs();
        break;
      case "dfs":
        // await dfs(grid, startNode, endNode, () => setGrid([...grid]));
        await handleDFS();
        break;
      default:
        break;
    }
  };

  //   const resetGrid = () => {
  //     setGrid(createGrid());
  //   };

  const resetGrid = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        isPath: false,
        previousNode: null,
      }))
    );
    setGrid(newGrid);
  };

  const handleBfs = async () => {
    const startNode = grid.flat().find((node) => node.isStart);
    const endNode = grid.flat().find((node) => node.isEnd);

    // await bfs(grid, startNode, endNode, () => setGrid([...grid]));
    await bfs(grid, startNode, endNode, (newGrid) => setGrid(newGrid));
  };

  const handleDFS = async () => {
    const startNode = grid.flat().find((node) => node.isStart);
    const endNode = grid.flat().find((node) => node.isEnd);

    // await dfs(grid, startNode, endNode, () => setGrid([...grid]));
    await dfs(grid, startNode, endNode, (newGrid) => setGrid(newGrid));
  };

  const navigate = useNavigate();

  const handleOtherAlgorithm = () => {
    navigate("/graph");
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* controls */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="p-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="bfs">Breadth-First-Search(BFS)</option>
          <option value="dfs">Deapth-First-Search(DFS)</option>
        </select>

        <button
          onClick={handleVisualize}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Visualize
        </button>
        <button
          onClick={resetGrid}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset Grid
        </button>
        <button
          onClick={handleOtherAlgorithm}
          className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
        >
          Other Algorithm's
        </button>
      </div>
      {/* Grid */}
      <div className="flex flex-col items-center gap-1">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {/* {row.map((node, colIndex) => (
              <Node key={colIndex} {...node} onClick={toggleWall} />
            ))} */}
            {row.map((node, colIndex) => (
              <Node
                key={colIndex}
                row={rowIndex}
                col={colIndex}
                isStart={node.isStart}
                isEnd={node.isEnd}
                isWall={node.isWall}
                isVisited={node.isVisited}
                isPath={node.isPath}
                weight={node.weight} // Add this line
                onClick={toggleWall}
              />
            ))}
          </div>
        ))}
        {/* <button
        className="mt-4 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => handleBfs()}
      >
        Visualize BFS
      </button>
      <button
        className="mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        onClick={() => handleDFS()}
      >
        Visualize DFS
      </button> */}
      </div>
    </div>
  );
};

export default Grid;

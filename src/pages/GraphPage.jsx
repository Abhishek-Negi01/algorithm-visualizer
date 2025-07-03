import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dijkstra } from "../algorithms/dijkstra";
import { prim } from "../algorithms/prim";
import { kruskal } from "../algorithms/kruskal";

const baseGraphs = {
  dijkstra: [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 1 },
    { from: 2, to: 1, weight: 2 },
    { from: 1, to: 3, weight: 1 },
    { from: 2, to: 3, weight: 5 },
    { from: 3, to: 4, weight: 3 },
  ],
  prim: [
    { from: 0, to: 1, weight: 2 },
    { from: 0, to: 3, weight: 6 },
    { from: 1, to: 2, weight: 3 },
    { from: 1, to: 3, weight: 8 },
    { from: 1, to: 4, weight: 5 },
    { from: 2, to: 4, weight: 7 },
    { from: 3, to: 4, weight: 9 },
  ],
  kruskal: [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 4 },
    { from: 1, to: 2, weight: 2 },
    { from: 2, to: 3, weight: 3 },
    { from: 3, to: 4, weight: 2 },
    { from: 4, to: 5, weight: 3 },
    { from: 5, to: 0, weight: 7 },
  ],
};

const createGraph = (algo, isDirected = true) => {
  const baseEdges = baseGraphs[algo];
  const nodes = Array.from(
    new Set(baseEdges.flatMap((e) => [e.from, e.to])),
    (id) => ({ id })
  );
  const edges = [...baseEdges];

  if (!isDirected && algo === "dijkstra") {
    baseEdges.forEach(({ from, to, weight }) => {
      if (!edges.find((e) => e.from === to && e.to === from)) {
        edges.push({ from: to, to: from, weight });
      }
    });
  }

  return { nodes, edges };
};

const useQuery = () => new URLSearchParams(useLocation().search);

const GraphPage = () => {
  const query = useQuery();
  const [isDirected, setIsDirected] = useState(true);
  const [selectedAlgo, setSelectedAlgo] = useState("dijkstra");
  const [graphData, setGraphData] = useState(createGraph("dijkstra", true));
  const [visualSteps, setVisualSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [source, setSource] = useState(0);
  const [target, setTarget] = useState(4);
  const [finalCost, setFinalCost] = useState(null);

  useEffect(() => {
    const src = Number(query.get("source")) || 0;
    const tgt = Number(query.get("target")) || 4;
    setSource(src);
    setTarget(tgt);
    setGraphData(createGraph(selectedAlgo, isDirected));
  }, [selectedAlgo, isDirected]);

  const handleRun = async () => {
    let steps = [];
    let result = {};
    if (selectedAlgo === "dijkstra") {
      steps = await dijkstra(graphData, source, target);
    } else if (selectedAlgo === "prim") {
      result = await prim(graphData);
      steps = result.steps;
      setFinalCost(result.cost);
    } else if (selectedAlgo === "kruskal") {
      result = await kruskal(graphData);
      steps = result.steps;
      setFinalCost(result.cost);
    }
    setVisualSteps(steps);
    setStepIndex(0);
    runSteps(steps);
  };

  const runSteps = async (steps) => {
    for (let i = 0; i < steps.length; i++) {
      setStepIndex(i);
      await new Promise((res) => setTimeout(res, 500));
    }
  };

  const handleReset = () => {
    setVisualSteps([]);
    setStepIndex(0);
    setGraphData(createGraph(selectedAlgo, isDirected));
    setFinalCost(null);
  };

  const currentStep = visualSteps[stepIndex] || {};

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Graph Algorithm Visualizer
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="p-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="prim">Prim's Algorithm</option>
          <option value="kruskal">Kruskal's Algorithm</option>
        </select>

        {selectedAlgo === "dijkstra" && (
          <>
            <label className="flex flex-col text-sm">
              Source Node
              <input
                type="number"
                value={source}
                onChange={(e) => setSource(Number(e.target.value))}
                className="p-1 border rounded"
              />
            </label>

            <label className="flex flex-col text-sm">
              Target Node
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="p-1 border rounded"
              />
            </label>
          </>
        )}

        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={!isDirected}
            onChange={() => setIsDirected((prev) => !prev)}
            className="mr-2"
          />
          Undirected Graph
        </label>

        <button
          onClick={handleRun}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Visualize
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {finalCost !== null && (
        <div className="mb-4 text-green-600 font-semibold">
          Minimum Cost: {finalCost}
        </div>
      )}

      <svg width="900" height="500" className="border border-gray-300">
        {graphData.edges.map((edge, i) => {
          const from = graphData.nodes.find((n) => n.id === edge.from);
          const to = graphData.nodes.find((n) => n.id === edge.to);
          const x1 = 80 + from.id * 70;
          const y1 = 100 + (from.id % 2) * 150;
          const x2 = 80 + to.id * 70;
          const y2 = 100 + (to.id % 2) * 150;

          const isVisited = currentStep.visitedEdges?.some(
            (e) => e.from === edge.from && e.to === edge.to
          );
          const isMST = currentStep.mstEdges?.some(
            (e) => e.from === edge.from && e.to === edge.to
          );

          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMST ? "green" : isVisited ? "orange" : "#aaa"}
                strokeWidth={isMST ? 3 : 2}
              />
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 10}
                fill="cyan"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {graphData.nodes.map((node) => {
          const x = 80 + node.id * 70;
          const y = 100 + (node.id % 2) * 150;
          const isCurrent = currentStep.currentNode === node.id;
          const isPath = currentStep.path?.includes(node.id);

          return (
            <g key={node.id}>
              <circle
                cx={x}
                cy={y}
                r="18"
                fill={isPath ? "green" : isCurrent ? "orange" : "#ddd"}
                stroke="black"
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fill="black"
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GraphPage;

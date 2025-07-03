// // /src/components/GraphCanvas.jsx
// import React, { useState } from "react";

// const GraphCanvas = ({ graphData, setGraphData }) => {
//   const [selectedNode, setSelectedNode] = useState(null);

//   const handleCanvasClick = (e) => {
//     const rect = e.target.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const newNode = {
//       id: graphData.nodes.length,
//       x,
//       y,
//       visited: false,
//       path: false,
//     };
//     setGraphData((prev) => ({
//       ...prev,
//       nodes: [...prev.nodes, newNode],
//     }));
//   };

//   const handleNodeClick = (id) => {
//     if (selectedNode === null) {
//       setSelectedNode(id);
//     } else if (selectedNode !== id) {
//       const weight = parseInt(prompt("Enter edge weight", "1"));
//       if (!isNaN(weight)) {
//         const newEdge = {
//           from: selectedNode,
//           to: id,
//           weight,
//         };
//         setGraphData((prev) => ({
//           ...prev,
//           edges: [...prev.edges, newEdge],
//         }));
//       }
//       setSelectedNode(null);
//     } else {
//       setSelectedNode(null);
//     }
//   };

//   return (
//     <svg
//       width="100%"
//       height="500px"
//       onClick={handleCanvasClick}
//       style={{ border: "1px solid gray" }}
//     >
//       {/* Edges */}
//       {graphData.edges.map((edge, index) => {
//         const from = graphData.nodes.find((n) => n.id === edge.from);
//         const to = graphData.nodes.find((n) => n.id === edge.to);
//         if (!from || !to) return null;

//         const midX = (from.x + to.x) / 2;
//         const midY = (from.y + to.y) / 2;

//         return (
//           <g key={index}>
//             <line
//               x1={from.x}
//               y1={from.y}
//               x2={to.x}
//               y2={to.y}
//               stroke="gray"
//               strokeWidth="2"
//             />
//             <text
//               x={midX}
//               y={midY}
//               textAnchor="middle"
//               fill="red"
//               fontSize="12"
//             >
//               {edge.weight}
//             </text>
//           </g>
//         );
//       })}

//       {/* Nodes */}
//       {graphData.nodes.map((node) => (
//         <g
//           key={node.id}
//           onClick={(e) => {
//             e.stopPropagation(); // prevent canvas click
//             handleNodeClick(node.id);
//           }}
//         >
//           <circle
//             cx={node.x}
//             cy={node.y}
//             r={20}
//             fill={node.path ? "green" : node.visited ? "orange" : "skyblue"}
//             stroke="black"
//           />
//           <text
//             x={node.x}
//             y={node.y + 5}
//             textAnchor="middle"
//             fontSize="12"
//             fill="black"
//           >
//             {node.id}
//           </text>
//         </g>
//       ))}
//     </svg>
//   );
// };

// export default GraphCanvas;
// /src/components/GraphCanvas.jsx
import React, { useEffect, useRef } from "react";

const GraphCanvas = ({ graphData, setGraphData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graphData.nodes.length) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    ctx.clearRect(0, 0, width, height);

    const nodeRadius = 20;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    const angleStep = (2 * Math.PI) / graphData.nodes.length;
    const positions = {};

    graphData.nodes.forEach((node, i) => {
      const angle = i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions[node.id] = { x, y };
    });

    // Draw edges
    for (const edge of graphData.edges) {
      const from = positions[edge.from];
      const to = positions[edge.to];
      if (!from || !to) continue;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = edge.isPath
        ? "green"
        : edge.visited
        ? "orange"
        : "gray";
      ctx.lineWidth = edge.isPath ? 4 : 2;
      ctx.stroke();

      // Draw weight at midpoint
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      ctx.fillStyle = "black";
      ctx.font = "14px sans-serif";
      ctx.fillText(edge.weight, midX + 5, midY - 5);
    }

    // Draw nodes
    for (const node of graphData.nodes) {
      const { x, y } = positions[node.id];
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = node.isPath
        ? "green"
        : node.isVisited
        ? "orange"
        : "lightgray";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.id, x, y);
    }

    // Update node positions in state if needed
    graphData.nodes.forEach((node) => {
      node.x = positions[node.id].x;
      node.y = positions[node.id].y;
    });
  }, [graphData]);

  return (
    <div className="w-full h-[600px] border rounded mt-4 relative">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default GraphCanvas;

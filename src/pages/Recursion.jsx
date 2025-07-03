// import React, { useState, useRef } from "react";

// const delay = (ms, signal) =>
//   new Promise((res, rej) => {
//     const timeout = setTimeout(res, ms);
//     signal?.addEventListener("abort", () => {
//       clearTimeout(timeout);
//       rej("Aborted");
//     });
//   });

// const Recursion = () => {
//   const [inputValue, setInputValue] = useState(5);
//   const [logs, setLogs] = useState([]);
//   const [running, setRunning] = useState(false);
//   const controllerRef = useRef(null);
//   const [selectedAlgo, setSelectedAlgo] = useState("fibonacci");

//   const logStep = async (message, depth, signal, type = "call") => {
//     setLogs((prev) => [
//       ...prev,
//       { message, depth, type, id: crypto.randomUUID() },
//     ]);
//     await delay(type === "call" ? 500 : 300, signal);
//   };

//   const fibonacci = async (n, depth = 0, signal) => {
//     await logStep(`fibonacci(${n})`, depth, signal, "call");
//     if (n <= 1) {
//       await logStep(`return ${n}`, depth, signal, "return");
//       return n;
//     }
//     const a = await fibonacci(n - 1, depth + 1, signal);
//     const b = await fibonacci(n - 2, depth + 1, signal);
//     const result = a + b;
//     await logStep(`return ${result}`, depth, signal, "return");
//     return result;
//   };

//   const factorial = async (n, depth = 0, signal) => {
//     await logStep(`factorial(${n})`, depth, signal, "call");
//     if (n <= 1) {
//       await logStep(`return 1`, depth, signal, "return");
//       return 1;
//     }
//     const sub = await factorial(n - 1, depth + 1, signal);
//     const result = n * sub;
//     await logStep(`return ${result}`, depth, signal, "return");
//     return result;
//   };

//   const handleVisualize = async () => {
//     setLogs([]);
//     setRunning(true);
//     const controller = new AbortController();
//     controllerRef.current = controller;

//     try {
//       const signal = controller.signal;
//       if (selectedAlgo === "fibonacci") {
//         await fibonacci(Number(inputValue), 0, signal);
//       } else if (selectedAlgo === "factorial") {
//         await factorial(Number(inputValue), 0, signal);
//       }
//     } catch (err) {
//       if (err !== "Aborted") console.error(err);
//     }

//     setRunning(false);
//   };

//   const handleReset = () => {
//     controllerRef.current?.abort();
//     setLogs([]);
//     setInputValue(5);
//     setRunning(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 text-white p-6">
//       <h1 className="text-4xl font-bold text-center mb-6 text-blue-400">
//         Recursion Visualizer
//       </h1>

//       <div className="flex justify-center flex-wrap items-end gap-4 mb-8">
//         <label className="text-sm">
//           Algorithm
//           <select
//             value={selectedAlgo}
//             onChange={(e) => setSelectedAlgo(e.target.value)}
//             className="ml-2 p-2 rounded bg-gray-800 border border-gray-600 text-white"
//           >
//             <option value="fibonacci">Fibonacci</option>
//             <option value="factorial">Factorial</option>
//           </select>
//         </label>

//         <label className="text-sm">
//           Input Value
//           <input
//             type="number"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             className="ml-2 p-2 rounded bg-gray-800 border border-gray-600 text-white w-20"
//             min="0"
//             max="10"
//           />
//         </label>

//         <button
//           onClick={handleVisualize}
//           disabled={running}
//           className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
//         >
//           Visualize
//         </button>

//         <button
//           onClick={handleReset}
//           className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
//         >
//           Reset
//         </button>
//       </div>

//       <div className="overflow-x-auto max-w-full p-4 bg-gray-900 rounded shadow-lg">
//         <div className="whitespace-nowrap flex flex-col gap-2">
//           {logs.map((log, index) => (
//             <div
//               key={log.id}
//               style={{ marginLeft: `${log.depth * 32}px` }}
//               className={`inline-block px-4 py-2 rounded text-sm w-fit transition-all duration-300 ${
//                 log.type === "call"
//                   ? "bg-indigo-600 text-white"
//                   : "bg-emerald-600 text-white"
//               }`}
//             >
//               {log.message}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Recursion;

// /src/components/Recursion.jsx
import React, { useState, useRef } from "react";

const delay = (ms, signal) =>
  new Promise((res, rej) => {
    const timeout = setTimeout(res, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      rej("Aborted");
    });
  });

const Recursion = () => {
  const [inputValue, setInputValue] = useState(5);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const controllerRef = useRef(null);
  const [selectedAlgo, setSelectedAlgo] = useState("fibonacci");

  const logStep = async (message, depth, signal) => {
    setLogs((prev) => [...prev, { message, depth, type: "call" }]);
    await delay(500, signal);
  };

  const logReturn = async (message, depth, signal) => {
    setLogs((prev) => [...prev, { message, depth, type: "return" }]);
    await delay(300, signal);
  };

  const fibonacci = async (n, depth = 0, signal) => {
    await logStep(`fibonacci(${n})`, depth, signal);
    if (n <= 1) {
      await logReturn(`return ${n}`, depth, signal);
      return n;
    }
    const a = await fibonacci(n - 1, depth + 1, signal);
    const b = await fibonacci(n - 2, depth + 1, signal);
    const result = a + b;
    await logReturn(`return ${result}`, depth, signal);
    return result;
  };

  const factorial = async (n, depth = 0, signal) => {
    await logStep(`factorial(${n})`, depth, signal);
    if (n <= 1) {
      await logReturn(`return 1`, depth, signal);
      return 1;
    }
    const sub = await factorial(n - 1, depth + 1, signal);
    const result = n * sub;
    await logReturn(`return ${result}`, depth, signal);
    return result;
  };

  const handleVisualize = async () => {
    setLogs([]);
    setResult(null);
    setRunning(true);
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const signal = controller.signal;
      let final;
      if (selectedAlgo === "fibonacci") {
        final = await fibonacci(Number(inputValue), 0, signal);
      } else if (selectedAlgo === "factorial") {
        final = await factorial(Number(inputValue), 0, signal);
      }
      setResult(final);
    } catch (err) {
      if (err !== "Aborted") console.error(err);
    }

    setRunning(false);
  };

  const handleReset = () => {
    controllerRef.current?.abort();
    setLogs([]);
    setInputValue(5);
    setRunning(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-400">
        Recursion Visualizer
      </h1>

      <div className="flex justify-center gap-4 mb-8 items-end flex-wrap">
        <label className="text-sm">
          Algorithm
          <select
            value={selectedAlgo}
            onChange={(e) => setSelectedAlgo(e.target.value)}
            className="ml-2 p-2 rounded bg-gray-800 border border-gray-600 text-white"
          >
            <option value="fibonacci">Fibonacci</option>
            <option value="factorial">Factorial</option>
          </select>
        </label>

        <label className="text-sm">
          Input Value
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="ml-2 p-2 rounded bg-gray-800 border border-gray-600 text-white w-20"
            min="0"
            max="10"
          />
        </label>

        <button
          onClick={handleVisualize}
          disabled={running}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          Visualize
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
        >
          Reset
        </button>
      </div>

      <div className="flex gap-8 flex-col lg:flex-row max-w-6xl mx-auto">
        <div className="flex-1 bg-gray-900 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold text-yellow-300 mb-2">
            Call Stack
          </h2>
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div
                key={index}
                style={{ marginLeft: `${log.depth * 30}px` }}
                className={`transition-all duration-300 text-sm py-1 px-2 rounded-md w-fit
                  ${
                    log.type === "call"
                      ? "bg-purple-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
              >
                {log.message}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/4 bg-gray-800 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">
            Final Result
          </h2>
          {result !== null ? (
            <div className="text-3xl font-bold text-center text-green-400">
              {result}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              Waiting for execution...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recursion;

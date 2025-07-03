import { motion } from "framer-motion";
import React, { useState } from "react";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const COLORS = {
  default: "bg-blue-500",
  comparing: "bg-yellow-400",
  swapping: "bg-red-500",
  pivot: "bg-purple-500",
  middle: "bg-orange-400",
  heapify: "bg-pink-400",
  sorted: "bg-green-500",
};

const Sorting = () => {
  const [inputArray, setInputArray] = useState("");
  const [array, setArray] = useState([]);
  const [colorArray, setColorArray] = useState([]);
  // const [speed, setSpeed] = useState(1000);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [shouldStop, setShouldStop] = useState(false);

  const generateRandomArray = (length = 10) => {
    if (isSorting) return;

    const randomArr = Array.from(
      { length },
      () => Math.floor(Math.random() * 50) + 1
    );

    const colors = new Array(length).fill("default");

    setInputArray(randomArr.join(","));
    setArray([...randomArr]);
    setColorArray(colors);
  };

  // const generateRandomArray = async (length = 10) => {
  //   const randomArr = Array.from(
  //     { length },
  //     () => Math.floor(Math.random() * 50) + 1
  //   );

  //   const colors = new Array(length).fill("default");

  //   setInputArray(randomArr.join(","));
  //   setArray([...randomArr]);
  //   setColorArray(colors);
  //   setIsSorting(true);

  //   const arrCopy = [...randomArr];

  //   switch (algorithm) {
  //     case "bubble":
  //       await bubbleSort(arrCopy);
  //       break;
  //     case "selection":
  //       await selectionSort(arrCopy);
  //       break;
  //     case "insertion":
  //       await insertionSort(arrCopy);
  //       break;
  //     case "quick":
  //       await quickSort(arrCopy, 0, arrCopy.length - 1, colors);
  //       break;
  //     case "merge":
  //       await mergeSort(arrCopy, 0, arrCopy.length - 1, colors);
  //       break;
  //     case "heap":
  //       await heapSort(arrCopy);
  //       break;
  //     default:
  //       break;
  //   }

  //   for (let i = 0; i < arrCopy.length; i++) {
  //     colors[i] = "sorted";
  //   }

  //   await update(arrCopy, colors);
  //   setArray([...arrCopy]);
  //   setColorArray([...colors]);
  //   setIsSorting(false);
  // };

  const parseInput = () => {
    return inputArray
      .split(",")
      .map((n) => Number(n.trim()))
      .filter((n) => !isNaN(n));
  };

  const update = async (arr, colors) => {
    setArray([...arr]);
    setColorArray([...colors]);
    await delay(500);
  };

  // const update = async (arr, colors) => {
  //   setArray([...arr]);
  //   setColorArray([...colors]);
  //   await delay(speed);
  // };

  const bubbleSort = async (arr) => {
    let colors = new Array(arr.length).fill("default");
    const n = arr.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight comparison
        colors[j] = "comparing";
        colors[j + 1] = "comparing";
        await update(arr, colors);

        if (arr[j] > arr[j + 1]) {
          // Show swap
          colors[j] = "swapping";
          colors[j + 1] = "swapping";
          await update(arr, colors);

          // Perform swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          await update(arr, colors);
        }

        // Reset colors
        colors[j] = "default";
        colors[j + 1] = "default";
        await update(arr, colors);
      }

      colors[n - i - 1] = "sorted";
      await update(arr, colors);
    }
  };

  const selectionSort = async (arr) => {
    let colors = new Array(arr.length).fill("default");
    const n = arr.length;

    for (let i = 0; i < n; i++) {
      let minIndex = i;

      // Highlight current minimum
      colors[minIndex] = "comparing";
      await update(arr, colors);

      for (let j = i + 1; j < n; j++) {
        // Highlight current element being compared
        colors[j] = "comparing";
        await update(arr, colors);

        if (arr[j] < arr[minIndex]) {
          // Reset previous minimum
          colors[minIndex] = "default";
          minIndex = j;
        } else {
          // Reset current element
          colors[j] = "default";
        }

        // Highlight new minimum
        colors[minIndex] = "comparing";
        await update(arr, colors);
      }

      if (minIndex !== i) {
        // Show swap
        colors[i] = "swapping";
        colors[minIndex] = "swapping";
        await update(arr, colors);

        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        await update(arr, colors);
      }

      // Reset colors and mark sorted
      colors.fill("default");
      colors[i] = "sorted";
      await update(arr, colors);
    }
  };

  const insertionSort = async (arr) => {
    let colors = new Array(arr.length).fill("default");
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      // Highlight current element being inserted
      colors[i] = "comparing";
      await update(arr, colors);

      while (j >= 0 && arr[j] > key) {
        // Show shift operation
        colors[j] = "swapping";
        await update(arr, colors);

        arr[j + 1] = arr[j];
        await update(arr, colors);

        // Reset color
        colors[j] = "default";
        j--;
      }

      // Place the key in correct position
      arr[j + 1] = key;
      colors.fill("default");
      await update(arr, colors);
    }

    // Mark all as sorted at the end
    colors.fill("sorted");
    await update(arr, colors);
  };

  // const quickSort = async (arr, low = 0, high = arr.length - 1, colors) => {
  //   if (low < high) {
  //     // Highlight the current partition
  //     for (let i = low; i <= high; i++) {
  //       colors[i] = "middle";
  //     }
  //     await update(arr, colors);

  //     // Highlight pivot
  //     colors[high] = "pivot";
  //     await update(arr, colors);

  //     const pivotIndex = await partition(arr, low, high, colors);

  //     // Visualize the partitioned array
  //     colors[pivotIndex] = "sorted";
  //     await update(arr, colors);

  //     // Reset colors before recursive calls
  //     for (let i = low; i <= high; i++) {
  //       if (i !== pivotIndex) colors[i] = "default";
  //     }
  //     await update(arr, colors);

  //     await Promise.all([
  //       quickSort(arr, low, pivotIndex - 1, colors),
  //       quickSort(arr, pivotIndex + 1, high, colors),
  //     ]);
  //   } else if (low === high) {
  //     // Single element case
  //     colors[low] = "sorted";
  //     await update(arr, colors);
  //   }
  // };

  const quickSort = async (arr, low = 0, high = arr.length - 1, colors) => {
    if (low < high) {
      // Visualize the current subarray being worked on
      for (let i = low; i <= high; i++) {
        colors[i] = "middle";
      }
      await update(arr, colors);

      const pivotIndex = await partition(arr, low, high, colors);

      // Reset subarray colors after partition
      for (let i = low; i <= high; i++) {
        if (colors[i] !== "sorted") {
          colors[i] = "default";
        }
      }
      await update(arr, colors);

      await quickSort(arr, low, pivotIndex - 1, colors);
      await quickSort(arr, pivotIndex + 1, high, colors);
    } else if (low === high) {
      colors[low] = "sorted";
      await update(arr, colors);
    }
  };

  const partition = async (arr, low, high, colors) => {
    const pivot = arr[high];
    let i = low - 1;

    // Mark pivot distinctly
    colors[high] = "pivot";
    await update(arr, colors);

    for (let j = low; j < high; j++) {
      colors[j] = "comparing";
      await update(arr, colors);

      if (arr[j] < pivot) {
        i++;
        // Swap and mark
        colors[i] = "swapping";
        colors[j] = "swapping";
        await update(arr, colors);

        [arr[i], arr[j]] = [arr[j], arr[i]];
        await update(arr, colors);

        // Reset to default
        colors[i] = "default";
        colors[j] = "default";
      } else {
        colors[j] = "default"; // Just reset j
      }

      await update(arr, colors);
    }

    // Final pivot swap
    colors[i + 1] = "swapping";
    colors[high] = "swapping";
    await update(arr, colors);

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    await update(arr, colors);

    // Mark pivot as sorted
    colors[i + 1] = "sorted";
    colors[high] = "default"; // Reset original pivot index
    await update(arr, colors);

    return i + 1;
  };

  // const partition = async (arr, low, high, colors) => {
  //   const pivot = arr[high];
  //   let i = low - 1;

  //   for (let j = low; j < high; j++) {
  //     // Highlight comparison
  //     colors[j] = "comparing";
  //     await update(arr, colors);

  //     if (arr[j] < pivot) {
  //       i++;
  //       // Show swap
  //       colors[i] = "swapping";
  //       colors[j] = "swapping";
  //       await update(arr, colors);

  //       [arr[i], arr[j]] = [arr[j], arr[i]];
  //       await update(arr, colors);
  //     }

  //     // Reset colors
  //     colors[j] = "default";
  //     colors[i] = "default";
  //     await update(arr, colors);
  //   }

  //   // Final swap with pivot
  //   colors[i + 1] = "swapping";
  //   colors[high] = "swapping";
  //   await update(arr, colors);

  //   [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  //   await update(arr, colors);

  //   // Reset colors
  //   colors[i + 1] = "default";
  //   colors[high] = "default";
  //   await update(arr, colors);

  //   return i + 1;
  // };

  const heapSort = async (arr) => {
    let colors = new Array(arr.length).fill("default");
    const n = arr.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i, colors);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      // Show swap
      colors[0] = "swapping";
      colors[i] = "swapping";
      await update(arr, colors);

      [arr[0], arr[i]] = [arr[i], arr[0]];
      await update(arr, colors);

      // Mark sorted element
      colors[i] = "sorted";
      await update(arr, colors);

      await heapify(arr, i, 0, colors);
    }

    colors[0] = "sorted";
    await update(arr, colors);
  };

  const heapify = async (arr, n, i, colors) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    // Highlight nodes being compared
    colors[i] = "heapify";
    if (left < n) colors[left] = "heapify";
    if (right < n) colors[right] = "heapify";
    await update(arr, colors);

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
      // Show swap
      colors[i] = "swapping";
      colors[largest] = "swapping";
      await update(arr, colors);

      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      await update(arr, colors);

      // Reset colors
      colors[i] = "default";
      colors[largest] = "default";
      await update(arr, colors);

      await heapify(arr, n, largest, colors);
    } else {
      // Reset colors
      colors[i] = "default";
      if (left < n) colors[left] = "default";
      if (right < n) colors[right] = "default";
      await update(arr, colors);
    }
  };

  const mergeSort = async (arr, left, right, colors) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await mergeSort(arr, left, mid, colors);
      await mergeSort(arr, mid + 1, right, colors);
      await merge(arr, left, mid, right, colors);
    }
  };

  const merge = async (arr, left, mid, right, colors) => {
    let temp = [];
    let i = left,
      j = mid + 1;

    // Visualize the two halves being merged
    for (let k = left; k <= right; k++) {
      colors[k] = k <= mid ? "comparing" : "heapify";
    }
    await update(arr, colors);

    while (i <= mid && j <= right) {
      // Highlight current comparison
      colors[i] = "comparing";
      colors[j] = "comparing";
      await update(arr, colors);

      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }

      // Reset colors after comparison
      colors[i - 1] = "default";
      colors[j - 1] = "default";
      await update(arr, colors);
    }

    // Add remaining elements
    while (i <= mid) {
      temp.push(arr[i++]);
      colors[i - 1] = "swapping";
      await update(arr, colors);
    }
    while (j <= right) {
      temp.push(arr[j++]);
      colors[j - 1] = "swapping";
      await update(arr, colors);
    }

    // Visualize the merge into original array
    for (let k = left; k <= right; k++) {
      arr[k] = temp[k - left];
      colors[k] = "swapping";
      await update(arr, colors);
      colors[k] = "default";
    }
  };

  const handleVisualize = async () => {
    setShouldStop(false);
    const arr = parseInput();
    if (arr.length === 0 || isSorting) return;
    setArray([...arr]);
    let arrCopy = [...arr];
    const colors = new Array(arr.length).fill("default");
    setColorArray(colors);
    setIsSorting(true);
    switch (algorithm) {
      case "bubble":
        await bubbleSort(arrCopy);
        break;
      case "selection":
        await selectionSort(arrCopy);
        break;
      case "insertion":
        await insertionSort(arrCopy);
        break;
      case "quick":
        await quickSort(arrCopy, 0, arrCopy.length - 1, colors);
        break;
      case "heap":
        await heapSort(arrCopy);
        break;
      case "merge":
        await mergeSort(arrCopy, 0, arrCopy.length - 1, colors);
        break;
      default:
        break;
    }
    if (!shouldStop) {
      for (let i = 0; i < arrCopy.length; i++) {
        colors[i] = "sorted";
      }
      await update(arrCopy, colors);
    }

    setIsSorting(false);
    setShouldStop(false);
  };

  const maxVal = Math.max(...array, 1);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        Sorting Visualizer
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          value={inputArray}
          onChange={(e) => setInputArray(e.target.value)}
          placeholder="e.g. 42,45,18,12,3,7"
          className="w-full p-2 rounded border bg-white text-black dark:bg-gray-800 dark:text-white"
        />

        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="w-full p-2 rounded border bg-white text-black dark:bg-gray-800 dark:text-white"
        >
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="heap">Heap Sort</option>
        </select>

        {/* <button
          onClick={handleVisualize}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Visualize
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => generateRandomArray(10)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Generate Random
        </button> */}

        <button
          onClick={() => generateRandomArray(10)}
          disabled={isSorting}
          className={`${
            isSorting
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white px-4 py-2 rounded`}
        >
          Generate Random
        </button>

        <button
          onClick={handleVisualize}
          disabled={isSorting}
          className={`${
            isSorting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded`}
        >
          Visualize
        </button>

        {/* <button
          onClick={() => {
            setShouldStop(true);
            setIsSorting(false);
          }}
          disabled={!isSorting}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          Stop
        </button> */}

        <button
          onClick={() => {
            setShouldStop(true);
            setInputArray("");
            setArray([]);
            setColorArray([]);
            setIsSorting(false);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
        {/* <button
          onClick={() => {
            setShouldStop(true); // Stop any ongoing sort
            setInputArray("");
            setArray([]);
            setColorArray([]);
            setIsSorting(false);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button> */}
      </div>
      <div className="h-72 bg-gray-100 rounded-md flex items-end justify-center gap-1 p-4 overflow-x-auto">
        {array.map((val, index) => {
          const height = (val / maxVal) * 100;
          const color = COLORS[colorArray[index] || "default"];
          return (
            <motion.div
              key={index}
              layout
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.3 }}
              className={`w-6 relative flex justify-center items-end ${color} rounded-sm`}
            >
              <span className="absolute bottom-full text-xs text-center text-black mb-1">
                {val}
              </span>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-6 w-full max-w-3xl mx-auto bg-gray-200 dark:bg-gray-800 p-4 rounded shadow text-sm grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-sm"></div>
          <span>Sorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded-sm"></div>
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-yellow-400 rounded-sm"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-purple-500 rounded-sm"></div>
          <span>Pivot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-400 rounded-sm"></div>
          <span>Middle (Partition)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-pink-400 rounded-sm"></div>
          <span>Heapify</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded-sm"></div>
          <span>Default</span>
        </div>
      </div>
    </div>
  );
};

export default Sorting;

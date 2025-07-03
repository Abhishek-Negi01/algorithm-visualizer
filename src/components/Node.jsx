import React from "react";
import classNames from "classnames";

const Node = ({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isVisited,
  isPath,
  weight,
  onClick,
}) => {
  const extraClass = classNames({
    "bg-black": isWall,
    "bg-cyan-500": isPath && !isStart && !isEnd,
    "bg-yellow-300": isVisited && !isStart && !isEnd,
    "bg-white": !isStart && !isEnd && !isWall && !isVisited && !isPath,
    "bg-green-500": isStart,
    "bg-red-500": isEnd,
    border: true,
    "w-5 h-5 md:w-6 md:h-6": true,
  });

  return (
    <div
      className={extraClass}
      onClick={() => onClick(row, col)}
      id={`node-${row}-${col}`}
    >
      {/* show weight only for normal nodes (not start/end/visited/path) */}
      {!isStart && !isEnd && !isWall && !isVisited && !isPath && (
        <span className="text-xs text-gray-600">{weight}</span>
      )}
    </div>
  );
};

export default Node;

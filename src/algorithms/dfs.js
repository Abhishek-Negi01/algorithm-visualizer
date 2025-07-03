export async function dfs(grid, startNode, endNode, updateGrid, delay = 20) {
  const stack = [startNode];
  const visited = new Set();

  while (stack.length > 0) {
    const current = stack.pop();
    const key = `${current.row}-${current.col}`;
    if (visited.has(key)) continue;

    visited.add(key);
    // current.isVisited = true;
    grid[current.row][current.col] = {
      ...grid[current.row][current.col],
      isVisited: true,
    };

    // updateGrid();
    updateGrid(grid.map((row) => row.map((cell) => ({ ...cell }))));

    await new Promise((res) => setTimeout(res, delay));

    if (current.row === endNode.row && current.col === endNode.col) {
      await animatePath(current, updateGrid, delay);
      return;
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (
        !visited.has(`${neighbor.row}-${neighbor.col}`) &&
        !neighbor.isWall &&
        !neighbor.previousNode
      ) {
        // neighbor.previousNode = current;
        grid[neighbor.row][neighbor.col] = {
          ...grid[neighbor.row][neighbor.col],
          previousNode: current,
        };

        stack.push(neighbor);
      }
    }
  }
}

function getNeighbors(node, grid) {
  const { row, col } = node;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const neighbors = [];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }
  return neighbors;
}

async function animatePath(node, updateGrid, delay) {
  const path = [];
  let current = node;

  while (current) {
    path.unshift(current);
    current = current.previousNode;
  }

  //   for (const cell of path) {
  //     cell.isPath = true;
  //     updateGrid();
  //     await new Promise((res) => setTimeout(res, delay));
  //   }

  for (const cell of path) {
    grid[cell.row][cell.col] = {
      ...grid[cell.row][cell.col],
      isPath: true,
    };
    updateGrid(grid.map((row) => row.map((cell) => ({ ...cell }))));
    await new Promise((res) => setTimeout(res, delay));
  }
}

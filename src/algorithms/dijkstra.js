export async function dijkstra(graph, startId, endId) {
  const nodes = new Map();
  graph.nodes.forEach((node) => {
    nodes.set(node.id, {
      id: node.id,
      dist: Infinity,
      prev: null,
      visited: false,
    });
  });

  const steps = [];
  const getEdge = (from, to) =>
    graph.edges.find((e) => e.from === from && e.to === to);

  const pq = [];
  nodes.get(startId).dist = 0;
  pq.push(nodes.get(startId));

  while (pq.length > 0) {
    // Sort priority queue by distance
    pq.sort((a, b) => a.dist - b.dist);
    const current = pq.shift();

    if (current.visited) continue;
    current.visited = true;

    const step = {
      currentNode: current.id,
      visitedEdges: [],
      path: [],
    };

    // Explore neighbors
    graph.edges
      .filter((e) => e.from === current.id)
      .forEach((edge) => {
        const neighbor = nodes.get(edge.to);
        if (neighbor.visited) return;
        const newDist = current.dist + edge.weight;
        if (newDist < neighbor.dist) {
          neighbor.dist = newDist;
          neighbor.prev = current.id;
        }
        step.visitedEdges.push({ from: current.id, to: neighbor.id });
        pq.push(neighbor);
      });

    steps.push(step);
    if (current.id === endId) break;
  }

  // Reconstruct path
  const finalPath = [];
  let crawl = nodes.get(endId);
  while (crawl) {
    finalPath.unshift(crawl.id);
    crawl = nodes.get(crawl.prev);
  }

  steps.push({
    currentNode: endId,
    visitedEdges: [],
    path: finalPath,
  });

  return steps;
}

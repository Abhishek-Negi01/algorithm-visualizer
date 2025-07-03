export async function prim(graph) {
  const { nodes, edges } = graph;
  const visited = new Set();
  const steps = [];
  const mstEdges = [];
  let cost = 0;

  const adj = {};
  nodes.forEach(({ id }) => (adj[id] = []));
  edges.forEach(({ from, to, weight }) => {
    adj[from].push({ to, weight });
    adj[to].push({ to: from, weight }); // undirected
  });

  const pq = [{ node: 0, parent: -1, weight: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.weight - b.weight);
    const { node, parent, weight } = pq.shift();
    if (visited.has(node)) continue;

    visited.add(node);
    if (parent !== -1) {
      mstEdges.push({ from: parent, to: node, weight });
      cost += weight;
    }

    steps.push({
      visitedEdges: [...mstEdges],
      currentNode: node,
      path: Array.from(visited),
      mstEdges: [...mstEdges],
    });

    for (const neighbor of adj[node]) {
      if (!visited.has(neighbor.to)) {
        pq.push({ node: neighbor.to, parent: node, weight: neighbor.weight });
      }
    }
  }

  return { steps, cost };
}

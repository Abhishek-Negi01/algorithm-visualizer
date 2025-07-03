export async function kruskal(graph) {
  const { nodes, edges } = graph;
  const steps = [];
  const parent = {};
  let cost = 0;

  nodes.forEach(({ id }) => (parent[id] = id));

  const find = (u) => {
    while (u !== parent[u]) u = parent[u];
    return u;
  };

  const union = (u, v) => {
    const pu = find(u);
    const pv = find(v);
    if (pu === pv) return false;
    parent[pu] = pv;
    return true;
  };

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const mstEdges = [];

  for (const edge of sortedEdges) {
    if (union(edge.from, edge.to)) {
      mstEdges.push(edge);
      cost += edge.weight;

      steps.push({
        visitedEdges: [...mstEdges],
        currentNode: edge.to,
        path: mstEdges.map((e) => e.to),
        mstEdges: [...mstEdges],
      });
    }
  }

  return { steps, cost };
}

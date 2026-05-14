import type { Stop, Route } from "./floyd-warshall";

export interface AlgorithmResult {
  path: string[];
  distance: number;
  time: number;
  stops: number;
}

interface Graph {
  [stopId: string]: { to: string; distance: number; time: number }[];
}

// ─── Build Graph ───────────────────────────────────────────────
function buildGraph(stops: Stop[], routes: Route[]): Graph {
  const g: Graph = {};
  
  stops.forEach(s => (g[s.id] = []));
  
  routes.forEach(r => {
    g[r.fromStop]?.push({ 
      to: r.toStop, 
      distance: r.distance, 
      time: r.time 
    });
    g[r.toStop]?.push({ 
      to: r.fromStop, 
      distance: r.distance, 
      time: r.time 
    });
  });
  
  return g;
}

// ─── DIJKSTRA ──────────────────────────────────────────────────
// Finds FASTEST route by time
export function dijkstra(
  stops: Stop[],
  routes: Route[],
  startId: string,
  endId: string,
): AlgorithmResult | null {

  const g = buildGraph(stops, routes);
  if (!g[startId] || !g[endId]) return null;

  // Set all stops to infinity
  const time: Record<string, number> = {};
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};

  stops.forEach(s => {
    time[s.id] = Infinity;
    dist[s.id] = Infinity;
    prev[s.id] = null;
  });

  // Start = 0
  time[startId] = 0;
  dist[startId] = 0;

  const visited = new Set<string>();
  const queue = new Set(stops.map(s => s.id));

  while (queue.size) {

    // Pick stop with smallest time
    let u: string | null = null;
    let best = Infinity;
    for (const id of queue) {
      if (time[id] < best) {
        best = time[id];
        u = id;
      }
    }

    if (u === null || best === Infinity) break;

    queue.delete(u);
    visited.add(u);

    if (u === endId) break;

    // Update neighbors
    for (const edge of g[u]) {
      if (visited.has(edge.to)) continue;

      const alt = time[u] + edge.time;
      if (alt < time[edge.to]) {
        time[edge.to] = alt;
        dist[edge.to] = dist[u] + edge.distance;
        prev[edge.to] = u;
      }
    }
  }

  if (time[endId] === Infinity) return null;

  // Trace back path
  const path: string[] = [];
  let cur: string | null = endId;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur];
  }

  return { 
    path, 
    distance: dist[endId], 
    time: time[endId], 
    stops: path.length 
  };
}

// ─── BFS ───────────────────────────────────────────────────────
// Finds FEWEST STOPS route
export function bfs(
  stops: Stop[],
  routes: Route[],
  startId: string,
  endId: string,
): AlgorithmResult | null {

  const g = buildGraph(stops, routes);
  if (!g[startId] || !g[endId]) return null;

  const visited = new Set<string>([startId]);
  const queue: string[][] = [[startId]];

  while (queue.length) {
    const path = queue.shift()!;
    const u = path[path.length - 1];

    // Reached destination!
    if (u === endId) {
      let distance = 0;
      let time = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const edge = g[path[i]].find(e => e.to === path[i + 1]);
        if (edge) {
          distance += edge.distance;
          time += edge.time;
        }
      }
      return { path, distance, time, stops: path.length };
    }

    // Add unvisited neighbors to queue
    for (const edge of g[u]) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push([...path, edge.to]);
      }
    }
  }

  return null;
}

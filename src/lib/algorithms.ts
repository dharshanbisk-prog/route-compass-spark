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

function buildGraph(stops: Stop[], routes: Route[]): Graph {
  const g: Graph = {};
  stops.forEach(s => (g[s.id] = []));

  routes.forEach(r => {
    g[r.fromStop]?.push({ to: r.toStop, distance: r.distance, time: r.time });
    g[r.toStop]?.push({ to: r.fromStop, distance: r.distance, time: r.time });
  });

  return g;
}

/** ---------------- DIJKSTRA (fastest by time) ---------------- */
export function dijkstra(
  stops: Stop[],
  routes: Route[],
  startId: string,
  endId: string,
): AlgorithmResult | null {
  const g = buildGraph(stops, routes);
  if (!g[startId] || !g[endId]) return null;

  const time: Record<string, number> = {};
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};

  stops.forEach(s => {
    time[s.id] = Infinity;
    dist[s.id] = Infinity;
    prev[s.id] = null;
  });

  time[startId] = 0;
  dist[startId] = 0;

  const visited = new Set<string>();
  const queue = new Set(stops.map(s => s.id));

  while (queue.size) {
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

  const path: string[] = [];
  let cur: string | null = endId;

  while (cur) {
    path.unshift(cur);
    cur = prev[cur];
  }

  return { path, distance: dist[endId], time: time[endId], stops: path.length };
}

/** ---------------- BFS (fewest stops ONLY) ---------------- */
export function bfs(
  stops: Stop[],
  routes: Route[],
  startId: string,
  endId: string,
): AlgorithmResult | null {
  const g = buildGraph(stops, routes);
  if (!g[startId] || !g[endId]) return null;

  // 🔥 CRITICAL: remove route insertion bias
  Object.keys(g).forEach(id => {
    g[id].sort((a, b) => b.to.localeCompare(a.to));
  });

  const visited = new Set<string>([startId]);
  const prev: Record<string, string | null> = { [startId]: null };

  const queue: string[][] = [[startId]];

  while (queue.length) {
    const path = queue.shift()!;
    const u = path[path.length - 1];

    // 🚨 STOP IMMEDIATELY when destination first seen
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

    for (const edge of g[u]) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        prev[edge.to] = u;
        queue.push([...path, edge.to]);
      }
    }
  }

  return null;
}

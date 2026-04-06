export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  fromStop: string;
  toStop: string;
  distance: number;
  time: number;
}

export interface FloydWarshallResult {
  dist: number[][];
  time: number[][];
  prev: (number | null)[][];
  stopIds: string[];
}

export function floydWarshall(stops: Stop[], routes: Route[]): FloydWarshallResult {
  const n = stops.length;
  const stopIds = stops.map(s => s.id);
  const idxMap = new Map(stopIds.map((id, i) => [id, i]));

  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  const time = Array.from({ length: n }, () => Array(n).fill(Infinity));
  const prev: (number | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));

  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
    time[i][i] = 0;
  }

  for (const route of routes) {
    const i = idxMap.get(route.fromStop);
    const j = idxMap.get(route.toStop);
    if (i === undefined || j === undefined) continue;
    if (route.distance < dist[i][j]) {
      dist[i][j] = route.distance;
      time[i][j] = route.time;
      prev[i][j] = i;
      // Bidirectional
      dist[j][i] = route.distance;
      time[j][i] = route.time;
      prev[j][i] = j;
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          time[i][j] = time[i][k] + time[k][j];
          prev[i][j] = prev[k][j];
        }
      }
    }
  }

  return { dist, time, prev, stopIds };
}

export function getPath(result: FloydWarshallResult, startId: string, endId: string): string[] {
  const { prev, stopIds } = result;
  const startIdx = stopIds.indexOf(startId);
  const endIdx = stopIds.indexOf(endId);
  if (startIdx === -1 || endIdx === -1) return [];
  if (prev[startIdx][endIdx] === null && startIdx !== endIdx) return [];

  const path: number[] = [];
  let current: number | null = endIdx;
  while (current !== null && current !== startIdx) {
    path.unshift(current);
    current = prev[startIdx][current];
  }
  if (current === startIdx) path.unshift(startIdx);
  else return [];

  return path.map(i => stopIds[i]);
}

export function getDistance(result: FloydWarshallResult, startId: string, endId: string): number {
  const si = result.stopIds.indexOf(startId);
  const ei = result.stopIds.indexOf(endId);
  if (si === -1 || ei === -1) return Infinity;
  return result.dist[si][ei];
}

export function getTime(result: FloydWarshallResult, startId: string, endId: string): number {
  const si = result.stopIds.indexOf(startId);
  const ei = result.stopIds.indexOf(endId);
  if (si === -1 || ei === -1) return Infinity;
  return result.time[si][ei];
}

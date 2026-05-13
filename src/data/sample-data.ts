export const sampleRoutes: Route[] = [
  // Core network
  { id: "r1", fromStop: ids.majestic, toStop: ids.mg_road, distance: 4.2, time: 15 },
  { id: "r2", fromStop: ids.mg_road, toStop: ids.btm, distance: 4.0, time: 8 },
  { id: "r3", fromStop: ids.btm, toStop: ids.hsr, distance: 2.5, time: 8 },
  { id: "r4", fromStop: ids.hsr, toStop: ids.electronic_city, distance: 9.0, time: 28 },

  // Long but FAST chain (Dijkstra will choose this)
  { id: "r5", fromStop: ids.mg_road, toStop: ids.indiranagar, distance: 5.1, time: 10 },
  { id: "r6", fromStop: ids.indiranagar, toStop: ids.koramangala, distance: 6.0, time: 10 },
  { id: "r7", fromStop: ids.koramangala, toStop: ids.btm, distance: 2.8, time: 6 },

  // Direct but VERY SLOW road (BFS will choose this)
  { id: "r8", fromStop: ids.majestic, toStop: ids.electronic_city, distance: 12.0, time: 90 },

  // Extra links so graph looks realistic
  { id: "r9", fromStop: ids.majestic, toStop: ids.jayanagar, distance: 5.0, time: 16 },
  { id: "r10", fromStop: ids.jayanagar, toStop: ids.btm, distance: 3.5, time: 12 },
  { id: "r11", fromStop: ids.mg_road, toStop: ids.koramangala, distance: 5.5, time: 20 },
];

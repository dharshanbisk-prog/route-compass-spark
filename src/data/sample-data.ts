export const sampleRoutes: Route[] = [
  // Fast chain (more stops, less time) → Dijkstra will choose this
  { id: "r1", fromStop: ids.koramangala, toStop: ids.hsr_layout, distance: 3.5, time: 10 },
  { id: "r2", fromStop: ids.hsr_layout, toStop: ids.bommanahalli, distance: 4.0, time: 12 },
  { id: "r3", fromStop: ids.bommanahalli, toStop: ids.electronic_city, distance: 5.0, time: 17 },

  // Slow direct path (fewer stops, high time) → BFS will choose this
  { id: "r4", fromStop: ids.koramangala, toStop: ids.electronic_city, distance: 6.0, time: 70 },

  // Extra connections so graph looks normal
  { id: "r5", fromStop: ids.indiranagar, toStop: ids.koramangala, distance: 6.0, time: 18 },
  { id: "r6", fromStop: ids.mg_road, toStop: ids.indiranagar, distance: 4.0, time: 12 },
  { id: "r7", fromStop: ids.whitefield, toStop: ids.mg_road, distance: 14.0, time: 40 },
  { id: "r8", fromStop: ids.yelahanka, toStop: ids.hebbal, distance: 8.0, time: 22 },
];

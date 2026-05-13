export const sampleRoutes: Route[] = [
  // Existing routes
  { id: "r1", fromStop: ids.majestic, toStop: ids.mg_road, distance: 4.2, time: 15 },
  { id: "r2", fromStop: ids.mg_road, toStop: ids.indiranagar, distance: 5.1, time: 18 },
  { id: "r3", fromStop: ids.indiranagar, toStop: ids.whitefield, distance: 12.5, time: 35 },
  { id: "r4", fromStop: ids.majestic, toStop: ids.malleshwaram, distance: 3.8, time: 12 },
  { id: "r5", fromStop: ids.malleshwaram, toStop: ids.hebbal, distance: 5.5, time: 18 },
  { id: "r6", fromStop: ids.hebbal, toStop: ids.yelahanka, distance: 8.0, time: 22 },
  { id: "r7", fromStop: ids.majestic, toStop: ids.jayanagar, distance: 5.0, time: 16 },
  { id: "r8", fromStop: ids.jayanagar, toStop: ids.btm, distance: 3.5, time: 12 },
  { id: "r9", fromStop: ids.btm, toStop: ids.koramangala, distance: 2.8, time: 10 },
  { id: "r10", fromStop: ids.koramangala, toStop: ids.hsr, distance: 3.2, time: 11 },
  { id: "r11", fromStop: ids.hsr, toStop: ids.electronic_city, distance: 9.0, time: 28 },
  { id: "r12", fromStop: ids.btm, toStop: ids.hsr, distance: 2.5, time: 8 },
  { id: "r13", fromStop: ids.mg_road, toStop: ids.koramangala, distance: 5.5, time: 20 },
  { id: "r14", fromStop: ids.indiranagar, toStop: ids.koramangala, distance: 6.0, time: 22 },
  { id: "r15", fromStop: ids.majestic, toStop: ids.hebbal, distance: 8.0, time: 25 },

  // NEW routes to make algos differ ✅
  { id: "r16", fromStop: ids.majestic, toStop: ids.koramangala, distance: 10.0, time: 45 },
  { id: "r17", fromStop: ids.mg_road, toStop: ids.btm, distance: 4.0, time: 8 },
  { id: "r18", fromStop: ids.malleshwaram, toStop: ids.mg_road, distance: 3.0, time: 10 },
  { id: "r19", fromStop: ids.hebbal, toStop: ids.indiranagar, distance: 6.0, time: 20 },
  { id: "r20", fromStop: ids.jayanagar, toStop: ids.hsr, distance: 4.0, time: 14 },
];

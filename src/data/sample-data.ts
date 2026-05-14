import type { Stop, Route } from "@/lib/floyd-warshall";

const ids = {
  majestic: "s1",
  koramangala: "s2",
  indiranagar: "s3",
  whitefield: "s4",
  jayanagar: "s5",
  malleshwaram: "s6",
  hebbal: "s7",
  electronic_city: "s8",
  yelahanka: "s9",
  btm: "s10",
  hsr: "s11",
  mg_road: "s12",
};

export const sampleStops: Stop[] = [
  { id: ids.majestic,        name: "Majestic",        lat: 12.9767, lng: 77.5713 },
  { id: ids.koramangala,     name: "Koramangala",     lat: 12.9352, lng: 77.6245 },
  { id: ids.indiranagar,     name: "Indiranagar",     lat: 12.9784, lng: 77.6408 },
  { id: ids.whitefield,      name: "Whitefield",      lat: 12.9698, lng: 77.7500 },
  { id: ids.jayanagar,       name: "Jayanagar",       lat: 12.9308, lng: 77.5838 },
  { id: ids.malleshwaram,    name: "Malleshwaram",    lat: 12.9965, lng: 77.5700 },
  { id: ids.hebbal,          name: "Hebbal",          lat: 13.0358, lng: 77.5970 },
  { id: ids.electronic_city, name: "Electronic City", lat: 12.8456, lng: 77.6603 },
  { id: ids.yelahanka,       name: "Yelahanka",       lat: 13.1007, lng: 77.5963 },
  { id: ids.btm,             name: "BTM Layout",      lat: 12.9166, lng: 77.6101 },
  { id: ids.hsr,             name: "HSR Layout",      lat: 12.9116, lng: 77.6389 },
  { id: ids.mg_road,         name: "MG Road",         lat: 12.9756, lng: 77.6068 },
];

export const sampleRoutes: Route[] = [

  // ── Majestic connections (many options = algos differ!) ──
  { id: "r1",  fromStop: ids.majestic,     toStop: ids.mg_road,         distance: 4.2,  time: 15 },
  { id: "r2",  fromStop: ids.majestic,     toStop: ids.malleshwaram,    distance: 3.8,  time: 12 },
  { id: "r3",  fromStop: ids.majestic,     toStop: ids.jayanagar,       distance: 5.0,  time: 16 },
  { id: "r4",  fromStop: ids.majestic,     toStop: ids.hebbal,          distance: 8.0,  time: 25 },
  { id: "r5",  fromStop: ids.majestic,     toStop: ids.koramangala,     distance: 10.0, time: 45 },

  // ── MG Road connections ──
  { id: "r6",  fromStop: ids.mg_road,      toStop: ids.indiranagar,     distance: 5.1,  time: 18 },
  { id: "r7",  fromStop: ids.mg_road,      toStop: ids.koramangala,     distance: 5.5,  time: 20 },
  { id: "r8",  fromStop: ids.mg_road,      toStop: ids.btm,             distance: 4.0,  time: 8  },

  // ── Malleshwaram connections ──
  { id: "r9",  fromStop: ids.malleshwaram, toStop: ids.hebbal,          distance: 5.5,  time: 18 },
  { id: "r10", fromStop: ids.malleshwaram, toStop: ids.mg_road,         distance: 3.0,  time: 10 },
  { id: "r11", fromStop: ids.malleshwaram, toStop: ids.yelahanka,       distance: 12.0, time: 35 },

  // ── Hebbal connections ──
  { id: "r12", fromStop: ids.hebbal,       toStop: ids.yelahanka,       distance: 8.0,  time: 22 },
  { id: "r13", fromStop: ids.hebbal,       toStop: ids.indiranagar,     distance: 6.0,  time: 20 },

  // ── Jayanagar connections ──
  { id: "r14", fromStop: ids.jayanagar,    toStop: ids.btm,             distance: 3.5,  time: 12 },
  { id: "r15", fromStop: ids.jayanagar,    toStop: ids.hsr,             distance: 4.0,  time: 14 },
  { id: "r16", fromStop: ids.jayanagar,    toStop: ids.koramangala,     distance: 6.5,  time: 22 },

  // ── BTM connections ──
  { id: "r17", fromStop: ids.btm,          toStop: ids.koramangala,     distance: 2.8,  time: 10 },
  { id: "r18", fromStop: ids.btm,          toStop: ids.hsr,             distance: 2.5,  time: 8  },
  { id: "r19", fromStop: ids.btm,          toStop: ids.electronic_city, distance: 11.0, time: 38 },

  // ── Koramangala connections ──
  { id: "r20", fromStop: ids.koramangala,  toStop: ids.indiranagar,     distance: 6.0,  time: 22 },
  { id: "r21", fromStop: ids.koramangala,  toStop: ids.hsr,             distance: 3.2,  time: 11 },

  // ── Indiranagar connections ──
  { id: "r22", fromStop: ids.indiranagar,  toStop: ids.whitefield,      distance: 12.5, time: 35 },

  // ── HSR connections ──
  { id: "r23", fromStop: ids.hsr,          toStop: ids.electronic_city, distance: 9.0,  time: 28 },
  { id: "r24", fromStop: ids.hsr,          toStop: ids.btm,             distance: 2.5,  time: 8  },

  // ── Whitefield connections ──
  { id: "r25", fromStop: ids.whitefield,   toStop: ids.electronic_city, distance: 15.0, time: 40 },

  // ── Yelahanka connections ──
  { id: "r26", fromStop: ids.yelahanka,    toStop: ids.hebbal,          distance: 8.0,  time: 22 },
];

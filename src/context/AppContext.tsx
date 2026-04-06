import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { Stop, Route, FloydWarshallResult } from "@/lib/floyd-warshall";
import { floydWarshall } from "@/lib/floyd-warshall";
import { sampleStops, sampleRoutes } from "@/data/sample-data";
import { v4 } from "@/lib/uuid";

interface AppState {
  stops: Stop[];
  routes: Route[];
  matrix: FloydWarshallResult | null;
  addStop: (stop: Omit<Stop, "id">) => void;
  removeStop: (id: string) => void;
  updateStop: (stop: Stop) => void;
  addRoute: (route: Omit<Route, "id">) => void;
  removeRoute: (id: string) => void;
  recomputeMatrix: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [stops, setStops] = useState<Stop[]>(sampleStops);
  const [routes, setRoutes] = useState<Route[]>(sampleRoutes);
  const [matrix, setMatrix] = useState<FloydWarshallResult | null>(() =>
    floydWarshall(sampleStops, sampleRoutes)
  );

  const addStop = useCallback((stop: Omit<Stop, "id">) => {
    setStops(prev => [...prev, { ...stop, id: v4() }]);
  }, []);

  const removeStop = useCallback((id: string) => {
    setStops(prev => prev.filter(s => s.id !== id));
    setRoutes(prev => prev.filter(r => r.fromStop !== id && r.toStop !== id));
  }, []);

  const updateStop = useCallback((stop: Stop) => {
    setStops(prev => prev.map(s => s.id === stop.id ? stop : s));
  }, []);

  const addRoute = useCallback((route: Omit<Route, "id">) => {
    setRoutes(prev => [...prev, { ...route, id: v4() }]);
  }, []);

  const removeRoute = useCallback((id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  }, []);

  const recomputeMatrix = useCallback(() => {
    setMatrix(floydWarshall(stops, routes));
  }, [stops, routes]);

  const value = useMemo(() => ({
    stops, routes, matrix,
    addStop, removeStop, updateStop, addRoute, removeRoute, recomputeMatrix,
  }), [stops, routes, matrix, addStop, removeStop, updateStop, addRoute, removeRoute, recomputeMatrix]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be inside AppProvider");
  return ctx;
}

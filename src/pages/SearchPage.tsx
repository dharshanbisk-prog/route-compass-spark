import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Clock, Route as RouteIcon, ArrowRight, Search, Trophy, Info, Zap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RouteMap from "@/components/RouteMap";
import { useAppState } from "@/context/AppContext";
import { dijkstra, bfs, type AlgorithmResult } from "@/lib/algorithms";

type Compare = {
  dijkstra: AlgorithmResult | null;
  bfs: AlgorithmResult | null;
};

export default function SearchPage() {
  const { stops, routes } = useAppState();
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [result, setResult] = useState<Compare | null>(null);

  const handleSearch = () => {
    if (!fromId || !toId || fromId === toId) return;
    setResult({
      dijkstra: dijkstra(stops, routes, fromId, toId),
      bfs: bfs(stops, routes, fromId, toId),
    });
  };

  const stopName = (id: string) => stops.find(s => s.id === id)?.name || id;

  // Pick best path for the map (Dijkstra preferred when available)
  const mapPath = result?.dijkstra?.path ?? result?.bfs?.path ?? [];
  const pathStops = useMemo(
    () => mapPath.map(id => stops.find(s => s.id === id)!).filter(Boolean),
    [mapPath, stops],
  );

  // Determine winners
  const dj = result?.dijkstra;
  const bf = result?.bfs;
  const dijkstraWinsTime = !!dj && (!bf || dj.time <= bf.time);
  const bfsWinsStops = !!bf && (!dj || bf.stops <= dj.stops);
  const samePath =
    !!dj && !!bf && dj.path.length === bf.path.length && dj.path.every((p, i) => p === bf.path[i]);

  const renderPath = (path: string[], tone: "green" | "yellow") => (
    <div className="flex flex-wrap items-center gap-1.5">
      {path.map((id, i) => (
        <div key={id + i} className="flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              tone === "green"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
            }`}
          >
            {stopName(id)}
          </span>
          {i < path.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white font-display mb-4"
          >
            🚌 Find Your Route
          </motion.h1>
          <p className="text-white/70 text-lg">
            Compare Dijkstra (fastest) vs BFS (fewest stops) side by side
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-8 pb-16">
        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">From Stop 🚌</label>
                <Select value={fromId} onValueChange={setFromId}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select departure stop" />
                  </SelectTrigger>
                  <SelectContent>
                    {stops.map(stop => (
                      <SelectItem key={stop.id} value={stop.id}>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {stop.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center pb-1">
                <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">To Stop 🚌</label>
                <Select value={toId} onValueChange={setToId}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select arrival stop" />
                  </SelectTrigger>
                  <SelectContent>
                    {stops.filter(s => s.id !== fromId).map(stop => (
                      <SelectItem key={stop.id} value={stop.id}>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-secondary" />
                          {stop.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSearch}
                disabled={!fromId || !toId || fromId === toId}
                size="lg"
                className="gradient-primary text-white border-0 h-12 px-8 rounded-xl glow-primary hover:scale-105 transition-transform"
              >
                <Search className="w-5 h-5 mr-2" />
                Compare Routes
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (dj || bf) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Two result cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Dijkstra card */}
                <Card
                  className={`glass-card p-6 border-2 ${
                    dijkstraWinsTime && !samePath
                      ? "border-emerald-500/60 shadow-[0_0_30px_-5px_hsl(160,80%,45%,0.45)]"
                      : "border-emerald-500/25"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-bold font-display">Dijkstra</h3>
                        {dijkstraWinsTime && !samePath && (
                          <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-0 gap-1">
                            <Trophy className="w-3 h-3" /> Fastest
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Shortest weighted route by time</p>
                    </div>
                  </div>

                  {dj ? (
                    <>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 rounded-lg bg-emerald-500/10">
                          <Clock className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                          <div className="text-lg font-bold">{dj.time.toFixed(0)}m</div>
                          <div className="text-[10px] text-muted-foreground">Time</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-emerald-500/10">
                          <Navigation className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                          <div className="text-lg font-bold">{dj.distance.toFixed(1)}km</div>
                          <div className="text-[10px] text-muted-foreground">Distance</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-emerald-500/10">
                          <RouteIcon className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                          <div className="text-lg font-bold">{dj.stops}</div>
                          <div className="text-[10px] text-muted-foreground">Stops</div>
                        </div>
                      </div>
                      {renderPath(dj.path, "green")}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No route found.</p>
                  )}
                </Card>

                {/* BFS card */}
                <Card
                  className={`glass-card p-6 border-2 ${
                    bfsWinsStops && !samePath
                      ? "border-amber-500/60 shadow-[0_0_30px_-5px_hsl(45,90%,55%,0.45)]"
                      : "border-amber-500/25"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Layers className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-bold font-display">BFS</h3>
                        {bfsWinsStops && !samePath && (
                          <Badge className="bg-amber-500 hover:bg-amber-500 text-white border-0 gap-1">
                            <Trophy className="w-3 h-3" /> Fewest stops
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Breadth-first — minimum transfers</p>
                    </div>
                  </div>

                  {bf ? (
                    <>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 rounded-lg bg-amber-500/10">
                          <RouteIcon className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                          <div className="text-lg font-bold">{bf.stops}</div>
                          <div className="text-[10px] text-muted-foreground">Stops</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-amber-500/10">
                          <Clock className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                          <div className="text-lg font-bold">{bf.time.toFixed(0)}m</div>
                          <div className="text-[10px] text-muted-foreground">Time</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-amber-500/10">
                          <Navigation className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                          <div className="text-lg font-bold">{bf.distance.toFixed(1)}km</div>
                          <div className="text-[10px] text-muted-foreground">Distance</div>
                        </div>
                      </div>
                      {renderPath(bf.path, "yellow")}
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-3 italic">
                        Note: optimised for fewest stops
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No route found.</p>
                  )}
                </Card>
              </div>

              {samePath && (
                <Card className="glass-card p-4 text-center text-sm text-muted-foreground">
                  Both algorithms produced the same route for this query.
                </Card>
              )}

              {/* Comparison table */}
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold font-display mb-4">Side-by-side comparison</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Algorithm</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead className="text-right">Stops</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                      <TableHead>Best For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                        Dijkstra
                      </TableCell>
                      <TableCell className="text-xs">
                        {dj ? dj.path.map(stopName).join(" → ") : "—"}
                      </TableCell>
                      <TableCell className="text-right">{dj?.stops ?? "—"}</TableCell>
                      <TableCell className="text-right">{dj ? `${dj.time.toFixed(0)} min` : "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">Fastest journey</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-amber-600 dark:text-amber-400">BFS</TableCell>
                      <TableCell className="text-xs">
                        {bf ? bf.path.map(stopName).join(" → ") : "—"}
                      </TableCell>
                      <TableCell className="text-right">{bf?.stops ?? "—"}</TableCell>
                      <TableCell className="text-right">{bf ? `${bf.time.toFixed(0)} min` : "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">Fewest transfers</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>

              {/* Map */}
              {pathStops.length > 0 && (
                <RouteMap stops={stops} pathStops={pathStops} className="h-[450px]" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Algorithm info section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
          <Card className="glass-card p-6 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-emerald-500" />
              <h4 className="font-semibold font-display">About Dijkstra's Algorithm</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Explores the network by always extending the cheapest known path first, using edge weights
              like time or distance. Guarantees the fastest weighted route.
            </p>
            <p className="text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Better when:</span>{" "}
              you care about <em>actual travel time</em>, even if it means more transfers.
            </p>
          </Card>

          <Card className="glass-card p-6 border-l-4 border-l-amber-500">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-amber-500" />
              <h4 className="font-semibold font-display">About BFS (Breadth-First Search)</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Explores the network level by level, treating every hop equally. Always returns the route
              with the fewest stops, ignoring edge weights.
            </p>
            <p className="text-xs">
              <span className="font-semibold text-amber-600 dark:text-amber-400">Better when:</span> you
              want to <em>minimise transfers</em> and prefer a simpler journey.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, MapPin, ArrowRightLeft, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppState } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { stops, routes, matrix, addStop, removeStop, addRoute, removeRoute, recomputeMatrix } = useAppState();

  const [stopName, setStopName] = useState("");
  const [stopLat, setStopLat] = useState("");
  const [stopLng, setStopLng] = useState("");

  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [routeDist, setRouteDist] = useState("");
  const [routeTime, setRouteTime] = useState("");

  const handleAddStop = () => {
    if (!stopName || !stopLat || !stopLng) return;
    addStop({ name: stopName, lat: parseFloat(stopLat), lng: parseFloat(stopLng) });
    setStopName(""); setStopLat(""); setStopLng("");
    toast.success("Stop added!");
  };

  const handleAddRoute = () => {
    if (!routeFrom || !routeTo || !routeDist || !routeTime || routeFrom === routeTo) return;
    addRoute({ fromStop: routeFrom, toStop: routeTo, distance: parseFloat(routeDist), time: parseFloat(routeTime) });
    setRouteFrom(""); setRouteTo(""); setRouteDist(""); setRouteTime("");
    toast.success("Route added!");
  };

  const handleRecompute = () => {
    recomputeMatrix();
    toast.success("Distance matrix recomputed! 🎉");
  };

  const getStopName = (id: string) => stops.find(s => s.id === id)?.name || id;

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-12 px-4">
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-display flex items-center gap-3">
              <Settings className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-white/60 mt-1">Manage stops, routes, and the distance matrix</p>
          </div>
          <div className="flex gap-3">
            <Link to="/search">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Search Routes
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 -mt-6 pb-16">
        <Card className="glass-card p-1">
          <Tabs defaultValue="stops">
            <TabsList className="w-full bg-muted/50 rounded-lg p-1">
              <TabsTrigger value="stops" className="flex-1 data-[state=active]:gradient-primary data-[state=active]:text-white rounded-md">
                <MapPin className="w-4 h-4 mr-2" /> Stops ({stops.length})
              </TabsTrigger>
              <TabsTrigger value="routes" className="flex-1 data-[state=active]:gradient-primary data-[state=active]:text-white rounded-md">
                <ArrowRightLeft className="w-4 h-4 mr-2" /> Routes ({routes.length})
              </TabsTrigger>
              <TabsTrigger value="matrix" className="flex-1 data-[state=active]:gradient-primary data-[state=active]:text-white rounded-md">
                <RefreshCw className="w-4 h-4 mr-2" /> Matrix
              </TabsTrigger>
            </TabsList>

            {/* STOPS TAB */}
            <TabsContent value="stops" className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 mb-6 items-end">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Stop Name</label>
                  <Input value={stopName} onChange={e => setStopName(e.target.value)} placeholder="e.g. Koramangala" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Latitude</label>
                  <Input value={stopLat} onChange={e => setStopLat(e.target.value)} placeholder="12.9352" type="number" step="any" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Longitude</label>
                  <Input value={stopLng} onChange={e => setStopLng(e.target.value)} placeholder="77.6245" type="number" step="any" />
                </div>
                <Button onClick={handleAddStop} className="gradient-success text-white border-0 glow-success">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {stops.map((stop, i) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-medium">{stop.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({stop.lat.toFixed(4)}, {stop.lng.toFixed(4)})
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { removeStop(stop.id); toast.info("Stop removed"); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* ROUTES TAB */}
            <TabsContent value="routes" className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 mb-6 items-end">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">From</label>
                  <Select value={routeFrom} onValueChange={setRouteFrom}>
                    <SelectTrigger><SelectValue placeholder="From stop" /></SelectTrigger>
                    <SelectContent>
                      {stops.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">To</label>
                  <Select value={routeTo} onValueChange={setRouteTo}>
                    <SelectTrigger><SelectValue placeholder="To stop" /></SelectTrigger>
                    <SelectContent>
                      {stops.filter(s => s.id !== routeFrom).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Dist (km)</label>
                  <Input value={routeDist} onChange={e => setRouteDist(e.target.value)} placeholder="5.0" type="number" step="any" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Time (min)</label>
                  <Input value={routeTime} onChange={e => setRouteTime(e.target.value)} placeholder="15" type="number" step="any" />
                </div>
                <Button onClick={handleAddRoute} className="gradient-success text-white border-0 glow-success">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {routes.map((route, i) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {getStopName(route.fromStop)} → {getStopName(route.toStop)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{route.distance} km</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">{route.time} min</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { removeRoute(route.id); toast.info("Route removed"); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* MATRIX TAB */}
            <TabsContent value="matrix" className="p-5">
              <div className="text-center mb-6">
                <p className="text-muted-foreground mb-4">
                  Recompute the Floyd-Warshall distance matrix after adding or removing stops/routes.
                </p>
                <Button onClick={handleRecompute} size="lg" className="gradient-primary text-white border-0 glow-primary hover:scale-105 transition-transform">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Recompute Matrix
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="p-2 text-left font-medium text-muted-foreground">From \ To</th>
                      {stops.slice(0, 8).map(s => (
                        <th key={s.id} className="p-2 text-center font-medium text-muted-foreground">{s.name.slice(0, 6)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stops.slice(0, 8).map((fromStop, i) => (
                      <tr key={fromStop.id} className="border-t border-border/50">
                        <td className="p-2 font-medium">{fromStop.name.slice(0, 8)}</td>
                        {stops.slice(0, 8).map((toStop, j) => {
                          const val = useAppState().matrix?.dist[i]?.[j];
                          return (
                            <td key={toStop.id} className={`p-2 text-center ${i === j ? 'bg-muted/30' : ''}`}>
                              {val === Infinity ? "∞" : val?.toFixed(1) || "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

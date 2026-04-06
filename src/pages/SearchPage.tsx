import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Clock, Route as RouteIcon, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import RouteMap from "@/components/RouteMap";
import { useAppState } from "@/context/AppContext";
import { getPath, getDistance, getTime } from "@/lib/floyd-warshall";

export default function SearchPage() {
  const { stops, matrix } = useAppState();
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [result, setResult] = useState<{
    path: string[];
    distance: number;
    time: number;
  } | null>(null);

  const handleSearch = () => {
    if (!matrix || !fromId || !toId || fromId === toId) return;
    const path = getPath(matrix, fromId, toId);
    const distance = getDistance(matrix, fromId, toId);
    const time = getTime(matrix, fromId, toId);
    setResult({ path, distance, time });
  };

  const pathStops = useMemo(() => {
    if (!result) return [];
    return result.path.map(id => stops.find(s => s.id === id)!).filter(Boolean);
  }, [result, stops]);

  const stopName = (id: string) => stops.find(s => s.id === id)?.name || id;

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
          <p className="text-white/70 text-lg">Select your stops and discover the optimal path</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 -mt-8 pb-16">
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
                Find Route
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && result.path.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card p-5 text-center">
                  <Navigation className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold font-display">{result.distance.toFixed(1)} km</div>
                  <div className="text-sm text-muted-foreground">Total Distance</div>
                </Card>
                <Card className="glass-card p-5 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold font-display">{result.time.toFixed(0)} min</div>
                  <div className="text-sm text-muted-foreground">Estimated Time</div>
                </Card>
                <Card className="glass-card p-5 text-center">
                  <RouteIcon className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <div className="text-2xl font-bold font-display">{result.path.length}</div>
                  <div className="text-sm text-muted-foreground">Stops</div>
                </Card>
              </div>

              {/* Path steps */}
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold font-display mb-4">Route Path</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {result.path.map((id, i) => (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        i === 0
                          ? "gradient-primary text-white"
                          : i === result.path.length - 1
                          ? "gradient-accent text-white"
                          : "bg-muted text-foreground"
                      }`}>
                        {stopName(id)}
                      </span>
                      {i < result.path.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Map */}
              <RouteMap stops={stops} pathStops={pathStops} className="h-[450px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {result && result.path.length === 0 && (
          <Card className="glass-card p-8 text-center">
            <p className="text-muted-foreground text-lg">No route found between these stops.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

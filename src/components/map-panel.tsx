"use client";

import { motion } from 'framer-motion';

type Location = {
  lat: number;
  lng: number;
};

interface MapPanelProps {
  locations: Location[];
}

const scale = (value: number, min: number, max: number) => {
    if (max - min === 0) return 50;
    return ((value - min) / (max - min)) * 100;
}

export function MapPanel({ locations }: MapPanelProps) {
    const lats = locations.length > 0 ? locations.map(l => l.lat) : [0];
    const lngs = locations.length > 0 ? locations.map(l => l.lng) : [0];

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

  return (
    <div className="h-[calc(100vh-10rem)] sticky top-24">
      <div 
        className="w-full h-full bg-card rounded-lg border shadow-lg overflow-hidden relative"
        data-ai-hint="map city"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50" />
        {locations.map((loc, index) => {
            const top = 100 - scale(loc.lat, minLat, maxLat);
            const left = scale(loc.lng, minLng, maxLng);
            
            return (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 10 }}
                    className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2"
                    style={{ top: `${top}%`, left: `${left}%` }}
                >
                    <div className="w-full h-full rounded-full bg-primary/80 backdrop-blur-sm ring-4 ring-background/50 shadow-xl flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                </motion.div>
            )
        })}
        {locations.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground font-headline text-lg">Busque por leads para vê-los no mapa</p>
            </div>
        )}
      </div>
    </div>
  );
}

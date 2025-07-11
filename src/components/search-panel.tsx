"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, Filter, Loader2, Tag } from 'lucide-react';

interface SearchPanelProps {
  onSearch: (criteria: { location: string; niche: string; radius: number }) => void;
  isLoading: boolean;
}

export function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [location, setLocation] = useState('São Paulo, SP');
  const [niche, setNiche] = useState('contabilidade');
  const [radius, setRadius] = useState([5]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location, niche, radius: radius[0] });
  };

  return (
    <Card className="bg-black/[.85] border-white/15 backdrop-blur-[10px] hover:border-primary hover:backdrop-blur-[12px] transition-all duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2 font-semibold">
          <Filter className="w-6 h-6 text-primary" />
          Encontre seu Próximo Lead
        </CardTitle>
        <CardDescription>Insira um local e um nicho de negócio para iniciar a prospecção.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="location" 
                aria-label="Localização"
                placeholder="Cidade, endereço ou coordenadas" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="niche">Nicho de Negócio</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="niche"
                aria-label="Nicho de Negócio"
                placeholder="Ex: contabilidade, restaurante, etc."
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="radius">Raio de Busca: {radius[0]} km</Label>
            <Slider 
              id="radius"
              aria-label="Raio de Busca"
              min={1} 
              max={50} 
              step={1} 
              value={radius}
              onValueChange={setRadius}
            />
          </div>

          <Button type="submit" className="w-full font-headline font-semibold" disabled={isLoading} aria-label="Buscar leads">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

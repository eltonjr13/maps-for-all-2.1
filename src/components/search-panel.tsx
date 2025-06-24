"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, Filter, Loader2 } from 'lucide-react';

interface SearchPanelProps {
  onSearch: (criteria: { location: string; niche: string; radius: number }) => void;
  isLoading: boolean;
}

export function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [location, setLocation] = useState('New York, NY');
  const [niche, setNiche] = useState('all');
  const [radius, setRadius] = useState([5]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location, niche, radius: radius[0] });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Filter className="w-6 h-6 text-primary" />
          Find Your Next Lead
        </CardTitle>
        <CardDescription>Enter a location and niche to start prospecting.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="location" 
                placeholder="City, address, or coordinates" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="niche">Business Niche</Label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger id="niche">
                <SelectValue placeholder="Select a niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Niches</SelectItem>
                <SelectItem value="accounting">Accounting</SelectItem>
                <SelectItem value="medical clinic">Medical Clinics</SelectItem>
                <SelectItem value="industry">Industries</SelectItem>
                <SelectItem value="corporate restaurant">Corporate Restaurants</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="radius">Search Radius: {radius[0]} km</Label>
            <Slider 
              id="radius"
              min={1} 
              max={50} 
              step={1} 
              value={radius}
              onValueChange={setRadius}
            />
          </div>

          <Button type="submit" className="w-full font-headline" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

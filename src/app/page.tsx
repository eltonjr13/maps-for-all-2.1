"use client";

import { useState } from 'react';
import type { Business } from '@/types';
import { AppHeader } from '@/components/app-header';
import { SearchPanel } from '@/components/search-panel';
import { ResultsPanel } from '@/components/results-panel';
import { MapPanel } from '@/components/map-panel';

const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'InnovateTech Solutions',
    address: '123 Tech Avenue, Silicon Valley, CA 94043',
    category: 'Software Company',
    website: 'https://innovatetech.com',
    phone: '555-0101',
    email: 'contact@innovatetech.com',
    rating: 4.8,
    openingHours: 'Open now',
    location: { lat: 37.422, lng: -122.084 },
  },
  {
    id: '2',
    name: 'Quantum Accounting',
    address: '456 Finance St, New York, NY 10007',
    category: 'Accounting',
    website: 'https://quantumaccounting.com',
    phone: '555-0102',
    email: 'info@quantumaccounting.com',
    rating: 4.9,
    openingHours: 'Open now',
    location: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: '3',
    name: 'Apex Medical Clinic',
    address: '789 Health Blvd, Chicago, IL 60611',
    category: 'Medical Clinic',
    website: 'https://apexmedical.com',
    phone: '555-0103',
    email: 'appointments@apexmedical.com',
    rating: 4.7,
    openingHours: 'Closed',
    location: { lat: 41.89, lng: -87.6254 },
  },
  {
    id: '4',
    name: 'Gourmet Corporate Catering',
    address: '101 Epicurean Way, San Francisco, CA 94105',
    category: 'Corporate Restaurant',
    website: 'https://gourmetcatering.com',
    phone: '555-0104',
    email: 'events@gourmetcatering.com',
    rating: 4.9,
    openingHours: 'Open now',
    location: { lat: 37.7749, lng: -122.4194 },
  },
  {
    id: '5',
    name: 'Precision Manufacturing',
    address: '212 Industrial Park, Detroit, MI 48226',
    category: 'Industry',
    website: 'https://precisionmfg.com',
    phone: '555-0105',
    email: 'sales@precisionmfg.com',
    rating: 4.6,
    openingHours: 'Open now',
    location: { lat: 42.3314, lng: -83.0458 },
  },
];

const searchLeads = async (criteria: any): Promise<Business[]> => {
  console.log('Searching with criteria:', criteria);
  await new Promise(resolve => setTimeout(resolve, 1500));
  const filtered = mockBusinesses.filter(b => criteria.niche === 'all' || b.category.toLowerCase().includes(criteria.niche.toLowerCase()));
  return filtered;
};

export default function Home() {
  const [results, setResults] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (criteria: { location: string; niche: string; radius: number }) => {
    setIsLoading(true);
    setHasSearched(true);
    setResults([]);
    const data = await searchLeads(criteria);
    setResults(data);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <div className="flex-1 w-full max-w-[90rem] mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 h-full">
          <section className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <SearchPanel onSearch={handleSearch} isLoading={isLoading} />
            <ResultsPanel businesses={results} isLoading={isLoading} hasSearched={hasSearched} />
          </section>
          <aside className="hidden lg:block lg:col-span-7 xl:col-span-8">
            <MapPanel locations={results.map(b => b.location)} />
          </aside>
        </div>
      </div>
    </div>
  );
}

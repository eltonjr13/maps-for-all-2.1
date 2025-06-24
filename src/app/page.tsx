"use client";

import { useState } from 'react';
import type { Business } from '@/types';
import { SearchPanel } from '@/components/search-panel';
import { ResultsPanel } from '@/components/results-panel';
import { MapPanel } from '@/components/map-panel';
import { searchLeads } from '@/ai/flows/search-leads-flow';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [results, setResults] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (criteria: { location: string; niche: string; radius: number }) => {
    setIsLoading(true);
    setHasSearched(true);
    setResults([]);
    try {
      const data = await searchLeads(criteria);
      setResults(data.businesses);
    } catch (error) {
      console.error('Failed to search for leads:', error);
      toast({
        variant: 'destructive',
        title: 'Falha na Busca',
        description: 'Ocorreu um erro ao encontrar leads. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[90rem] mx-auto p-4 md:p-6 lg:p-8">
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
  );
}

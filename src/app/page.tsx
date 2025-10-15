"use client";

import { useState, useMemo } from 'react';
import type { Business } from '@/types';
import { SearchPanel } from '@/components/search-panel';
import { ResultsPanel } from '@/components/results-panel';
import { searchLeads } from '@/ai/flows/search-leads-flow';
import { getLeadDetails } from '@/ai/flows/get-lead-details-flow';
import { useToast } from '@/hooks/use-toast';
import { MapPanel } from '@/components/map-panel';

export default function Home() {
  const [results, setResults] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState<string[]>([]);
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

  const handleFetchDetails = async (businessId: string) => {
    const business = results.find(b => b.id === businessId);
    if (!business || loadingDetails.includes(businessId) || business.phone) {
      return;
    }

    setLoadingDetails(prev => [...prev, businessId]);
    try {
      const details = await getLeadDetails({ businessId });
      setResults(prevResults =>
        prevResults.map(b => (b.id === businessId ? { ...b, ...details } : b))
      );
    } catch (error) {
      console.error('Failed to fetch lead details:', error);
      toast({
        variant: 'destructive',
        title: 'Falha ao Carregar Detalhes',
        description: 'Não foi possível buscar os detalhes completos do lead.',
      });
    } finally {
      setLoadingDetails(prev => prev.filter(id => id !== businessId));
    }
  };
  
  const locations = useMemo(() => results.map(b => b.location).filter(l => l && l.lat && l.lng), [results]);

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
        <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 h-fit mb-8 lg:mb-0">
          <SearchPanel onSearch={handleSearch} isLoading={isLoading} />
        </aside>
        <main className="lg:col-span-4 xl:col-span-5">
          <ResultsPanel 
            businesses={results} 
            isLoading={isLoading} 
            hasSearched={hasSearched}
            onFetchDetails={handleFetchDetails}
            loadingDetails={loadingDetails}
          />
        </main>
        <aside className="hidden xl:block xl:col-span-4">
          <MapPanel locations={locations} />
        </aside>
      </div>
    </div>
  );
}

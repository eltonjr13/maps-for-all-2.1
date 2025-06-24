"use client";

import { useState } from 'react';
import type { Business } from '@/types';
import { SearchPanel } from '@/components/search-panel';
import { ResultsPanel } from '@/components/results-panel';
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
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-6 h-full">
        <SearchPanel onSearch={handleSearch} isLoading={isLoading} />
        <ResultsPanel businesses={results} isLoading={isLoading} hasSearched={hasSearched} />
      </div>
    </div>
  );
}

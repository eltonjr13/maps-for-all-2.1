"use client";

import type { Business } from '@/types';
import { downloadCsv } from '@/lib/csv';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Globe, Mail, MapPin, Phone, Star, Tag, Clock, Building2 } from 'lucide-react';

interface ResultsPanelProps {
  businesses: Business[];
  isLoading: boolean;
  hasSearched: boolean;
}

const InfoLine = ({ icon: Icon, text }: { icon: React.ElementType, text: string | number | undefined }) => {
  if (!text) return null;
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="w-4 h-4 text-accent" />
      <span>{text}</span>
    </div>
  );
};

const BusinessCard = ({ business }: { business: Business }) => (
  <Card className="hover:shadow-md transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="font-headline text-lg text-foreground">{business.name}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <InfoLine icon={Tag} text={business.category} />
      <InfoLine icon={MapPin} text={business.address} />
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoLine icon={Globe} text={business.website} />
        <InfoLine icon={Phone} text={business.phone} />
        <InfoLine icon={Mail} text={business.email} />
        <InfoLine icon={Star} text={`${business.rating} / 5`} />
        <InfoLine icon={Clock} text={business.openingHours} />
      </div>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export function ResultsPanel({ businesses, isLoading, hasSearched }: ResultsPanelProps) {
  const handleExport = () => {
    downloadCsv(businesses, `leads-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-headline text-foreground">
          {isLoading ? 'Buscando...' : `${businesses.length} Leads Encontrados`}
        </h2>
        {businesses.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2">
        {isLoading && <LoadingSkeleton />}
        {!isLoading && hasSearched && businesses.length === 0 && (
            <Card className="text-center p-8">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium font-headline">Nenhuma Empresa Encontrada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Tente ajustar seus critérios de busca.
                </p>
            </Card>
        )}
        {!isLoading && businesses.length > 0 && (
          <div className="space-y-4">
            {businesses.map(business => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import type { Business } from '@/types';
import { downloadCsv } from '@/lib/csv';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Globe, Mail, MapPin, Phone, Star, Tag, Clock, Building2, Map } from 'lucide-react';

interface ResultsPanelProps {
  businesses: Business[];
  isLoading: boolean;
  hasSearched: boolean;
  onFetchDetails: (businessId: string) => void;
  loadingDetails: string[];
}

const InfoLine = ({ icon: Icon, text, href }: { icon: React.ElementType, text?: string | number, href?: string }) => {
  if (!text) return null;

  let linkHref = href;
  if (!linkHref && typeof text === 'string') {
    if (Icon === Phone) {
      linkHref = `tel:${text.replace(/[^\d+]/g, '')}`;
    } else if (text.startsWith('http') || text.startsWith('www')) {
      linkHref = text.startsWith('www') ? `https://${text}` : text;
    }
  }


  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
      <div className="truncate">
        {linkHref ? (
          <a href={linkHref} target="_blank" rel="noopener noreferrer" className="hover:underline text-foreground">
            {String(text)}
          </a>
        ) : (
          <span>{text}</span>
        )}
      </div>
    </div>
  );
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.5-5.613-1.458l-6.323 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.433-9.896-9.896-9.896-5.46 0-9.887 4.434-9.887 9.896 0 2.09.647 4.148 1.82 5.896l-1.2 4.419 4.555-1.196z M12.07 9.382c-.227-.118-1.335-.658-1.543-.733-.207-.075-.357-.118-.507.118-.15.236-.583.733-.714.882-.13.15-.26.168-.487.05-.227-.118-.96-.356-1.829-1.13-1.393-1.2-2.34-2.793-2.614-3.26-.274-.466-.039-.718.106-.867.13-.134.288-.356.438-.533.15-.177.202-.296.302-.495.1-.2.05-.374-.025-.494-.075-.12-.507-1.217-.692-1.666-.177-.433-.357-.375-.507-.383-.134-.008-.288-.008-.438-.008-.15 0-.398.05-.624.296-.226.248-.865.848-.865 2.065s.884 2.398 1.004 2.578c.12.18 1.734 2.82 4.202 3.965.599.267 1.066.426 1.423.545.57.192 1.087.163 1.492.1.448-.075 1.335-.545 1.523-1.071.187-.525.187-.973.132-1.071-.053-.1-.192-.168-.42-.286z"/>
    </svg>
);

const BusinessCardAccordion = ({ business, isLoadingDetails }: { business: Business, isLoadingDetails: boolean }) => {
  const hasDetails = !!business.phone || !!business.website || !!business.email;

  return (
    <AccordionItem value={business.id} className="border-none">
      <Card className="bg-black/[.85] border-white/15 backdrop-blur-[10px] hover:border-primary hover:backdrop-blur-[12px] transition-all duration-300 overflow-hidden">
        <AccordionTrigger className="w-full p-6 text-left hover:no-underline">
          <CardTitle className="font-headline text-lg text-foreground">{business.name}</CardTitle>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-6 pb-6 space-y-3">
            <InfoLine icon={Tag} text={business.category} />
            <InfoLine icon={MapPin} text={business.address} />
            <Separator />
            
            {isLoadingDetails ? (
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : hasDetails ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoLine icon={Globe} text={business.website} />
                  <InfoLine icon={Phone} text={business.phone} />
                  <InfoLine icon={Phone} text={business.internationalPhone} />
                  <InfoLine icon={Mail} text={business.email} href={business.email ? `mailto:${business.email}` : undefined} />
                  <InfoLine icon={Star} text={business.rating ? `${business.rating} / 5` : undefined} />
                  <InfoLine icon={Clock} text={business.openingHours} />
                </div>
                <div className="pt-2 space-y-2 sm:space-y-0 sm:flex sm:gap-2">
                  {business.whatsappLink && (
                    <Button asChild className="w-full" aria-label={`Chamar ${business.name} no WhatsApp`}>
                      <a href={business.whatsappLink} target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="mr-2 h-5 w-5" />
                        Chamar no WhatsApp
                      </a>
                    </Button>
                  )}
                   {business.googleMapsUrl && (
                    <Button asChild variant="secondary" className="w-full" aria-label={`Ver ${business.name} no Google Maps`}>
                        <a href={business.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            <Map className="mr-2 h-5 w-5" />
                            Google Maps
                        </a>
                    </Button>
                  )}
                </div>
              </>
            ) : (
                <div className="pt-2 text-center text-muted-foreground">
                    <p>Nenhum detalhe de contato adicional encontrado.</p>
                </div>
            )}
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <Card key={i} className="bg-black/[.85] border-white/15 backdrop-blur-[10px] p-6">
        <Skeleton className="h-6 w-3/4" />
      </Card>
    ))}
  </div>
);

export function ResultsPanel({ businesses, isLoading, hasSearched, onFetchDetails, loadingDetails }: ResultsPanelProps) {
  const handleExport = () => {
    downloadCsv(businesses, `leads-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleAccordionToggle = (businessId: string) => {
    if (!businessId) return;
    const business = businesses.find(b => b.id === businessId);
    if (business && !business.phone && !loadingDetails.includes(businessId)) {
        onFetchDetails(businessId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-headline font-semibold text-foreground">
          {isLoading ? 'Buscando...' : `${businesses.length} Leads Encontrados`}
        </h2>
        {businesses.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExport} aria-label="Exportar resultados para CSV">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2">
        {isLoading && <LoadingSkeleton />}
        {!isLoading && hasSearched && businesses.length === 0 && (
            <Card className="text-center p-8 bg-black/[.85] backdrop-blur-[10px] border-border">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium font-headline">Nenhuma Empresa Encontrada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Tente ajustar seus critérios de busca.
                </p>
            </Card>
        )}
        {!isLoading && businesses.length > 0 && (
          <Accordion type="single" collapsible className="space-y-4" onValueChange={handleAccordionToggle}>
            {businesses.map(business => (
              <BusinessCardAccordion 
                key={business.id} 
                business={business} 
                isLoadingDetails={loadingDetails.includes(business.id)}
              />
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}

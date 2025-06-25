"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Pause } from 'lucide-react';
import { useBackground } from '@/components/background-provider';

export function AppHeader() {
  const { isAnimating, toggleAnimation } = useBackground();

  return (
    <header className="border-b border-border sticky top-0 bg-black z-10 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="w-10" />
        <Image
          src="https://i.imgur.com/psrWNPI.png"
          alt="Logotipo da Buscador de Leads"
          width={40}
          height={40}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleAnimation} aria-label="Toggle background animation">
                {isAnimating ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isAnimating ? 'Pausar animação de fundo' : 'Iniciar animação de fundo'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}

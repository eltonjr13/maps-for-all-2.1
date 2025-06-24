import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="border-b border-border sticky top-0 bg-black z-10 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3 text-white">
          <AppLogo className="h-7 w-7" />
          <h1 className="text-xl font-semibold font-headline">
            Buscador de Leads
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="link" className="text-white hover:text-primary px-0">Entrar</Button>
            <Button>Minha Conta</Button>
        </div>
      </div>
    </header>
  );
}

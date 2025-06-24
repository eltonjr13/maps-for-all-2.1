import { AppLogo } from '@/components/app-logo';

export function AppHeader() {
  return (
    <header className="border-b border-border sticky top-0 bg-black z-10 shadow-sm">
      <div className="container mx-auto flex items-center justify-center h-16 px-4">
        <div className="flex items-center gap-3 text-white">
          <AppLogo className="h-7 w-7" />
          <h1 className="text-xl font-semibold font-headline">
            Buscador de Leads
          </h1>
        </div>
      </div>
    </header>
  );
}

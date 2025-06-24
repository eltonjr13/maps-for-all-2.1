import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="border-b border-border sticky top-0 bg-black z-10 shadow-sm">
      <div className="container mx-auto flex items-center justify-center h-16 px-4">
        <Image
          src="https://i.imgur.com/psrWNPI.png"
          alt="Logotipo da Buscador de Leads"
          width={40}
          height={40}
        />
      </div>
    </header>
  );
}

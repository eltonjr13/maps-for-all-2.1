import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AppHeader } from '@/components/app-header';
import LightningBackground from '@/components/lightning-background';
import '@/components/lightning-background.css';

export const metadata: Metadata = {
  title: 'Buscador de Leads',
  description: 'Prospecção automática de clientes B2B',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <LightningBackground speed={0.4} intensity={0.7} size={2.0} />
        <div className="relative z-10 flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

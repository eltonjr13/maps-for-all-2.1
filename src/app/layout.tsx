import type {Metadata} from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AppHeader } from '@/components/app-header';
import LightningBackground from '@/components/lightning-background';
import '@/components/lightning-background.css';
import { BackgroundProvider } from '@/components/background-provider';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  variable: '--font-poppins'
});

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
    <html lang="pt-br" className={poppins.variable} suppressHydrationWarning>
      <head />
      <body className="font-body antialiased" suppressHydrationWarning>
        <BackgroundProvider>
          <LightningBackground hue={55} xOffset={0} speed={0.7} intensity={0.8} size={2.1} />
          <div className="relative z-10 flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </BackgroundProvider>
      </body>
    </html>
  );
}

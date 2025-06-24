import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="bg-black border-t border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center gap-2">
            <span className="font-headline text-xl font-semibold text-white">
              Buscador de Leads
            </span>
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="#" className="text-white hover:text-primary transition-colors">Sobre</Link>
            <Link href="#" className="text-white hover:text-primary transition-colors">Suporte</Link>
            <Link href="#" className="text-white hover:text-primary transition-colors">Privacidade</Link>
          </div>
          <div className="flex space-x-4">
            <a href="#" aria-label="Visite nosso Twitter" className="text-white hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Visite nosso LinkedIn" className="text-white hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Visite nosso GitHub" className="text-white hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Buscador de Leads. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

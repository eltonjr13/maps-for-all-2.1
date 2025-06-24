import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AppHeader() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Compass className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Lead Seeker
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="ghost">Login</Button>
            <Avatar>
                <AvatarImage src="https://placehold.co/40x40" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
        </div>
      </div>
    </header>
  );
}

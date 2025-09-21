import { Droplets } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Aqua Index Analyzer</span>
        </Link>
        {/* Future navigation links can be added here */}
      </div>
    </header>
  );
}

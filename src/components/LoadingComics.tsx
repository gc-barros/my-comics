import { Loader2 } from 'lucide-react';

export function LoadingComics() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-light-accent">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-lg">Fetching your comics...</p>
    </div>
  );
}

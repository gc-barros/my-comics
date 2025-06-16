import { Loader2 } from 'lucide-react';

export function LoadingComics() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
      <p className="text-light-accent">Loading your comics...</p>
    </div>
  );
}

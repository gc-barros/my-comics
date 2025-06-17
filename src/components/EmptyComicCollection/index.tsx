import { BookOpen } from 'lucide-react';

export function EmptyComicCollection() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <BookOpen className="w-16 h-16 text-light-accent/20" />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-surface">No Comics Yet</h3>
        <p className="text-light-accent max-w-sm">
          Start building your collection by adding your first comic book. Click the &quot;New
          Comic&quot; button above to get started!
        </p>
      </div>
    </div>
  );
}

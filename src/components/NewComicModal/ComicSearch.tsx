import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MarvelComic } from '@/types/marvel';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ComicSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  isSearching: boolean;
  isError: boolean;
  isIdle: boolean;
  noResults: boolean;
  suggestions: MarvelComic[];
  selectedComic: MarvelComic | null;
  onComicSelect: (comic: MarvelComic) => void;
  onComicRemove: () => void;
}

const ComicTag = ({ title, onRemove }: { title: string; onRemove: () => void }) => (
  <div className="flex items-center justify-between gap-1 bg-accent/20 text-surface px-2 py-1 rounded-md">
    <span className="text-sm truncate">{title}</span>
    <Button
      variant="ghost"
      size="icon"
      onClick={onRemove}
      className="h-4 w-4 p-0 text-accent hover:text-surface hover:bg-transparent cursor-pointer"
    >
      <X size={14} />
    </Button>
  </div>
);

export function ComicSearch({
  search,
  onSearchChange,
  isSearching,
  isError,
  isIdle,
  noResults,
  suggestions,
  selectedComic,
  onComicSelect,
  onComicRemove,
}: ComicSearchProps) {
  return (
    <div className="grid gap-2 mb-6">
      <label htmlFor="search" className="font-medium">
        Comic Title
      </label>
      <div className="relative">
        {selectedComic ? (
          <div className="w-full bg-primary text-surface border border-light-accent/20 rounded-md px-2 py-1.5">
            <ComicTag title={selectedComic.title} onRemove={onComicRemove} />
          </div>
        ) : (
          <>
            <Input
              id="search"
              placeholder="Search comic"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full bg-primary text-surface placeholder:text-light-accent/50 border-light-accent/20 focus-visible:ring-light-accent focus-visible:ring-offset-0"
            />
            {isSearching && (
              <p className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-light-accent">
                Searching...
              </p>
            )}
            {isIdle && (
              <p className="mt-2 text-sm text-light-accent">Enter at least 3 letters...</p>
            )}
            {isError && <p className="mt-2 text-sm text-red-400">Error searching for comics.</p>}
            {noResults && search.length >= 3 && !isSearching && (
              <p className="mt-2 text-sm text-red-400">
                No Marvel Comics found for &ldquo;{search}&rdquo;
              </p>
            )}
          </>
        )}
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-primary border border-light-accent/20 rounded-md shadow-lg">
            {suggestions.map(comic => (
              <Button
                key={comic.id}
                variant="ghost"
                className="w-full p-2 text-left hover:bg-light-accent/10 flex items-center gap-2 h-auto cursor-pointer"
                onClick={() => onComicSelect(comic)}
              >
                <Image
                  src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                  alt={comic.title}
                  width={40}
                  height={40}
                  className="rounded"
                />
                <span className="flex-1 truncate">{comic.title}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

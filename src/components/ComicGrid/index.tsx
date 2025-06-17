import { SavedComic } from '@/services/comics';
import { ComicCard } from './ComicCard';

interface ComicGridProps {
  comics: SavedComic[];
  onComicDeleted: (id: string) => void;
  onComicEdited: (comic: SavedComic) => void;
}

export function ComicGrid({ comics, onComicDeleted, onComicEdited }: ComicGridProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-4">
        {comics.map(comic => (
          <ComicCard
            key={comic.id}
            comic={comic}
            onDelete={onComicDeleted}
            onEdit={onComicEdited}
          />
        ))}
      </div>
    </div>
  );
}

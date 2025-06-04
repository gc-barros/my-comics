import { SavedComic, comicsService } from '@/services/comics';
import { ComicCard } from './ComicCard';

interface ComicGridProps {
  comics: SavedComic[];
  onComicDeleted: (id: string) => void;
}

export function ComicGrid({ comics, onComicDeleted }: ComicGridProps) {
  const handleDelete = (id: string) => {
    comicsService.delete(id);
    onComicDeleted(id);
  };

  return (
    <div className="w-full max-w-[1200px]">
      <div className="flex flex-wrap justify-center gap-4">
        {comics.map(comic => (
          <ComicCard key={comic.id} comic={comic} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

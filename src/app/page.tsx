'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NewComicModal } from '@/components/NewComicModal';
import { useEffect, useState } from 'react';
import { SavedComic, comicsService } from '@/services/comics';
import { LoadingComics } from '@/components/LoadingComics';
import { EmptyComicCollection } from '@/components/EmptyComicCollection';
import { ComicGrid } from '@/components/ComicGrid';
import { Toaster, toast } from 'sonner';

export default function Home() {
  const [comics, setComics] = useState<SavedComic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulates a small delay to show loading
    setTimeout(() => {
      setComics(comicsService.getAll());
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSaveComic = (comic: SavedComic) => {
    setComics(prev => [...prev, comic]);
    toast.success('Comic added successfully!');
  };

  const handleEditComic = (updatedComic: SavedComic) => {
    setComics(prev => prev.map(comic => (comic.id === updatedComic.id ? updatedComic : comic)));
    toast.success('Comic updated successfully!');
  };

  const handleComicDeleted = (id: string) => {
    setComics(prev => prev.filter(comic => comic.id !== id));
    toast.success('Comic deleted successfully!');
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 p-4">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-surface tracking-tight">
          Welcome to Your <span className="text-accent">Comic Collection</span>
        </h2>
        <p className="text-light-accent text-lg max-w-2xl">
          Your digital sanctuary for organizing and enjoying your favorite comic books. Start
          building your collection today!
        </p>
      </div>

      <NewComicModal onSave={handleSaveComic}>
        <Button className="bg-accent hover:bg-accent/90 text-surface cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Comic
        </Button>
      </NewComicModal>

      {isLoading ? (
        <LoadingComics />
      ) : comics.length === 0 ? (
        <EmptyComicCollection />
      ) : (
        <ComicGrid
          comics={comics}
          onComicDeleted={handleComicDeleted}
          onComicEdited={handleEditComic}
        />
      )}

      <Toaster richColors position="bottom-right" />
    </div>
  );
}

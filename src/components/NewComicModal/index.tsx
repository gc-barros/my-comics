'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/useDebounce';
import { MarvelComic } from '@/types/marvel';
import { ComicSearch } from './ComicSearch';
import { ComicDetails } from './ComicDetails';
import type { ComicFormData } from '../../types/comicFormSchema';
import { SavedComic, comicsService } from '@/services/comics';
import { useSearchComics } from '@/hooks/useSearchComics';

interface NewComicModalProps {
  children: React.ReactNode;
  onSave: (comic: SavedComic) => void;
}

export function NewComicModal({ children, onSave }: NewComicModalProps) {
  const [search, setSearch] = useState('');
  const [selectedComic, setSelectedComic] = useState<MarvelComic | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const { data: suggestions = [], isLoading, isError } = useSearchComics(debouncedSearch);

  const noResults = !isLoading && search.length >= 3 && suggestions.length === 0;

  const resetFields = () => {
    setSearch('');
    setSelectedComic(null);
    setIsOpen(false);
  };

  const handleComicSelect = (comic: MarvelComic) => {
    setSelectedComic(comic);
    setSearch('');
  };

  const handleSave = (data: ComicFormData) => {
    if (!selectedComic) return;

    const savedComic = comicsService.save(selectedComic, data);
    onSave(savedComic);
    resetFields();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open);
        if (!open) resetFields();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] bg-primary text-surface border-secondary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-surface">Add New Comic</DialogTitle>
        </DialogHeader>

        <ComicSearch
          search={search}
          onSearchChange={setSearch}
          isSearching={isLoading}
          isError={isError}
          isIdle={debouncedSearch.length < 3}
          noResults={noResults}
          suggestions={selectedComic ? [] : suggestions}
          selectedComic={selectedComic}
          onComicSelect={handleComicSelect}
          onComicRemove={resetFields}
        />

        {selectedComic && (
          <ComicDetails comic={selectedComic} onCancel={resetFields} onSave={handleSave} />
        )}
      </DialogContent>
    </Dialog>
  );
}

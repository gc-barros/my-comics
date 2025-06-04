'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/useDebounce';
import { searchComics } from '@/services/marvel';
import { MarvelComic } from '@/types/marvel';
import { ComicSearch } from './ComicSearch';
import { ComicDetails } from './ComicDetails';
import type { ComicFormData } from './schema';
import { SavedComic, comicsService } from '@/services/comics';

interface NewComicModalProps {
  children: React.ReactNode;
  onSave?: (comic: SavedComic) => void;
}

export function NewComicModal({ children, onSave }: NewComicModalProps) {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<MarvelComic[]>([]);
  const [selectedComic, setSelectedComic] = useState<MarvelComic | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    async function fetchComics() {
      if (debouncedSearch.length < 3) {
        setSuggestions([]);
        setNoResults(false);
        return;
      }

      setIsSearching(true);
      setNoResults(false);
      try {
        const results = await searchComics(debouncedSearch);
        setSuggestions(results);
        setNoResults(results.length === 0);
      } catch (error) {
        console.error('Error searching comics:', error);
        setSuggestions([]);
        setNoResults(true);
      } finally {
        setIsSearching(false);
      }
    }

    fetchComics();
  }, [debouncedSearch]);

  const resetFields = () => {
    setSearch('');
    setSuggestions([]);
    setSelectedComic(null);
    setIsOpen(false);
  };

  const handleComicSelect = (comic: MarvelComic) => {
    setSelectedComic(comic);
    setSearch('');
    setSuggestions([]);
  };

  const handleSave = (data: ComicFormData) => {
    if (!selectedComic) return;

    const savedComic = comicsService.save(selectedComic, data);
    onSave?.(savedComic);
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
          isSearching={isSearching}
          noResults={noResults}
          suggestions={suggestions}
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

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StarRating } from '../StarRating';
import { searchComics } from '@/services/marvel';
import { useDebounce } from '@/hooks/useDebounce';
import Image from 'next/image';
import { X } from 'lucide-react';

type ComicStatus = 'not_started' | 'in_progress' | 'finished';

interface MarvelComic {
  id: number;
  title: string;
  description: string;
  textObjects: Array<{
    type: string;
    language: string;
    text: string;
  }>;
  thumbnail: {
    path: string;
    extension: string;
  };
  creators: {
    items: Array<{
      name: string;
      role: string;
    }>;
  };
  dates: Array<{
    type: string;
    date: string;
  }>;
}

interface NewComicModalProps {
  children: React.ReactNode;
}

const ComicTag = ({ title, onRemove }: { title: string; onRemove: () => void }) => (
  <div className="flex items-center justify-between gap-1 bg-accent/20 text-surface px-2 py-1 rounded-md">
    <span className="text-sm truncate">{title}</span>
    <button onClick={onRemove} className="text-accent hover:text-surface transition-colors">
      <X size={14} />
    </button>
  </div>
);

export function NewComicModal({ children }: NewComicModalProps) {
  const [status, setStatus] = useState<ComicStatus>('not_started');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [plannedStartDate, setPlannedStartDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<MarvelComic[]>([]);
  const [selectedComic, setSelectedComic] = useState<MarvelComic | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);

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
    setStatus('not_started');
    setCurrentPage(0);
    setRating(0);
    setPlannedStartDate(undefined);
    setSearch('');
    setSuggestions([]);
    setSelectedComic(null);
  };

  const handleComicSelect = (comic: MarvelComic) => {
    setSelectedComic(comic);
    setSearch('');
    setSuggestions([]);
  };

  const handleRemoveComic = () => {
    resetFields();
  };

  const getAuthor = (comic: MarvelComic) => {
    const writer = comic.creators.items.find(creator => creator.role === 'writer');
    return writer ? writer.name : 'Unknown';
  };

  const getYear = (comic: MarvelComic) => {
    const onsaleDate = comic.dates.find(date => date.type === 'onsaleDate');
    return onsaleDate ? new Date(onsaleDate.date).getFullYear() : 'Unknown';
  };

  const getDescription = (comic: MarvelComic) => {
    // Tenta encontrar primeiro o preview_text
    const previewText = comic.textObjects.find(obj => obj.type === 'issue_preview_text');
    if (previewText) return previewText.text;

    // Se não encontrar, tenta o solicit_text
    const solicitText = comic.textObjects.find(obj => obj.type === 'issue_solicit_text');
    if (solicitText) return solicitText.text;

    // Se não encontrar nenhum, retorna a descrição padrão ou mensagem de fallback
    return comic.description || 'No description available';
  };

  return (
    <Dialog onOpenChange={open => !open && resetFields()}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] bg-primary text-surface border-secondary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-surface">Add New Comic</DialogTitle>
        </DialogHeader>

        {/* Campo de busca de comic */}
        <div className="grid gap-2 mb-6">
          <label htmlFor="search" className="font-medium">
            Comic Title
          </label>
          <div className="relative">
            {selectedComic ? (
              <div className="w-full bg-primary text-surface border border-light-accent/20 rounded-md px-2 py-1.5">
                <ComicTag title={selectedComic.title} onRemove={handleRemoveComic} />
              </div>
            ) : (
              <>
                <Input
                  id="search"
                  placeholder="Search comic"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-primary text-surface placeholder:text-light-accent/50 border-light-accent/20 focus-visible:ring-light-accent focus-visible:ring-offset-0"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-light-accent">
                    Searching...
                  </div>
                )}
                {noResults && search.length >= 3 && !isSearching && (
                  <div className="mt-2 text-sm text-red-400">
                    No Marvel Comics found for &ldquo;{search}&rdquo;
                  </div>
                )}
              </>
            )}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-primary border border-light-accent/20 rounded-md shadow-lg">
                {suggestions.map(comic => (
                  <button
                    key={comic.id}
                    className="w-full p-2 text-left hover:bg-light-accent/10 flex items-center gap-2"
                    onClick={() => handleComicSelect(comic)}
                  >
                    <Image
                      src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                      alt={comic.title}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <span className="flex-1 truncate">{comic.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid de detalhes da comic - só exibido após seleção */}
        {selectedComic && (
          <div className="grid grid-cols-2 gap-6 py-4 relative">
            {/* Coluna 1: Capa */}
            <div>
              <div className="w-[300px] h-[450px] mx-auto relative rounded-md overflow-hidden">
                <Image
                  src={`${selectedComic.thumbnail.path}.${selectedComic.thumbnail.extension}`}
                  alt={selectedComic.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Linha divisória vertical */}
            <div className="absolute top-0 left-1/2 h-full w-px bg-light-accent/20 -translate-x-1/2" />

            {/* Coluna 2: Detalhes e Controles */}
            <div className="space-y-4 min-h-[500px] relative">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Author</h3>
                  <p className="text-light-accent">{getAuthor(selectedComic)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Year</h3>
                  <p className="text-light-accent">{getYear(selectedComic)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-light-accent text-sm line-clamp-3">
                    {getDescription(selectedComic)}
                  </p>
                </div>

                <div className="grid gap-2">
                  <label className="font-semibold">Your Read Status</label>
                  <Select value={status} onValueChange={(value: ComicStatus) => setStatus(value)}>
                    <SelectTrigger
                      className="bg-primary text-surface border-light-accent/20 focus:ring-light-accent 
                  focus:ring-offset-0 w-full"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-primary text-surface border-light-accent/20">
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="finished">Finished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {status === 'not_started' && (
                  <div className="grid gap-2">
                    <label className="font-bold">Planned Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal bg-primary text-surface border-light-accent/20',
                            !plannedStartDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {plannedStartDate ? (
                            format(plannedStartDate, 'dd/MM/yyyy')
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-light-accent/20" align="start">
                        <Calendar
                          className="bg-secondary rounded text-surface"
                          mode="single"
                          selected={plannedStartDate}
                          onSelect={setPlannedStartDate}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {status === 'in_progress' && (
                  <div className="grid gap-2">
                    <label htmlFor="currentPage" className="font-bold">
                      Current Page
                    </label>
                    <Input
                      id="currentPage"
                      type="number"
                      min={0}
                      value={currentPage}
                      onChange={e => setCurrentPage(Number(e.target.value))}
                      className="bg-primary border-light-accent/20"
                    />
                  </div>
                )}

                {status === 'finished' && (
                  <div className="grid gap-2">
                    <label className="font-bold">Rating</label>
                    <StarRating value={rating} onChange={setRating} />
                  </div>
                )}
              </div>

              {/* Botões no canto inferior direito */}
              <div className="absolute bottom-0 right-0 flex gap-2">
                <Button
                  className="w-24 cursor-pointer hover:bg-transparent"
                  variant="outline"
                  onClick={() => resetFields()}
                >
                  Cancel
                </Button>
                <Button className="w-24 bg-accent hover:bg-accent/90 cursor-pointer">Save</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

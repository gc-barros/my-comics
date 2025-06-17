import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StarRating } from '../StarRating';
import { comicsService, SavedComic } from '@/services/comics';
import { cn } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { EditComicModal } from '../EditComicModal';
import { ComicFormData } from '@/types/comicFormSchema';

interface ComicCardProps {
  comic: SavedComic;
  onDelete: (id: string) => void;
  onEdit: (comic: SavedComic) => void;
}

const statusColors = {
  not_started: 'bg-yellow-500/20 text-yellow-500',
  in_progress: 'bg-blue-500/20 text-blue-500',
  finished: 'bg-green-500/20 text-green-500',
} as const;

const statusLabels = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  finished: 'Finished',
} as const;

export function ComicCard({ comic, onDelete, onEdit }: ComicCardProps) {
  const { title, thumbnail, pageCount } = comic.comic;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    comicsService.delete(comic.id);
    onDelete(comic.id);
  };

  const handleEdit = (data: ComicFormData) => {
    const updatedComic = comicsService.update(comic.id, data);
    onEdit(updatedComic);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="bg-primary rounded-lg overflow-hidden border border-accent/10 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 max-w-[240px] w-full h-full flex flex-col group">
        <div className="relative aspect-[2/3] w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent h-20 z-10" />
          <div className="absolute top-2 right-2 z-20 flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors group/edit cursor-pointer"
            >
              <Pencil className="w-5 h-5 text-white group-hover/edit:text-blue-500 transition-colors" />
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors group/delete cursor-pointer"
            >
              <Trash2 className="w-5 h-5 text-white group-hover/delete:text-red-500 transition-colors" />
            </button>
          </div>
          <Image
            src={`${thumbnail.path}.${thumbnail.extension}`}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-3 space-y-2 flex-1 flex flex-col">
          <div>
            <h3 className="font-bold text-sm text-surface line-clamp-1" title={title}>
              {title}
            </h3>

            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs font-medium',
                  statusColors[comic.status]
                )}
              >
                {statusLabels[comic.status]}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs text-light-accent mt-auto">
            {comic.status === 'not_started' && comic.plannedStartDate && (
              <p>Planned: {format(comic.plannedStartDate, "dd 'de' MMM", { locale: ptBR })}</p>
            )}

            {comic.status === 'in_progress' && comic.currentPage && (
              <p>
                Progress: {comic.currentPage}
                {pageCount > 0 &&
                  ` of ${pageCount} (${Math.round((comic.currentPage / pageCount) * 100)}%)`}
                {pageCount === 0 && ' pages'}
              </p>
            )}

            {comic.status === 'finished' && comic.rating && (
              <div className="flex items-center gap-1.5">
                <span>Rating:</span>
                <StarRating value={comic.rating} readOnly size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Comic"
        description="Are you sure you want to delete this comic? This action cannot be undone."
      />

      <EditComicModal
        comic={comic}
        isOpen={isEditModalOpen}
        onSave={handleEdit}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

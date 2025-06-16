import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ComicForm } from './ComicForm';
import { SavedComic, comicsService } from '@/services/comics';
import { ComicFormData } from '../../types/comicFormSchema';

interface EditComicModalProps {
  comic: SavedComic;
  isOpen: boolean;
  onClose: () => void;
  onSave: (comic: SavedComic) => void;
}

export function EditComicModal({ comic, isOpen, onClose, onSave }: EditComicModalProps) {
  const handleSave = (data: ComicFormData) => {
    const updatedComic = comicsService.update(comic.id, data);
    onSave(updatedComic);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-primary text-surface border-secondary">
        <DialogHeader>
          <DialogTitle>Edit Comic</DialogTitle>
        </DialogHeader>
        <ComicForm
          initialData={{
            status: comic.status,
            plannedStartDate: comic.plannedStartDate,
            currentPage: comic.currentPage,
            rating: comic.rating,
            pageCount: comic.comic.pageCount,
          }}
          onSubmit={handleSave}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
}

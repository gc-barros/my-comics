import Image from 'next/image';
import { MarvelComic } from '@/types/marvel';
import { ComicForm } from './ComicForm';
import type { ComicFormData } from '../../types/comicFormSchema';

interface ComicDetailsProps {
  comic: MarvelComic;
  onCancel: () => void;
  onSave: (data: ComicFormData) => void;
}

const getAuthor = (comic: MarvelComic) => {
  const writer = comic.creators.items.find(creator => creator.role === 'writer');
  return writer ? writer.name : 'Unknown';
};

const getYear = (comic: MarvelComic) => {
  const onsaleDate = comic.dates.find(date => date.type === 'onsaleDate');
  return onsaleDate ? new Date(onsaleDate.date).getFullYear() : 'Unknown';
};

const getDescription = (comic: MarvelComic) => {
  const previewText = comic.textObjects.find(obj => obj.type === 'issue_preview_text');
  if (previewText) return previewText.text;

  const solicitText = comic.textObjects.find(obj => obj.type === 'issue_solicit_text');
  if (solicitText) return solicitText.text;

  return comic.description || 'No description available';
};

export function ComicDetails({ comic, onCancel, onSave }: ComicDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 py-4 relative">
      {/* Coluna 1: Capa */}
      <div>
        <div className="w-[300px] h-[450px] mx-auto relative rounded-md overflow-hidden">
          <Image
            src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
            alt={comic.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="absolute top-0 left-1/2 h-full w-px bg-light-accent/20 -translate-x-1/2" />

      {/* Coluna 2: Detalhes e Controles */}
      <div className="space-y-4 min-h-[500px]">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Author</h3>
            <p className="text-light-accent">{getAuthor(comic)}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Year</h3>
            <p className="text-light-accent">{getYear(comic)}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-light-accent text-sm line-clamp-3">{getDescription(comic)}</p>
          </div>
        </div>

        <ComicForm totalPages={comic.pageCount || 0} onCancel={onCancel} onSave={onSave} />
      </div>
    </div>
  );
}

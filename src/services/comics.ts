import { MarvelComic } from '@/types/marvel';
import { ComicFormData } from '@/types/comicFormSchema';
import mockStorage from './mockStorage';

export interface SavedComic {
  id: string;
  comic: MarvelComic;
  status: ComicFormData['status'];
  plannedStartDate: ComicFormData['plannedStartDate'];
  currentPage: ComicFormData['currentPage'];
  rating: ComicFormData['rating'];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = '@my-comics:saved';

export const comicsService = {
  getAll: (): SavedComic[] => {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved || saved === '[]') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockStorage));
      saved = JSON.stringify(mockStorage);
    }
    return JSON.parse(saved, (key, value) => {
      if (value && (key === 'plannedStartDate' || key === 'createdAt' || key === 'updatedAt')) {
        return new Date(value);
      }
      return value;
    });
  },

  save: (comic: MarvelComic, data: ComicFormData): SavedComic => {
    const comics = comicsService.getAll();

    const newComic: SavedComic = {
      id: crypto.randomUUID(),
      comic,
      status: data.status,
      plannedStartDate: data.plannedStartDate,
      currentPage: data.currentPage,
      rating: data.rating,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(newComic);

    comics.push(newComic);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comics));

    return newComic;
  },

  update: (id: string, data: Partial<ComicFormData>): SavedComic => {
    const comics = comicsService.getAll();
    const index = comics.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error('Comic not found');
    }

    const updatedComic = {
      ...comics[index],
      ...data,
      updatedAt: new Date(),
    };

    comics[index] = updatedComic;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comics));

    return updatedComic;
  },

  delete: (id: string): void => {
    const comics = comicsService.getAll();
    const filtered = comics.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};

import md5 from 'md5';
import { MARVEL_API_BASE_URL, MARVEL_PRIVATE_KEY, MARVEL_PUBLIC_KEY } from '@/config/marvel';

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

interface MarvelResponse {
  data: {
    results: MarvelComic[];
  };
}

export async function searchComics(query: string): Promise<MarvelComic[]> {
  const timestamp = new Date().getTime();
  const hash = md5(`${timestamp}${MARVEL_PRIVATE_KEY}${MARVEL_PUBLIC_KEY}`);

  const params = new URLSearchParams({
    apikey: MARVEL_PUBLIC_KEY || '',
    ts: timestamp.toString(),
    hash,
    titleStartsWith: query,
    limit: '5',
    orderBy: 'title',
  });

  const response = await fetch(`${MARVEL_API_BASE_URL}/comics?${params}`);
  const data: MarvelResponse = await response.json();

  return data.data.results;
}

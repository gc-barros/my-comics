import { useQuery } from '@tanstack/react-query';
import md5 from 'md5';
import { MARVEL_API_BASE_URL, MARVEL_PRIVATE_KEY, MARVEL_PUBLIC_KEY } from '@/config/marvelKeys';
import { MarvelComic, MarvelResponse } from '@/types/marvel';

async function fetchComics(query: string, signal?: AbortSignal): Promise<MarvelComic[]> {
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

  const response = await fetch(`${MARVEL_API_BASE_URL}/comics?${params}`, { signal });
  const data: MarvelResponse = await response.json();

  return data.data.results;
}

export function useSearchComics(query: string) {
  // const abortControllerRef = useRef<AbortController | null>(null);

  return useQuery({
    queryKey: ['comics', query],
    /*
    queryFn: async () => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      return fetchComics(query, controller.signal);
    },
    */
    queryFn: ({ signal }) => fetchComics(query, signal),
    enabled: query.length >= 3,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });
}

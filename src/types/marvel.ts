export interface MarvelComic {
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

export interface MarvelResponse {
  data: {
    results: MarvelComic[];
  };
}

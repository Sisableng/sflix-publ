export enum ConsumetMediaType {
  Movie = "Movie",
  TV = "TV Series",
}

export interface ConsumetBase {
  id: string;
  title: string;
  url: string;
  image: string;
  type: ConsumetMediaType;
}

export interface Movie extends ConsumetBase {
  releaseDate?: string;
  duration?: string;
}

export interface TVShow extends ConsumetBase {
  seasons?: number;
  season?: string;
  latestEpisode?: string;
}

export interface MovieDetail extends Movie {
  cover: string;
  description: string;
  genres: string[];
  casts: string[];
  tags: string[];
  production: string;
  country: string;
  rating: number;
  recommendations: Movie[];
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  number?: number;
  season?: number;
  url: string;
}

export interface ProviderServer {
  name: string;
  url: string;
}

export interface Stream {
  headers: Headers;
  sources: Source[];
  subtitles: Subtitle[];
}

export interface Headers {
  Referer: string;
}

export interface Source {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export interface Subtitle {
  url: string;
  lang: string;
}

export interface Country {
  id: string;
  title: string;
  code: string;
}

export interface Genre {
  id: string;
  title: string;
}

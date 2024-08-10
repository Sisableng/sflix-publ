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

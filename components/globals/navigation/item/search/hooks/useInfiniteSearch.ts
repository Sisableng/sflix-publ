import { Movie, TVShow } from "@/types/flixhq";
import useSWRInfinite from "swr/infinite";

export type ResultItem = Movie | TVShow;

export interface SearchResult {
  currentPage: number;
  hasNextPage: boolean;
  results: ResultItem[];
}

interface SearchParams {
  query: string;
}

export const useInfiniteSearch = ({ query }: SearchParams) => {
  const getKey = (pageIndex: number, previousPageData: SearchResult | null) => {
    if (
      query.length === 0 ||
      (previousPageData && !previousPageData.hasNextPage)
    )
      return null;
    return `/api/movies/search?query=${query}&page=${pageIndex + 1}`;
  };

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error("An error occurred while fetching the data");
    }

    return response.json();
  };

  const { data, error, isLoading, size, setSize } =
    useSWRInfinite<SearchResult>(getKey, fetcher);

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.results.length === 0;
  const isReachingEnd =
    isEmpty || (data && !data[data.length - 1]?.hasNextPage);

  return {
    data: data ? data.flatMap((page) => page.results) : [],
    error,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    loadMore: () => setSize(size + 1),
  };
};

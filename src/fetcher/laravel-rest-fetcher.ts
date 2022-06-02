import { PaginationState, SortingState } from "@tanstack/react-table";
import { FetchArgs, Fetcher, FetchResult } from "./index";

export class LaravelRestFetcher<D extends object> implements Fetcher<D> {
  constructor(private readonly url: string) {}

  async fetch({ tableState, columns }: FetchArgs<D>): Promise<FetchResult<D>> {
    if (!tableState?.pagination) return [];
    const url = new URL(
      isAbsoluteUrl(this.url)
        ? this.url
        : `${window.location.origin}${this.url}`
    );
    const { pagination, sorting } = tableState;
    if (sorting) {
      setPaginationQueryParams(url, pagination);
      setSortingQueryParams(url, sorting);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (
      "meta" in data &&
      "data" in data &&
      isLaravelMeta(data.meta) &&
      Array.isArray(data.data)
    ) {
      return {
        data: data.data,
        paginationState: transformLaravelMeta(data.meta),
      };
    }

    return data.data;
  }
}

function setPaginationQueryParams(url: URL, paginationState: PaginationState) {
  url.searchParams.set("page", (paginationState.pageIndex + 1).toString());
  url.searchParams.set("per_page", paginationState.pageSize.toString());
}
function setSortingQueryParams(url: URL, sorting: SortingState) {
  const sortingString = sorting
    .map((sort) => (sort.desc ? "-" : "") + sort.id)
    .join(",");
  url.searchParams.set("sort", sortingString);
}

function isAbsoluteUrl(url: string): boolean {
  return url.indexOf("http://") === 0 || url.indexOf("https://") === 0;
}

interface LaravelMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

function isLaravelMeta(meta: object): meta is LaravelMeta {
  return (
    "current_page" in meta &&
    "from" in meta &&
    "last_page" in meta &&
    "per_page" in meta &&
    "to" in meta &&
    "total" in meta
  );
}

function transformLaravelMeta(meta: LaravelMeta): PaginationState {
  return {
    pageIndex: meta.current_page - 1,
    pageSize: meta.per_page,
    pageCount: meta.last_page,
  };
}

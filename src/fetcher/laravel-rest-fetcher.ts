import { isPaginationTableState } from "../type-guards";
import { FetchArgs, Fetcher, FetchResult, PaginationMeta } from "./index";

export class LaravelRestFetcher<D extends object> implements Fetcher<D> {
  constructor(private readonly url: string) {}

  async fetch({ tableState, columns }: FetchArgs<D>): Promise<FetchResult<D>> {
    if (!tableState) return [];
    const url = new URL(
      isAbsoluteUrl(this.url)
        ? this.url
        : `${window.location.origin}${this.url}`
    );
    if (isPaginationTableState(tableState)) {
      url.searchParams.set("page", (tableState.pageIndex + 1).toString());
      // TODO: add support for pageSize
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
        paginationMeta: transformLaravelMeta(data.meta),
      };
    }

    return data.data;
  }
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

function transformLaravelMeta(meta: LaravelMeta): PaginationMeta {
  return {
    pageIndex: meta.current_page - 1,
    pageSize: meta.per_page,
    pageCount: meta.last_page,
  };
}

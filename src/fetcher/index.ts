import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { TableState } from "react-table";

import { Column } from "../core/types";

export interface FetchArgs<D extends object> {
  tableState?: TableState<D>;
  columns: Column<D>[];
  // customFilters
}

export interface PaginationMeta {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
}

export type FetchResult<D extends object> =
  | D[]
  | {
      data: D[];
      paginationMeta: PaginationMeta;
    };

export interface Fetcher<D extends object> {
  fetch(fetchArgs: FetchArgs<D>): Promise<FetchResult<D>>;
}

interface Props<D extends object> {
  fetcher: Fetcher<D>;
  columns: Column<D>[];
  tableState?: TableState<D>;
  key: string;
}

export interface FetcherState<D extends object> {
  data?: D[];
  paginationMeta?: PaginationMeta;
  isLoading: boolean;
  error?: unknown;
}

export function useFetcher<D extends object>({
  fetcher,
  columns,
  tableState,
  key,
}: Props<D>) {
  const [oldFetchResult, setOldFetchResult] = useState<FetchResult<D>>();
  const {
    isLoading,
    error,
    data: fetchResult,
  } = useQuery({
    queryKey: [`${key}-fetch`, tableState],
    queryFn: () => {
      return fetcher.fetch({
        columns,
        tableState: tableState,
      });
    },
  });

  useEffect(() => {
    if (fetchResult) {
      setOldFetchResult(fetchResult);
    }
  }, [fetchResult]);

  const { data, paginationMeta } =
    (fetchResult && extractFetchResult(fetchResult)) ||
    (oldFetchResult && extractFetchResult(oldFetchResult)) ||
    {};

  const fetcherState: FetcherState<D> = {
    isLoading,
    error,
    data,
  };

  if (paginationMeta) {
    fetcherState.paginationMeta = paginationMeta;
  }

  return fetcherState;
}

function extractFetchResult<D extends object>(fetchResult: FetchResult<D>) {
  if (fetchResult && "data" in fetchResult) {
    return {
      data: fetchResult.data,
      paginationMeta: fetchResult.paginationMeta,
    };
  }
  return { data: fetchResult };
}

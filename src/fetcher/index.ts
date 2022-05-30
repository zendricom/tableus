import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { ColumnDef, TableState } from "../core/types";

export interface FetchArgs<D extends Record<string, any>> {
  tableState?: TableState;
  columns: ColumnDef<D>[];
  // customFilters
}

export type FetchResult<D extends Record<string, any>> =
  | D[]
  | {
      data: D[];
      paginationState: PaginationState;
    };

export interface Fetcher<D extends Record<string, any>> {
  fetch(fetchArgs: FetchArgs<D>): Promise<FetchResult<D>>;
}

interface Props<D extends object> {
  fetcher: Fetcher<D>;
  columns: ColumnDef<D>[];
  tableState?: TableState;
  key: string;
}

export interface FetcherState<D extends Record<string, any>> {
  data?: D[];
  paginationState?: PaginationState;
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
        tableState,
      });
    },
  });

  useEffect(() => {
    if (fetchResult) {
      setOldFetchResult(fetchResult);
    }
  }, [fetchResult]);

  const { data, paginationState } =
    (fetchResult && extractFetchResult(fetchResult)) ||
    (oldFetchResult && extractFetchResult(oldFetchResult)) ||
    {};

  const fetcherState: FetcherState<D> = {
    isLoading,
    error,
    data,
  };

  if (paginationState) {
    fetcherState.paginationState = paginationState;
  }

  return fetcherState;
}

function extractFetchResult<D extends object>(fetchResult: FetchResult<D>) {
  if (fetchResult && "data" in fetchResult) {
    return {
      data: fetchResult.data,
      paginationState: fetchResult.paginationState,
    };
  }
  return { data: fetchResult };
}

import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PaginationState as ReactTablePaginationState } from "@tanstack/react-table";
import { TableInstance as ReactTableInstance } from "@tanstack/react-table";
import { TableConfig } from "../core";

import { PaginationState, TableState } from "../core/types";

export interface FetchArgs {
  tableState?: RelevantTableState;
  tableConfig: TableConfig;
}

export type FetchResult<D extends Record<string, any>> =
  | D[]
  | {
      data: D[];
      paginationState: PaginationState;
    };

export interface Fetcher<D extends Record<string, any>> {
  fetch(fetchArgs: FetchArgs): Promise<FetchResult<D>>;
}

interface Props<D extends Record<string, any>> {
  fetcher: Fetcher<D>;
  tableState?: TableState;
  tableConfig: TableConfig;
  key: string;
}

export interface FetcherState<D extends Record<string, any>> {
  data?: D[];
  paginationState?: PaginationState;
  isLoading: boolean;
  error?: unknown;
}

export type RelevantPaginationState = Omit<
  ReactTablePaginationState,
  "pageCount"
>;

export type RelevantTableState = Omit<TableState, "pagination"> & {
  pagination: RelevantPaginationState;
};

function getRelevantTableState(
  tableState?: TableState
): RelevantTableState | undefined {
  if (!tableState) return undefined;
  return {
    ...tableState,
    pagination: {
      pageIndex: tableState.pagination.pageIndex,
      pageSize: tableState.pagination.pageSize,
    },
  };
}

export function useFetcher<D extends Record<string, any>>({
  fetcher,
  tableState,
  key,
  tableConfig,
}: Props<D>) {
  const [oldFetchResult, setOldFetchResult] = useState<FetchResult<D>>();
  const relevantTableState = getRelevantTableState(tableState);
  const {
    isLoading,
    error,
    data: fetchResult,
  } = useQuery({
    queryKey: [`${key}-fetch`, relevantTableState],
    queryFn: () => {
      return fetcher.fetch({
        tableState: relevantTableState,
        tableConfig,
      });
    },
  });

  useEffect(() => {
    if (fetchResult) {
      setOldFetchResult(fetchResult);
    }
  }, [fetchResult]);

  const { data, paginationState } =
    (fetchResult && extractFetchResult(fetchResult)) || {};
  const { data: oldData } =
    (oldFetchResult && extractFetchResult(oldFetchResult)) || {};

  const fetcherState: FetcherState<D> = {
    isLoading,
    error,
    data: data || oldData,
    paginationState,
  };

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

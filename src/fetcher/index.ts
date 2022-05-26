import { useState } from "react";
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

interface UseFetcherReturn<D extends object> {
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
  const [oldData, setOldData] = useState<D[]>();
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

  const useFetcherReturn: UseFetcherReturn<D> = {
    isLoading,
    error,
  };

  if (fetchResult && "data" in fetchResult) {
    useFetcherReturn.data = fetchResult.data;
    useFetcherReturn.paginationMeta = fetchResult.paginationMeta;
  } else {
    useFetcherReturn.data = fetchResult;
  }
  // if (useFetcherReturn.data) {
  //   setOldData(useFetcherReturn.data);
  // } else if (oldData) {
  //   useFetcherReturn.data = oldData;
  // }

  return useFetcherReturn;
}

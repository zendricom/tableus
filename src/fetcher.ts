import { useEffect, useState } from "react";
import { Column } from "./core";
import { useQuery } from "react-query";

export interface FetchArgs<D extends object> {
  tableState: any;
  columns: Column<D>[];
  // customFilters
}

export interface Fetcher<D extends object> {
  fetch(fetchArgs: FetchArgs<D>): Promise<D[]>;
}

interface Props<D extends object> {
  fetcher: Fetcher<D>;
  columns: Column<D>[];
  tableState: any;
  key: string;
}

export function useFetcher<D extends object>({
  fetcher,
  columns,
  tableState,
  key,
}: Props<D>) {
  const { isLoading, error, data } = useQuery(`${key}-fetch`, () =>
    fetcher.fetch({ columns, tableState })
  );
  console.log("useFetcher", { isLoading, error, data });
  return { data, isLoading, error };
}

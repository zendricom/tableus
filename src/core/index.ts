import {
  createTable as createReactTable,
  getCoreRowModel,
  PaginationState,
  ReactTableGenerics,
  SortingState,
  Table as ReactTable,
  TableInstance as ReactTableInstance,
  useTableInstance,
  UseTableInstanceOptions,
} from "@tanstack/react-table";
import deepmerge from "deepmerge";
import { useContext, useEffect, useMemo, useState } from "react";

import { TableusContext } from "../context";
import { Fetcher, useFetcher } from "../fetcher/index";
import { Props as TableusProps } from "../renderer/index";
import queryParamSync from "./query-param-sync";
import { translateColumns } from "./translator/index";
import { AdditionalColumnDef, ColumnDef, TableState } from "./types";

export interface PaginationTableConfig {
  pagination: boolean;
  pageSize?: number;
  pageSizeSelect?: number[];
}

export type TableConfig = PaginationTableConfig & {
  sorting: boolean;
  rowSelect: boolean;
  syncQueryParams: boolean;
};

export interface TableOptions<T extends ReactTableGenerics> {
  columns: ColumnDef<T>[];
  fetcher: Fetcher<T["Row"]>;
  key: string;
  config?: Partial<TableConfig>;
  reactTableOptions?: Partial<UseTableInstanceOptions<T>>;
}

export interface TableStateInstance<T extends ReactTableGenerics> {
  tableusProps: TableusProps<T>;
  selectedRows: any[];
  reactTableInstance: ReactTableInstance<T>;
}

export function createTable<D extends Record<string, any>>() {
  const table = createReactTable().setRowType<D>();
  return table.setColumnMetaType<AdditionalColumnDef<typeof table.generics>>();
}
const defaultTableConfig: TableConfig = {
  pagination: false,
  sorting: false,
  rowSelect: false,
  syncQueryParams: true,
};

export function useTableus<T extends ReactTableGenerics>(
  table: ReactTable<T>,
  options: TableOptions<T>
): TableStateInstance<T> {
  const {
    columns,
    fetcher,
    key,
    reactTableOptions: reactTableOptionsProp,
  } = options;
  const tableConfig = { ...defaultTableConfig, ...options.config };

  const context = useContext(TableusContext);
  const tableusConfig = context?.config;
  if (!tableusConfig) {
    throw new Error("Tableus config not provided");
  }

  const reactTableColumns = useMemo(
    () => translateColumns(columns, tableusConfig),
    [columns, tableusConfig]
  );

  const initialTableState: Partial<TableState> = queryParamSync.read(key);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: options.config?.pageSize ?? 20,
    pageCount: -1,
    ...(tableConfig.syncQueryParams && initialTableState.pagination),
  });
  const [sorting, setSorting] = useState<SortingState>(
    initialTableState.sorting ?? []
  );

  useEffect(() => {
    if (!tableConfig.syncQueryParams) return;
    queryParamSync.write(key, {
      pagination,
      sorting,
    });
  }, [pagination, sorting, tableConfig.syncQueryParams]);

  const fetcherState = useFetcher<T["Row"]>({
    fetcher,
    columns,
    tableState: { pagination, sorting },
    key,
  });

  const { data, paginationState } = fetcherState;
  useEffect(() => {
    if (paginationState !== undefined) {
      setPagination(paginationState);
    }
  }, [paginationState]);

  const reactTableOptions: UseTableInstanceOptions<T> = useMemo(() => {
    const config: UseTableInstanceOptions<T> = {
      data: data ?? [],
      columns: reactTableColumns,

      state: { pagination, sorting },

      manualPagination: true,
      onPaginationChange: setPagination,

      manualSorting: true,
      onSortingChange: setSorting,

      autoResetAll: false,

      getCoreRowModel: getCoreRowModel(),
    };
    if (reactTableOptionsProp === undefined) return config;
    return deepmerge<UseTableInstanceOptions<T>>(config, reactTableOptionsProp);
  }, [data, reactTableColumns, reactTableOptionsProp]);

  const reactTableInstance = useTableInstance(table, reactTableOptions);

  return {
    tableusProps: {
      reactTableInstance,
      tableConfig,
      fetcherState,
      tableState: { pagination, sorting },
    },
    selectedRows: [],
    reactTableInstance: reactTableInstance,
  };
}

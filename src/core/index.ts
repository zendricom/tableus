import {
  createTable as createReactTable,
  getCoreRowModel,
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
import { FilterComponentProps } from "../renderer/filtering";
import { Props as TableusProps } from "../renderer/index";
import { Props as PaginationProps } from "../renderer/pagination";

import {
  read as readQueryParams,
  write as writeQueryParams,
} from "./query-param-sync";
import { translateColumns } from "./translator/index";
import {
  AdditionalColumnDef,
  ColumnDef,
  FilterDefinition,
  FilteringState,
  PaginationState,
  TableState,
} from "./types";

export interface PaginationTableConfig {
  pagination: boolean;
  pageSize?: number;
  pageSizeSelect?: number[];
}

export type TableConfig = PaginationTableConfig & {
  sorting: boolean;
  rowSelect: boolean;
  syncQueryParams: boolean;
  filterDefinitions: FilterDefinition[];
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

  filterComponentProps: Omit<FilterComponentProps, "filterKey">;
  paginationComponentProps: PaginationProps<T>;
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
  filterDefinitions: [],
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

  const initialTableState: Partial<TableState> = readQueryParams(key);
  const initialFilters =
    (tableConfig.syncQueryParams && initialTableState?.filters) || [];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: options.config?.pageSize ?? 25,
    pageCount: -1,
    ...(tableConfig.syncQueryParams && initialTableState.pagination),
  });
  const [sorting, setSorting] = useState<SortingState>(
    initialTableState.sorting ?? []
  );
  const [filters, setFilters] = useState<FilteringState>(initialFilters);

  const stateFunctions = useMemo(
    () => ({
      setPagination,
      setSorting,
      setFilters,
    }),
    []
  );

  useEffect(() => {
    if (!tableConfig.syncQueryParams) return;
    writeQueryParams(key, {
      pagination,
      sorting,
      filters,
    });
  }, [pagination, sorting, filters, tableConfig.syncQueryParams]);

  const fetcherState = useFetcher<T["Row"]>({
    fetcher,
    tableState: { pagination, sorting, filters },
    tableConfig,
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
      tableState: { pagination, sorting, filters },
      stateFunctions,
    },
    filterComponentProps: {
      filters,
      setFilters,
      filterDefinitions: options.config?.filterDefinitions ?? [],
    },
    paginationComponentProps: {
      paginationState: pagination,
      reactTableInstance: reactTableInstance,
      tableConfig: tableConfig,
      position: "custom",
    },
    selectedRows: [],
    reactTableInstance: reactTableInstance,
  };
}

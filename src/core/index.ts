import {
  getCoreRowModel,
  SortingState,
  useReactTable,
  TableOptions as ReactTableOptions,
  Table as ReactTable,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import deepmerge from "deepmerge";
import { useContext, useEffect, useMemo, useState } from "react";

import { PaginationProps, TableusConfig, TableusContext } from "../context";
import { Fetcher, useFetcher } from "../fetcher/index";
import { FilterComponentProps } from "../renderer/filtering";
import { Props as TableusProps } from "../renderer/index";
import { useControlPagination } from "./pagination-controller";

import {
  read as readQueryParams,
  write as writeQueryParams,
} from "./query-param-sync";
import { translateColumns } from "./translator/index";
import {
  FilterDefinition,
  FilteringState,
  PaginationState,
  TableState,
} from "./types";

export interface PaginationTableConfig {
  pagination: boolean;
  showPagination?: "top" | "bottom" | "both" | "none";
  pageSize?: number;
  pageSizeSelect?: number[];
}

export type TableConfig = PaginationTableConfig & {
  sorting: boolean;
  rowSelect: boolean;
  syncQueryParams: boolean;
  filterDefinitions: FilterDefinition[];
};

export interface TableOptions<D extends Record<string, any>> {
  columns: ColumnDef<D, any>[];
  fetcher: Fetcher<D>;
  key: string;
  config?: Partial<TableConfig>;
  reactTableOptions?: Partial<ReactTableOptions<D>>;
}

export interface TableStateInstance<D extends Record<string, any>> {
  tableusProps: TableusProps<D>;
  selectedRows: any[];
  reactTable: ReactTable<D>;

  filterComponentProps: Omit<FilterComponentProps, "filterKey">;
  paginationComponentProps: PaginationProps;
}

const defaultTableConfig: TableConfig = {
  pagination: false,
  showPagination: "both",
  sorting: false,
  rowSelect: false,
  syncQueryParams: true,
  filterDefinitions: [],
};

export function useTableus<D extends Record<string, any>>(
  tableOptions: TableOptions<D>
) {
  const {
    columns,
    fetcher,
    key,
    reactTableOptions: reactTableOptionsProp,
  } = tableOptions;

  const context = useContext(TableusContext);
  const tableusConfig = context?.config;
  if (!tableusConfig) {
    throw new Error("Tableus config not provided");
  }
  const tableConfig = mergeTableusDefaults(tableOptions.config, tableusConfig);

  const reactTableColumns = useMemo(
    () => translateColumns(columns, tableusConfig),
    [columns, tableusConfig]
  );

  const initialTableState: Partial<TableState> = readQueryParams(key);
  const initialFilters =
    (tableConfig.syncQueryParams && initialTableState?.filters) || [];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: tableOptions.config?.pageSize ?? tableusConfig.pageSize ?? 25,
    ...(tableConfig.syncQueryParams && initialTableState.pagination),
  });
  const [sorting, setSorting] = useState<SortingState>(
    initialTableState.sorting ?? []
  );
  const [filters, setFilters] = useState<FilteringState>(initialFilters);

  useControlPagination(setPagination, pagination);

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

  const fetcherState = useFetcher<D>({
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

  const reactTableOptions: ReactTableOptions<D> = useMemo(() => {
    const config: ReactTableOptions<D> = {
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
    return deepmerge<ReactTableOptions<D>>(config, reactTableOptionsProp);
  }, [data, reactTableColumns, reactTableOptionsProp]);

  const reactTable = useReactTable(reactTableOptions);
  const paginationProps: PaginationProps = {
    paginationState: pagination,
    paginationMethods: reactTable,
    paginationConfig: tableConfig,
    position: "custom",
  };

  return {
    tableusProps: {
      reactTable,
      tableConfig,
      fetcherState,
      tableState: { pagination, sorting, filters },
      stateFunctions,
    },
    filterComponentProps: {
      filters,
      setFilters,
      filterDefinitions: tableOptions.config?.filterDefinitions ?? [],
    },
    paginationProps,
    selectedRows: [],
    reactTable: reactTable,
  };
}

function mergeTableusDefaults(
  tableConfig: Partial<TableConfig> | undefined,
  tableusConfig: TableusConfig
): TableConfig {
  if (tableConfig !== undefined) {
    tableConfig.pageSize = tableConfig.pageSize ?? tableusConfig.pageSize;
    tableConfig.pageSizeSelect =
      tableConfig.pageSizeSelect ?? tableusConfig.pageSizeSelect;
  }
  return { ...defaultTableConfig, ...tableConfig };
}

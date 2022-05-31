import {
  createTable as createReactTable,
  getCoreRowModel,
  PaginationState,
  ReactTableGenerics,
  Table as ReactTable,
  TableInstance as ReactTableInstance,
  useTableInstance,
  UseTableInstanceOptions,
} from "@tanstack/react-table";
import deepmerge from "deepmerge";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { TableusContext } from "../context";
import { Fetcher, useFetcher } from "../fetcher/index";
import { Props as TableusProps } from "../renderer/index";

import { translateColumns } from "./translator/index";
import { AdditionalColumnDef, ColumnDef } from "./types";

export interface PaginationTableConfig {
  pagination?: boolean;
  pageSize?: 10;
  pageSizeSelect?: [10, 25, 50, 100];
}

export type TableConfig = PaginationTableConfig & { rowSelect?: boolean };

export interface TableOptions<T extends ReactTableGenerics> {
  columns: ColumnDef<T>[];
  fetcher: Fetcher<T["Row"]>;
  key: string;
  config?: TableConfig;
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

export function useTableus<T extends ReactTableGenerics>(
  table: ReactTable<T>,
  options: TableOptions<T>
): TableStateInstance<T> {
  const {
    columns,
    fetcher,
    config: tableConfig = {},
    key,
    reactTableOptions: reactTableOptionsProp,
  } = options;

  const context = useContext(TableusContext);
  const tableusConfig = context?.config;
  if (!tableusConfig) {
    throw new Error("Tableus config not provided");
  }

  const reactTableColumns = useMemo(
    () => translateColumns(columns, tableusConfig),
    [columns]
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    pageCount: 200,
  });

  const fetcherState = useFetcher<T["Row"]>({
    fetcher,
    columns,
    tableState: { pagination },
    key,
  });
  const { data, paginationState } = fetcherState;
  useEffect(() => {
    if (paginationState !== undefined) {
      setPagination(paginationState);
    }
  }, [paginationState]);

  const reactTableOptions: UseTableInstanceOptions<T> = useMemo(() => {
    const configs: Partial<UseTableInstanceOptions<T>>[] = [
      {
        data: data ?? [],
        columns: reactTableColumns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),

        // consider autoResetAll as this already caused a hard to debug bug
        autoResetPageIndex: false,
      },
    ];
    if (reactTableOptionsProp !== undefined)
      configs.push(reactTableOptionsProp);
    return deepmerge.all<UseTableInstanceOptions<T>>(configs);
  }, [data, reactTableColumns, reactTableOptionsProp]);

  const reactTableInstance = useTableInstance(table, reactTableOptions);

  return {
    tableusProps: {
      reactTableInstance,
      tableConfig,
      fetcherState,
      tableState: { pagination },
    },
    selectedRows: [],
    reactTableInstance: reactTableInstance,
  };
}

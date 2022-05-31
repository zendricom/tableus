import {
  createTable as createReactTable,
  getCoreRowModel,
  PaginationState,
  ReactTableGenerics,
  Render,
  Table as ReactTable,
  TableInstance as ReactTableInstance,
  TableState as ReactTableState,
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

  // const [laggedTableState, setLaggedTableState] = useState<ReactTableState>();

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

  // const [plugins, pluginConfigs] = useMemo((): [
  //   PluginHook<D>[],
  //   Record<any, any>[]
  // ] => {
  //   if (tableConfig === undefined) return [[], []];
  //   const pluginConfigs = getPlugins<D>(tableConfig, { paginationState });
  //   const plugins = pluginConfigs.map((c) => c.plugin);
  //   const configs = pluginConfigs.map((c) => c.config);
  //   return [plugins, configs];
  // }, [tableConfig, paginationState]);
  //
  //
  const reactTableOptions: UseTableInstanceOptions<T> = useMemo(() => {
    const configs: Partial<UseTableInstanceOptions<T>>[] = [
      {
        data: data ?? [],
        columns: reactTableColumns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),

      },
      // ...pluginConfigs,
    ];
    if (reactTableOptionsProp !== undefined)
      configs.push(reactTableOptionsProp);
    return deepmerge.all<UseTableInstanceOptions<T>>(configs);
    // }, [data, reactTableColumns, pluginConfigs,
    // options.reactTableOptions]);
    // }, [data, reactTableColumns, pluginConfigs, reactTableOptionsProp]);
  }, [data, reactTableColumns, reactTableOptionsProp]);

  const reactTableInstance = useTableInstance(
    table,
    reactTableOptions
    // ...plugins
  );
  // const [tableState, setTableState] = useState<ReactTableState>(
  //   reactTableInstance.initialState
  // );
  // useEffect(() => {
  //   setLaggedTableState(tableState);
  // }, [tableState]);

  // const setPagination = useCallback(

  // reactTableInstance.setOptions((prev) => ({
  //   ...prev,
  //   state: tableState,
  //   onStateChange: setTableState,
  // }));

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

// interface PluginConfig<D extends object> {
//   plugin: PluginHook<D>;
//   config: object;
// }

// function getPlugins<D extends object>(
//   config: TableConfig,
//   dynamicPluginConfig: { paginationState?: PaginationMeta }
// ) {
//   const pluginConfigs: PluginConfig<D>[] = [];
//
//   if (config.pagination)
//     pluginConfigs.push(
//       getPagination<D>(config, dynamicPluginConfig.paginationState)
//     );
//
//   return pluginConfigs;
// }
//
// function getPagination<D extends object>(
//   config: TableConfig,
//   paginationState?: PaginationMeta
// ): PluginConfig<D> {
//   return {
//     plugin: usePagination,
//     config: {
//       manualPagination: true,
//       pageCount: paginationState?.pageCount ?? 10,
//       initialState: {
//         pageSize: paginationState?.pageIndex ?? config.pageSize,
//       },
//     },
//   };
// }

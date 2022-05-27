import { useContext, useEffect, useMemo, useState } from "react";
import {
  PluginHook,
  TableInstance as ReactTableInstance,
  TableOptions as ReactTableOptions,
  TableState,
  usePagination,
  useTable,
} from "react-table";
import { Fetcher, PaginationMeta, useFetcher } from "../fetcher/index";
import { Props as TableusProps } from "../renderer/index";
import deepmerge from "deepmerge";
import { translateColumns } from "./translator/index";
import { Column } from "./types";
import { TableusContext } from "../context";

export interface PaginationTableConfig {
  pagination?: boolean;
  pageSize?: 10;
  pageSizeSelect?: [10, 25, 50, 100];
}

export type TableConfig = PaginationTableConfig & {
  rowSelect?: boolean;
};

export interface TableOptions<D extends object> {
  columns: Column<D>[];
  fetcher: Fetcher<D>;
  key: string;
  config?: TableConfig;
  reactTableOptions?: Partial<ReactTableOptions<D>>;
}

export interface TableStateInstance<D extends object> {
  tableusProps: TableusProps<D>;
  selectedRows: any[];
  reactTableInstance: ReactTableInstance<D>;
}

export function useTableus<D extends object>(
  options: TableOptions<D>
): TableStateInstance<D> {
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

  const [tableState, setTableState] = useState<TableState<D>>();

  const fetcherState = useFetcher<D>({
    fetcher,
    columns,
    tableState,
    key,
  });
  const { data, paginationMeta } = fetcherState;

  const [plugins, pluginConfigs] = useMemo((): [
    PluginHook<D>[],
    Record<any, any>[]
  ] => {
    if (tableConfig === undefined) return [[], []];
    const pluginConfigs = getPlugins<D>(tableConfig, { paginationMeta });
    const plugins = pluginConfigs.map((c) => c.plugin);
    const configs = pluginConfigs.map((c) => c.config);
    return [plugins, configs];
  }, [tableConfig, paginationMeta]);

  const reactTableOptions: ReactTableOptions<D> = useMemo(() => {
    const configs: Partial<ReactTableOptions<D>>[] = [
      {
        data: data ?? [],
        columns: reactTableColumns,
      },
      ...pluginConfigs,
    ];
    if (reactTableOptionsProp !== undefined)
      configs.push(reactTableOptionsProp);
    return deepmerge.all<ReactTableOptions<D>>(configs);
    // }, [data, reactTableColumns, pluginConfigs, options.reactTableOptions]);
  }, [data, reactTableColumns, pluginConfigs, reactTableOptionsProp]);

  const reactTableInstance = useTable<D>(reactTableOptions, ...plugins);

  useEffect(() => {
    setTableState(reactTableInstance.state);
  }, [reactTableInstance.state]);

  return {
    tableusProps: { reactTableInstance, tableConfig, fetcherState },
    selectedRows: [],
    reactTableInstance: reactTableInstance,
  };
}

interface PluginConfig<D extends object> {
  plugin: PluginHook<D>;
  config: object;
}

function getPlugins<D extends object>(
  config: TableConfig,
  dynamicPluginConfig: { paginationMeta?: PaginationMeta }
) {
  const pluginConfigs: PluginConfig<D>[] = [];

  if (config.pagination)
    pluginConfigs.push(
      getPagination<D>(config, dynamicPluginConfig.paginationMeta)
    );

  return pluginConfigs;
}

function getPagination<D extends object>(
  config: TableConfig,
  paginationMeta?: PaginationMeta
): PluginConfig<D> {
  return {
    plugin: usePagination,
    config: {
      manualPagination: true,
      pageCount: paginationMeta?.pageCount ?? 10,
      initialState: {
        pageSize: paginationMeta?.pageIndex ?? config.pageSize,
      },
    },
  };
}

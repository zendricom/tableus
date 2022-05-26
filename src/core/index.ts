import { useContext, useMemo } from "react";
import {
  PluginHook,
  TableInstance as ReactTableInstance,
  TableOptions as ReactTableOptions,
  usePagination,
  useTable,
} from "react-table";
import { Fetcher, useFetcher } from "../fetcher/index";
import { Props as TableusProps } from "../renderer/index";
import deepmerge from "deepmerge";
import { translateColumns } from "./translator/index";
import { Column } from "./types";
import { TableusContext } from "../context";

export interface TableConfig {
  rowSelect?: boolean;
  pagination?: boolean;
  pageSize?: 10;
  pageSizeSelect?: [10, 25, 50, 100];
}

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
    config: tableConfig,
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

  const { data, isLoading, error } = useFetcher<D>({
    fetcher,
    columns,
    tableState: {},
    key,
  });

  const [plugins, pluginConfigs] = useMemo((): [
    PluginHook<D>[],
    Record<any, any>[]
  ] => {
    if (tableConfig === undefined) return [[], []];
    const pluginConfigs = getPlugins<D>(tableConfig);
    const plugins = pluginConfigs.map((c) => c.plugin);
    const configs = pluginConfigs.map((c) => c.config);
    return [plugins, configs];
  }, [tableConfig]);

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

  return {
    tableusProps: { reactTableInstance },
    selectedRows: [],
    reactTableInstance: reactTableInstance,
  };
}

interface PluginConfig<D extends object> {
  plugin: PluginHook<D>;
  config: object;
}

function getPlugins<D extends object>(config: TableConfig) {
  const pluginConfigs: PluginConfig<D>[] = [];

  if (config.pagination) pluginConfigs.push(getPagination<D>(config));

  return pluginConfigs;
}

function getPagination<D extends object>(config: TableConfig): PluginConfig<D> {
  return {
    plugin: usePagination,
    config: {
      manualPagination: true,
      pageCount: -1,
      initialState: {
        pageSize: config.pageSize,
      },
    },
  };
}

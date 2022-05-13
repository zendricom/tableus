import { useContext, useMemo } from "react";
import {
  TableInstance as ReactTableInstance,
  TableOptions as ReactTableOptions,
  useTable,
} from "react-table";

import { Fetcher, useFetcher } from "../fetcher/index";
import { Props as TableusProps } from "../renderer/index";
import { UIContext } from "../ui/context";
import { translateColumns } from "./translator/index";

import { Column } from "./types";

interface TableConfig {
  rowSelect?: boolean;
  pagination?: boolean;
  paginationSize?: 10;
  paginationSelect?: [10, 25, 50, 100];
}

interface TableOptions<D extends object> {
  columns: Column<D>[];
  fetcher: Fetcher<D>;
  key: string;
  config: TableConfig;
  reactTableOptions: Partial<ReactTableOptions<D>>;
}

interface TableStateInstance<D extends object> {
  tableusProps: TableusProps<D>;
  selectedRows: any[];
  reactTableInstance: ReactTableInstance<D>;
}

export function useTableus<D extends object>(
  options: TableOptions<D>
): TableStateInstance<D> {
  const { columns, fetcher, config, key } = options;

  const uiContext = useContext(UIContext);
  if (!uiContext?.UI) {
    throw new Error("UI context not found");
  }
  const { UI } = uiContext;
  const UIComponents = UI.getComponents();

  const reactTableColumns = useMemo(
    () => translateColumns(columns, UIComponents),
    [columns]
  );

  const { data, isLoading, error } = useFetcher<D>({
    fetcher,
    columns,
    tableState: {},
    key,
  });

  const reactTableOptions: ReactTableOptions<D> = useMemo(
    () => ({
      data: data ?? [],
      columns: reactTableColumns,
      ...options.reactTableOptions,
    }),
    [data]
  );

  const reactTableInstance = useTable<D>(reactTableOptions);
  return {
    tableusProps: { reactTableInstance },
    selectedRows: [],
    reactTableInstance: reactTableInstance,
  };
}

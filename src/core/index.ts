import { useMemo } from "react";
import {
  Column as ReactTableColumn,
  TableInstance as ReactTableInstance,
  TableOptions as ReactTableOptions,
  useTable,
} from "react-table";
import { Fetcher, useFetcher } from "../fetcher/index";
import { Props as TableusProps } from "../renderer/index";
import {
  Column,
  isHiddenSingleValueColumn,
  isMultiValueColumn,
  isSingleValueColumn,
} from "./types";

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

function getReactTableColumns<D extends object>(
  columns: Column<D>[]
): ReactTableColumn<D>[] {
  return columns.map((column) => {
    if (isHiddenSingleValueColumn<D>(column)) {
      return {
        accessor: column.accessor,
        ...column.reactTableOptions,
      };
    } else if (isSingleValueColumn<D>(column)) {
      return {
        Header: column.Header,
        accessor: column.accessor,
        ...column.reactTableOptions,
      };
    } else if (isMultiValueColumn<D>(column)) {
      return {
        Header: column.Header,
        id: column.key,
        Cell: column.Cell,
        ...column.reactTableOptions,
      };
    }
    throw new Error("Unknown column type");
  }) as ReactTableColumn<D>[]; // temorary fix
}

export function useTableus<D extends object>(
  options: TableOptions<D>
): TableStateInstance<D> {
  const { columns, fetcher, config, key } = options;

  const reactTableColumns = useMemo(
    () => getReactTableColumns(columns),
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

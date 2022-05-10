import { useMemo } from "react";
import {
  Column as ReactTableColumn,
  TableInstance as ReactTableInstance,
  TableOptions as ReactTableOptions,
  useTable,
} from "react-table";
import { Props as TableusProps } from "./renderer";

interface HiddenSingleValueColumn<D extends object> {
  accessor: keyof D;
  isVisible: false;
}

function isHiddenSingleValueColumn<D extends object>(
  column: Column<D>
): column is HiddenSingleValueColumn<D> {
  return (
    "isVisible" in column && column.isVisible === false && !("Header" in column)
  );
}

interface SingleValueColumn<D extends object> {
  accessor: keyof D;
  Header: string | (() => JSX.Element);
}

function isSingleValueColumn<D extends object>(
  column: Column<D>
): column is SingleValueColumn<D> {
  if ("isVisible" in column && column.isVisible === false) {
    return false;
  }
  return "accessor" in column && "Header" in column;
}

interface MultiValueColumn {
  Cell: (cell: any) => JSX.Element;
  Header: string | (() => JSX.Element);
  key: string;
}

function isMultiValueColumn<D extends object>(
  column: Column<D>
): column is MultiValueColumn {
  if ("isVisible" in column && column.isVisible === false) {
    return false;
  }
  return "Cell" in column && "Header" in column && "key" in column;
}

interface ColumnOptions<D extends object> {
  reactTableOptions?: Partial<ReactTableColumn<D>>;
}

export type Column<D extends object> = (
  | HiddenSingleValueColumn<D>
  | SingleValueColumn<D>
  | MultiValueColumn
) &
  ColumnOptions<D>;

interface TableConfig {
  rowSelect?: boolean;
  pagination?: boolean;
  paginationSize?: 10;
  paginationSelect?: [10, 25, 50, 100];
}

interface TableOptions<D extends object> {
  columns: Column<D>[];
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
  options: TableOptions<D>,
  data: D[]
): TableStateInstance<D> {
  const reactTableOptions: ReactTableOptions<D> = useMemo(
    () => ({
      data,
      columns: getReactTableColumns(options.columns),
      ...options.reactTableOptions,
    }),
    []
  );

  const reactTableInstance = useTable<D>(reactTableOptions);
  return {
    tableusProps: { reactTableInstance },
    selectedRows: [],
    reactTableInstance: reactTableInstance,
  };
}

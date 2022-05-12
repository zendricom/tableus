import { Path } from "../helpers/types";
import { CellProps, Column as ReactTableColumn, Renderer } from "react-table";

export interface HiddenSingleValueColumn<D extends object> {
  accessor: Path<D>;
  isVisible: false;
}

export function isHiddenSingleValueColumn<D extends object>(
  column: Column<D>
): column is HiddenSingleValueColumn<D> {
  return (
    "isVisible" in column && column.isVisible === false && !("Header" in column)
  );
}

export interface SingleValueColumn<D extends object> {
  accessor: Path<D>;
  Header: string | (() => JSX.Element);
}

export function isSingleValueColumn<D extends object>(
  column: Column<D>
): column is SingleValueColumn<D> {
  if ("isVisible" in column && column.isVisible === false) {
    return false;
  }
  return "accessor" in column && "Header" in column;
}

// export type ExtendedCellProps<D extends object, V> = CellProps<D, V> & {
//   values: D;
// };

export interface MultiValueColumn<D extends object> {
  Cell: Renderer<CellProps<D, any>> | undefined;
  Header: string | (() => JSX.Element);
  key: string;
}

export function isMultiValueColumn<D extends object>(
  column: Column<D>
): column is MultiValueColumn<D> {
  if ("isVisible" in column && column.isVisible === false) {
    return false;
  }
  return "Cell" in column && "Header" in column && "key" in column;
}

export interface ColumnOptions<D extends object> {
  reactTableOptions?: Partial<ReactTableColumn<D>>;
}

export type Column<D extends object> = (
  | HiddenSingleValueColumn<D>
  | SingleValueColumn<D>
  | MultiValueColumn<D>
) &
  ColumnOptions<D>;

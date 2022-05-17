import { Path } from "../helpers/types";
import { CellProps, Column as ReactTableColumn, Renderer } from "react-table";

export type Accessor<D> = string | Path<D>;
export type ColumnValueType = "date" | "datetime";

export interface HiddenSingleValueColumn<D extends object> {
  accessor: Accessor<D>;
  isVisible: false;
  isId?: boolean;
}

export function isHiddenSingleValueColumn<D extends object>(
  column: Column<D>
): column is HiddenSingleValueColumn<D> {
  return (
    "isVisible" in column && column.isVisible === false && !("Header" in column)
  );
}

export interface VisibleColumnOptions<D extends object> {
  link?: (props: EasyCellProps<D>) => string;
  tooltip?: (props: EasyCellProps<D>) => string;
}

export interface SingleValueColumn<D extends object> {
  accessor: Accessor<D>;
  Header: string | (() => JSX.Element);
  Cell?: Renderer<EasyCellProps<D>> | undefined;
  type?: ColumnValueType;
  isId?: boolean;
}

export function isSingleValueColumn<D extends object>(
  column: Column<D>
): column is SingleValueColumn<D> {
  if ("isVisible" in column && column.isVisible === false) {
    return false;
  }
  return "accessor" in column && "Header" in column;
}

export interface MultiValueColumn<D extends object> {
  Cell: Renderer<EasyCellProps<D>>;
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
  | ((SingleValueColumn<D> | MultiValueColumn<D>) & VisibleColumnOptions<D>)
) &
  ColumnOptions<D>;

export interface EasyCellProps<D extends object> {
  value: any;
  data: D;
  cellProps: CellProps<D>;
  id?: any;
}

import { Path } from "../helpers/types";
import { CellProps, Column as ReactTableColumn, Renderer } from "react-table";

export type Accessor<D> = string | Path<D>;
export type ColumnValueType = "date" | "datetime";

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
  return "Cell" in column && "Header" in column && "key" in column;
}

export interface ColumnOptions<D extends object> {
  reactTableOptions?: Partial<ReactTableColumn<D>>;
  link?: (props: EasyCellProps<D>) => string;
  tooltip?: (props: EasyCellProps<D>) => string;
}

export type Column<D extends object> =
  | (SingleValueColumn<D> | MultiValueColumn<D>) & ColumnOptions<D>;

export interface EasyCellProps<D extends object> {
  value: any;
  data: D;
  cellProps: CellProps<D>;
  id?: any;
}

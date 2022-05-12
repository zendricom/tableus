/// <reference types="react" />
import { Path } from "../helpers/types";
import { CellProps, Column as ReactTableColumn, Renderer } from "react-table";
export interface HiddenSingleValueColumn<D extends object> {
    accessor: Path<D>;
    isVisible: false;
}
export declare function isHiddenSingleValueColumn<D extends object>(column: Column<D>): column is HiddenSingleValueColumn<D>;
export interface SingleValueColumn<D extends object> {
    accessor: Path<D>;
    Header: string | (() => JSX.Element);
}
export declare function isSingleValueColumn<D extends object>(column: Column<D>): column is SingleValueColumn<D>;
export interface MultiValueColumn<D extends object> {
    Cell: Renderer<CellProps<D, any>> | undefined;
    Header: string | (() => JSX.Element);
    key: string;
}
export declare function isMultiValueColumn<D extends object>(column: Column<D>): column is MultiValueColumn<D>;
export interface ColumnOptions<D extends object> {
    reactTableOptions?: Partial<ReactTableColumn<D>>;
}
export declare type Column<D extends object> = (HiddenSingleValueColumn<D> | SingleValueColumn<D> | MultiValueColumn<D>) & ColumnOptions<D>;
//# sourceMappingURL=types.d.ts.map
/// <reference types="react" />
import { Column as ReactTableColumn, TableInstance as ReactTableInstance, TableOptions as ReactTableOptions } from "react-table";
import { Fetcher } from "./fetcher";
import { Props as TableusProps } from "./renderer";
declare type PathImpl<T, K extends keyof T> = K extends string ? T[K] extends Record<string, any> ? T[K] extends ArrayLike<any> ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}` : K | `${K}.${PathImpl<T[K], keyof T[K]>}` : K : never;
declare type Path<T> = PathImpl<T, keyof T> | keyof T;
interface HiddenSingleValueColumn<D extends object> {
    accessor: Path<D>;
    isVisible: false;
}
interface SingleValueColumn<D extends object> {
    accessor: Path<D>;
    Header: string | (() => JSX.Element);
}
interface MultiValueColumn {
    Cell: (cell: any) => JSX.Element;
    Header: string | (() => JSX.Element);
    key: string;
}
interface ColumnOptions<D extends object> {
    reactTableOptions?: Partial<ReactTableColumn<D>>;
}
export declare type Column<D extends object> = (HiddenSingleValueColumn<D> | SingleValueColumn<D> | MultiValueColumn) & ColumnOptions<D>;
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
export declare function useTableus<D extends object>(options: TableOptions<D>): TableStateInstance<D>;
export {};
//# sourceMappingURL=core.d.ts.map
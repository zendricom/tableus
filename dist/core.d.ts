/// <reference types="react" />
import { Column as ReactTableColumn, TableInstance as ReactTableInstance, TableOptions as ReactTableOptions } from "react-table";
interface HiddenSingleValueColumn<D extends object> {
    accessor: keyof D;
    isVisible: false;
}
interface SingleValueColumn<D extends object> {
    accessor: keyof D;
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
    config: TableConfig;
    reactTableOptions: Partial<ReactTableOptions<D>>;
}
interface TableStateInstance<D extends object> {
    tableusProps: any;
    selectedRows: any[];
    reactTableInstance: ReactTableInstance<D>;
}
export declare function useTableus<D extends object>(options: TableOptions<D>, data: D[]): TableStateInstance<D>;
export {};
//# sourceMappingURL=core.d.ts.map
import { TableInstance as ReactTableInstance, TableOptions as ReactTableOptions } from "react-table";
import { Fetcher } from "../fetcher/index";
import { Props as TableusProps } from "../renderer/index";
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
export declare function useTableus<D extends object>(options: TableOptions<D>): TableStateInstance<D>;
export {};
//# sourceMappingURL=index.d.ts.map
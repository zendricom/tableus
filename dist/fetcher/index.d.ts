import { Column } from "../core/types";
export interface FetchArgs<D extends object> {
    tableState: any;
    columns: Column<D>[];
}
export interface Fetcher<D extends object> {
    fetch(fetchArgs: FetchArgs<D>): Promise<D[]>;
}
interface Props<D extends object> {
    fetcher: Fetcher<D>;
    columns: Column<D>[];
    tableState: any;
    key: string;
}
export declare function useFetcher<D extends object>({ fetcher, columns, tableState, key, }: Props<D>): {
    data: D[] | undefined;
    isLoading: boolean;
    error: unknown;
};
export {};
//# sourceMappingURL=index.d.ts.map
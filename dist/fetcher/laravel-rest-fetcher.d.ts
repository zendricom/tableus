import { FetchArgs, Fetcher } from "../fetcher";
export declare class LaravelRestFetcher<D extends object> implements Fetcher<D> {
    private readonly url;
    constructor(url: string);
    fetch({ tableState, columns }: FetchArgs<D>): Promise<D[]>;
}
//# sourceMappingURL=laravel-rest-fetcher.d.ts.map
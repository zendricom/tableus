import { FetchArgs, Fetcher } from "./index";

export class LaravelRestFetcher<D extends object> implements Fetcher<D> {
  constructor(private readonly url: string) {}

  async fetch({ tableState, columns }: FetchArgs<D>): Promise<D[]> {
    const response = await fetch(this.url);
    const data = await response.json();
    return data.data;
  }
}

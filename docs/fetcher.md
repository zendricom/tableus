## Tableus Fetcher

A Tableus Fetcher is a package that enables tableus to communicate with your
backend. It should be able to receive data from the server, given a certain
table state, and transform it into the form that tableus expects it. The table
state consists of the current state of the pagination, filters and sorts.

A valid Tableus Fetcher has to provide a fetcher class, that implements the
fetcher interface
([source](https://github.com/zendricom/tableus/blob/main/src/fetcher/index.ts#L21-L23)).
The fetch method of the fetcher class is given the table's current state and
configuration and should return an array of data objects, as well as,
updated information on the pagination state from the server.

For an example you can check out the [laravel-rest-fetcher](https://github.com/zendricom/tableus-fetcher-laravel-rest) UI.

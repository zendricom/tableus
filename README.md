# Tableus

##### A react library for rapidly building highly configurable tables flawlessly integrated with your backend

![](https://badgen.net/bundlephobia/minzip/@tableus/core)

### Summary

Tableus offers a configurable **out-of-the-box** react table. It is intended to
be integrated fully with your backend to deliver tables with **sorting**,
**filtering** and **pagination**. Tableus does not state any requirements on
your preferred UI (bootstrap, material UI, etc.) or backend API (REST, GraphQL,
etc.), by externalizing those into seperate modules called **fetchers** and
**UIs**.  
If your UI and backend API are already available as a package, then you are
ready to go to create complex tables with **minimal effort** and **zero
boilerplate**.
Tableus is built on top of [Tanstack Table](https://tanstack.com/table/v8/) and
often the API is the same. If you are already familiar with Tanstack Table
(formerly React Table), then you will feel familiar with Tableus fast!

### Available Fetchers & UIs

#### Fetchers

- [laravel-rest](https://github.com/zendricom/tableus-fetcher-laravel-rest)

#### UIs

- [bootstrap 5](https://github.com/zendricom/tableus-ui-bootstrap5)

### Installation

````
npm install @tableus/core
npm install @tableus/fetcher-[your-preferred-fetcher]
npm install @tableus/ui-[your-preferred-ui]```
````

### Requirements

- Your preferred UI has to be available as a package. If not you have to
  implement a `tableus-ui` yourself. Look [here]() on how to do that.
- Your backend API has to be compatible with one of the available
  fetchers. If not you have to implement a `tableus-fetcher` yourself.
  Look [here]() on how to do that.
- You have to provide a `QueryClient` from `react-query` in your App, as
  tableus uses `react-query` under the hood to improve performance.

### Quick Start

1. Provide a project-wide `TableusConfig` with the
   `TableusContextProvider`, where you specify your UI. Also be sure that
   a `react-query` `QueryClient` is provided .

```typescript
import { initTableComponents } from '@tableus/ui-bootstrap5';
import { TableusConfig } from '@tableus/core/dist/context';
import { TableusContextProvider } from '@tableus/core';
import { QueryClient, QueryClientProvider } from 'react-query';

const tableusConfig: TableusConfig = {
  tableUI: initTableComponents(),
};

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TableusContextProvider config={tableusConfig}>
        {...}
      </TableusContextProvider>
    </QueryClientProvider>
  );
}
```

2. Init the table object and pass the type data that the table will display.

```typescript
const table = createTable<TableEntry>();
```

3. Specify the columns of your table.

```typescript
const columns = [
  table.createDataColumn("id", {
    header: "ID",
  }),
  table.createDataColumn(
    (row) => `${row.user.firstname} ${row.user.lastname}`,
    {
      id: "name",
      header: "Name",
    }
  ),
];
```

4. Initialize your fetcher. E.g. here we use a REST fetcher. The url
   `/users` should return an array of users in the format expected by the
   `LaravelRestFetcher`, where each entry is of the form of `TableEntry`.

```typescript
const fetcher = new LaravelRestFetcher<TableEntry>("/users");
```

5. Call useTableus.

```typescript
const { tableusProps } = useTableus(table, {
  columns,
  fetcher,
  key: "users",
});
```

6. Render Tableus

```typescript
<Tableus {...tableusProps} />
```

7. Done!

### [Documentation](/docs/docs.md)

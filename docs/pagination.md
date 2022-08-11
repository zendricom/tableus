## Pagination

As tableus integrates seamlessly with your backend, it is natural to use
pagination.

### Requirements

- The UI of your choice has to provide the optional `TablePagination` component

### Usage

To use pagination activate it through the table config.

```typescript
const { tableusProps } = useTableus(table, {
  config: {
    pagination: true,
  },
});
```

You can provide the default page size and the options for the page size
selector either in the table config:

```typescript
const { tableusProps } = useTableus(table, {
  config: {
    pagination: true,
    pageSize: 25,
    pageSizeSelect: [10, 25, 50, 100, 200],
  },
});
```

or in the project-wide tableus config:

```typescript
const tableusConfig: TableusConfig = {
  ...
  pageSize: 25,
  pageSizeSelect: [25, 50, 100],
};

...

<TableusContextProvider config={tableusConfig}>
```

By default tableus will render a pagination component above and below the
table. You can configure this behavior with the `showPagination` property.

```typescript
const { tableusProps } = useTableus(table, {
  config: {
    pagination: true,
    showPagination: "both",
  },
});
```

That's all it takes!

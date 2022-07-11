## Sorting

Sorting allows your users to specify single or multi-sorts, that are then
communicated to your backend for processing, to enable your frontend to be
resource-saving.

### Usage

To use sorting activate it through the table config and provde a column that
has sorting enabled.

```typescript
const column = [
  table.createDataColumn('id', {
    header: 'ID',
    enableSorting: true,
  }),
];

...

const { tableusProps } = useTableus(table, {
  config: {
    sorting: true,
  },
});
```

That's all it takes!

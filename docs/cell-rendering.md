## Column Definitions & Cell Rendering

Tableus is built on top of [Tanstack Table](https://tanstack.com/table/v8/) we
use its API to specify column definitions. Therefore, all configuration that is
possible with Tanstack Table is also possible with tableus.

### Tableus Built-In Renderers

Tableus provides the ability to use predefined renderers for common use cases,
like rendering dates.

#### Rendering Dates, Datetimes And Times

To tell Tableus to render a specific column as a date, datetime or time, simply
add the following to the column definition:

```typescript
table.createDataColumn("id", {
  header: "ID",
  meta: {
    type: "date", // 'date' | 'datetime' | 'time'
  },
});
```

By default Tableus will now use the `Date` browser built-in class for
rendering.

If you wish to customize that behaviour, you can add a `DatetimeCell`,
`DateCell` or `TimeCell` component to your project wide tableus config.

#### Rendering Empty Values

By default tableus will render an empty string when encountering any empty
value. You can customize that behaviour by passing a component or string as
`EmptyValue` to the tableus config .

#### Rendering Tooltips

Tableus can render tooltips on top of the values that the cell would normally
display. To do that, modify the column definition:

```typescript
table.createDataColumn("id", {
  header: "ID",
  meta: {
    tooltip: (props) => props.value,
  },
});
```

The tooltip function is passed the following props:

```typescript
{
  value: any;
  data: TableEntry;
  cellProps: CellProps; // tanstack table cell props
}
```

#### Rendering Links

Similar to rendering tooltips Tableus can also render links:

```typescript
table.createDataColumn("id", {
  header: "ID",
  meta: {
    link: (props) => `/users/${props.value}`,
  },
});
```

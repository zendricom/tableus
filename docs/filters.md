## Filters

- [Usage](#usage)
- [Built-in Filters](#built-in-filters)
- [Custom Filters](#custom-filters)

Tableus Filters allow your users, as the name suggests, to filter the data
shown in your tables. Following the tableus philosophy filtering is not done on
the client side, but on the server side. Therefore a Tableus Filter will handle
two things for you:

1. It provides a component, which allows the user to interact with the filter
2. It translate the internal state of the filter for your server (e.g. for a
   REST API this could mean that it translate a js object into a query string)

At the moment there are two built-in filters, the `SearchFilter` and the
`SelectFilter`. Here built-in means that they are built into the Tableus core,
however, they still need to be implemented by the UI and Fetcher that you use.

### Usage

1. Pass all filter definitions of your table to `filterDefinitions` in your table
   config.

```typescript
import {
  defineSearchFilter,
  defineSelectFilter,
  defineCustomFilter,
} from "@tableus/core/dist/filtering";

const { tableusProps, filterComponentProps } = useTableus(table, {
  config: {
    filterDefinitions: [
      defineSearchFilter({
        key: "search",
        label: "Search",
      }),
    ],
  },
});
```

2. Place the filter component somewhere into your UI and pass the
   `filterComponentProps` returned by `useTableus`, as well as, the key of the
   filter that you want to place.

```typescript
import { Filter } from "@tableus/core";

...

<Filter {...filterComponentProps} filterKey="search" />
```

That's all it takes!

### Built-in Filters

- [SelectFilter](#selectfilter)
- [SearchFilter](#searchfilter)

#### SelectFilter

A select filter will display the user a set of options and later communicate to
the server which options are selected. Multi-select is possible.

##### API

The `defineSelectFilter` has the following parameters.

###### `key`

```typescript
key: string;
```

The unique key that is used recognize the filter in the backend.

###### `label`

```typescript
label: string;
```

The label that is displayed in the UI.

###### `options`

```typescript
options: [
  {
    label: string;
    value: string;
  }
]
```

The options that are available to the user. `label` is the string that the user
will read and `value` is what will be used for communication with the backend.

###### `defaultValue`

```
defaultValue?: string
```

###### `isMulti`

```typescript
isMulti?: boolean;
```

Determines whether multiple selects are allowed.

#### SearchFilter

A search filter will allow the user to input a string into a text field.
The input value is usually (depending on the tableus UI) debounced and then
communicated to the backend.

##### API

The `defineSearchFilter` has the following parameters.

###### `key`

```typescript
key: string;
```

The unique key that is used recognize the filter in the backend.

###### `label`

```typescript
label: string;
```

The label that is displayed in the UI.

###### `placeholder`

```typescript
placeholder?: string;
```

A placeholder that is displayed to the user.

### Custom Filters

Tableus also allows to define custom filters by specifiying a renderer and a
translator. The renderer is the component that will be used by the UI and the
translator is a function that takes in the value of the filter and then
processes it for the backend.

First you need to define the `Renderer` for your custom filter by extending the
`CustomFilterRenderer` type.

```typescript
type ToggleFilterValue = boolean;

const ToggleFilterRenderer: CustomFilterRenderer<
  CustomFilterState<ToggleFilterValue>
> = ({ filter, setFilter, filterDefinition }) => {
  const checked = !!filter?.value;
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setFilter(!checked ? true : undefined)}
      />
      {filterDefinition.label}
    </label>
  );
};
```

Next you need to define the translator for your custom filter. The
implementation of the translator depends completly on your Tableus Fetcher.
In our example we use the
[laravel-rest-fetcher](https://github.com/zendricom/tableus-fetcher-laravel-rest),
in which case the server expects a additional query string.

```typescript
const ToggleFilterTranslator: CustomFilterTranslator<
  CustomFilterState<ToggleFilterValue>
> = (filter, url) => {
  if (!filter) return;
  if (!(url instanceof URL)) {
    throw new Error("url must be instance of URL");
  }
  url.searchParams.set(`filter[${filter.key}]`, filter.value ? "1" : "0");
};
```

The first argument that will be passed to the translator is always the filter
value. Any other additional arguments are optional and depend on the Tableus
Fetcher in use.

After defining the translator and the renderer, you can use them to create a
new instance of your custom filter, by passing them to the `defineCustomFilter`
function and then pass the results to the `filterDefinitions` in your table
config.

```typescript
const { tableusProps, filterComponentProps } = useTableus(table, {
  config: {
    filterDefinitions: [
      defineCustomFilter({
        key: "enableLogin",
        renderer: ToggleFilterRenderer,
        translator: ToggleFilterTranslator,
        label: "Enable login",
      }),
    ],
  },
});
```

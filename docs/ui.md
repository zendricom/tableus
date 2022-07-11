## Tableus UI

A Tableus UI is a package that provides components to Tableus, which are then
used to render the table. Tableus UI are encapsulated from the rest of the
tableus logic, which allows to easily replace an existing UI with another.

A valid Tableus UI has to provide an object of type `TableUI`
([source](https://github.com/zendricom/tableus/blob/main/src/context.tsx#L68-L81)),
hence it must contain all of the necessary table components and optionally it
can provide filter and pagination component.

For an example you can check out the [bootstrap
5](https://github.com/zendricom/tableus-ui-bootstrap5) UI.

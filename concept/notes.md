Filter

- renderer pro UI
- "query-builder" pro fetcher

Fetcher

- fetch() -> Promise<data>
  - filters
    - map filter to "query"
  - sorts
    - map sort to "query"
  - pagination
    - map pagination to "query"

filters

- key
- value
  - string/number
  - object/array

sorts

- array of (key, [asc/desc])

pagination

- page number
- entries per page

Renderer

-

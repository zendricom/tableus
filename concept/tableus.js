export const Test = () => {
  const data = React.useMemo(
    () => [
      {
        id: "2",
        firstName: "Mike",
        lastName: "Smith",
        age: 21,
        address: "New York",
        friends: [{ id: "1", name: "John" }],
        profile: { hits: 100 },
        updatedAt: new Date(),
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        accessor: "id",
        isId: true,
      },
      {
        Header: "Age",
        accessor: "age",
      },
      {
        Header: "Visits",
        accessor: "visits",
        type: "numeric",
        filter: "range",
      },
      {
        Header: "Status",
        accessor: "status",
        filter: "select",
        // filter: "multiSelect",
      },
      {
        Header: "Profile hits",
        accessor: "profile.hits",
        type: "numeric",
        allowSort: true,
        filter: "exact",
        reactTableProps: {
          // will be passed to the react-table column definition
        },
      },
      {
        Header: "Updated at",
        accessor: "updatedAt",
        type: "date",
        allowSort: true,
        filter: "range",
        // filter: "date",
        // filter: "hour",
      },
      {
        Header: "Name",

        // Cell: (values, rowData) => null,
        // accessor: ["firstName", "lastName", "id"],

        Cell: (rowData) => null,

        key: "fullName", // will be used for communication with the server when filtered or sorted
        sortBy: "lastname", // optional
        sortBy: ["lastname", "firstname"], // optional
        // eg with rest:
        // /users?sort=fullName
        // /users?filter[fullName]=Mike

        allowSort: true,
        filter: "fuzzy",
      },
    ],
    []
  );

  const globalFilters = [
    new SelectFilter({
      label: "Status",
      key: "status",
      isMulti: true,
      options: [
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Inactive",
          value: "inactive",
        },
      ],
    }),
    new SearchFilter({
      label: "Search",
      key: "search",
      placeholder: "Search by name, age, etc...",
    }),
    new DateRangeFilter({
      label: "Updated at",
      key: "updatedAt",
    }),
  ];

  /**
   * Filter
   *
   * @Component ({ label, key, filterValue, setFilterValue }) => ReactNode
   * mapToLogic
   *
   */

  // am besten werden die verschiedenen fetcher als zusatz packages provided oder?
  const dataFetcher = useTableusLaravelRestFetcher({
    url: "https://localhost:8091/api/users",
    // filter & paginate
    // /users?filter[age]>20&filter[age]<30&page=1
    // /users?filter[profile.hits]>100&page=1
    //
    // global filter
    // /users?globalFilter[status]=active
    //
    // sort
    // /users?sort=-age (desc)
    // /users?sort=age (asc)
    // /users?sort=-age,firstName (multi-sort)
  });

  const dataFetcher = useTableusArrayFetcher({
    data,
  });

  const {
    tableusProps,
    selectedRowIds, // contains values from id if exists else index
    reactTableInstance,
  } = useTableus({
    fetcher: dataFetcher,
    columns,
    config: {
      rowSelect: true,

      pagination: true,
      paginationSize: 10,
      paginationSelect: [10, 25, 50, 100],
    },
    reactTableProps: {
      /* will be passed to react-table */
    },
  });

  return (
    <div>
      <TableusUIProvider ui={TableusBootstrap4UI}>
        {/* am besten werden die verschiedenen ui's als zusatz packages provided oder?*/}
        <Tableus {...tableusProps} />
      </TableusUIProvider>
    </div>
  );
};

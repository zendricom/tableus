import "./bootstrap5.css";

import React from "react";
import { SortUp, SortDown } from "react-bootstrap-icons";
import {
  Pagination as BootstrapPagination,
  Table as BootstrapTable,
  TableProps,
} from "react-bootstrap";
import { HeaderProps, PaginationProps, Props, TableUI } from "../context";

const DEFAULT_EMPTY_VALUE = "-";

interface Config {
  tableProps: TableProps;
  emptyValue: string;
}

function Pagination({
  paginationMethods: {
    getCanPreviousPage,
    getCanNextPage,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
  },
  paginationState: { pageIndex, pageCount, pageSize },
  paginationConfig,
}: PaginationProps) {
  if (pageCount === undefined) return null;

  let sliderMin = pageIndex - 2;
  let sliderMax = pageIndex + 2;

  if (sliderMin < 0) sliderMin = 0;
  if (sliderMax > pageCount - 1) sliderMax = pageCount - 1;

  const slider = [];
  for (let i = sliderMin; i <= sliderMax; i++) {
    slider.push(i);
  }

  return (
    <div className="bs5-pagination-wrapper">
      <BootstrapPagination>
        <BootstrapPagination.Prev
          disabled={!getCanPreviousPage()}
          onClick={previousPage}
        />
        {sliderMin > 0 && (
          <BootstrapPagination.Item onClick={() => setPageIndex(0)}>
            {1}
          </BootstrapPagination.Item>
        )}
        {sliderMin > 1 && <BootstrapPagination.Ellipsis />}

        {slider.map((i) => (
          <BootstrapPagination.Item
            active={i == pageIndex}
            key={i}
            onClick={() => setPageIndex(i)}
          >
            {i + 1}
          </BootstrapPagination.Item>
        ))}

        {sliderMax < pageCount - 2 && <BootstrapPagination.Ellipsis />}

        {sliderMax < pageCount - 1 && (
          <BootstrapPagination.Item onClick={() => setPageIndex(pageCount - 1)}>
            {pageCount}
          </BootstrapPagination.Item>
        )}
        <BootstrapPagination.Next
          disabled={!getCanNextPage()}
          onClick={nextPage}
        />
      </BootstrapPagination>
      {paginationConfig?.pageSizeSelect && (
        <BootstrapPagination className="bs5-page-size-select">
          {paginationConfig.pageSizeSelect.map((size) => (
            <BootstrapPagination.Item
              active={size === pageSize}
              key={size}
              onClick={() => setPageSize(size)}
            >
              {size}
            </BootstrapPagination.Item>
          ))}
        </BootstrapPagination>
      )}
    </div>
  );
}

export function initTableComponents(configArg: Partial<Config>): TableUI {
  const config: Required<Config> = {
    ...{
      tableProps: {},
      emptyValue: DEFAULT_EMPTY_VALUE,
    },
    ...configArg,
  };
  return {
    Table: (props: Props) => {
      const className = props.fetcherState.isLoading ? "bs5-filter-blur" : "";
      return (
        <BootstrapTable {...config.tableProps} className={className}>
          {props.children}
        </BootstrapTable>
      );
    },

    TableHead: (props: Props) => {
      return <thead>{props.children}</thead>;
    },

    TableHeadRow: (props: Props) => {
      return <tr>{props.children}</tr>;
    },

    TableHeadCell: ({
      getCanSort,
      getToggleSortingHandler,
      getIsSorted,
      tableConfig,
      children,
    }: HeaderProps) => {
      const canSort = tableConfig.sorting === true && getCanSort();

      let sortIcon = null;
      if (canSort && getIsSorted()) {
        sortIcon =
          getIsSorted() === "asc" ? (
            <SortUp size={16} />
          ) : (
            <SortDown size={16} />
          );
      }

      const thProps = canSort
        ? { role: "button", onClick: getToggleSortingHandler() }
        : {};
      return (
        <th {...thProps}>
          <div className="d-flex justify-content-between align-items-center">
            {children}
            {sortIcon}
          </div>
        </th>
      );
    },

    TableBody: (props: Props) => {
      return <tbody>{props.children}</tbody>;
    },

    TableRow: (props: Props) => {
      return <tr>{props.children}</tr>;
    },

    TableCell: (props: Props) => {
      return <td>{props.children}</td>;
    },

    TablePagination: Pagination,
  };
}

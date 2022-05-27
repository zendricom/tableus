import "./bootstrap5.css";

import React from "react";
import {
  Pagination as BootstrapPagination,
  Table as BootstrapTable,
  TableProps,
} from "react-bootstrap";
import { PaginationProps, Props, TableUI } from "../context";

const DEFAULT_EMPTY_VALUE = "-";

interface Config {
  tableProps: TableProps;
  emptyValue: string;
}

function Pagination({
  state,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  canNextPage,
  canPreviousPage,
  paginationConfig,
  setPageSize,
}: PaginationProps) {
  const { pageIndex } = state;

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
          disabled={!canPreviousPage}
          onClick={previousPage}
        />
        {sliderMin > 0 && (
          <BootstrapPagination.Item onClick={() => gotoPage(0)}>
            {1}
          </BootstrapPagination.Item>
        )}
        {sliderMin > 1 && <BootstrapPagination.Ellipsis />}

        {slider.map((i) => (
          <BootstrapPagination.Item
            active={i == pageIndex}
            key={i}
            onClick={() => gotoPage(i)}
          >
            {i + 1}
          </BootstrapPagination.Item>
        ))}

        {sliderMax < pageCount - 2 && <BootstrapPagination.Ellipsis />}

        {sliderMax < pageCount - 1 && (
          <BootstrapPagination.Item onClick={() => gotoPage(pageCount - 1)}>
            {pageCount}
          </BootstrapPagination.Item>
        )}
        <BootstrapPagination.Next disabled={!canNextPage} onClick={nextPage} />
      </BootstrapPagination>
      {paginationConfig?.pageSizeSelect && (
        <BootstrapPagination className="bs5-page-size-select">
          {paginationConfig.pageSizeSelect.map((size) => (
            <BootstrapPagination.Item
              active={size === state.pageSize}
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

    TableHeadCell: (props: Props) => {
      return <th>{props.children}</th>;
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

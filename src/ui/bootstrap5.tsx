import "./bootstrap5.css";

import React from "react";
import { SortUp, SortDown } from "react-bootstrap-icons";
import { Table as BootstrapTable, TableProps } from "react-bootstrap";
import { HeaderProps, TableComponentProps, TableUI } from "../context";
import { Pagination } from "./pagination";
import { SearchFilter, SelectFilter } from "./filtering";

const DEFAULT_EMPTY_VALUE = "-";

interface Config {
  tableProps: TableProps;
  emptyValue: string;
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
    Table: (props: TableComponentProps) => {
      const className = props.fetcherState.isLoading ? "bs5-filter-blur" : "";
      return (
        <BootstrapTable {...config.tableProps} className={className}>
          {props.children}
        </BootstrapTable>
      );
    },

    TableHead: (props: TableComponentProps) => {
      return <thead>{props.children}</thead>;
    },

    TableHeadRow: (props: TableComponentProps) => {
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

    TableBody: (props: TableComponentProps) => {
      return <tbody>{props.children}</tbody>;
    },

    TableRow: (props: TableComponentProps) => {
      return <tr>{props.children}</tr>;
    },

    TableCell: (props: TableComponentProps) => {
      return <td>{props.children}</td>;
    },

    TablePagination: Pagination,

    SelectFilter: SelectFilter,
    SearchFilter: SearchFilter,
  };
}

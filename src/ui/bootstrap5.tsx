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

function Pagination({ state }: PaginationProps) {
  const { pageIndex } = state;

  return (
    <BootstrapPagination>
      <BootstrapPagination.Prev />
      <BootstrapPagination.Item>{1}</BootstrapPagination.Item>
      <BootstrapPagination.Ellipsis />

      <BootstrapPagination.Item>{10}</BootstrapPagination.Item>
      <BootstrapPagination.Item>{11}</BootstrapPagination.Item>
      <BootstrapPagination.Item active>{12}</BootstrapPagination.Item>
      <BootstrapPagination.Item>{13}</BootstrapPagination.Item>
      <BootstrapPagination.Item disabled>{14}</BootstrapPagination.Item>

      <BootstrapPagination.Ellipsis />
      <BootstrapPagination.Item>{20}</BootstrapPagination.Item>
      <BootstrapPagination.Next />
    </BootstrapPagination>
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
      return (
        <BootstrapTable {...config.tableProps}>{props.children}</BootstrapTable>
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
  };
}

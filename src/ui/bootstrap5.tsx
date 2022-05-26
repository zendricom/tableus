import React from "react";
import {
  OverlayTrigger,
  Pagination as BootstrapPagination,
  Table as BootstrapTable,
  TableProps,
  Tooltip,
} from "react-bootstrap";
import {
  LinkProps,
  PaginationProps,
  Props,
  TooltipProps,
  UI,
} from "../ui/context";
import dayjs from "dayjs";

const DEFAULT_EMPTY_VALUE = "-";

interface Config {
  tableProps: TableProps;
  emptyValue: string;
}

interface BootstrapProps extends Props {
  config: Config;
}

function Table(props: BootstrapProps) {
  return (
    <BootstrapTable {...props.config.tableProps}>
      {props.children}
    </BootstrapTable>
  );
}

function TableHead(props: BootstrapProps) {
  return <thead>{props.children}</thead>;
}

function TableHeadRow(props: BootstrapProps) {
  return <tr>{props.children}</tr>;
}

function TableHeadCell(props: BootstrapProps) {
  return <th>{props.children}</th>;
}

function TableBody(props: BootstrapProps) {
  return <tbody>{props.children}</tbody>;
}

function TableRow(props: BootstrapProps) {
  return <tr>{props.children}</tr>;
}

function TableCell(props: BootstrapProps) {
  return <td>{props.children}</td>;
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

export class Bootstrap5UI implements UI {
  private config: Required<Config>;
  constructor(config?: Partial<Config>) {
    this.config = {
      ...{
        tableProps: {},
        emptyValue: DEFAULT_EMPTY_VALUE,
      },
      ...config,
    };
  }

  Table = (props: Props) => {
    return <Table {...props} config={this.config} />;
  };

  TableHead = (props: Props) => {
    return <TableHead {...props} config={this.config} />;
  };

  TableHeadRow = (props: Props) => {
    return <TableHeadRow {...props} config={this.config} />;
  };

  TableHeadCell = (props: Props) => {
    return <TableHeadCell {...props} config={this.config} />;
  };

  TableBody = (props: Props) => {
    return <TableBody {...props} config={this.config} />;
  };

  TableRow = (props: Props) => {
    return <TableRow {...props} config={this.config} />;
  };

  TableCell = (props: Props) => {
    return <TableCell {...props} config={this.config} />;
  };

  DateCell = ({ value }: { value: string }) => {
    if (!value) return this.config.emptyValue;
    return dayjs(value).format("DD.MM.YYYY");
  };

  DateTimeCell = ({ value }: { value: string }) => {
    if (!value) return this.config.emptyValue;
    return dayjs(value).format("DD.MM.YYYY HH:mm");
  };

  EmptyValue = () => this.config.emptyValue;

  Tooltip = ({ text, children }: TooltipProps) => {
    return (
      <OverlayTrigger overlay={<Tooltip> {text} </Tooltip>}>
        <span>{children}</span>
      </OverlayTrigger>
    );
  };

  Link = ({ children, href }: LinkProps) => {
    return <a href={href}> {children} </a>;
  };
}

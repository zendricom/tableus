import React from "react";
import {
  OverlayTrigger,
  Table as BootstrapTable,
  TableProps,
  Tooltip,
} from "react-bootstrap";
import { Props, UI } from "../ui/context";
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

function DateCell({ date, config }: { date: string; config: Config }) {
  if (!date) return <>{config.emptyValue}</>;
  return <>{dayjs(date).format("DD.MM.YYYY")}</>;
}

function DatetimeCell({ date, config }: { date: string; config: Config }) {
  if (!date) return <>{config.emptyValue}</>;
  return <>{dayjs(date).format("DD.MM.YYYY HH:mm")}</>;
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

  getTableComponent() {
    return (props: Props) => {
      return <Table {...props} config={this.config} />;
    };
  }

  getTableHeadComponent() {
    return (props: Props) => {
      return <TableHead {...props} config={this.config} />;
    };
  }

  getTableHeadRowComponent() {
    return (props: Props) => {
      return <TableHeadRow {...props} config={this.config} />;
    };
  }

  getTableHeadCellComponent() {
    return (props: Props) => {
      return <TableHeadCell {...props} config={this.config} />;
    };
  }

  getTableBodyComponent() {
    return (props: Props) => {
      return <TableBody {...props} config={this.config} />;
    };
  }

  getTableRowComponent() {
    return (props: Props) => {
      return <TableRow {...props} config={this.config} />;
    };
  }

  getTableCellComponent() {
    return (props: Props) => {
      return <TableCell {...props} config={this.config} />;
    };
  }

  getDateCellComponent() {
    return ({ value }: { value: string }) => {
      return DateCell({ date: value, config: this.config });
    };
  }

  getDateTimeCellComponent() {
    return ({ value }: { value: string }) => {
      return DatetimeCell({ date: value, config: this.config });
    };
  }

  getEmptyValueComponent() {
    return () => {
      return <>{this.config.emptyValue}</>;
    };
  }

  getTooltipComponent(): React.ComponentType<{
    children: React.ReactNode;
    text: string;
  }> {
    return ({ children, text }) => (
      <OverlayTrigger overlay={<Tooltip> {text} </Tooltip>}>
        <div>{children}</div>
      </OverlayTrigger>
    );
  }

  getLinkComponent(): React.ComponentType<{
    children: React.ReactNode;
    href: string;
  }> {
    return ({ children, href }) => <a href={href}> {children} </a>;
  }

  getComponents() {
    return {
      Table: this.getTableComponent(),
      TableHead: this.getTableHeadComponent(),
      TableHeadRow: this.getTableHeadRowComponent(),
      TableHeadCell: this.getTableHeadCellComponent(),
      TableBody: this.getTableBodyComponent(),
      TableRow: this.getTableRowComponent(),
      TableCell: this.getTableCellComponent(),
      DateCell: this.getDateCellComponent(),
      DatetimeCell: this.getDateTimeCellComponent(),
      EmptyValue: this.getEmptyValueComponent(),
      TooltipComponent: this.getTooltipComponent(),
      LinkComponent: this.getLinkComponent(),
    };
  }
}

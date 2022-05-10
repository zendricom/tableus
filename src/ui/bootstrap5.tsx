import React from "react";
import { Table, TableProps } from "react-bootstrap";
import { Props, UI } from "../context";
import { ValidJSX } from "../types/helpers";

interface Config {
  tableProps: TableProps;
}

export class Bootstrap5UI implements UI {
  constructor(private config?: Config) {}

  Table(props: Props): ValidJSX {
    return <Table {...this?.config?.tableProps}>{props.children}</Table>;
  }

  TableHead(props: Props): ValidJSX {
    return <thead>{props.children}</thead>;
  }

  TableHeadRow(props: Props): ValidJSX {
    return <tr>{props.children}</tr>;
  }

  TableHeadCell(props: Props): ValidJSX {
    return <th>{props.children}</th>;
  }

  TableBody(props: Props): ValidJSX {
    return <tbody>{props.children}</tbody>;
  }

  TableRow(props: Props): ValidJSX {
    return <tr>{props.children}</tr>;
  }

  TableCell(props: Props): ValidJSX {
    return <td>{props.children}</td>;
  }
}
